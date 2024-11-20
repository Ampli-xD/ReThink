from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session, send_file
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import markdown2
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import io
from markdown_pdf import MarkdownPdf, Section

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Database configuration
if os.getenv('DATABASE_URL'):
    # Production PostgreSQL database
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
else:
    # Development SQLite database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notes.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')  # Change this in production
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512))
    notes = db.relationship('Note', backref='author', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

def init_db():
    with app.app_context():
        # Create tables only if they don't exist
        db.create_all()
        
        # Create a test user only if no users exist
        if not User.query.first():
            test_user = User(username='test', email='test@example.com')
            test_user.set_password('test123')
            db.session.add(test_user)
            db.session.commit()

# Initialize the database
init_db()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        if User.query.filter_by(username=username).first():
            flash('Username already exists')
            return redirect(url_for('signup'))
        
        if User.query.filter_by(email=email).first():
            flash('Email already registered')
            return redirect(url_for('signup'))
        
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        flash('Registration successful! Please login.')
        return redirect(url_for('login'))
    
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            flash('Logged in successfully!')
            return redirect(url_for('notes'))
        
        flash('Invalid username or password')
        return redirect(url_for('login'))
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    flash('You have been logged out.')
    return redirect(url_for('login'))

@app.route('/notes')
@login_required
def notes():
    user_id = session.get('user_id')
    user = User.query.get(user_id)
    notes = Note.query.filter_by(user_id=user_id).order_by(Note.updated_at.desc()).all()
    return render_template('index.html', notes=notes, user=user)

@app.route('/api/notes', methods=['GET'])
@login_required
def get_notes():
    user_id = session.get('user_id')
    notes = Note.query.filter_by(user_id=user_id).order_by(Note.updated_at.desc()).all()
    return jsonify([note.to_dict() for note in notes])

@app.route('/api/notes', methods=['POST'])
@login_required
def create_note():
    user_id = session.get('user_id')
    data = request.json
    note = Note(title=data['title'], content=data['content'], user_id=user_id)
    db.session.add(note)
    db.session.commit()
    return jsonify(note.to_dict())

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
@login_required
def update_note(note_id):
    user_id = session.get('user_id')
    note = Note.query.get_or_404(note_id)
    if note.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    note.title = data['title']
    note.content = data['content']
    db.session.commit()
    return jsonify(note.to_dict())

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
@login_required
def delete_note(note_id):
    user_id = session.get('user_id')
    note = Note.query.get_or_404(note_id)
    if note.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    db.session.delete(note)
    db.session.commit()
    return '', 204

@app.route('/api/preview', methods=['POST'])
@login_required
def preview_markdown():
    content = request.json.get('content', '')
    html = markdown2.markdown(content, extras=[
        'tables',
        'fenced-code-blocks',
        'break-on-newline',
        'code-friendly'
    ])
    
    # Add Prism.js class to code blocks
    html = html.replace('<pre><code>', '<pre><code class="language-plaintext">')
    html = html.replace('<pre><code class="', '<pre><code class="language-')
    
    return jsonify({'html': html})

@app.route('/export_pdf/<int:note_id>')
@login_required
def export_pdf(note_id):
    note = Note.query.get_or_404(note_id)
    if note.user_id != session['user_id']:
        flash('Unauthorized access to note', 'error')
        return redirect(url_for('notes'))
    
    try:
        # Get current user
        user = User.query.get(session['user_id'])
        current_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        
        # Create PDF from markdown
        pdf = MarkdownPdf()
        
        # Set metadata
        pdf.meta.update({
            "title": note.title,
            "author": user.username if user else "",
            "subject": f"Note exported from ReThink",
            "keywords": "markdown,note,rethink",
            "creator": "ReThink Notes App",
            "producer": "ReThink Notes App",
            "creationDate": current_time,
            "modDate": current_time
        })
        
        # Add content without title
        content = note.content
        pdf.add_section(Section(content, toc=False))
        
        # Save to BytesIO
        pdf_file = io.BytesIO()
        pdf.save(pdf_file)
        pdf_file.seek(0)
        
        # Send the PDF file
        return send_file(
            pdf_file,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"{note.title}.pdf"
        )
                
    except Exception as e:
        print(f"Error in PDF generation: {str(e)}")
        flash('Error generating PDF. Please try again.', 'error')
        return redirect(url_for('notes'))

if __name__ == '__main__':
    app.run(debug=True)

# For Vercel deployment
app = app

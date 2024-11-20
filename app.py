from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import markdown2
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///notes.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your-secret-key-here'  # Change this to a secure secret key
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
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
        # Create tables if they don't exist
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
            return redirect(url_for('index'))
        
        flash('Invalid username or password')
        return redirect(url_for('login'))
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    flash('You have been logged out.')
    return redirect(url_for('login'))

@app.route('/')
@login_required
def index():
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

if __name__ == '__main__':
    app.run(debug=True)

# For Vercel deployment
app = app

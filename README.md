# ReThink Notes 

### Made with [Cascade Windsurf](https://codeium.com/windsurf) 🏄‍♂️

> A modern markdown notes application designed for seamless note-taking and organization. Experience it live at [rethinknotes.vercel.app](https://rethinknotes.vercel.app)

## ✨ Features

### Core Functionality 🎯
- **Real-time Markdown Preview**: See your formatting come to life as you type
- **PDF Export**: Convert your notes to professional PDFs with a click
- **Secure Authentication**: Keep your notes private and secure
- **Cloud Sync**: Access your notes from any device, anytime
- **Version History**: Track changes to your notes over time

### User Experience 🎨
- **Modern UI**: Clean, intuitive interface with custom design system
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Mode**: Easy on the eyes, day or night
- **Keyboard Shortcuts**: Boost your productivity
- **Rich Text Support**: Tables, code blocks, and more

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask with SQLAlchemy ORM
- **Database**: 
  - Production: PostgreSQL on Supabase
  - Development: SQLite
- **Security**: 
  - Werkzeug password hashing
  - Session-based authentication
  - CSRF protection
- **Core Libraries**: 
  - `markdown2`: Markdown parsing
  - `python-dotenv`: Environment management
  - `markdown-pdf`: PDF generation

### Frontend
- **Core**: HTML5, CSS3, JavaScript
- **Design**: Custom component system
- **Features**:
  - Real-time preview
  - Responsive layouts
  - Dark mode support

### Infrastructure
- **Hosting**: Vercel
- **CI/CD**: Automatic deployments
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Git
- A text editor (VS Code recommended)

### Local Development Setup
1. **Clone & Navigate**:
   ```bash
   git clone https://github.com/yourusername/ReThink.git
   cd ReThink
   ```

2. **Set Up Environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # For Unix/macOS: source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Required settings in .env:
   # SECRET_KEY=your-secret-key
   # DATABASE_URL=postgresql://... (for production)
   ```

4. **Initialize & Run**:
   ```bash
   flask db upgrade  # Set up database
   python app.py     # Start server
   # Visit http://localhost:5000
   ```

## 👥 Contributing

We welcome contributions! Here's how you can help make ReThink Notes better.

### Development Workflow

1. **Fork & Clone**:
   - Fork the repository on GitHub
   - Clone your fork locally

2. **Branch**:
   Create a branch following our naming convention:
   ```bash
   git checkout -b your_name-type/description
   # Examples:
   # dishant-feature/markdown-tables
   # dishant-fix/pdf-export-bug
   # dishant-docs/api-documentation
   ```

3. **Develop**:
   - Write clean, commented code
   - Follow style guidelines
   - Add tests for new features
   - Update documentation

4. **Commit**:
   ```bash
   git add .
   git commit -m "feat: add markdown table support"
   # Use conventional commits:
   # feat: new feature
   # fix: bug fix
   # docs: documentation
   # style: formatting
   # refactor: code restructure
   ```

5. **Push & PR**:
   ```bash
   git push origin type/description
   # Open a Pull Request on GitHub
   ```

### Branch Naming Convention 
- `feature/*`: New features or enhancements
- `fix/*`: Bug fixes and patches
- `docs/*`: Documentation updates
- `style/*`: Code style/formatting changes
- `refactor/*`: Code improvements
- `test/*`: Test additions/updates

### Code Style Guidelines 
- Follow [PEP 8](https://peps.python.org/pep-0008/) for Python
- Use meaningful variable and function names
- Comment complex logic
- Keep functions focused and small
- Write tests for new features
- Update documentation for API changes

## License
All rights reserved.

---
Built with ❤ by the ReThink team

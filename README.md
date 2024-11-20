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

## 🎨 Markdown Styling Guide

ReThink Notes supports rich HTML styling within markdown for beautiful document formatting. Here's your complete styling guide:

### Text Utilities

```markdown
<!-- Text Alignment -->
<div class="text-center">Centered Text</div>
<div class="text-right">Right-aligned Text</div>

<!-- Text Sizes -->
<div class="text-sm">Small Text</div>
<div class="text-lg">Large Text</div>
<div class="text-xl">Extra Large Text</div>
<div class="text-2xl">2X Large Text</div>

<!-- Text Styles -->
<div class="font-bold">Bold Text</div>
<div class="font-light">Light Text</div>
<div class="italic">Italic Text</div>

<!-- Text Colors -->
<div class="text-primary">Primary Color</div>
<div class="text-secondary">Secondary Color</div>
<div class="text-success">Success Color</div>
<div class="text-warning">Warning Color</div>
<div class="text-error">Error Color</div>
<div class="text-gray">Gray Text</div>
```

### Alerts & Cards

```markdown
<!-- Info Alert -->
<div class="alert alert-info">
    Important information here!
</div>

<!-- Warning Alert -->
<div class="alert alert-warning">
    Warning message here!
</div>

<!-- Success Alert -->
<div class="alert alert-success">
    Success message here!
</div>

<!-- Error Alert -->
<div class="alert alert-error">
    Error message here!
</div>

<!-- Card -->
<div class="card">
    <h3>Card Title</h3>
    <p>Card content goes here...</p>
</div>
```

### Layout Components

```markdown
<!-- Flex Container -->
<div class="flex-container">
    <div>Column 1</div>
    <div>Column 2</div>
</div>

<!-- Vertical Flex -->
<div class="flex-container flex-col">
    <div>Row 1</div>
    <div>Row 2</div>
</div>

<!-- Grid Container -->
<div class="grid-container">
    <div>Grid Item 1</div>
    <div>Grid Item 2</div>
    <div>Grid Item 3</div>
</div>

<!-- Spacing -->
<div class="mt-1">Margin Top 0.5em</div>
<div class="mb-2">Margin Bottom 1em</div>
<div class="mt-4">Margin Top 2em</div>
```

### Custom Lists

```markdown
<!-- Checklist -->
<ul class="checklist">
    <li>Checked item 1</li>
    <li>Checked item 2</li>
</ul>
```

### Decorative Elements

```markdown
<!-- Gradient Divider -->
<hr class="divider">

<!-- Badge -->
<span class="badge">New</span>

<!-- Special Quote -->
<blockquote class="quote-special">
    A beautifully styled quote with decorative quotation mark
</blockquote>
```

### Tables

```markdown
<!-- Striped Table -->
<table class="table-striped">
    <tr><th>Header 1</th><th>Header 2</th></tr>
    <tr><td>Data 1</td><td>Data 2</td></tr>
</table>

<!-- Bordered Table -->
<table class="table-bordered">
    <tr><th>Header 1</th><th>Header 2</th></tr>
    <tr><td>Data 1</td><td>Data 2</td></tr>
</table>
```

### Code Blocks

```markdown
<!-- Dark Theme Code Window -->
<div class="code-window">
    <code>
    function hello() {
        console.log("Hello, World!");
    }
    </code>
</div>
```

### Images

```markdown
<!-- Rounded Image -->
<img src="image.jpg" class="img-rounded">

<!-- Circular Image -->
<img src="image.jpg" class="img-circle">

<!-- Shadowed Image -->
<img src="image.jpg" class="img-shadow">

<!-- Bordered Image -->
<img src="image.jpg" class="img-border">
```

### Print Controls

```markdown
<!-- Page Breaks -->
<div class="page-break-before">Starts on new page</div>
<div class="page-break-after">Next content on new page</div>

<!-- Hide from Print -->
<div class="no-print">Only visible on screen</div>
```

### Background Colors

```markdown
<div class="bg-light">Light Background</div>
<div class="bg-primary">Primary Background</div>
<div class="bg-secondary">Secondary Background</div>
<div class="bg-success">Success Background</div>
<div class="bg-warning">Warning Background</div>
<div class="bg-error">Error Background</div>
```

### Combining Classes

You can combine multiple classes for complex styling:

```markdown
<div class="card text-center bg-light mb-2">
    <h3 class="text-xl font-bold text-primary">
        Beautiful Heading
    </h3>
    <p class="text-gray">
        Content with custom styling
    </p>
</div>
```

These styles are optimized for both screen viewing and PDF export. Use them to create beautiful, professional documents!

## License
All rights reserved.

---
Built with ❤ by the ReThink team

let editor;
let currentNote = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize EasyMDE
    editor = new EasyMDE({
        element: document.getElementById('note-content'),
        spellChecker: true,
        toolbar: true,
        status: true,
        lineWrapping: true,
        indentWithTabs: true,
        indentUnit: 4,
        tabSize: 4,
        autoRefresh: true,
        initialValue: '',
        minHeight: '100px',
        maxHeight: '650px',
        autofocus: true,
        placeholder: 'Start writing your note here...',
        autosave: {
            enabled: true,
            delay: 1000,
            uniqueId: 'note-content'
        },
        sideBySideFullscreen: false,
        forceSync: true,
        renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true,
            markedOptions: {
                headerIds: false,
                breaks: false
            }
        },
        status: ["lines", "words", "cursor"],
        toolbar: [
            {
                name: "sync",
                action: function(editor) {
                    saveNote();
                },
                className: "fa fa-refresh",
                title: "Save (Sync)",
            },
            {
                name: "delete",
                action: function(editor) {
                    deleteCurrentNote();
                },
                className: "fa fa-trash",
                title: "Delete Note",
            },
            "|",
            "undo", "redo",
            "|",
            {
                name: "heading-1",
                action: EasyMDE.toggleHeading1,
                className: "fa fa-header fa-header-x fa-header-1",
                title: "Heading 1",
            },
            {
                name: "heading-2",
                action: EasyMDE.toggleHeading2,
                className: "fa fa-header fa-header-x fa-header-2",
                title: "Heading 2",
            },
            {
                name: "heading-3",
                action: EasyMDE.toggleHeading3,
                className: "fa fa-header fa-header-x fa-header-3",
                title: "Heading 3",
            },
            "|",
            "bold",
            "italic",
            "strikethrough",
            "|",
            {
                name: "text-color",
                action: function(editor) {
                    const colors = {
                        'Primary': 'text-primary',
                        'Secondary': 'text-secondary',
                        'Success': 'text-success',
                        'Warning': 'text-warning',
                        'Error': 'text-error',
                        'Gray': 'text-gray'
                    };
                    const color = prompt('Choose color: ' + Object.keys(colors).join(', '));
                    if (color && colors[color]) {
                        const selection = editor.codemirror.getSelection();
                        editor.codemirror.replaceSelection(`<span class="${colors[color]}">${selection || 'Colored text'}</span>`);
                    }
                },
                className: "fa fa-paint-brush",
                title: "Text Color",
            },
            {
                name: "background",
                action: function(editor) {
                    const backgrounds = {
                        'Light': 'bg-light',
                        'Primary': 'bg-primary',
                        'Secondary': 'bg-secondary',
                        'Success': 'bg-success',
                        'Warning': 'bg-warning',
                        'Error': 'bg-error'
                    };
                    const bg = prompt('Choose background: ' + Object.keys(backgrounds).join(', '));
                    if (bg && backgrounds[bg]) {
                        const selection = editor.codemirror.getSelection();
                        editor.codemirror.replaceSelection(`<div class="${backgrounds[bg]}">${selection || 'Text with background'}</div>`);
                    }
                },
                className: "fa fa-fill",
                title: "Background Color",
            },
            "|",
            "unordered-list",
            "ordered-list",
            {
                name: "checklist",
                action: function(editor) {
                    const text = '<ul class="checklist">\n' +
                        '    <li>New item</li>\n' +
                        '</ul>';
                    editor.codemirror.replaceSelection(text);
                },
                className: "fa fa-check-square-o",
                title: "Checklist",
            },
            "|",
            {
                name: "alert-info",
                action: function(editor) {
                    const text = '<div class="alert alert-info">\n' +
                        '    Important information here\n' +
                        '</div>';
                    editor.codemirror.replaceSelection(text);
                },
                className: "fa fa-info-circle",
                title: "Info Alert",
            },
            {
                name: "alert-warning",
                action: function(editor) {
                    const text = '<div class="alert alert-warning">\n' +
                        '    Warning message here\n' +
                        '</div>';
                    editor.codemirror.replaceSelection(text);
                },
                className: "fa fa-exclamation-triangle",
                title: "Warning Alert",
            },
            {
                name: "alert-success",
                action: function(editor) {
                    const text = '<div class="alert alert-success">\n' +
                        '    Success message here\n' +
                        '</div>';
                    editor.codemirror.replaceSelection(text);
                },
                className: "fa fa-check-circle",
                title: "Success Alert",
            },
            {
                name: "alert-error",
                action: function(editor) {
                    const text = '<div class="alert alert-error">\n' +
                        '    Error message here\n' +
                        '</div>';
                    editor.codemirror.replaceSelection(text);
                },
                className: "fa fa-times-circle",
                title: "Error Alert",
            },
            "|",
            {
                name: "card",
                action: function(editor) {
                    const text = '<div class="card">\n' +
                        '    <h3>Card Title</h3>\n' +
                        '    <p>Card content here...</p>\n' +
                        '</div>';
                    editor.codemirror.replaceSelection(text);
                },
                className: "fa fa-credit-card",
                title: "Card",
            },
            {
                name: "badge",
                action: function(editor) {
                    const selection = editor.codemirror.getSelection();
                    editor.codemirror.replaceSelection(`<span class="badge">${selection || 'New'}</span>`);
                },
                className: "fa fa-certificate",
                title: "Badge",
            },
            "|",
            {
                name: "flex-container",
                action: function(editor) {
                    const text = '<div class="flex-container">\n' +
                        '    <div>Column 1</div>\n' +
                        '    <div>Column 2</div>\n' +
                        '</div>';
                    editor.codemirror.replaceSelection(text);
                },
                className: "fa fa-columns",
                title: "Flex Container",
            },
            {
                name: "grid-container",
                action: function(editor) {
                    const text = '<div class="grid-container">\n' +
                        '    <div>Grid Item 1</div>\n' +
                        '    <div>Grid Item 2</div>\n' +
                        '    <div>Grid Item 3</div>\n' +
                        '</div>';
                    editor.codemirror.replaceSelection(text);
                },
                className: "fa fa-th",
                title: "Grid Container",
            },
            "|",
            {
                name: "quote-special",
                action: function(editor) {
                    const text = '<blockquote class="quote-special">\n' +
                        '    Your special quote here\n' +
                        '</blockquote>';
                    editor.codemirror.replaceSelection(text);
                },
                className: "fa fa-quote-right",
                title: "Special Quote",
            },
            {
                name: "divider",
                action: function(editor) {
                    editor.codemirror.replaceSelection('\n<hr class="divider">\n');
                },
                className: "fa fa-minus",
                title: "Gradient Divider",
            },
            "|",
            {
                name: "code-window",
                action: function(editor) {
                    const text = '<div class="code-window">\n' +
                        '    <code>\n' +
                        '    // Your code here\n' +
                        '    </code>\n' +
                        '</div>';
                    editor.codemirror.replaceSelection(text);
                },
                className: "fa fa-code",
                title: "Code Window",
            },
            "code",
            "|",
            {
                name: "image-styles",
                action: function(editor) {
                    const styles = {
                        'Rounded': 'img-rounded',
                        'Circle': 'img-circle',
                        'Shadow': 'img-shadow',
                        'Border': 'img-border'
                    };
                    const style = prompt('Choose image style: ' + Object.keys(styles).join(', '));
                    if (style && styles[style]) {
                        editor.codemirror.replaceSelection(`<img src="your-image.jpg" class="${styles[style]}" alt="Image">`);
                    }
                },
                className: "fa fa-picture-o",
                title: "Styled Image",
            },
            "image",
            "|",
            {
                name: "page-break",
                action: function(editor) {
                    editor.codemirror.replaceSelection('\n<div class="page-break-after"></div>\n');
                },
                className: "fa fa-file-o",
                title: "Page Break",
            },
            {
                name: "no-print",
                action: function(editor) {
                    const selection = editor.codemirror.getSelection();
                    editor.codemirror.replaceSelection(`<div class="no-print">${selection || 'Screen-only content'}</div>`);
                },
                className: "fa fa-eye-slash",
                title: "Hide in PDF",
            },
            "|",
            {
                name: "preview",
                action: EasyMDE.togglePreview,
                className: "fa fa-eye no-disable",
                title: "Toggle Preview",
            },
            {
                name: "side-by-side",
                action: EasyMDE.toggleSideBySide,
                className: "fa fa-columns no-disable",
                title: "Toggle Side by Side",
            },
            "fullscreen",
            "|",
            {
                name: "export-pdf",
                action: function(editor) {
                    exportToPDF();
                },
                className: "fa fa-file-pdf-o",
                title: "Export to PDF",
            },
            {
                name: "guide",
                action: "https://www.markdownguide.org/basic-syntax/",
                className: "fa fa-question-circle",
                title: "Markdown Guide",
            }
        ]
    });

    // Load notes
    loadNotes();

    // Event listeners
    document.getElementById('new-note').addEventListener('click', createNewNote);
    document.getElementById('note-title').addEventListener('input', debounce(saveNote, 500));
    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
    document.querySelector('.delete-note').addEventListener('click', () => deleteCurrentNote());
    editor.codemirror.on('change', debounce(saveNote, 500));
});

async function loadNotes() {
    try {
        const response = await fetch('/api/notes');
        const notes = await response.json();
        displayNotes(notes);
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

function displayNotes(notes) {
    const container = document.getElementById('notes-container');
    container.innerHTML = '';
    
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        if (currentNote && currentNote.id === note.id) {
            noteElement.classList.add('active');
        }
        
        noteElement.innerHTML = `
            <div class="note-title">${note.title || 'Untitled Note'}</div>
            <div class="note-timestamp">
                <i class="far fa-clock me-1"></i>
                ${new Date(note.updated_at).toLocaleDateString()}
            </div>
        `;
        
        noteElement.addEventListener('click', () => loadNote(note));
        container.appendChild(noteElement);
    });
}

async function loadNote(note) {
    currentNote = note;
    document.getElementById('editor-area').style.display = 'block';
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('note-title').value = note.title;
    editor.value(note.content);
    
    // Update active state in note list
    document.querySelectorAll('.note-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.noteId === String(note.id)) {
            item.classList.add('active');
        }
    });
}

async function createNewNote() {
    const note = {
        title: 'Untitled Note',
        content: ''
    };

    try {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        });
        const newNote = await response.json();
        currentNote = newNote;
        loadNotes();
        loadNote(newNote);
    } catch (error) {
        console.error('Error creating note:', error);
    }
}

async function saveNote() {
    if (!currentNote) return;

    const updatedNote = {
        title: document.getElementById('note-title').value,
        content: editor.value()
    };

    try {
        const response = await fetch(`/api/notes/${currentNote.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedNote)
        });
        
        if (response.ok) {
            const savedNote = await response.json();
            currentNote = savedNote;
            loadNotes();
        }
    } catch (error) {
        console.error('Error saving note:', error);
    }
}

async function deleteCurrentNote() {
    if (!currentNote) {
        alert('Please select a note to delete.');
        return;
    }

    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }

    try {
        const response = await fetch(`/api/notes/${currentNote.id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            currentNote = null;
            document.getElementById('editor-area').style.display = 'none';
            document.getElementById('empty-state').style.display = 'flex';
            loadNotes();
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note. Please try again.');
    }
}

function exportToPDF() {
    if (!currentNote || !currentNote.id) {
        alert('Please save the note first before exporting to PDF.');
        return;
    }
    window.location.href = `/export_pdf/${currentNote.id}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

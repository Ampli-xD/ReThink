let editor;
let currentNote = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize EasyMDE
    editor = new EasyMDE({
        element: document.getElementById('note-content'),
        spellChecker: false,
        autosave: {
            enabled: true,
            delay: 1000,
            uniqueId: 'note-content'
        },
        sideBySideFullscreen: false,
        renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true,
        },
        minHeight: "500px",
        status: ["lines", "words", "cursor"],
        toolbar: [
            {
                name: "save",
                action: function(editor) {
                    saveNote();
                },
                className: "fa fa-save",
                title: "Save",
            },
            "|",
            "undo", "redo", "|",
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
            "quote",
            "code",
            "unordered-list",
            "ordered-list",
            "|",
            "link",
            "image",
            "|",
            {
                name: "horizontal-rule",
                action: EasyMDE.drawHorizontalRule,
                className: "fa fa-minus",
                title: "Insert Horizontal Line",
            },
            "|",
            "preview",
            "side-by-side",
            "fullscreen",
            "|",
            {
                name: "guide",
                action: "https://www.markdownguide.org/basic-syntax/",
                className: "fa fa-question-circle",
                title: "Markdown Guide",
            }
        ],
        previewRender: (text) => {
            let result = '';
            fetch('/api/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: text })
            })
            .then(response => response.json())
            .then(data => {
                const previewElement = document.querySelector('.EasyMDEContainer .editor-preview, .EasyMDEContainer .editor-preview-side');
                if (previewElement) {
                    previewElement.innerHTML = data.html;
                    // Re-initialize Prism for the new content
                    if (window.Prism) {
                        previewElement.querySelectorAll('pre code').forEach((block) => {
                            Prism.highlightElement(block);
                        });
                    }
                }
            })
            .catch(error => {
                console.error('Error previewing markdown:', error);
            });
            return 'Loading preview...';
        }
    });

    // Load notes
    loadNotes();

    // Event listeners
    document.getElementById('new-note').addEventListener('click', createNewNote);
    document.getElementById('note-title').addEventListener('input', debounce(saveNote, 500));
    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
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
            <h5>${note.title || 'Untitled'}</h5>
            <small>${new Date(note.updated_at).toLocaleDateString()}</small>
            <button class="btn btn-sm btn-danger float-end delete-note" data-id="${note.id}">Delete</button>
        `;
        
        noteElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-note')) {
                loadNote(note);
            }
        });

        const deleteBtn = noteElement.querySelector('.delete-note');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteNote(note.id);
        });

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
        if (item.querySelector(`[data-id="${note.id}"]`)) {
            item.classList.add('active');
        }
    });
}

async function createNewNote() {
    const note = {
        title: 'Untitled',
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
        const savedNote = await response.json();
        currentNote = savedNote;
        loadNotes();
    } catch (error) {
        console.error('Error saving note:', error);
    }
}

async function deleteNote(noteId) {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
        await fetch(`/api/notes/${noteId}`, {
            method: 'DELETE'
        });
        if (currentNote && currentNote.id === noteId) {
            currentNote = null;
            document.getElementById('editor-area').style.display = 'none';
            document.getElementById('empty-state').style.display = 'block';
        }
        loadNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

async function exportToPDF() {
    if (!currentNote) {
        alert('Please select a note to export');
        return;
    }
    
    try {
        window.location.href = `/export_pdf/${currentNote.id}`;
    } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Error exporting PDF. Please try again.');
    }
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
}

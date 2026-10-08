document.addEventListener("DOMContentLoaded", () => {
    const noteForm = document.getElementById("note-form");
    const noteInput = document.getElementById("note-input");
    const noteCategory = document.getElementById("note-category");
    const searchInput = document.getElementById("search-input");
    const notesList = document.getElementById("notes-list");
    const noteCount = document.getElementById("note-count");
    const errorMessage = document.getElementById("error-message");
    const clearAllBtn = document.getElementById("clear-all-btn");

    // Load notes from localStorage
    let notes = JSON.parse(localStorage.getItem("quicknotes")) || [];

    function saveNotes() {
        localStorage.setItem("quicknotes", JSON.stringify(notes));
    }

    function render(filteredNotes = notes) {
        notesList.innerHTML = "";

        if (filteredNotes.length === 0) {
            const emptyMessage = document.createElement("li");
            emptyMessage.textContent = notes.length === 0 ? "No notes added yet." : "No notes match your search.";
            emptyMessage.style.textAlign = "center";
            emptyMessage.style.color = "#666";
            emptyMessage.style.padding = "1rem";
            notesList.appendChild(emptyMessage);
        } else {
            filteredNotes.forEach(note => {
                const li = document.createElement("li");
                li.className = `note-card category-${note.category}`;

                const contentDiv = document.createElement("div");
                contentDiv.className = "note-content";

                const textP = document.createElement("p");
                textP.className = "note-text";
                textP.textContent = note.text; // Safe from XSS

                const metaDiv = document.createElement("div");
                metaDiv.className = "note-meta";

                const categorySpan = document.createElement("span");
                categorySpan.className = "category-badge";
                categorySpan.textContent = note.category;

                const dateSpan = document.createElement("span");
                dateSpan.textContent = note.createdAt;

                metaDiv.appendChild(categorySpan);
                metaDiv.appendChild(dateSpan);
                contentDiv.appendChild(textP);
                contentDiv.appendChild(metaDiv);

                const deleteBtn = document.createElement("button");
                deleteBtn.className = "delete-btn";
                deleteBtn.textContent = "Delete";
                deleteBtn.addEventListener("click", () => {
                    deleteNote(note.id);
                });

                li.appendChild(contentDiv);
                li.appendChild(deleteBtn);
                notesList.appendChild(li);
            });
        }

        updateCountDisplay(filteredNotes.length, notes.length);
    }

    function updateCountDisplay(filteredLength, totalLength) {
        if (totalLength === 0) {
            noteCount.textContent = "You have no notes yet.";
        } else if (totalLength === 1) {
            noteCount.textContent = "You have 1 note.";
        } else {
            noteCount.textContent = `You have ${totalLength} notes.`;
        }
        if (filteredLength !== totalLength) {
            noteCount.textContent += ` (Showing ${filteredLength} filtered)`;
        }
    }

    function addNote(event) {
        event.preventDefault();
        const text = noteInput.value.trim();
        const category = noteCategory.value;

        // Validation
        if (text === "") {
            errorMessage.textContent = "Please type a note first.";
            return;
        }
        if (text.length > 200) {
            errorMessage.textContent = "Notes must be 200 characters or fewer.";
            return;
        }

        errorMessage.textContent = "";

        const now = new Date();
        const createdAt = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newNote = {
            id: Date.now(),
            text,
            category,
            createdAt
        };

        notes.push(newNote);
        saveNotes();
        noteInput.value = "";
        render();
    }

    function deleteNote(id) {
        notes = notes.filter(note => note.id !== id);
        saveNotes();
        handleSearch(); // Maintain search filter state if active
    }

    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        const filtered = notes.filter(note => note.text.toLowerCase().includes(query));
        render(filtered);
    }

    // Event Listeners
    noteForm.addEventListener("submit", addNote);
    searchInput.addEventListener("input", handleSearch);

    clearAllBtn.addEventListener("click", () => {
        if (notes.length > 0 && confirm("Delete all notes?")) {
            notes = [];
            saveNotes();
            render();
        }
    });

    // Initial Render
    render();
});
document.addEventListener("DOMContentLoaded", () => {
    const noteText = document.getElementById("note-text");
    const charCount = document.getElementById("char-count");
    const wordCount = document.getElementById("word-count");
    const clearBtn = document.getElementById("clear-btn");
    const themeToggle = document.getElementById("theme-toggle");

    // 1. Restore saved draft and theme from localStorage on page load
    const savedDraft = localStorage.getItem("noteDraft");
    if (savedDraft !== null) {
        noteText.value = savedDraft;
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "Light mode";
    } else {
        themeToggle.textContent = "Dark mode";
    }

    // Function to update characters, words, and warning classes
    function updateCounts() {
        const text = noteText.value;
        const length = text.length;

        // Word count calculation (splits by whitespace and filters out empty strings)
        const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

        charCount.textContent = `${length} / 200 characters`;
        wordCount.textContent = `${words} ${words === 1 ? "word" : "words"}`;

        // Reset classes
        charCount.className = "";

        // Apply warning or over classes
        if (length > 200) {
            charCount.classList.add("over");
        } else if (length > 180) {
            charCount.classList.add("warning");
        }
    }

    // Call updateCounts on initial load
    updateCounts();

    // 2. Event listener for input typing (updates counts and saves draft)
    noteText.addEventListener("input", () => {
        updateCounts();
        localStorage.setItem("noteDraft", noteText.value);
    });

    // 3. Clear functionality (resets textarea, counts, and clears storage)
    function clearNote() {
        noteText.value = "";
        updateCounts();
        localStorage.removeItem("noteDraft");
    }

    clearBtn.addEventListener("click", clearNote);

    // 4. Pressing Escape inside the textarea clears it
    noteText.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            clearNote();
        }
    });

    // 5. Theme toggle functionality
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        
        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "Light mode";
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "Dark mode";
        }
    });
});
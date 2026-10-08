let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. searchNotes(word)
function searchNotes(word) {
  const searchTerm = word.toLowerCase();
  return notes.filter(note => note.text.toLowerCase().includes(searchTerm));
}

// 2. longestNote()
function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, current) => 
    current.text.length > longest.text.length ? current : longest
  );
}

// 3. countByCategory()
function countByCategory() {
  const counts = { personal: 0, work: 0, study: 0 };
  for (let note of notes) {
    if (counts[note.category] !== undefined) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }
  return counts;
}

// 4. getSummary()
function getSummary() {
  const counts = countByCategory();
  const totalNotes = notes.length;
  const noteWord = totalNotes === 1 ? "note" : "notes";
  return `${totalNotes} ${noteWord}: ${counts.personal} personal, ${counts.work} work, ${counts.study} study.`;
}

// 5. isDuplicate(text)
function isDuplicate(text) {
  const normalizedText = text.trim().toLowerCase();
  return notes.some(note => note.text.trim().toLowerCase() === normalizedText);
}

// 6. addNote(text, category)
function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];
  
  if (typeof text !== "string" || text.length < 1 || text.length > 200) {
    console.log(`Failed to add: Text length must be between 1 and 200 characters.`);
    return false;
  }
  
  if (!validCategories.includes(category)) {
    console.log(`Failed to add: Invalid category "${category}". Must be personal, work, or study.`);
    return false;
  }
  
  if (isDuplicate(text)) {
    console.log(`Failed to add: Duplicate note found.`);
    return false;
  }
  
  const newId = notes.length > 0 ? notes[notes.length - 1].id + 1 : 1;
  notes.push({ id: newId, text: text.trim(), category });
  return true;
}

// --- TESTS & CONSOLE LOGS ---

// Test searchNotes
console.log(searchNotes("milk")); // Expected: [{ id: 1, text: "Buy milk and bread", category: "personal" }]
console.log(searchNotes("xyz"));  // Expected: []

// Test longestNote
console.log(longestNote()); // Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

// Test countByCategory
console.log(countByCategory()); // Expected: { personal: 2, work: 1, study: 2 }

// Test getSummary
console.log(getSummary()); // Expected: "5 notes: 2 personal, 1 work, 2 study."

// Test isDuplicate
console.log(isDuplicate("call mum"));           // Expected: true
console.log(isDuplicate("Learn a new language")); // Expected: false

// Test addNote
console.log(addNote("Schedule team meeting", "work")); // Expected: true
console.log(addNote("Call mum", "personal"));          // Expected: false (duplicate)
console.log(addNote("", "study"));                     // Expected: false (invalid length)
document.addEventListener('DOMContentLoaded', function() {
    function showConfetti() {
        const container = document.getElementById('confetti-container');
        const emojis = ['✨','🎉','💖','🌸','🍒','🌼'];
        for (let i = 0; i < 20; i++) {
            const span = document.createElement('span');
            span.className = 'confetti';
            span.textContent = emojis[Math.floor(Math.random()*emojis.length)];
            span.style.left = Math.random() * 100 + '%';
            container.appendChild(span);
            span.addEventListener('animationend', () => span.remove());
        }
    }

    function loadData() {
        const raw = localStorage.getItem('notesData');
        if (raw) {
            try { return JSON.parse(raw); } catch(e) {}
        }
        return { subjects: [] };
    }
    function saveData(data) {
        localStorage.setItem('notesData', JSON.stringify(data));
    }

    // elements
    const subjectInput = document.getElementById('subjectInput');
    const addSubjectButton = document.getElementById('addSubjectButton');
    const notesContainer = document.getElementById('notesContainer');

    // greeting
    const nameInput = document.getElementById('nameInput');
    const greetButton = document.getElementById('greetButton');
    const greetingText = document.getElementById('greetingText');
    greetButton.addEventListener('click', function() {
        const name = nameInput.value.trim();
        if (name) {
            greetingText.textContent = `Hi, ${name}!`;
        } else {
            greetingText.textContent = 'Please enter your name.';
        }
        showConfetti();
    });

    // clock
    const clockEl = document.getElementById('clock');
    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();

    // theme
    const themeButton = document.getElementById('themeButton');
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    themeButton.addEventListener('click', function() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // add subject
    addSubjectButton.addEventListener('click', function() {
        const name = subjectInput.value.trim();
        if (!name) return;
        const data = loadData();
        data.subjects.push({name, assignments: []});
        saveData(data);
        subjectInput.value = '';
        renderNotes();
        showConfetti();
    });

    // render all notes organized by subject->assignment->note
    function renderNotes() {
        const data = loadData();
        notesContainer.innerHTML = '';
        data.subjects.forEach((s, si) => {
            const subjCard = document.createElement('div');
            subjCard.className = 'subject-card';
            const subjTitle = document.createElement('h2');
            subjTitle.textContent = `📚 ${s.name}`;
            subjCard.appendChild(subjTitle);

            s.assignments.forEach((a, ai) => {
                const assignCard = document.createElement('div');
                assignCard.style.borderLeft = '4px solid #ff9a9e';
                assignCard.style.paddingLeft = '1rem';
                assignCard.style.marginBottom = '1rem';
                const assignTitle = document.createElement('h3');
                assignTitle.textContent = `✓ ${a.title}`;
                assignCard.appendChild(assignTitle);

                if (a.notes && a.notes.length > 0) {
                    const notesList = document.createElement('div');
                    notesList.className = 'notes-list';
                    a.notes.forEach((n, ni) => {
                        const noteItem = document.createElement('div');
                        noteItem.className = 'note-item';
                        noteItem.innerHTML = `<p>${n.content}</p><small>${n.date}</small>`;
                        const deleteBtn = document.createElement('button');
                        deleteBtn.textContent = '✖';
                        deleteBtn.style.position = 'absolute';
                        deleteBtn.style.top = '0.25rem';
                        deleteBtn.style.right = '0.25rem';
                        deleteBtn.addEventListener('click', () => {
                            a.notes.splice(ni, 1);
                            saveData(data);
                            renderNotes();
                        });
                        noteItem.style.position = 'relative';
                        noteItem.appendChild(deleteBtn);
                        notesList.appendChild(noteItem);
                    });
                    assignCard.appendChild(notesList);
                }

                // inline add note
                const addNoteArea = document.createElement('div');
                addNoteArea.style.marginTop = '0.75rem';
                addNoteArea.style.paddingTop = '0.75rem';
                addNoteArea.style.borderTop = '1px solid #eee';
                addNoteArea.style.display = 'flex';
                addNoteArea.style.gap = '0.5rem';
                const noteInput = document.createElement('textarea');
                noteInput.placeholder = 'Add a note...';
                noteInput.style.flex = '1';
                noteInput.style.minHeight = '50px';
                noteInput.style.padding = '0.5rem';
                noteInput.style.fontFamily = "'Poppins', sans-serif";
                const addNoteBtn = document.createElement('button');
                addNoteBtn.textContent = '➕';
                addNoteBtn.style.width = '40px';
                addNoteBtn.style.alignSelf = 'flex-start';
                addNoteBtn.addEventListener('click', () => {
                    const content = noteInput.value.trim();
                    if (content) {
                        if (!a.notes) a.notes = [];
                        a.notes.push({content, date: new Date().toLocaleString()});
                        saveData(data);
                        noteInput.value = '';
                        renderNotes();
                        showConfetti();
                    }
                });
                addNoteArea.appendChild(noteInput);
                addNoteArea.appendChild(addNoteBtn);
                assignCard.appendChild(addNoteArea);

                subjCard.appendChild(assignCard);
            });

            // add assignment input
            const addAssignArea = document.createElement('div');
            addAssignArea.style.marginTop = '1rem';
            addAssignArea.style.paddingTop = '1rem';
            addAssignArea.style.borderTop = '1px solid #eee';
            addAssignArea.style.display = 'flex';
            addAssignArea.style.gap = '0.5rem';
            const assignInput = document.createElement('input');
            assignInput.type = 'text';
            assignInput.placeholder = 'New assignment...';
            assignInput.style.flex = '1';
            const addAssignBtn = document.createElement('button');
            addAssignBtn.textContent = '➕ Assignment';
            addAssignBtn.addEventListener('click', () => {
                const title = assignInput.value.trim();
                if (title) {
                    s.assignments.push({title, notes: []});
                    saveData(data);
                    assignInput.value = '';
                    renderNotes();
                    showConfetti();
                }
            });
            addAssignArea.appendChild(assignInput);
            addAssignArea.appendChild(addAssignBtn);
            subjCard.appendChild(addAssignArea);

            notesContainer.appendChild(subjCard);
        });
    }

    renderNotes();
});

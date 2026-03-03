document.addEventListener('DOMContentLoaded', function() {
    const subjectInput = document.getElementById('subjectInput');
    const addSubjectButton = document.getElementById('addSubjectButton');
    const subjectsContainer = document.getElementById('subjectsContainer');

    // theme persistence
    const themeButton = document.createElement('button');
    themeButton.id = 'themeButton';
    themeButton.textContent = 'Toggle Dark/Light 🌙';
    document.querySelector('main').appendChild(themeButton);
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    themeButton.addEventListener('click', function() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    function loadData() {
        const raw = localStorage.getItem('notesData');
        if (raw) {
            try { return JSON.parse(raw); } catch (e) { }
        }
        return { subjects: [] };
    }
    function saveData(data) {
        localStorage.setItem('notesData', JSON.stringify(data));
    }

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

    function renderSubjects(filterText = '') {
        const data = loadData();
        subjectsContainer.innerHTML = '';
        data.subjects.forEach((subj, i) => {
            if (filterText) {
                const lower = filterText.toLowerCase();
                const subjMatch = subj.name.toLowerCase().includes(lower);
                const assignMatch = subj.assignments.some(a => a.title.toLowerCase().includes(lower) || a.content.toLowerCase().includes(lower));
                if (!subjMatch && !assignMatch) return;
            }
            const card = document.createElement('div');
            card.className = 'subject-card';
            // header with delete button
            const h3 = document.createElement('h3');
            h3.textContent = subj.name;
            const delBtn = document.createElement('button');
            delBtn.textContent = '✖';
            delBtn.addEventListener('click', function() {
                data.subjects.splice(i,1);
                saveData(data);
                renderSubjects();
                showConfetti();
            });
            h3.appendChild(delBtn);
            card.appendChild(h3);
            // assignments list
            const list = document.createElement('div');
            list.className = 'assignments-list';
            subj.assignments.forEach((ass, j) => {
                const item = document.createElement('div');
                item.className = 'assignment-item' + (ass.done ? ' done' : '');
                item.innerHTML = `<span class="mark-done">${ass.done?'✅':'⬜'}</span> <strong>${ass.title}</strong><p>${ass.content}</p>`;
                const aDel = document.createElement('button');
                aDel.textContent = '✖';
                aDel.addEventListener('click', () => {
                    subj.assignments.splice(j,1);
                    saveData(data);
                    renderSubjects();
                });
                item.appendChild(aDel);
                item.querySelector('.mark-done').addEventListener('click', () => {
                    ass.done = !ass.done;
                    saveData(data);
                    renderSubjects();
                    showConfetti();
                });
                list.appendChild(item);
            });
            card.appendChild(list);
            // add assignment area
            const addArea = document.createElement('div');
            addArea.className = 'add-assignment';
            addArea.innerHTML = `
                <input type="text" class="assignmentTitle" placeholder="Assignment title">
                <textarea class="assignmentContent" placeholder="Details"></textarea>
                <button class="addAssignmentBtn">Add Assignment</button>
            `;
            addArea.querySelector('.addAssignmentBtn').addEventListener('click', function() {
                const titleEl = addArea.querySelector('.assignmentTitle');
                const contentEl = addArea.querySelector('.assignmentContent');
                const title = titleEl.value.trim();
                const content = contentEl.value.trim();
                if (!title && !content) {
                    return; // nothing to add
                }
                subj.assignments.push({title, content, done:false});
                saveData(data);
                renderSubjects();
                showConfetti();
            });
            card.appendChild(addArea);

            subjectsContainer.appendChild(card);
        });
    }

    addSubjectButton.addEventListener('click', function() {
        const name = subjectInput.value.trim();
        if (!name) return;
        const data = loadData();
        data.subjects.push({name, assignments: []});
        saveData(data);
        subjectInput.value = '';
        renderSubjects();
        showConfetti();
    });

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        renderSubjects(searchInput.value.trim());
    });

    const clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all notes?')) {
            localStorage.removeItem('notesData');
            renderSubjects();
        }
    });

    renderSubjects();
});
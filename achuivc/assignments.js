document.addEventListener('DOMContentLoaded', function() {
    const subjectSelect = document.getElementById('subjectSelect');
    const assignTitle = document.getElementById('assignTitle');
    const assignContent = document.getElementById('assignContent');
    const addAssignBtn = document.getElementById('addAssignBtn');
    const allAssignments = document.getElementById('allAssignments');

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

    function populateSubjects() {
        const data = loadData();
        subjectSelect.innerHTML = '';
        data.subjects.forEach((s, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = s.name;
            subjectSelect.appendChild(opt);
        });
    }

    function renderAssignments() {
        const data = loadData();
        allAssignments.innerHTML = '';
        data.subjects.forEach((s, i) => {
            s.assignments.forEach((a, j) => {
                const card = document.createElement('div');
                card.className = 'assignment-item' + (a.done ? ' done' : '');
                card.innerHTML = `<strong>${a.title}</strong> <em>(${s.name})</em><p>${a.content}</p>`;
                const del = document.createElement('button');
                del.textContent = '✖';
                del.addEventListener('click', () => {
                    s.assignments.splice(j,1);
                    saveData(data);
                    renderAssignments();
                });
                const mark = document.createElement('span');
                mark.className = 'mark-done';
                mark.textContent = a.done ? '✅' : '⬜';
                mark.addEventListener('click', () => {
                    a.done = !a.done;
                    saveData(data);
                    renderAssignments();
                    showConfetti();
                });
                card.appendChild(mark);
                card.appendChild(del);
                allAssignments.appendChild(card);
            });
        });
    }

    addAssignBtn.addEventListener('click', function() {
        const idx = subjectSelect.value;
        const title = assignTitle.value.trim();
        const content = assignContent.value.trim();
        if (idx === '' || !title) return;
        const data = loadData();
        data.subjects[idx].assignments.push({title, content, done:false});
        saveData(data);
        assignTitle.value = '';
        assignContent.value = '';
        renderAssignments();
        showConfetti();
    });

    populateSubjects();
    renderAssignments();

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
});
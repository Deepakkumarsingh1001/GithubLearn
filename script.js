// Task Manager App

document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle logic
  const darkToggle = document.getElementById('dark-mode-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let darkMode = localStorage.getItem('darkMode');
  if (darkMode === null) darkMode = prefersDark ? 'on' : 'off';
  setDarkMode(darkMode === 'on');

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const enabled = document.body.classList.toggle('dark-mode');
      darkToggle.classList.toggle('active', enabled);
      darkToggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      darkToggle.textContent = enabled ? '☀️ Light Mode' : '🌙 Dark Mode';
      localStorage.setItem('darkMode', enabled ? 'on' : 'off');
    });
  }

  function setDarkMode(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    if (darkToggle) {
      darkToggle.classList.toggle('active', enabled);
      darkToggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      darkToggle.textContent = enabled ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
  }

  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const filterNav = document.querySelector('.filter-nav');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  let currentFilter = 'all';
  renderTasks();

  form.addEventListener('submit', e => {
    e.preventDefault();
    let text = input.value;
    if (typeof text === 'string') text = text.trim();
    if (!text) {
      input.value = '';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    tasks.push({ text, completed: false });
    input.value = '';
    saveAndRender();
  });

  list.addEventListener('click', e => {
    if (e.target.matches('button.complete')) {
      const idx = e.target.closest('li').dataset.index;
      tasks[idx].completed = !tasks[idx].completed;
      saveAndRender();
    }
    if (e.target.matches('button.delete')) {
      const idx = e.target.closest('li').dataset.index;
      tasks.splice(idx, 1);
      saveAndRender();
    }
  });

  if (filterNav) {
    filterNav.addEventListener('click', e => {
      if (e.target.classList.contains('filter-btn')) {
        filterBtns.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        });
        e.target.classList.add('active');
        e.target.setAttribute('aria-pressed', 'true');
        currentFilter = e.target.dataset.filter;
        renderTasks();
      }
    });
  }

  function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }

  function renderTasks() {
    list.innerHTML = '';
    let filtered = tasks;
    if (currentFilter === 'completed') {
      filtered = tasks.filter(t => t.completed);
    } else if (currentFilter === 'pending') {
      filtered = tasks.filter(t => !t.completed);
    }
    if (filtered.length === 0) {
      list.innerHTML = '<li style="text-align:center;color:#888;">No tasks found.</li>';
      return;
    }
    filtered.forEach((task, i) => {
      // Find the original index for actions
      const origIdx = tasks.indexOf(task);
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.dataset.index = origIdx;
      li.innerHTML = `
        <span>${escapeHTML(task.text)}</span>
        <span class="task-actions">
          <button class="action complete" aria-label="${task.completed ? 'Mark as incomplete' : 'Mark as completed'}" title="${task.completed ? 'Mark as incomplete' : 'Mark as completed'}">✔</button>
          <button class="action delete" aria-label="Delete task" title="Delete">✖</button>
        </span>
      `;
      list.appendChild(li);
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, tag => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[tag]));
  }
});

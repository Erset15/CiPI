document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('taskModal');
  const closeBtn = modal ? modal.querySelector('.close') : null;
  const newTaskBtn = document.getElementById('newTaskBtn');
  const taskForm = document.getElementById('taskForm');
  const tasksGrid = document.getElementById('tasksGrid');
  const sortBy = document.getElementById('sortBy');
  const taskSearch = document.getElementById('taskSearch');
  const modalTitle = document.getElementById('modalTitle');

  let tasks = [];
  let editIndex = null;

  if (!tasksGrid || !newTaskBtn || !modal || !closeBtn || !taskForm || !modalTitle) {
    console.warn('Некоторые элементы не найдены, скрипт будет работать частично.');
  }

  // Загрузка задач из localStorage
  function loadTasks() {
    const saved = localStorage.getItem('tasks');
    tasks = saved ? JSON.parse(saved) : [];
  }

  // Сохранение задач в localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Открыть модальное окно
  function openModal(isEdit = false) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    modalTitle.textContent = isEdit ? 'Редактирование задачи' : 'Новая задача';
    if (!isEdit) {
      taskForm.reset();
      editIndex = null;
    }
  }

  // Закрыть модальное окно
  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // Валидация задачи
  function validateTask(task) {
    if (!task.title.trim()) {
      alert('Пожалуйста, укажите тему задачи');
      return false;
    }

    if (!task.start || !task.end) {
      alert('Пожалуйста, укажите даты начала и окончания');
      return false;
    }

    if (new Date(task.start) > new Date(task.end)) {
      alert('Дата окончания должна быть позже даты начала');
      return false;
    }

    if (!task.pomodoroDuration || isNaN(task.pomodoroDuration) || task.pomodoroDuration < 1) {
      alert('Пожалуйста, укажите корректную длительность Pomodoro');
      return false;
    }

    return true;
  }

  // Рендер задач
  function renderTasks() {
    if (!tasksGrid) return;
    tasksGrid.innerHTML = '';

    let filteredTasks = [...tasks];

    // Фильтрация
    const searchTerm = taskSearch ? taskSearch.value.trim().toLowerCase() : '';
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(t =>
        t.title.toLowerCase().includes(searchTerm) ||
        (t.description && t.description.toLowerCase().includes(searchTerm))
      );
    }

    // Сортировка
    if (sortBy) {
      if (sortBy.value === 'priority') {
        filteredTasks.sort((a, b) => b.priority - a.priority);
      } else if (sortBy.value === 'date') {
        filteredTasks.sort((a, b) => new Date(a.start) - new Date(b.start));
      } else if (sortBy.value === 'name') {
        filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    filteredTasks.forEach((task, idx) => {
      const taskCard = document.createElement('div');
      taskCard.className = 'task-card';
      taskCard.dataset.index = idx;

      taskCard.innerHTML = `
        <div class="task-header">
          <h3>${task.title}</h3>
          <span class="priority ${getPriorityClass(task.priority)}">Приоритет: ${task.priority}</span>
        </div>
        <p class="task-desc">${task.description || 'Нет описания'}</p>
        <div class="task-dates">
          <span>Начало: ${formatDate(task.start)}</span>
          <span>Окончание: ${formatDate(task.end)}</span>
        </div>
        <div class="task-pomodoro">
          <span>Длительность Pomodoro: ${task.pomodoroDuration} мин</span>
        </div>
        <div class="task-actions">
          <button class="btn small edit">Редактировать</button>
          <button class="btn small delete">Удалить</button>
        </div>
      `;

      // Обработчики кнопок
      const editBtn = taskCard.querySelector('.edit');
      const deleteBtn = taskCard.querySelector('.delete');

      editBtn.addEventListener('click', () => openEditTask(idx));
      deleteBtn.addEventListener('click', () => deleteTask(idx));

      tasksGrid.appendChild(taskCard);
    });
  }

  // Получить класс для приоритета
  function getPriorityClass(priority) {
    const prio = parseInt(priority);
    if (prio >= 8) return 'high';
    if (prio >= 5) return 'medium';
    return 'low';
  }

  // Формат даты
  function formatDate(dateString) {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
  }

  // Открыть задачу для редактирования
  function openEditTask(idx) {
    if (!tasks[idx]) return;
    editIndex = idx;
    openModal(true);

    // Заполнить форму данными задачи
    document.getElementById('taskTitle').value = tasks[idx].title || '';
    document.getElementById('taskDescription').value = tasks[idx].description || '';
    document.getElementById('taskStart').value = tasks[idx].start || '';
    document.getElementById('taskEnd').value = tasks[idx].end || '';
    document.getElementById('taskPriority').value = tasks[idx].priority || 10;
    document.getElementById('taskPomodoroDuration').value = tasks[idx].pomodoroDuration || 25;
  }

  // Удалить задачу
  function deleteTask(idx) {
    if (!tasks[idx]) return;
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      tasks.splice(idx, 1);
      saveTasks();
      renderTasks();
    }
  }

  // Обработчик отправки формы
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskData = {
      title: document.getElementById('taskTitle').value.trim(),
      description: document.getElementById('taskDescription').value.trim(),
      start: document.getElementById('taskStart').value,
      end: document.getElementById('taskEnd').value,
      priority: Number(document.getElementById('taskPriority').value),
      pomodoroDuration: Number(document.getElementById('taskPomodoroDuration').value)
    };

    if (!validateTask(taskData)) return;

    if (editIndex !== null) {
      tasks[editIndex] = taskData;
    } else {
      tasks.push(taskData);
    }

    saveTasks();
    renderTasks();
    closeModal();
    taskForm.reset();
    editIndex = null;
  });

  // Обработчики открытия/закрытия модального окна
  if (newTaskBtn) newTaskBtn.addEventListener('click', () => openModal(false));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Обработчики сортировки и фильтрации
  if (sortBy) sortBy.addEventListener('change', () => renderTasks());
  if (taskSearch) taskSearch.addEventListener('input', () => renderTasks());

  // Инициализация
  loadTasks();
  renderTasks();
});

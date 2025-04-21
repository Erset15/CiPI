document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('taskModal');
    const closeBtn = modal.querySelector('.close');
    const newTaskBtn = document.getElementById('newTaskBtn');
    const taskForm = document.getElementById('taskForm');
    const tasksGrid = document.getElementById('tasksGrid');
    const sortBy = document.getElementById('sortBy');
    const taskSearch = document.getElementById('taskSearch');

    modal.classList.remove('active');
    document.body.classList.remove('modal-open');

    newTaskBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const taskData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            start: document.getElementById('taskStart').value,
            end: document.getElementById('taskEnd').value,
            priority: document.getElementById('taskPriority').value
        };

        if (!validateTask(taskData)) return;

        saveTask(taskData);
        closeModal();
        taskForm.reset();
    });

    function openModal() {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        document.getElementById('modalTitle').textContent = 'Новая задача';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

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

        return true;
    }

    function saveTask(task) {
        console.log('Сохранение задачи:', task);
        addTaskToGrid(task);
    }

    function addTaskToGrid(task) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
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
            <div class="task-actions">
                <button class="btn small edit">Редактировать</button>
                <button class="btn small delete">Удалить</button>
            </div>
        `;

        tasksGrid.appendChild(taskCard);
        addTaskCardEventListeners(taskCard);
    }

    function addTaskCardEventListeners(card) {
        const editBtn = card.querySelector('.edit');
        const deleteBtn = card.querySelector('.delete');

        editBtn.addEventListener('click', () => editTask(card));
        deleteBtn.addEventListener('click', () => deleteTask(card));
    }

    function editTask(card) {
        console.log('Редактирование задачи:', card);
        openModal();
    }

    function deleteTask(card) {
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            card.remove();
        }
    }

    // Вспомогательные функции
    function getPriorityClass(priority) {
        const prio = parseInt(priority);
        if (prio >= 8) return 'high';
        if (prio >= 5) return 'medium';
        return 'low';
    }

    function formatDate(dateString) {
        if (!dateString) return 'Не указано';
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU');
    }

    document.querySelectorAll('.task-card').forEach(card => {
        addTaskCardEventListeners(card);
    });

    if (sortBy) {
        sortBy.addEventListener('change', function() {
            sortTasks(this.value);
        });
    }

    if (taskSearch) {
        taskSearch.addEventListener('input', function() {
            filterTasks(this.value);
        });
    }

    function sortTasks(criteria) {

        console.log('Сортировка по:', criteria);
    }

    function filterTasks(searchTerm) {

        console.log('Поиск задач:', searchTerm);
    }
});
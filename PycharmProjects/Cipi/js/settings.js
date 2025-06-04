// settings.js - Настройки с интеграцией авторизации

document.addEventListener('DOMContentLoaded', function() {
  firebase.auth().onAuthStateChanged(user => {
    if (!user || !user.emailVerified) {
      window.location.href = '/index.html';
      return;
    }

    document.getElementById('userEmail').textContent = user.email;

    initSettings();
  });

  function initSettings() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        const tabId = button.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
      });
    });

    loadSettings();

    document.getElementById('saveSettings').addEventListener('click', saveSettings);
    document.getElementById('resetSettings').addEventListener('click', resetSettings);

    setupDataHandlers();

    setupBackgroundHandlers();
  }

  function loadSettings() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const settings = JSON.parse(localStorage.getItem(`userSettings_${user.uid}`)) || {
      workDuration: 25,
      breakDuration: 5,
      autoStartNext: true,
      backupFrequency: 'weekly',
      background: '1'
    };

    document.getElementById('workDuration').value = settings.workDuration;
    document.getElementById('breakDuration').value = settings.breakDuration;
    document.getElementById('autoStartNext').checked = settings.autoStartNext;
    document.getElementById('backupFrequency').value = settings.backupFrequency;

    document.querySelector(`.bg-option[data-bg="${settings.background}"]`)?.classList.add('selected');
  }

  function saveSettings() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const settings = {
      workDuration: parseInt(document.getElementById('workDuration').value),
      breakDuration: parseInt(document.getElementById('breakDuration').value),
      autoStartNext: document.getElementById('autoStartNext').checked,
      backupFrequency: document.getElementById('backupFrequency').value,
      background: document.querySelector('.bg-option.selected')?.getAttribute('data-bg') || '1'
    };

    localStorage.setItem(`userSettings_${user.uid}`, JSON.stringify(settings));


    alert('Настройки сохранены!');
  }

  function resetSettings() {
    if (confirm('Вы уверены, что хотите сбросить все настройки?')) {
      const defaults = {
        workDuration: 25,
        breakDuration: 5,
        autoStartNext: true,
        backupFrequency: 'weekly',
        background: '1'
      };

      document.getElementById('workDuration').value = defaults.workDuration;
      document.getElementById('breakDuration').value = defaults.breakDuration;
      document.getElementById('autoStartNext').checked = defaults.autoStartNext;
      document.getElementById('backupFrequency').value = defaults.backupFrequency;

      document.querySelectorAll('.bg-option').forEach(opt => opt.classList.remove('selected'));
      document.querySelector(`.bg-option[data-bg="${defaults.background}"]`).classList.add('selected');

      saveSettings();
    }
  }

  function setupDataHandlers() {
    // Экспорт/импорт задач
    document.getElementById('exportTasks').addEventListener('click', exportTasks);
    document.getElementById('exportSettings').addEventListener('click', exportSettings);

    const importTasksInput = document.createElement('input');
    importTasksInput.type = 'file';
    importTasksInput.accept = '.json';
    importTasksInput.addEventListener('change', importTasks);
    document.body.appendChild(importTasksInput);
    document.getElementById('importTasks').addEventListener('click', () => importTasksInput.click());

    const importSettingsInput = document.createElement('input');
    importSettingsInput.type = 'file';
    importSettingsInput.accept = '.json';
    importSettingsInput.addEventListener('change', importSettings);
    document.body.appendChild(importSettingsInput);
    document.getElementById('importSettings').addEventListener('click', () => importSettingsInput.click());
  }

  function exportTasks() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const tasks = JSON.parse(localStorage.getItem(`userTasks_${user.uid}`)) || [];
    downloadFile(JSON.stringify(tasks), 'pomodoro_tasks.json', 'application/json');
  }

  function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const tasks = JSON.parse(e.target.result);
        const user = firebase.auth().currentUser;
        if (user) {
          localStorage.setItem(`userTasks_${user.uid}`, JSON.stringify(tasks));
          alert('Задачи успешно загружены!');
        }
      } catch (error) {
        alert('Ошибка при загрузке файла: ' + error.message);
      }
    };
    reader.readAsText(file);
  }

  function exportSettings() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const settings = JSON.parse(localStorage.getItem(`userSettings_${user.uid}`)) || {};
    downloadFile(JSON.stringify(settings), 'pomodoro_settings.json', 'application/json');
  }

  function importSettings(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const settings = JSON.parse(e.target.result);
        const user = firebase.auth().currentUser;
        if (user) {
          localStorage.setItem(`userSettings_${user.uid}`, JSON.stringify(settings));
          loadSettings();
          alert('Настройки успешно загружены!');
        }
      } catch (error) {
        alert('Ошибка при загрузке файла: ' + error.message);
      }
    };
    reader.readAsText(file);
  }

  function setupBackgroundHandlers() {
    // Выбор фона из пресетов
    document.querySelectorAll('.bg-option').forEach(option => {
      option.addEventListener('click', function() {
        document.querySelectorAll('.bg-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
      });
    });

    // Загрузка пользовательского фона
    document.getElementById('customBg').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const user = firebase.auth().currentUser;
          if (user) {
            localStorage.setItem(`userBg_${user.uid}`, event.target.result);
            document.body.style.backgroundImage = `url(${event.target.result})`;
            alert('Фон успешно загружен!');
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Загрузка сохраненного фона
    const user = firebase.auth().currentUser;
    if (user) {
      const savedBg = localStorage.getItem(`userBg_${user.uid}`);
      if (savedBg) {
        document.body.style.backgroundImage = `url(${savedBg})`;
      }
    }
  }

  function downloadFile(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }
});


//новый код
// Функция применения цвета меню из localStorage
function applyMenuColor() {
  const menuElement = document.querySelector('header');
  if (!menuElement) return;

  const settings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
  const bgColors = {
    "1": "",          // системный цвет
    "2": "#FFC0CB",   // розовый
    "3": "#00CED1",   // лазурный
    "4": "#C5B895"    // тёмно-бежевый
  };

  const bgValue = settings.background || "1";
  const bgColor = bgColors[bgValue] || "";

  if (bgColor === "") {
    menuElement.style.backgroundColor = "";
    menuElement.style.color = "";
  } else {
    menuElement.style.backgroundColor = bgColor;
    menuElement.style.color = (bgValue === "4") ? "#000000" : "";
  }
}

// Вызывайте эту функцию при загрузке каждой страницы
document.addEventListener('DOMContentLoaded', () => {
  applyMenuColor();
});


// Создаём элемент ico
const link = document.createElement('link');
link.rel = 'icon';
link.type = 'icon';
link.href = '../icon.ico';

// Добавляем в head
document.head.appendChild(link);
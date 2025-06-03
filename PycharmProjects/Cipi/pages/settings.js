document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('DOMContentLoaded', () => {
  const bgOptions = document.querySelectorAll('.bg-option');
  const menuElement = document.querySelector('header');

  const bgColors = {
    "1": "",          // системный цвет (сброс)
    "2": "#FFC0CB",   // розовый
    "3": "#00CED1",   // лазурный
    "4": "#C5B895"    // тёмно-бежевый
  };

  // Функция установки активного фона и цвета меню
  function setActiveBg(bgValue) {
    // Снимаем выделение со всех
    bgOptions.forEach(opt => opt.classList.remove('selected'));

    // Выделяем выбранный
    const selectedOption = document.querySelector(`.bg-option[data-bg="${bgValue}"]`);
    if (selectedOption) selectedOption.classList.add('selected');

    // Устанавливаем цвет меню
    if (menuElement) {
      if (!bgColors[bgValue]) {
        menuElement.style.backgroundColor = "";
        menuElement.style.color = "";
      } else {
        menuElement.style.backgroundColor = bgColors[bgValue];
        menuElement.style.color = (bgValue === "4") ? "#000000" : "";
      }

    }

    // Сохраняем в localStorage
    const settings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
    settings.background = bgValue;
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }

  // Обработчик клика по фону
  bgOptions.forEach(option => {
    option.addEventListener('click', () => {
      const bgValue = option.getAttribute('data-bg');
      setActiveBg(bgValue);
    });
  });

  // Загрузка настроек при старте
  function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
    const bgValue = settings.background || "1";
    setActiveBg(bgValue);
  }

  loadSettings();
});


  //старый код
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

  const workDurationInput = document.getElementById('workDuration');
  const breakDurationInput = document.getElementById('breakDuration');
  const autoStartCheckbox = document.getElementById('autoStartNext');

  const exportTasksBtn = document.getElementById('exportTasks');
  const importTasksBtn = document.getElementById('importTasks');
  const exportSettingsBtn = document.getElementById('exportSettings');
  const importSettingsBtn = document.getElementById('importSettings');
  const backupFrequencySelect = document.getElementById('backupFrequency');

  const saveSettingsBtn = document.getElementById('saveSettings');
  const resetSettingsBtn = document.getElementById('resetSettings');

  // Load saved settings
  function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
    
    if (settings.workDuration) workDurationInput.value = settings.workDuration;
    if (settings.breakDuration) breakDurationInput.value = settings.breakDuration;
    if (settings.autoStartNext !== undefined) autoStartCheckbox.checked = settings.autoStartNext;
    if (settings.backupFrequency) backupFrequencySelect.value = settings.backupFrequency;
    if (settings.background) {
      document.querySelector(`.bg-option[data-bg="${settings.background}"]`).classList.add('selected');
    }
  }

  function saveSettings() {
    const settings = {
      workDuration: parseInt(workDurationInput.value),
      breakDuration: parseInt(breakDurationInput.value),
      autoStartNext: autoStartCheckbox.checked,
      backupFrequency: backupFrequencySelect.value,
      background: document.querySelector('.bg-option.selected')?.getAttribute('data-bg')
    };
    
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    alert('Настройки сохранены! Обновите страницу');
  }

  function resetSettings() {
    if (confirm('Вы уверены, что хотите сбросить все настройки?')) {
      workDurationInput.value = 25;
      breakDurationInput.value = 5;
      autoStartCheckbox.checked = true;
      backupFrequencySelect.value = 'weekly';

      document.querySelectorAll('.bg-option').forEach(option => {
        option.classList.remove('selected');
      });
      
      saveSettings();
    }
  }

  // Background selection
  document.querySelectorAll('.bg-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.bg-option').forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  function exportTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const dataStr = JSON.stringify(tasks);
    downloadFile(dataStr, 'pomodoro_tasks.json', 'application/json');
  }

  function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const tasks = JSON.parse(e.target.result);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        alert('Задачи успешно загружены!');
      } catch (error) {
        alert('Ошибка при загрузке файла: ' + error.message);
      }
    };
    reader.readAsText(file);
  }

  function exportSettings() {
    const settings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
    const dataStr = JSON.stringify(settings);
    downloadFile(dataStr, 'pomodoro_settings.json', 'application/json');
  }

  function importSettings(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const settings = JSON.parse(e.target.result);
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
        loadSettings();
        alert('Настройки успешно загружены!');
      } catch (error) {
        alert('Ошибка при загрузке файла: ' + error.message);
      }
    };
    reader.readAsText(file);
  }

  function downloadFile(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  saveSettingsBtn.addEventListener('click', saveSettings);
  resetSettingsBtn.addEventListener('click', resetSettings);
  
  exportTasksBtn.addEventListener('click', exportTasks);
  exportSettingsBtn.addEventListener('click', exportSettings);

  const importTasksInput = document.createElement('input');
  importTasksInput.type = 'file';
  importTasksInput.accept = '.json';
  importTasksInput.style.display = 'none';
  importTasksInput.addEventListener('change', importTasks);
  document.body.appendChild(importTasksInput);
  
  importTasksBtn.addEventListener('click', () => importTasksInput.click());
  
  const importSettingsInput = document.createElement('input');
  importSettingsInput.type = 'file';
  importSettingsInput.accept = '.json';
  importSettingsInput.style.display = 'none';
  importSettingsInput.addEventListener('change', importSettings);
  document.body.appendChild(importSettingsInput);
  
  importSettingsBtn.addEventListener('click', () => importSettingsInput.click());

  const customBgInput = document.getElementById('customBg');
  customBgInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {

        localStorage.setItem('customBackground', event.target.result);

        document.body.style.backgroundImage = `url(${event.target.result})`;
        alert('Фон успешно загружен!');
      };
      reader.readAsDataURL(file);
    }
  });

  const savedBg = localStorage.getItem('customBackground');
  if (savedBg) {
    document.body.style.backgroundImage = `url(${savedBg})`;
  }

  loadSettings();
});
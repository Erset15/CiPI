document.addEventListener('DOMContentLoaded', () => {
  const tasksContainer = document.getElementById('taskList');
  const timerDisplay = document.getElementById('timer');
  const startBtn = document.getElementById('startPomodoro');
  const stopBtn = document.getElementById('stopPomodoro');
  const skipBreakBtn = document.getElementById('skipBreak');
  const increaseBtn = document.getElementById('increaseTime');
  const decreaseBtn = document.getElementById('decreaseTime');

  let pomodoroDuration = 25 * 60;
  let timer = pomodoroDuration;
  let intervalId = null;
  let isPomodoro = true;
  const breakDuration = 5 * 60;

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(timer);
  }

  function loadTasks() {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  }

  function renderTasks() {
    const tasks = loadTasks();
    tasksContainer.innerHTML = '';

    if (tasks.length === 0) {
      tasksContainer.textContent = 'Нет задач для отображения.';
      return;
    }

    tasks.forEach((task, idx) => {
      const card = document.createElement('div');
      card.className = 'task-item';

      card.innerHTML = `
        <h4>${task.title}</h4>
        <p>Приоритет: ${task.priority}</p>
        <p>До: ${new Date(task.end).toLocaleString()}</p>
        <button class="btn small start-btn">Запустить</button>
      `;

      card.querySelector('.start-btn').onclick = () => {
        startPomodoroWithDuration(task.pomodoroDuration);
      };

      tasksContainer.appendChild(card);
    });
  }

  function startPomodoroWithDuration(minutes) {
    if (intervalId) {
      clearInterval(intervalId);
    }
    pomodoroDuration = minutes * 60;
    timer = pomodoroDuration;
    isPomodoro = true;

    updateDisplay();

    startBtn.disabled = true;
    stopBtn.disabled = false;
    increaseBtn.disabled = true;
    decreaseBtn.disabled = true;
    skipBreakBtn.disabled = true;
    timerDisplay.contentEditable = false;

    intervalId = setInterval(() => {
      timer--;
      updateDisplay();

      if (timer <= 0) {
        clearInterval(intervalId);
        intervalId = null;

        if (isPomodoro) {
          isPomodoro = false;
          timer = breakDuration;
          updateDisplay();

          skipBreakBtn.disabled = false;

          // Автоматический старт перерыва
          startPomodoroWithDuration(breakDuration / 60);
        } else {
          isPomodoro = true;
          timer = pomodoroDuration;
          updateDisplay();

          skipBreakBtn.disabled = true;
          startBtn.disabled = false;
          stopBtn.disabled = true;
          increaseBtn.disabled = false;
          decreaseBtn.disabled = false;
          timerDisplay.contentEditable = true;
        }
      }
    }, 1000);
  }

  function stopTimer() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    startBtn.disabled = false;
    stopBtn.disabled = true;
    increaseBtn.disabled = false;
    decreaseBtn.disabled = false;
    skipBreakBtn.disabled = true;
    timerDisplay.contentEditable = true;
    updateDisplay();
  }

  startBtn.onclick = () => {
    startPomodoroWithDuration(pomodoroDuration / 60);
  };
  stopBtn.onclick = stopTimer;
  skipBreakBtn.onclick = () => {
    if (!isPomodoro && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      isPomodoro = true;
      timer = pomodoroDuration;
      updateDisplay();
      skipBreakBtn.disabled = true;
      startBtn.disabled = false;
      stopBtn.disabled = true;
      increaseBtn.disabled = false;
      decreaseBtn.disabled = false;
      timerDisplay.contentEditable = true;
    }
  };
  increaseBtn.onclick = () => {
    if (intervalId) return;
    pomodoroDuration += 60;
    if (pomodoroDuration > 60 * 60) pomodoroDuration = 60 * 60;
    timer = pomodoroDuration;
    updateDisplay();
  };
  decreaseBtn.onclick = () => {
    if (intervalId) return;
    pomodoroDuration -= 60;
    if (pomodoroDuration < 60) pomodoroDuration = 60;
    timer = pomodoroDuration;
    updateDisplay();
  };

  renderTasks();
  timer = pomodoroDuration;
  updateDisplay();
  stopBtn.disabled = true;
  skipBreakBtn.disabled = true;
});

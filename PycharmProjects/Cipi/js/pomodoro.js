 const timerDisplay = document.getElementById('timer');
  const startBtn = document.getElementById('startPomodoro');
  const stopBtn = document.getElementById('stopPomodoro');
  const skipBreakBtn = document.getElementById('skipBreak');
  const increaseBtn = document.getElementById('increaseTime');
  const decreaseBtn = document.getElementById('decreaseTime');

  const workAudio = document.getElementById('workAudio');
  const breakAudio = document.getElementById('breakAudio');

  const breakDuration = 5 * 60; // 5 минут перерыва

  let timer = 0;          // текущее время в секундах
  let intervalId = null;
  let isPomodoro = true;  // true - рабочий период, false - перерыв
  let pomodoroDuration = 25 * 60; // по умолчанию 25 минут

  function parseTime(str) {
    const parts = str.split(':');
    if (parts.length !== 2) return null;
    const m = parseInt(parts[0], 10);
    const s = parseInt(parts[1], 10);
    if (isNaN(m) || isNaN(s) || s < 0 || s >= 60 || m < 0) return null;
    return m * 60 + s;
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(timer);
  }

  function getInitialTime() {
    const val = timerDisplay.textContent.trim();
    const seconds = parseTime(val);
    return seconds !== null ? seconds : pomodoroDuration;
  }

  function setNewTime(newSeconds) {
    if (newSeconds < 60) newSeconds = 60;
    if (newSeconds > 60 * 60) newSeconds = 60 * 60;
    pomodoroDuration = newSeconds;
    if (isPomodoro && !intervalId) {
      timer = pomodoroDuration;
      updateDisplay();
    }
  }

  function playWorkAudio() {
    breakAudio.pause();
    breakAudio.currentTime = 0;
    workAudio.play().catch(() => {});
  }

  function playBreakAudio() {
    workAudio.pause();
    workAudio.currentTime = 0;
    breakAudio.play().catch(() => {});
  }

  function stopAllAudio() {
    workAudio.pause();
    breakAudio.pause();
    workAudio.currentTime = 0;
    breakAudio.currentTime = 0;
  }

  increaseBtn.addEventListener('click', () => {
    if (intervalId) return;
    const current = getInitialTime();
    setNewTime(current + 60);
  });

  decreaseBtn.addEventListener('click', () => {
    if (intervalId) return;
    const current = getInitialTime();
    setNewTime(current - 60);
  });

  function startTimer() {
    if (intervalId) return;

    if (timer === 0 || timer === pomodoroDuration) {
      timer = getInitialTime();
      pomodoroDuration = timer;
    }

    startBtn.disabled = true;
    stopBtn.disabled = false;
    increaseBtn.disabled = true;
    decreaseBtn.disabled = true;
    timerDisplay.contentEditable = false;

    if (isPomodoro) {
      playWorkAudio();
    } else {
      playBreakAudio();
    }

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

          playBreakAudio();
          startTimer();
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

          stopAllAudio();
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
    timerDisplay.contentEditable = true;

    stopAllAudio();
  }

  function skipBreak() {
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

      stopAllAudio();
    }
  }

  timer = getInitialTime();
  updateDisplay();
  skipBreakBtn.disabled = true;
  stopBtn.disabled = true;

  startBtn.addEventListener('click', startTimer);
  stopBtn.addEventListener('click', stopTimer);
  skipBreakBtn.addEventListener('click', skipBreak);
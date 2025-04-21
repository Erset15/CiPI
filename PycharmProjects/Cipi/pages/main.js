import Head from 'next/head';
import Link from 'next/link';

export default function Main() {
  return (
    <div>
      <Head>
        <title>Pomodoro App - Главная</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <header>
        <div className="logo">Pomodoro App</div>
        <nav>
          <ul>
            <li>
              <Link href="/main" className="active">
                Главная
              </Link>
            </li>
            <li>
              <Link href="/tasks">Задачи</Link>
            </li>
            <li>              <Link href="/stats">Статистика</Link>
            </li>
            <li>
              <Link href="/feedback">Обратная связь</Link>
            </li>
            <li>
              <Link href="/settings">Настройки</Link>
            </li>
          </ul>
        </nav>
        <div className="user-info">
          <span id="userEmail">user@edu.mirea.ru</span>
          <button id="logoutBtn">Выйти</button>
        </div>
      </header>

      <div className="container">
        <main className="pomodoro-container">
          <div className="pomodoro-timer">
            <div className="timer-display" id="timer">
              25:00
            </div>
            <div className="timer-controls">
              <button id="startPomodoro" className="btn">
                Старт
              </button>
              <button id="stopPomodoro" className="btn" disabled>
                Стоп
              </button>
              <button id="skipBreak" className="btn" disabled>
                Пропустить перерыв
              </button>
            </div>
            <div className="current-task">
              <h3>Текущая задача</h3>
              <div id="currentTaskInfo">Нет активной задачи</div>
              <button id="extendTime" className="btn hidden">
                Продлить время
              </button>
            </div>
          </div>
        </main>

        <aside className="tasks-sidebar">
          <h2>Ваши задачи</h2>
          <div className="task-list" id="taskList">
            <div className="task-item">
              <h4>Завершить проект</h4>
              <p>Приоритет: 8</p>
              <p>До: 15.06.2023 18:00</p>
            </div>
            <div className="task-item">
              <h4>Подготовить презентацию</h4>
              <p>Приоритет: 5</p>
              <p>До: 16.06.2023 12:00</p>
            </div>
          </div>
        </aside>
      </div>

      <script src="/js/pomodoro.js"></script>
      <script src="/js/tasks.js"></script>
      <script src="/js/auth.js"></script>
    </div>
  );
}

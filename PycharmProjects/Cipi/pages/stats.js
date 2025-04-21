import Head from 'next/head';
import Link from 'next/link';

export default function Stats() {
  return (
    <div>
      <Head>
        <title>Pomodoro App - Статистика</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <header>
        <div className="logo">Pomodoro App</div>
        <nav>
          <ul>
            <li>
              <Link href="/main">Главная</Link>
            </li>
            <li>
              <Link href="/tasks">Задачи</Link>
            </li>
            <li>
              <Link href="/stats" className="active">
                Статистика
              </Link>
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
        <main className="stats-main">
          <h1>Статистика продуктивности</h1>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Выполнено задач</h3>
              <div className="stat-value">24</div>
              <div className="stat-trend up">+5% за неделю</div>
            </div>

            <div className="stat-card">
              <h3>Просрочено задач</h3>
              <div className="stat-value">3</div>              <div className="stat-trend down">-2% за неделю</div>
            </div>

            <div className="stat-card">
              <h3>Среднее время выполнения</h3>
              <div className="stat-value">1ч 25м</div>
              <div className="stat-trend neutral">±0% за неделю</div>
            </div>

            <div className="stat-card">
              <h3>Использовано Pomodoro</h3>
              <div className="stat-value">87</div>
              <div className="stat-trend up">+12% за неделю</div>
            </div>
          </div>

          <div className="chart-container">
            <h3>Продуктивность по дням</h3>
            <div className="chart-placeholder">
              {/* Здесь будет график */}
              <canvas id="productivityChart"></canvas>
            </div>
          </div>

          <div className="urgent-tasks">
            <h3>Задачи, требующие внимания</h3>
            <ul id="urgentTasksList">
              <li>
                <strong>Подготовить отчет</strong> - Осталось 2 дня (Приоритет: 9)
                <span className="warning">Рекомендуется ускориться!</span>
              </li>
              <li>
                <strong>Изучить новую тему</strong> - Осталось 3 дня (Приоритет: 7)
              </li>
            </ul>
          </div>
        </main>
      </div>

      <script src="/js/auth.js"></script>
      <script src="/js/stats.js"></script>
    </div>
  );
}

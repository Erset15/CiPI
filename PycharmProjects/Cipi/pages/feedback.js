import Head from 'next/head';
import Link from 'next/link';

export default function Feedback() {
  return (
    <div>
      <Head>
        <title>Pomodoro App - Обратная связь</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <header>        <div className="logo">Pomodoro App</div>
        <nav>
          <ul>
            <li>
              <Link href="/main">Главная</Link>
            </li>
            <li>
              <Link href="/tasks">Задачи</Link>
            </li>
            <li>
              <Link href="/stats">Статистика</Link>
            </li>
            <li>
              <Link href="/feedback" className="active">
                Обратная связь
              </Link>
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
        <main className="feedback-main">
          <h1>Обратная связь</h1>
          <p>Если у вас возникли проблемы или есть предложения по улучшению приложения, заполните форму ниже.</p>

          <form id="feedbackForm">
            <div className="form-group">
              <label htmlFor="feedbackSubject">Тематика*</label>
              <select id="feedbackSubject" required>
                <option value="">Выберите тематику</option>
                <option value="bug">Ошибка в приложении</option>
                <option value="feature">Предложение по улучшению</option>
                <option value="question">Вопрос по использованию</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="feedbackDescription">Описание проблемы*</label>
              <textarea id="feedbackDescription" rows="6" required placeholder="Опишите вашу проблему или предложение как можно подробнее..."></textarea>
            </div>

            <button type="submit" className="btn">
              Отправить обращение
            </button>
          </form>

          <div id="feedbackMessage" className="message hidden"></div>
        </main>
      </div>

      <script src="/js/auth.js"></script>
      <script src="/js/feedback.js"></script>
    </div>
  );
}

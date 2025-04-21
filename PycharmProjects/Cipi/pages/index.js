import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Pomodoro App - Вход</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <div className="login-page">
        <div className="login-container">
          <h1>Вход в Pomodoro App</h1>
          <p>Введите ваш email для получения ссылки входа</p>

          <form id="loginForm">
            <div className="form-group">
              <input type="email" id="email" placeholder="your@email.edu.mirea.ru" required />
            </div>
            <button type="submit" className="btn">
              Получить ссылку входа
            </button>
          </form>

          <div id="message" className="message"></div>
        </div>
      </div>
      <script src="/js/auth.js"></script>
    </div>
  );
}

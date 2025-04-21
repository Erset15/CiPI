const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));


// База данных
const db = {
  verificationCodes: [],
  sessions: []
};

// Генерация 6-значного кода
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Middleware для логирования
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// API для отправки кода
app.post('/api/send-code', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email обязателен'
      });
    }

    // Простая валидация email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Неверный формат email'
      });
    }

    db.verificationCodes = db.verificationCodes.filter(c => c.email !== email);

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

    db.verificationCodes.push({ email, code, expiresAt });

    // Логирование
    const logMessage = `${new Date().toISOString()} | Код для ${email}: ${code}\n`;
    fs.appendFileSync('auth.log', logMessage);
    console.log(logMessage.trim());

    res.json({
      success: true,
      message: 'Код отправлен. Проверьте консоль сервера.',
      code: code // Временный вывод на входе
    });

  } catch (error) {
    console.error('Ошибка в /api/send-code:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: error.message
    });
  }
});

// API для проверки кода
app.post('/api/verify-code', (req, res) => {
  try {
    const { email, code } = req.body;
    const now = new Date();

    const verification = db.verificationCodes.find(
      c => c.email === email && c.code === code && c.expiresAt > now
    );

    if (verification) {
      // Удаляем использованный код
      db.verificationCodes = db.verificationCodes.filter(c => c.code !== code);

      // Создаем сессию
      const token = crypto.randomBytes(16).toString('hex');
      db.sessions.push({ email, token, createdAt: new Date() });

      res.json({
        success: true,
        token,
        email
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Неверный или просроченный код'
      });
    }
  } catch (error) {
    console.error('Ошибка в /api/verify-code:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

// API для проверки авторизации
app.get('/api/check-auth', (req, res) => {
  try {
    const token = req.headers.authorization;
    const session = db.sessions.find(s => s.token === token);

    if (session) {
      res.json({
        success: true,
        email: session.email
      });
    } else {
      res.status(401).json({
        success: false
      });
    }
  } catch (error) {
    console.error('Ошибка в /api/check-auth:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

// API для выхода
app.post('/api/logout', (req, res) => {
  try {
    const { token } = req.body;
    db.sessions = db.sessions.filter(s => s.token !== token);
    res.json({
      success: true
    });
  } catch (error) {
    console.error('Ошибка в /api/logout:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

// Маршруты для HTML страниц
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.get('/main.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'main.html'));
});

app.get('/tasks.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'tasks.html'));
});

app.get('/stats.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'stats.html'));
});

app.get('/feedback.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'feedback.html'));
});

app.get('/settings.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'settings.html'));
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log('Логи будут сохраняться в auth.log');
});
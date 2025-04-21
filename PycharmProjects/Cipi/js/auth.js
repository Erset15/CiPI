// auth.js - Система авторизации с одноразовыми кодами

const auth = {
  currentUser: null,

  init() {
    this.loadCurrentUser();
    this.setupEventListeners();
    console.log('Auth module initialized');
  },

  loadCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        this.updateUI();
        console.log('User loaded from storage:', this.currentUser.email);
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('currentUser');
      }
    }
  },

  updateUI() {
    const userElements = document.querySelectorAll('#userEmail, .user-email');
    if (userElements.length > 0 && this.currentUser?.email) {
      userElements.forEach(el => {
        el.textContent = this.currentUser.email;
      });
    }
  },

  // Отправка кода
  async sendVerificationCode(email) {
    try {
      console.log('Sending code to:', email);
      const response = await fetch('/api/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Send code error:', error);
      return {
        success: false,
        message: error.message || 'Ошибка сети при отправке кода'
      };
    }
  },

  // Проверка кода
  async verifyCode(email, code) {
    try {
      console.log('Verifying code for:', email);
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, code })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        this.currentUser = {
          email: data.email,
          token: data.token
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.updateUI();
        console.log('User verified:', data.email);
      }

      return data;
    } catch (error) {
      console.error('Verify code error:', error);
      return {
        success: false,
        message: error.message || 'Ошибка сети при проверке кода'
      };
    }
  },

  // Проверка авторизации
  async checkAuth() {
    if (!this.currentUser?.token) {
      return false;
    }

    try {
      const response = await fetch('/api/check-auth', {
        headers: {
          'Authorization': this.currentUser.token
        }
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Check auth error:', error);
      return false;
    }
  },

  async logout() {
    try {
      if (this.currentUser?.token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: this.currentUser.token
          })
        });
      }

      this.currentUser = null;
      localStorage.removeItem('currentUser');
      console.log('User logged out');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Ошибка при выходе'
      };
    }
  },

  requireAuth(redirectTo = '/index.html') {
    if (!this.currentUser) {
      console.log('Auth required - redirecting to login');
      window.location.href = redirectTo;
      return false;
    }
    return true;
  },

  setupEventListeners() {
    document.querySelectorAll('#logoutBtn, .logout-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const result = await this.logout();
        if (result.success) {
          window.location.href = '/index.html';
        } else {
          alert(result.message);
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  auth.init();

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('email');
      const email = emailInput.value.trim();
      const messageEl = document.getElementById('message') || document.createElement('div');

      if (!email) {
        messageEl.textContent = 'Введите email';
        return;
      }

      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
      messageEl.textContent = '';
      messageEl.className = 'message';

      const result = await auth.sendVerificationCode(email);

      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      if (result.success) {
        loginForm.innerHTML = `
          <div class="form-group">
            <p>Код отправлен на ${email}</p>
            <p><small>(Для разработки: ${result.code})</small></p>
            <input type="text" id="code" placeholder="Введите 6-значный код" 
                   required pattern="\\d{6}" title="Введите 6 цифр">
          </div>
          <div class="form-actions">
            <button type="button" id="verifyCodeBtn" class="btn">Подтвердить</button>
            <button type="button" id="backBtn" class="btn secondary">Назад</button>
          </div>
        `;

        document.getElementById('verifyCodeBtn').addEventListener('click', async () => {
          const code = document.getElementById('code').value.trim();

          if (!/^\d{6}$/.test(code)) {
            messageEl.textContent = 'Введите 6 цифр кода';
            messageEl.className = 'message error';
            return;
          }

          const verifyResult = await auth.verifyCode(email, code);

          if (verifyResult.success) {
            window.location.href = '/main.html';
          } else {
            messageEl.textContent = verifyResult.message || 'Неверный код';
            messageEl.className = 'message error';
          }
        });

        document.getElementById('backBtn').addEventListener('click', () => {
          window.location.reload();
        });
      } else {
        messageEl.textContent = result.message || 'Ошибка отправки кода';
        messageEl.className = 'message error';
      }
    });
  }
});

window.auth = auth;
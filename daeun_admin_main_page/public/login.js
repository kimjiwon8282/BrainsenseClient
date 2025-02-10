document
  .getElementById('loginForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:8081/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/admin/dashboard';
      } else {
        document.getElementById('errorMessage').innerText = data.message;
      }
    } catch (error) {
      console.error('로그인 에러', error);
      document.getElementById('errorMessage').innerText = '서버 오류';
    }
  });

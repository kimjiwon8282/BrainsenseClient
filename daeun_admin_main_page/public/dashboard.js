document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('로그인이 필요합니다.');
    window.location.href = '/admin';
    return;
  }

  try {
    const response = await fetch('http://localhost:8081/admin/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById(
        'adminInfo'
      ).innerText = `관리자: ${data.admin.username}`;
    } else {
      alert('인증 실패: ' + data.message);
      window.location.href = '/admin';
    }
  } catch (error) {
    console.error('인증 오류:', error);
    alert('서버 오류 발생!');
    window.location.href = '/admin';
  }
});

document.getElementById('logoutBtn').addEventListener('click', function () {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});

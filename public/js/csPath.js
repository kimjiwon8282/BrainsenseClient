document.addEventListener('DOMContentLoaded', () => {
  const csaskLink = document.getElementById('btn-ask');
  const csfaqLink = document.getElementById('btn-faq');
  const allLinks = [csaskLink, csfaqLink];

  setButtonStateByUrl();

  csaskLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/cs/ask';
  });
  csfaqLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/cs/faq';
  });

  // URL에 따른 버튼 색상 자동 설정
  function setButtonStateByUrl() {
    const currentPath = window.location.pathname;

    if (currentPath.startsWith('/cs/ask')) {
      resetActiveButtons();
      csaskLink.classList.add('active');
    } else if (currentPath.startsWith('/cs/faq')) {
      resetActiveButtons();
      csfaqLink.classList.add('active');
    }
  }

  // 모든 버튼의 active 클래스 초기화 함수
  function resetActiveButtons() {
    allLinks.forEach((link) => link.classList.remove('active'));
  }
});

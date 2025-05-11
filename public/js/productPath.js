document.addEventListener('DOMContentLoaded', () => {
  const hardwareLink = document.getElementById('btn-hw');
  const softwareLink = document.getElementById('btn-sw');
  const allLinks = [hardwareLink, softwareLink];

  // 초기 로드 시 URL에 따라 버튼 색상 자동 설정
  setButtonStateByUrl();

  // 하드웨어 버튼 클릭 시
  hardwareLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/products/hw';
  });

  // 소프트웨어 버튼 클릭 시
  softwareLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/products/sw';
  });

  // URL에 따른 버튼 색상 자동 설정
  function setButtonStateByUrl() {
    const currentPath = window.location.pathname;

    // /products/hw 일 때 하드웨어 버튼 파란색
    if (currentPath.startsWith('/products/hw')) {
      resetActiveButtons();
      hardwareLink.classList.add('active');
    }
    // /products/sw 일 때 소프트웨어 버튼 파란색
    else if (currentPath.startsWith('/products/sw')) {
      resetActiveButtons();
      softwareLink.classList.add('active');
    }
  }

  // 모든 버튼의 active 클래스 초기화 함수
  function resetActiveButtons() {
    allLinks.forEach((link) => link.classList.remove('active'));
  }
});

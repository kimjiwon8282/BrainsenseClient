document.addEventListener('DOMContentLoaded', () => {
  const cpintroLink = document.getElementById('btn-intro');
  const cpnewsink = document.getElementById('btn-news');
  const cpteamLink = document.getElementById('btn-team');
  const cpperformLink = document.getElementById('btn-perform');
  const allLinks = [cpintroLink, cpnewsink, cpteamLink, cpperformLink];

  setButtonStateByUrl();

  cpintroLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/company/intro';
  });
  cpnewsink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/company/news';
  });
  cpteamLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/company/team';
  });
  cpperformLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/company/perform';
  });

  // URL에 따른 버튼 색상 자동 설정
  function setButtonStateByUrl() {
    const currentPath = window.location.pathname;

    if (currentPath.startsWith('/company/intro')) {
      resetActiveButtons();
      cpintroLink.classList.add('active');
    } else if (currentPath.startsWith('/company/perform')) {
      resetActiveButtons();
      cpperformLink.classList.add('active');
    } else if (currentPath.startsWith('/company/news')) {
      resetActiveButtons();
      cpnewsink.classList.add('active');
    } else if (currentPath.startsWith('/company/team')) {
      resetActiveButtons();
      cpteamLink.classList.add('active');
    }
  }

  // 모든 버튼의 active 클래스 초기화 함수
  function resetActiveButtons() {
    allLinks.forEach((link) => link.classList.remove('active'));
  }
});

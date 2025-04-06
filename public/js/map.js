const waitForKakao = () => {
  if(window.kakao && window.kakao.maps){
    const container = document.getElementById("map");
    const options =  {
      center: new kakao.maps.LatLng(35.451757048437976, 128.809566612766),
      level:3
    };
    const map = new kakao.maps.Map(container, options);
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(35.451757048437976, 128.809566612766),
      map:map
    });
  }else{
    setTimeout(waitForKakao, 100);
  }
};
window.addEventListener("load", waitForKakao);
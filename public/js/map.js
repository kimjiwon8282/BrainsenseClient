var container = document.getElementById('map');
var options = {
  center: new kakao.maps.LatLng(35.451757048437976, 128.809566612766),
  level: 3,
};

var map = new kakao.maps.Map(container, options);

var markerPosition = new kakao.maps.LatLng(
  35.451757048437976,
  128.809566612766
);
var marker = new kakao.maps.Marker({
  position: markerPosition,
});

marker.setMap(map);

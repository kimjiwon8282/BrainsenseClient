function showSlide(index) {
    var img = document.getElementById("slider-image");
    if (img) {
      img.src = images[index];
    }
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + images.length) % images.length;
    showSlide(currentSlide);
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % images.length;
    showSlide(currentSlide);
  }
  
  document.addEventListener("DOMContentLoaded", function() { //목록보기 버튼을 눌렀을때때
    var listButton = document.querySelector(".id_list");
    if (listButton) {
      listButton.addEventListener("click", function() {
        window.location.href = "/company/news";
      });
    }
  });
  
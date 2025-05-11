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
  
  document.addEventListener("DOMContentLoaded", function() { //목록보기 버튼을 눌렀을때
    var listButton = document.querySelector(".id_list");
    if (listButton) {
      listButton.addEventListener("click", function() {
        window.location.href = "/company/news";
      });
    }

    var viewerButtons = document.querySelectorAll(".id_viewer");
    
    viewerButtons.forEach(function (button) {
      button.addEventListener("click", function() {
        var fileUrl = button.getAttribute("data-file-url");
        if (fileUrl) {
          // PDF 파일을 브라우저의 내장 뷰어에서 열도록 처리
          var pdfWindow = window.open("");
          pdfWindow.document.write(
              `<iframe src="${fileUrl}" frameborder="0" style="width:100%;height:100%;"></iframe>`
          );
      } else {
          alert("파일을 열 수 없습니다.");
      }
      });
    });
  });


  
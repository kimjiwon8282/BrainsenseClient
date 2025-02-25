document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cs_form");
    const fileInput = document.getElementById("fileInput");
    const uploadArea = document.getElementById("cs_upload_area");
    const uploadBtn = document.getElementById("cs_upload_btn");
    const fileListDisplay = document.getElementById("cs_file_list");
    const submitBtn = document.getElementById("submitBtn");
  
    // 선택된 파일들을 저장할 배열
    let selectedFiles = [];
  
    // "파일 선택" 버튼 클릭 -> 숨겨진 file input 클릭
    uploadBtn.addEventListener("click", () => {
      fileInput.click();
    });
  
    // file input에서 파일을 선택했을 때
    fileInput.addEventListener("change", (e) => {
      handleFiles(e.target.files);
      // 선택 후에 input.value를 초기화해서 같은 파일 다시 선택 가능하도록
      fileInput.value = "";
    });
  
    // 드래그앤드롭 이벤트
    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.classList.add("dragover");
    });
  
    uploadArea.addEventListener("dragleave", (e) => {
      e.preventDefault();
      uploadArea.classList.remove("dragover");
    });
  
    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.classList.remove("dragover");
      handleFiles(e.dataTransfer.files);
    });
  
    // 파일 처리 로직
    function handleFiles(files) {
      // 새로 드롭하거나 선택한 파일들을 배열에 추가 (최대 5개 제한)
      for (let i = 0; i < files.length; i++) {
        if (selectedFiles.length >= 5) {
          alert("최대 5개까지 업로드 가능합니다.");
          break;
        }
        selectedFiles.push(files[i]);
      }
      updateFileList();
    }
  
    // 파일 목록 UI 업데이트
    function updateFileList() {
      fileListDisplay.innerHTML = "";
      if (selectedFiles.length === 0) {
        const li = document.createElement("li");
        li.textContent = "선택된 파일이 없습니다.";
        fileListDisplay.appendChild(li);
      } else {
        selectedFiles.forEach((file, index) => {
          const li = document.createElement("li");
          li.style.marginBottom = "4px";
  
          // 파일명 표시
          const fileNameSpan = document.createElement("span");
          fileNameSpan.textContent = file.name;
  
          // 삭제 버튼
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "삭제";
          deleteBtn.style.marginLeft = "8px";
          deleteBtn.style.backgroundColor = "transparent";
          deleteBtn.style.border = "1px solid #aaa";
          deleteBtn.style.cursor = "pointer";
          deleteBtn.addEventListener("click", () => {
            // selectedFiles에서 해당 파일 제거
            selectedFiles.splice(index, 1);
            updateFileList();
          });
  
          li.appendChild(fileNameSpan);
          li.appendChild(deleteBtn);
          fileListDisplay.appendChild(li);
        });
      }
    }
  
    // 초기 상태
    updateFileList();
  
    // 폼 제출 (AJAX)
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      // FormData 수동 생성
      const formData = new FormData();
  
      // 1) 배열에 있는 파일들을 FormData에 추가
      selectedFiles.forEach((file) => {
        formData.append("attachments", file);
      });
  
      // 2) 나머지 텍스트 필드, 라디오/체크박스 값 가져오기
      const orderType = form.querySelector('input[name="orderType"]:checked');
      if (orderType) {
        formData.append("orderType", orderType.value);
      }
  
      formData.append("customerName", document.getElementById("customerName").value);
      formData.append("companyName", document.getElementById("companyName").value);
      formData.append("companyPhone", document.getElementById("companyPhone").value);
      formData.append("companyEmail", document.getElementById("companyEmail").value);
      formData.append("details", document.getElementById("details").value);
  
      // 체크박스
      const privacyConsent = document.getElementById("privacyConsent").checked;
      formData.append("privacyConsent", privacyConsent ? "true" : "false");
  
      try {
        const response = await fetch("/api/order", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert(data.message);
          window.location.href = "/cs/ask"; // 제출 후 다시 /cs/ask 로 이동
        } else {
          alert("오류가 발생했습니다: " + data.error);
        }
      } catch (error) {
        alert("제출에 실패했습니다: " + error.message);
      }
    });
  });
  
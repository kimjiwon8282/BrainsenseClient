// 선택한 DOM 요소들 가져오기
const csUploadArea = document.getElementById('cs_upload_area');
const attachmentsInput = document.getElementById('attachments'); // 숨겨진 file input (name="attachments")
const csUploadBtn = document.getElementById('cs_upload_btn');
const csFileList = document.getElementById('cs_file_list');
const csForm = document.getElementById('cs_form');

// 선택된 파일들을 저장할 배열 (AJAX 전송을 위해 관리)
let selectedFiles = [];

// 파일 선택 버튼 클릭 시 숨겨진 파일 input 열기
csUploadBtn.addEventListener('click', () => {
  attachmentsInput.click();
});

// 파일 input의 change 이벤트 (파일 선택 시)
attachmentsInput.addEventListener('change', (event) => {
  handleFiles(event.target.files);
  // input.value 초기화 (같은 파일 재선택 가능)
  attachmentsInput.value = "";
});

// 드래그 앤 드롭 이벤트 처리
csUploadArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  csUploadArea.classList.add('hover');
});

csUploadArea.addEventListener('dragleave', (event) => {
  event.preventDefault();
  csUploadArea.classList.remove('hover');
});

csUploadArea.addEventListener('drop', (event) => {
  event.preventDefault();
  csUploadArea.classList.remove('hover');
  handleFiles(event.dataTransfer.files);
});

// 파일들을 처리하여 selectedFiles 배열에 추가하고, UI 업데이트
function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    // 최대 5개 제한 확인
    if (selectedFiles.length >= 5) {
      alert("최대 5개까지 업로드 가능합니다.");
      break;
    }
    selectedFiles.push(files[i]);
  }
  updateFileList();
}

// 파일 목록 UI 업데이트 함수
function updateFileList() {
  csFileList.innerHTML = "";
  if (selectedFiles.length === 0) {
    const li = document.createElement('li');
    li.textContent = "선택된 파일이 없습니다.";
    csFileList.appendChild(li);
  } else {
    selectedFiles.forEach((file, index) => {
      const li = document.createElement('li');
      // 파일 미리보기용 URL 생성 (옵션)
      const fileURL = URL.createObjectURL(file);
      
      // 파일명과 크기를 보여주는 링크
      const a = document.createElement('a');
      a.href = fileURL;
      a.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
      a.target = "_blank";
      
      // 삭제 버튼 생성
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '삭제';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', () => {
        // 배열에서 해당 파일 제거
        selectedFiles.splice(index, 1);
        updateFileList();
        // 생성된 object URL 해제 (메모리 누수 방지)
        URL.revokeObjectURL(fileURL);
      });
      
      li.appendChild(a);
      li.appendChild(deleteBtn);
      csFileList.appendChild(li);
    });
  }
}

// 폼 제출 시 AJAX로 모든 입력 데이터와 선택된 파일들을 백엔드에 전송
csForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // 기본 폼 제출 막기

  // FormData 객체 생성
  const formData = new FormData();

  // selectedFiles 배열의 파일들을 "attachments" 필드에 추가
  selectedFiles.forEach((file) => {
    formData.append("attachments", file);
  });

  // 나머지 텍스트 필드와 라디오, 체크박스 값을 FormData에 추가
  const orderType = csForm.querySelector('input[name="orderType"]:checked');
  if (orderType) formData.append("orderType", orderType.value);
  formData.append("customerName", document.getElementById("customerName").value);
  formData.append("companyName", document.getElementById("companyName").value);
  formData.append("companyPhone", document.getElementById("companyPhone").value);
  formData.append("companyEmail", document.getElementById("companyEmail").value);
  formData.append("details", document.getElementById("details").value);
  
  // 개인정보 동의 (체크박스)
  const privacyConsent = document.getElementById("privacyConsent").checked;
  formData.append("privacyConsent", privacyConsent ? "true" : "false");

  try {
    // AJAX 요청: 백엔드 /api/order로 POST 전송
    const response = await fetch("/api/order", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      window.location.href = "/cs/ask"; // 성공 후 문의 폼 페이지로 이동
    } else {
      alert("오류가 발생했습니다: " + data.error);
    }
  } catch (error) {
    alert("제출에 실패했습니다: " + error.message);
  }
});

# Brainsense Client  
🚀 스타트업 홈페이지 **클라이언트 전용 서버** 개발 프로젝트

---

## 🌐 배포 URL  
[브레인센스 홈페이지 접속하기](https://port-0-brainsense-ma6ncuq4334fb805.sel4.cloudtype.app/home)  

---

## 🏢 프로젝트명  
브레인센스 클라이언트 서버 제작

---

## 📌 프로젝트 개요  

브레인센스 스타트업의 홈페이지 운영을 위한 **사용자 전용 인터페이스**입니다.  
Node.js 기반의 서버와 EJS 템플릿 엔진을 사용하여 사용자 친화적인 UI를 구현하고,  
MongoDB Atlas를 통해 안정적으로 데이터를 관리합니다.  

- **프로젝트 배경**: 스타트업의 브랜드·서비스 홍보와 사용자 편의성 제공  
- **목표**: 사용자 주문(문의), 뉴스 조회, 회사 소개 등 사용자 중심의 웹사이트 구축  
- **팀 구성**:  
  - 프론트엔드 개발자 2명  
  - 백엔드 개발자 2명 (**본 리포지토리 담당**)  
  - 디자이너 1명  
  - 대표(총괄) 1명  

---

## 📚 사용된 기술 스택 📚 (클라이언트 서버)

- **Backend (Client Server)**:
  - **런타임 / 프레임워크**: **Node.js**, **Express.js**
  - **데이터베이스 / ODM**: **MongoDB Atlas** with **Mongoose**
  - **파일 처리**:  
    - `multer` + `multer-google-storage` → **서버 디스크를 거치지 않고 GCS로 직접 스트리밍 업로드**
  - **템플릿 엔진**: **EJS**
  - **기타**: `dotenv`, `nodemailer`

---

## ✨ 프로젝트의 특징 (클라이언트 서버)

1. **안정적인 서버 운영 설계**  
   서버 종료 신호(`SIGINT`) 감지 시 DB 연결을 먼저 해제 후 종료 → 데이터 손상 최소화  

2. **클라우드 환경에 최적화된 인증**  
   GCS 인증키를 로컬 파일에 두지 않고 **Base64 환경 변수에서 동적으로 생성** → 보안 강화 및 배포 환경 유연성 확보  

3. **성능 고려한 페이지네이션**  
   뉴스 페이지 조회 시 **DB에서 필요한 데이터만 페이지 단위로 가져오기** → 수백·수천 건 데이터도 빠른 응답 유지  

4. **편리한 UI/UX**  
   - 파일 업로드는 **드래그 앤 드롭** + 프론트에서 용량·개수 검증  
   - 메뉴 이동 시 **active 클래스**로 현재 위치 표시  

---

## 📝 핵심 로직 및 중요한 코드 발췌 📝

### **1. GCS 인증키 동적 생성 및 안전한 서버 종료 (`server.js`)**

```jsx
// server.js

// 1. Base64 환경변수 디코드하여 임시 JSON 파일 작성
if (process.env.GCP_SERVICE_ACCOUNT_KEY_B64) {
  const creds = JSON.parse(
    Buffer.from(process.env.GCP_SERVICE_ACCOUNT_KEY_B64, 'base64').toString('utf8')
  );
  const tmpPath = path.join(os.tmpdir(), 'gcs-key.json');
  fs.writeFileSync(tmpPath, JSON.stringify(creds));
  process.env.GOOGLE_APPLICATION_CREDENTIALS = tmpPath;
}

// ...

// 2. 그레이스풀 종료 처리
process.on('SIGINT', async () => {
  console.log('SIGINT received; closing DB connection');
  await dbDisconnect();
  process.exit(0);
});
```

### **2. GCS로 직접 스트리밍하는 파일 업로드 (userOrderRoutes.js)**

```jsx
// routes/userOrderRoutes.js

// multer + GCS 스토리지 엔진 설정
const upload = multer({
  storage: storageEngine({
    projectId,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    bucket: GCLOUD_BUCKET,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `orders/${Date.now()}${ext}`); // GCS 내 저장 경로
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 주문 생성 라우트
router.post('/api/order', upload.array('attachments', 5), async (req, res) => {
  const files = req.files || [];
  const fileUrls = files.map(f => f.path); // 업로드 후 반환된 GCS URL
  
  const newOrder = new Order({
    // ... (주문 정보)
    attachments: fileUrls, // DB에는 GCS URL만 저장
  });

  await newOrder.save();
  // ... (관리자에게 이메일 알림)
});
```
### **3. 대량 데이터를 위한 페이지네이션 구현 (companyRoutes.js)**

```jsx
// routes/companyRoutes.js

router.get('/news', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    // 전체 뉴스 개수
    const totalNews = await Post.countDocuments();
    const totalPages = Math.ceil(totalNews / limit);

    // 페이지에 해당하는 뉴스만 조회
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.render('companyNews', { posts, currentPage: page, totalPages });
  } catch (err) {
    // ... (에러 처리)
  }
});
```

---

## 🔄 어드민 서버와의 유기적 연동

- **데이터 흐름**
  1. [클라이언트 서버] 사용자가 주문/문의 작성 → DB 저장 + 파일 GCS 업로드 + 관리자에게 이메일 알림  
  2. [어드민 서버] 관리자가 주문 확인 후 상태 변경  
  3. [어드민 서버] 관리자가 뉴스 작성  
  4. [클라이언트 서버] 사용자가 홈페이지에서 최신 뉴스 조회  

👉 클라이언트는 **데이터 생성·조회**, 어드민은 **데이터 관리(생성·수정·삭제)** 역할을 담당

---

## 👑 버전 관리와 협업

여러 팀원이 동시에 참여했기 때문에 **GitHub를 통한 버전 관리**는 필수였습니다.  

- **브랜치 전략 (Git-flow)**  
  - `main`: 안정적 배포 버전  
  - `develop`: 개발 메인 브랜치  
  - `feature/*`: 기능 단위 개발  

- **Pull Request(PR) 문화**  
  - 코드 리뷰 → 충돌 해결 → 안정적 병합


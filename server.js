require('dotenv').config();
const fs = require('fs');
const path = require('path');
const os   = require('os');            
const express = require('express');

// 1. Base64 환경변수 디코드하여 임시 JSON 파일 작성
if (process.env.GCP_SERVICE_ACCOUNT_KEY_B64) {
  const creds = JSON.parse(
    Buffer.from(process.env.GCP_SERVICE_ACCOUNT_KEY_B64, 'base64').toString('utf8')
  );
  const tmpPath = path.join(os.tmpdir(), 'gcs-key.json');
  fs.writeFileSync(tmpPath, JSON.stringify(creds));
  // keyFilename 으로 읽어올 수 있도록 환경변수 덮어쓰기
  process.env.GOOGLE_APPLICATION_CREDENTIALS = tmpPath;
  console.log('Wrote GCS key to temp file:', tmpPath);
}

// 3. 나머지 모듈 로드
const dbConnect    = require('./config/dbConnect');
const dbDisconnect = require('./config/dbDisconnect');
const orderRoutes  = require('./routes/userOrderRoutes');
const productRoutes= require('./routes/productRoutes');
const companyRoutes= require('./routes/companyRoutes');
const csRoutes     = require('./routes/csRoutes');
const techRoutes   = require('./routes/techRoutes');
const postRoutes   = require('./routes/postRoutes');

const app = express();
const port = process.env.PORT || 8080;

// 4. MongoDB 연결
dbConnect();

// 5. EJS 전역 로컬 변수 (카카오 키)
app.locals.KAKAO_JS_KEY = process.env.KAKAO_JS_KEY;

// 6. 뷰 엔진 및 정적 파일 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// 7. 요청 본문 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 8. 라우터 등록
app.use(orderRoutes);
app.use('/products', productRoutes);
app.use('/company', companyRoutes);
app.use('/cs', csRoutes);
app.use('/tech', techRoutes);
app.use(postRoutes);

// 9. 기본 및 홈 경로
app.get('/', (req, res) => res.redirect('/home'));
app.get('/home', (req, res) => res.render('home'));

// 10. 서버 시작
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

// 11. 그레이스풀 종료 처리
process.on('SIGINT', async () => {
  console.log('SIGINT received; closing DB connection');
  await dbDisconnect();
  process.exit(0);
});

require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
//admin router 추가
const adminRouter = require('./routes/admin');

app.use(express.json()); //JSON 요청 처리
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //쿠키 처리
app.use(express.static(path.join(__dirname, 'public')));
//middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); //CORS 처리

const PORT = process.env.PORT || 8081;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ 환경 변수에 MONGO_URI가 설정되지 않았습니다!');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log('mongodb connect err', err));

app.get('/', (req, res) => {
  res.send('홈페이지 서버 실행');
});
//routes
app.use('/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`server ${PORT} is running`);
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

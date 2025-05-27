require('dotenv').config();           // 환경 변수 로드
const express        = require('express');
const Order          = require('../models/order');
const smtpTransport  = require('../config/mailer');
const multer         = require('multer');
const path           = require('path');
const { storageEngine } = require('multer-google-storage');

const router = express.Router();

// GCS 설정
const GCLOUD_BUCKET = process.env.GCLOUD_BUCKET;  // 'bucket-quickstart_brainsense-455803'
const projectId     = JSON.parse(
  Buffer.from(process.env.GCP_SERVICE_ACCOUNT_KEY_B64, 'base64').toString('utf8')
).project_id;

// multer + GCS 스토리지 엔진 설정
const upload = multer({
  storage: storageEngine({
    projectId,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    bucket: GCLOUD_BUCKET,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `orders/${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});


// 4) 주문 생성 라우트 (파일 업로드 포함)
router.post('/api/order', upload.array('attachments', 5), async (req, res) => {
  try {
    const files    = req.files || [];
    const fileUrls = files.map(f => f.path);  // GCS 업로드 후 public URL

    // 새 주문 생성
    const newOrder = new Order({
      customerName:   req.body.customerName,
      companyName:    req.body.companyName,
      companyPhone:   req.body.companyPhone,
      companyEmail:   req.body.companyEmail,
      orderType:      req.body.orderType,
      details:        req.body.details,
      privacyConsent: req.body.privacyConsent,
      attachments:    fileUrls,
    });

    await newOrder.save();
    console.log('주문요청 생성됨');

    // 관리자 알림 이메일 발송
    const mailOptions = {
      from:    process.env.MAIL_USER,
      to:      process.env.ADMIN_EMAIL,
      subject: `새로운 외주 요청이 도착했습니다 - ${newOrder.companyName}`,
      html: `
        <h2>새로운 외주 문의가 등록되었습니다.</h2>
        <p><strong>회사명:</strong> ${newOrder.companyName}</p>
        <p><strong>회사 이메일:</strong> ${newOrder.companyEmail}</p>
        <p><strong>회사 전화번호:</strong> ${newOrder.companyPhone}</p>
        <p><strong>문의 유형:</strong> ${newOrder.orderType}</p>
        <p><strong>문의 내용:</strong> ${newOrder.details}</p>
      `,
    };

    smtpTransport.sendMail(mailOptions, (err, info) => {
      if (err) console.error('메일 전송 오류', err);
      else    console.log('메일 전송 성공', info.response);
    });

    res.status(201).json({
      message: '문의가 성공적으로 완료되었습니다!',
      data:    newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

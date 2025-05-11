require('dotenv').config(); // 환경 변수 로드
const express = require('express');
const Order = require('../models/order');
const router = express.Router();
const smtpTransport = require('../config/mailer');
const multer = require('multer');
const path = require('path');
const multerGoogleStorage = require('multer-google-storage');

const GCLOUD_BUCKET = 'bucket-quickstart_brainsense-455803';

// multerGoogleStorage 설정
const upload = multer({
  storage: multerGoogleStorage.storageEngine({
    bucket: GCLOUD_BUCKET,
    projectId: 'brainsense-455803',
    keyFilename: path.join(__dirname, '..', 'brainsense-455803-dcda0e4146ff.json'),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      // orders/ 접두사를 추가하여 GCS 내 orders 폴더에 저장
      const newFilename = `orders/${Date.now()}${ext}`;
      cb(null, newFilename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/api/order', upload.array('attachments', 5), async (req, res) => {
  try {
    // 업로드된 파일 객체들을 가져옵니다.
    const files = req.files || [];
    // GCS 업로드 시 file 객체의 'path' 속성이 공개 URL로 설정되어 있습니다.
    const fileUrls = files.map(file => file.path);

    // Order 생성 시 각 필드를 명시적으로 지정합니다.
    const newOrder = new Order({
      customerName: req.body.customerName,
      companyName: req.body.companyName,
      companyPhone: req.body.companyPhone,
      companyEmail: req.body.companyEmail,
      orderType: req.body.orderType,
      details: req.body.details,
      privacyConsent: req.body.privacyConsent,
      attachments: fileUrls,
    });

    await newOrder.save();
    console.log('주문요청 생성됨');

    // 메일 전송 설정
    const adminEmail = process.env.ADMIN_EMAIL;
    const mailOptions = {
      from: process.env.MAIL_USER, // 보내는 사람 (회사메일)
      to: adminEmail, // 받는 사람 (대표님)
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

    smtpTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('메일 전송 오류', error);
      } else {
        console.log('메일 전송 성공', info.response);
      }
    });

    res.status(201).json({
      message: '문의가 성공적으로 완료되었습니다!',
      data: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

const express = require('express');
const Order = require('../models/order');
const router = express.Router();
const smtpTransport = require('../config/mailer');

// **POST 요청: 새로운 주문 생성** 📌8080포트에서 필요
router.post('/api/order', async (req, res) => {
    try {
        const newOrder = new Order(req.body); // 요청 데이터로 Order 생성
        await newOrder.save(); // MongoDB에 저장
        console.log("주문요청 생성됨")

        //메일 전송 설정
        const adminEmail = process.env.ADMIN_EMAIL;
        const mailOptions = {
            from: process.env.MAIL_USER, //보내는 사람(회사메일일)
            to: adminEmail, //받는사람(대표님)
            subject: `새로운 외주 요청이 도착했습니다 - ${newOrder.companyName}`,
            html:  `
                <h2>새로운 외주 문의가 등록되었습니다.</h2>
                <p><strong>회사명:</strong> ${newOrder.companyName}</p>
                <p><strong>회사 이메일:</strong> ${newOrder.companyEmail}</p>
                <p><strong>회사 전화번호:</strong> ${newOrder.companyPhone}</p>
                <p><strong>문의 유형:</strong> ${newOrder.orderType}</p>
                <p><strong>문의 내용:</strong> ${newOrder.details}</p>
            `
        };
        smtpTransport.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.error('메일 전송 오류',error);
            }else{
                console.log('메일 전송 성공',info.response);
            }
        });
        res.status(201).json({ 
            message: '✅ Order created successfully', 
            data: newOrder 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; // 모듈 내보내기
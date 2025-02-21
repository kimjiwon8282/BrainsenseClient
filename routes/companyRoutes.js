const express = require('express')
const router = express.Router();

router.get('/intro',(req,res)=>{
    res.send('인트로 페이지');
});

router.get('/news',(req,res)=>{
    res.send('뉴스 페이지');
});

router.get('/team',(req,res)=>{
    res.send('팀소개 페이지');
});

module.exports = router;

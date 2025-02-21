const express = require('express')
const router = express.Router();

router.get('/ask',(req,res)=>{
    res.send("1:1 문의");
});

router.get('/faq',(req,res)=>{
    res.send("자주 묻는 질문")
});

module.exports = router;

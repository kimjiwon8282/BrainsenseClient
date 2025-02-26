const express = require('express');
const router = express.Router();

router.get('/intro', (req, res) => {
  res.render('companyIntro');
});

router.get('/news', (req, res) => {
  res.render('companyNews');
});

router.get('/team', (req, res) => {
  res.send('팀소개 페이지');
});

module.exports = router;

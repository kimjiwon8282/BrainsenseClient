const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/ask', (req, res) => {
  res.render('csAsk.ejs');
});

router.get('/faq', (req, res) => {
  res.render('csFaq.ejs');
});

module.exports = router;

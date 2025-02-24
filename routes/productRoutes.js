const express = require('express');
const router = express.Router();

router.get('/hw', (req, res) => {
  res.send('HW 페이지');
});

router.get('/sw', (req, res) => {
  res.send('SW 페이지');
});

module.exports = router;

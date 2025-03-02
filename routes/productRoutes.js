const express = require('express');
const router = express.Router();

router.get('/hw', (req, res) => {
  res.render('productHw');
});

router.get('/sw', (req, res) => {
  res.render('productSw');
});

router.get('/sw/safenest', (req, res) => {
  res.render('productSwSafenest');
});

module.exports = router;

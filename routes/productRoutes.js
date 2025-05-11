const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('productHw');
});

router.get('/hw', (req, res) => {
  res.render('productHw');
});

router.get('/hw/sensor', (req, res) => {
  res.render('productHwSensor');
});

router.get('/sw', (req, res) => {
  res.render('productSw');
});

router.get('/sw/safenest', (req, res) => {
  res.render('productSwSafenest');
});
router.get('/sw/catchme', (req, res) => {
  res.render('productSwCatchme');
});
router.get('/sw/jeje', (req, res) => {
  res.render('productSwJeje');
});

module.exports = router;

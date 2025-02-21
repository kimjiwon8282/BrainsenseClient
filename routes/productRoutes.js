const express = require('express')
const router = express.Router();

router.get('/hw', (req, res) => {
  res.send('HW 페이지');
});

router.get('/sw', (req, res) => {
  res.send('SW 페이지');
});

router.get('/hw/sensor', (req, res) => {
  res.send('HW Sensor 페이지');
});

router.get('/sw/safenest', (req, res) => {
  res.send('SW Safenest 페이지');
});

router.get('/sw/catchme', (req, res) => {
  res.send('SW Catchme 페이지');
});

router.get('/sw/jeje', (req, res) => {
  res.send('SW Jeje 페이지');
});

module.exports = router;

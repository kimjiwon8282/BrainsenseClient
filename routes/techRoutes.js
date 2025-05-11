const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('techIntro');
});

module.exports = router;

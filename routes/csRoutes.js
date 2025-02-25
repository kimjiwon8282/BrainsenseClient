const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/ask', (req, res) => {
  res.render('csAsk.ejs');
});

// 뉴스 상세 페이지
router.get('/company/news/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('게시글을 찾을 수 없습니다.');
    }
    res.render('client_cs_detail', { post });
  } catch (err) {
    console.error('게시글 조회 오류:', err);
    res.status(500).send('서버 오류');
  }
});

module.exports = router;

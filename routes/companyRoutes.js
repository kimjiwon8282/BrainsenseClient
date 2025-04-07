const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/intro', (req, res) => {
  res.render('companyIntro', {
    KAKAO_JS_KEY: process.env.KAKAO_JS_KEY
  });
});

router.get('/perform', (req, res) => {
  res.render('companyPerform');
});
router.get('/news', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // 기본값 1페이지
    const limit = 6;
    const skip = (page - 1) * limit;

    // 전체 뉴스 개수
    const totalNews = await Post.countDocuments();

    // 페이지에 해당하는 뉴스 조회 (최신순 정렬)
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalNews / limit);

    res.render('companyNews', { posts, currentPage: page, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 오류');
  }
});

// 뉴스 상세 페이지
router.get('/news/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('게시글을 찾을 수 없습니다.');
    }
    // 상세 페이지용 ejs 템플릿 (예: news_detail.ejs)
    res.render('companyNewsDetail', { post });
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 오류');
  }
});

router.get('/team', (req, res) => {
  res.render('companyTeam');
});

module.exports = router;

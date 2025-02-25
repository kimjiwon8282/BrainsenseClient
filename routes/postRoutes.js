const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// 📌 게시글 조회 (GET /api/posts)
router.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        res.json({ posts });
    } catch (err) {
        console.error("게시글 조회 오류:", err);
        res.status(500).send("서버 오류");
    }
});

module.exports = router;
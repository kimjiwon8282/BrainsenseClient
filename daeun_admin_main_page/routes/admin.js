// 관리자 로그인 / 인증 API
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

//관리자 회원가입
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.status(400).json({ message: '이미 존재합니다' });
    }

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    //resource created
    res.status(201).json({ message: '관리자 계정 생성 완료' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});
//관리자 로그인
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.comparePassword(password))) {
      return res
        .status(401)
        .json({ message: '아이디 또는 비밀번호가 일치하지 않습니다' });
    }

    //JWT 토큰 생성
    const token = jwt.sign({ adminId: admin._id, username }, JWT_SECRET, {
      expiresIn: '2h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.json({ message: '로그인 성공', token });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});
//관리자 인증 - 토큰 검증
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: '인증 성공', admin: decoded });
  } catch (err) {
    res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
  }
});
//로그아웃
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: '로그아웃 성공' });
});

module.exports = router;

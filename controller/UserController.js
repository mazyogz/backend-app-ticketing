const {
  user
} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.getUser = async (req, res) => {
  try {
    const user = await user.findAll({
      attributes: ['id', 'username', 'email', 'nama_lengkap', 'alamat', 'nomor_telepon'],
      order: [
        ['id', 'ASC']
      ],
    });
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No user found',
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: 'List All user',
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.editUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      username,
      nama_lengkap,
      nomor_telepon,
      alamat
    } = req.body;

    const existingUser = await user.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
      });
    }
    if (nama_lengkap) {
      existingUser.nama_lengkap = nama_lengkap;
    }
    if (nomor_telepon) {
      existingUser.nomor_telepon = nomor_telepon;
    }
    if (nomor_telepon) {
      existingUser.username = username;
    }
    if (alamat) {
      existingUser.alamat = alamat;
    }
    await existingUser.save();

    res.status(200).json({
      success: true,
      message: 'Update data successfully',
      data: existingUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

exports.register = async (req, res) => {
  const {
    username,
    password,
    nama_lengkap,
    alamat,
    email,
    nomor_telepon
  } = req.body;

  const emailExisted = await user.findOne({
    where: {
      email: email,
    },
  });

  if (emailExisted) {
    return res.status(409).json({
      status: false,
      msg: 'Email already exists',
    });
  }
  const salt = 10;
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    let user = await user.create({
      username: username,
      password: hashPassword,
      nama_lengkap: nama_lengkap,
      alamat: alamat,
      email: email,
      nomor_telepon: nomor_telepon,
    });

    user = JSON.parse(JSON.stringify(user));

    return res.status(200).json({
      success: true,
      message: 'Register Successfully',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    let user = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    user = JSON.parse(JSON.stringify(user));

    if (!user) return res.status(400).json({
      success: false,
      message: "Email or Password didn't match"
    });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({
      success: false,
      message: 'Wrong Password'
    });

    // Token generation
    let refreshTokens = [];

    const userId = user.id;
    const username = user.username;
    const email = user.email;
    const nama_lengkap = user.nama_lengkap;
    const alamat = user.alamat;
    const nomor_telepon = user.nomor_telepon;

    const tokenParams = {
      userId,
      email,
      nama_lengkap,
      alamat,
      nomor_telepon
    };

    const accessToken = jwt.sign(tokenParams, 'access', {
      expiresIn: '1d',
    });
    const refreshToken = jwt.sign(tokenParams, 'refresh', {
      expiresIn: '30d',
    });
    refreshTokens.push(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const expiresInDays = 1; // 1 day expiration for accessToken
    const refreshTokenExpiresInDays = 30; // 30 days expiration for refreshToken

    const data = {
      userId,
      username,
      email,
      nama_lengkap,
      alamat,
      nomor_telepon,
      accessToken,
      refreshToken,
      accessTokenExpiresIn: expiresInDays + ' day(s)',
      refreshTokenExpiresIn: refreshTokenExpiresInDays + ' day(s)',
    };

    return res.status(201).json({
      success: true,
      message: 'Login Successfully',
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'Login Failed'
    });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie('accessToken');

    res.clearCookie('refreshToken');

    return res.status(200).json({
      success: true,
      message: 'Logout Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Logout Failed'
    });
  }
};

exports.forgotPassword = async (req, res) => {

};

exports.forgotPasswordOTP = async (req, res) => {

};

exports.resetPassword = async (req, res) => {

};

exports.resetPasswordOTP = async (req, res) => {

};
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');

const app = express();

// Thiết lập session
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// Khởi tạo Passport và sử dụng Google Strategy
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
    clientID: '383281791298-nvhiv0girntrfnu5pfi0lfaf21p8gbog.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Xử lý thông tin người dùng sau khi đăng nhập thành công
    return done(null, profile);
  }
));

// Đăng nhập bằng tài khoản Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Xử lý thông tin sau khi đăng nhập thành công
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

// Hiển thị trang chủ
app.get('/', function(req, res) {
  if(req.user) {
    res.send(`Xin chào, ${req.user.displayName}!`);
  } else {
    res.send('Bạn chưa đăng nhập!');
  }
});

app.listen(3000, function() {
  console.log('Server đang chạy trên cổng 3000!');
});

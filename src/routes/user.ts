import express from "express";
var router = express.Router();
module.exports = function (passport) {

 

  router.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}));
  router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      res.redirect('https://criel-front.netlify.app');
    });
  router.get('/auth/kakao', passport.authenticate('kakao'));

  router.get('/auth/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      res.redirect('https://criel-front.netlify.app');
    });


  router.get('/auth/naver', passport.authenticate('naver'));

  router.get('/auth/naver/callback',
    passport.authenticate('naver', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      res.redirect('https://criel-front.netlify.app');
    });

  router.get("/getuser", (req, res) => {
    res.send(req.user);
  })

  router.get("/auth/logout", (req, res) => {
    // if (req.user) {
    req.logout();
    res.send("done");
  }
  
  )
  router.get("/debug", (req, res) => {
    res.json({
      "req.session": req.session, // 세션 데이터
      "req.user": req.user, // 유저 데이터(뒷 부분에서 설명)
     })
  })

  return router;
}
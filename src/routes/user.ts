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


  router.get('/auth/naver', passport.authenticate('naver',{scope: ['email', 'profile']}));

  router.get('/auth/naver/callback',
    passport.authenticate('naver', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      res.redirect('https://criel-front.netlify.app');
    });

  router.get("/getuser", (req, res) => {
    res.send(req.user);
  })

  router.get("/auth/logout", (req, res) => {
    req.logout()
    res.status(200).clearCookie('connect.sid', {
      path: '/'
    })
    req.session.destroy(function (err) {
      res.redirect('/')
    })
  })


  return router;
}
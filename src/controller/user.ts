import User from '../models/user';
import { IMongoDBUser } from "../interfaces/user";
import passport from 'passport';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;

module.exports = function (app) {

  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user: IMongoDBUser, done: any) => {
    console.log('serializeUser', user)
    return done(null, user._id);
  });

  passport.deserializeUser((id: string, done: any) => {
    console.log('deserializeUser', id)
    User.findById(id, (err: Error, doc: IMongoDBUser) => {
      // Whatever we return goes to the client and binds to the req.user property
      return done(null, doc);
    })
  })


  passport.use(new GoogleStrategy({
    clientID: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    callbackURL: "/user/auth/google/callback",
    profileFields: ['id', 'displayName', 'email', 'thumbnail']
  },

    function (_: any, __: any, profile: any, cb: any) {
      User.findOne({ googleId: profile.id }, async (err: Error, doc: IMongoDBUser) => {

        if (err) {
          return cb(err, null);
        }

        if (!doc) {
          const newUser = new User({
            googleId: profile.id,
            username: profile.name.givenName,
            email: profile.emails[0].value,
            thumbnail: profile.photos[0].value
          });

          await newUser.save();
          cb(null, newUser);

        }
        cb(null, doc);



      })

    }));



  passport.use(new KakaoStrategy({
    clientID: `277fa70bdd2668f91926c6f580733c2d`,
    clientSecret: `MIzMT0MCDBgoRe1pKdZ81GRGEnNqZaEG`,
    callbackURL: "/user/auth/kakao/callback"
  },
  function (_: any, __: any, profile: any, cb: any) {

    User.findOne({ kakaoId: profile.id }, async (err: Error, doc: IMongoDBUser) => {

      if (err) {
        return cb(err, null);
      }

      if (!doc) {
        const newUser = new User({
          kakaoId: profile.id,
          name: profile.displayName,
          email: profile._json.kakao_account.email,
          username: profile.displayName,
          thumbnail: profile._json.profile_image
        });

        await newUser.save();
        cb(null, newUser);
      }
      cb(null, doc);
    })

  }
));


  passport.use(new NaverStrategy({
    clientID: `xeiJ4Etz63ZzWGd_3ODf`,
    clientSecret: `i25diPbhrQ`,
    callbackURL: "/user/auth/naver/callback"
  },
    function (_: any, __: any, profile: any, cb: any) {

      User.findOne({ naverId: profile.id }, async (err: Error, doc: IMongoDBUser) => {

        if (err) {
          return cb(err, null);
        }

        if (!doc) {
          const newUser = new User({
            naverId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.displayName,
            thumbnail: profile._json.profile_image
          });

          await newUser.save();
          cb(null, newUser);
        }
        cb(null, doc);
      })

    }
  ));


  return passport;
}
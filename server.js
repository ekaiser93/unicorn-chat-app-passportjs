const express = require('express'),
  app = module.exports.app = express();
const http = require('http');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const publicPath = path.join(__dirname, './public');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');
const MongoStore = require('connect-mongo')(session);
var passportSocketIo = require('passport.socketio');
var cookieParser = require('cookie-parser');

const server = http.createServer(app);
const io = require('socket.io').listen(server);
const port = process.env.PORT || 8080;

//Configure Mongoose
mongoose.connect('mongodb+srv://admin:admin123@cluster0-loeak.mongodb.net/test?retryWrites=true', {
  useMongoClient: true
});

//configure mongoose's promise to global promise.
mongoose.Promise = global.Promise;
const db = mongoose.connection;

// app configurations
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(publicPath));

// Add session support
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  }),
  cookieName: 'session'
}));

io.use(passportSocketIo.authorize({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  store: new MongoStore({
    mongooseConnection: db
  }),
  passport: passport,
  cookieParser: cookieParser
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((userDataFromCookie, done) => {
  done(null, userDataFromCookie);
});

// Checks if a user is logged in
const accessProtectionMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({
      message: 'must be logged in to continue',
    });
  }
};

// Set up passport strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_SECRET,
    callbackURL: 'https://calm-dawn-99540.herokuapp.com/auth/google/callback',
    scope: ['profile', 'email']
  },
  // This is a "verify" function required by all Passport strategies
  (req, accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      if (!req.user) {
        User.findOne({
          'email': JSON.stringify(profile.emails[0].value)
        }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (user) {
            req.session.user = user;
            res.locals.user = user;
            return done(null, user);
          } else {
            let newUser = new User({
              email: profile.emails[0].value
            });

            newUser.save((err) => {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            })
          }
        })
      }
    })
  }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: true
  }),
  (req, res) => {
    console.log('wooo we authenticated, here is our user object:', req.user);
    res.redirect('/');
  }
);

app.get('/protected', accessProtectionMiddleware, (req, res) => {
  res.json({
    user: req.user
  });
});

app.post('/messages', (req, res) => {
  const message = new Message(req.body);
  console.log(JSON.stringify(message));
  message.save()
    .then(message => {
      res.json('added message!')
    })
    .catch(err => {
      res.status(400).send("unable to save");
    })
  // Message.insertOne({
  //   email: "hello123@gmail.com",
  //   message: "I am a message"
  // })
});

// io.on('connection', (socket) => {
//   // user data from the socket.io passport middleware
//   if (socket.request.user) {
//     console.log(socket.request.user);
//   }
// });

server.listen((process.env.PORT || 8080), () => {
  console.log('listening on *:8080');
});

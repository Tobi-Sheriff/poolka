// if (process.env.NOD_ENV !== "production") {
//     require('dotenv').config();
// }

// import express from 'express';
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const pageRoutes = require('./routes/pages');
const userRoutes = require('./routes/users');
const reviewRequest = require('./routes/requests');
// const profileRoutes = require('./routes/profiles');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const { NONE } = require('express-csp-header');
// const bodyParser = require('body-parser')

// const apiKey = process.env.GOOGLE_MAPS_API_KEY;


const PORT = process.env.PORT || 8000;
// const dbUrl = process.env.DB_URL || 'mongodb://0.0.0.0:27017/SMP';
const connectDB = async () => {
    try {
      const conn = await mongoose.connect('mongodb://0.0.0.0:27017/poolka');
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
}

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || 'justapreproductionsecret!';
const store = new MongoStore({
    mongoUrl: 'mongodb://0.0.0.0:27017/SMP',
    secret,
    touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({
    // xContentTypeOptions: {
    //     noSniff: false,
    // },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", 'https://maps.googleapis.com/'],
            // styleSrc: ['http://localhost:8000', 'https://cdn.jsdelivr.net'],
            scriptSrc: [
                "'self'",
                'http://localhost:8000',
                'https://cdn.jsdelivr.net',
                'https://maps.googleapis.com/'],
            fontSrc: ["https://cdnjs.cloudflare.com"],
            imgSrc: [
                "'self'",
                'http://localhost:8000',
                "https://maps.gstatic.com",
                "blob:",
                "data:",
            ],

            // Add more directives as needed

            // defaultSrc: [],
            // connectSrc: ["'self'", ...connectSrcUrls],
            // scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            // styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            // workerSrc: ["'self'", "blob:"],
            // objectSrc: [],
            // imgSrc: [
            //     "'self'",
            //     "blob:",
            //     "data:",
            //     "https://res.cloudinary.com/dfh1oel6o/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
            //     "https://images.unsplash.com/",
            // ],
            // fontSrc: ["'self'", ...fontSrcUrls],
        }
    },
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}



app.get('/home', (req, res) => {
    res.render('home');
});
app.use('/', userRoutes);
app.use('/pages', pageRoutes);
app.use('/pages/:requestId', reviewRequest);


// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page Not Found', 404))
// })
// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = 'Oh No, Something Went Wrong!'
//     res.status(statusCode).render('error', { err });
// })



connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests on...", PORT);
    })
})
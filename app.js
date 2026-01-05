
const express = require('express');
const app = express();
const path = require('path');


const mongoose = require('mongoose');


const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const userRoutes = require('./routes/users');
const campquestsRoutes = require('./routes/campquests');
const reviewsRoutes = require('./routes/review');


const Eerror = require('./utils/Eerror');


mongoose.connect('mongodb+srv://MananChopra07:NoraChopra@cluster0.jtzuajy.mongodb.net/camp-quest?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
    secret: 'thisshouldbeasecret',
    resave: false,
    saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(flash());

app.use((req, res, next) => {
    res.locals.curruntUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});


app.get('/', (req, res) => {
    res.render('home');
});

app.use('/campquests', campquestsRoutes);
app.use('/campquests', reviewsRoutes);
app.use('/', userRoutes);



app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'siyasehrawat@gmail.com', username: 'siya' });
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
});


app.use((req, res, next) => {
    next(new Eerror('Page Not Found', 404));
});



app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use(cookieParser('secret'));
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama: 'Adam Zullowa',
            email: 'adamzullowa06@gmail.com'
        },
        {
            nama: 'Mega',
            email: 'gaga@gmail.com'
        },
        {
            nama: 'Ravi',
            email: 'Ravi@gmail.com'
        }
    ]
    res.render('index', {
        title: 'Express JS',
        layout: 'layouts/main',
        nama: 'Adam Zullowa',
        mahasiswa
    });
});

app.get('/about', (req, res) => {
    res.render('about', { 
        title: 'About', 
        layout: 'layouts/main'
    });
});

app.get('/contact', async (req, res) => {
    const contacts = await Contact.find();
    res.render('contact', { 
        title: 'Contact', 
        layout: 'layouts/main',
        contacts,
        msg: req.flash('msg')
    });
});

app.get('/contact/add', (req, res) => {
    res.render('add', {
        title: 'Tambah Kontak',
        layout: 'layouts/main'
    })
});

app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });
    
    res.render('detail', { 
        title: 'Detail Contact', 
        layout: 'layouts/main',
        contact
    });
});

app.listen(port, () => {
    console.log(`Mongo Contact App | listening at http://localhost:${port}`)
});
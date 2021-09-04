const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const {body, validationResult, check} = require('express-validator');
const methodOverride = require('method-override');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

app.use(methodOverride('_method'));

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

app.post('/contact', [
    body('nama').custom( async (value) => {
        const duplikat = await Contact.findOne({nama: value});
        if(duplikat) {
            throw new Error('Nama kontak sudah ada!');
        }
        return true; 
    }),
    check('email', 'email tidak valid').isEmail(), 
    check('nohp', 'No Hp tidak valid').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.render('add', {
            title: 'Tambah kontak', 
            layout: 'layouts/main',
            errors: errors.array()
        })
    } else {
        Contact.insertMany(req.body, () => {
            req.flash('msg', 'Kontak berhasil ditambahkan');
            res.redirect('/contact');
        });
    }
});

app.delete('/contact', (req,res) => {
    Contact.deleteOne({ nama: req.body.nama }).then((result) => {
        req.flash('msg', 'Kontak berhasil dihapus!');
        res.redirect('/contact');
    });
});

app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({nama: req.params.nama});

    res.render('edit', {
        title: 'Edit Kontak',
        layout: 'layouts/main',
        contact
    })
});

app.put('/contact', [
    body('nama').custom( async (value, {req}) => {
        const duplikat = await Contact.findOne({ nama : value });
        if(value !== req.body.oldNama && duplikat) {
            throw new Error('Nama contact sudah digunakan!');
        }
        return true;
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('nohp', 'No Hp tidak valid').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.render('edit', {
            title: 'Edit Kontak',
            layout: 'layouts/main',
            errors: errors.array(),
            contact: req.body
        })
    } else {
        Contact.updateOne(
            {_id : req.body._id},
            {
                $set: {
                    nama: req.body.nama,
                    email: req.body.email,
                    nohp: req.body.nohp
                }
            }
        ).then((result) => {
            req.flash('msg', 'Kontak berhasil diubah!');
            res.redirect('/contact');
        });
    }
})

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
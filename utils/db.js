const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/latihan', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

// save data
// contact1.save().then((contact) => console.log(contact));
const mongoose = require('mongoose');
const env = require('./environment');

const dbName = process.env.db || 'codeial';

// mongoose.connect('mongodb://localhost/codeial_development');
mongoose.connect(`mongodb://127.0.0.1/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = db;

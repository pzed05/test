const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const Joi = require('joi');
const express = require('express');
const helmet = require('helmet');
const morgan = require ('morgan');
const logger = require('./logger');

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(logger);
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('tiny'));

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('morgan Enabeled....');
    }

    dbDebugger('Connected to database...');

const Books = [
    {id:1, name: 'book1'},
    {id:2, name: 'book2'},
    {id:3, name: 'book3'}
];

app.get('/', (req, res) => {
    res.send('hello world');
});
app.get('/api/books', (req, res) => {
    res.send(Books);
});

app.get('/api/Books/:id', (req, res) =>{
    const book = Books.find(c=> c.id === parseInt(req.params.id));
    if(!book) res.status(404).send('Invalid Request');
    res.send(book);
});



const port = process.env.PORT || 3000;
app.listen(port , () => console.log(`Listening on the port ${port}...`));

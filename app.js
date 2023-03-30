const express = require('express')
const morgan = require('morgan')

const mongoose = require('mongoose')

const blogRoutes = require('./routes/blogRoutes')

const app = express();

// connect to mongodb
const db_uri = 'mongodb+srv://user:user@node-cluster.8vrkycx.mongodb.net/nodedb?retryWrites=true&w=majority';
mongoose.connect(db_uri)
    .then((result) => {
        console.log('db connected');
    })
    .catch((err) => console.log(err))

// register view engine
app.set('view engine', 'ejs');

// middleware 
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true })); // needed to accept form data
app.use(morgan('dev'));


// routes
app.get('/', (req, res) => {
    // using the easier way
    res.redirect('/blogs');
})

app.get('/about', (req, res) => {
    // using the module path
    res.render('about', { title: 'About' });
})

// blog routes
app.use(blogRoutes);


// error 404 page
app.use((req, res) => {
    res.status(404).render('error', { title: '404' });
})


app.listen(3000);

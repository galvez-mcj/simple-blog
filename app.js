const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const Blog = require('./models/blog')

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


// dummy blogs
const blogs = [
    { title: 'First Blog Post Evah!', summary: 'This is my first blog post ever for this month.'},
    { title: 'They see me ROLLIN, they HATIN!', summary: 'I\'m on the roll! Beaches'},
    { title: 'Ria and Kulit: The Pandemic Doggos', summary: 'Ria and Kulit are as old as the Covid19 pandemic'}
]

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
app.get('/blogs', (req, res) => {
    // show latest to oldest
    Blog.find().sort( { createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result})
        })
        .catch((err) => console.log(err))
})

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create Blog' });
})

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => console.log(err))
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('details', { title: 'Blog Details', blog: result });
        })
        .catch((err) => console.log(err))
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/blogs' })
        })
        .catch((err) => console.log(err))
})

// error 404 page
app.use((req, res) => {
    res.status(404).render('error', { title: '404' });
})


app.listen(3000);

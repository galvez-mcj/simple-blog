const express = require('express')
const Blog = require('../models/blog')

const router = express.Router();

// blog routes
router.get('/blogs', (req, res) => {
    // show latest to oldest
    Blog.find().sort( { createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result})
        })
        .catch((err) => console.log(err))
})

router.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => console.log(err))
})

router.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create Blog' });
})

router.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('details', { title: 'Blog Details', blog: result });
        })
        .catch((err) => console.log(err))
})

router.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/blogs' })
        })
        .catch((err) => console.log(err))
})

module.exports = router;
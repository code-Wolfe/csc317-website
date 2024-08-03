var express = require('express');
var router = express.Router();
const { getRecentPosts } = require('../middleware/posts')

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
  res.render('index', { title: 'CSC 317 App', name:"Max Cole" });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* GET registration page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

/* GET post video page. */
router.get('/postvideo', function(req, res, next) {
  res.render('postvideo', { title: 'Post Video' });
});




/* GET view post page.
router.get('/viewpost/:id(\\d+)', function(req, res, next) {
  res.render('viewpost', { title: 'View Post', js: ['viewpost.js']});
});
 */

module.exports = router;
const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Page = require('../models/page');
const Request = require('../models/request');
const requests = require('../controllers/requests');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))
// router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


router.delete('/request', requests.deleteRequest)

module.exports = router;
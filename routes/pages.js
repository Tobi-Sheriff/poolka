const express = require('express');
const router = express.Router();
const pages = require('../controllers/pages');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validatePage } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(pages.index))
    .post(pages.requestRide)

// router.get('/autocomplete', pages.autoComplete)
// router.get('/places-proxy', pages.placesProxy)

router.get('/new', isLoggedIn, pages.renderNewForm)

router.get('/show', pages.pageShow)

router.route('/:id')
    .get(catchAsync(pages.showPage))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePage, catchAsync(pages.updatePage))
    .delete(isLoggedIn, isAuthor, catchAsync(pages.deletePage));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(pages.renderEditForm))


module.exports = router;
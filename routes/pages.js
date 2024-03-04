const express = require('express');
const router = express.Router();
const pages = require('../controllers/pages');
const catchAsync = require('../utils/catchAsync');
const { isAdmin, isLoggedIn, isAuthor, validatePage } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(pages.index))
    .post(pages.requestRide)

// router.get('/autocomplete', pages.autoComplete)
// router.get('/places-proxy', pages.placesProxy)

router.get('/new', isLoggedIn, pages.renderNewForm)


router.route('/admin/:id')
    .get(isAdmin, catchAsync(pages.adminShowPage))

// router.get('/show/:id', pages.pageShow)
router.route('/:id')
    .get(catchAsync(pages.showPage))
    // .get(isAdmin, pages.pageShow)
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePage, catchAsync(pages.updatePage))
    .delete(isLoggedIn, isAuthor, catchAsync(pages.deletePage));

router.get('/:id/edit', catchAsync(pages.renderEditForm))


module.exports = router;
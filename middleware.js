const { pageSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Page = require('./models/page');
// const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validatePage = (req, res, next) => {
    const { error } = pageSchema.validate(req.body);
    if (error) {
        if (process.env.NODE_ENV !== "production") {
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            req.flash('error', 'An ERROR has occurred');
            return res.redirect('/pages');
        }
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const page = await Page.findById(id);
    if (!page.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/pages/${id}`);
    }
    next();
}

// module.exports.isReviewAuthor = async (req, res, next) => {
//     const { id, reviewId } = req.params;
//     const review = await Review.findById(reviewId);
//     if (!review.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/carkets/${id}`);
//     }
//     next();
// }

// module.exports.validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }
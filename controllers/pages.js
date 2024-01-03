const Page = require('../models/page');
const User = require('../models/user');
const { cloudinary } = require("../cloudinary");



module.exports.index = async (req, res) => {
    const pages = await Page.find({});
    res.render('pages/index', { pages});
}

module.exports.renderNewForm = (req, res) => {
    res.render('pages/new');
}

module.exports.createPage = async (req, res, next) => {
    const page = new Page(req.body.page);
    page.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    page.author = req.user._id;
    await page.save();
    req.flash('success', 'Successfully made a new page!');
    res.redirect(`/pages/${page._id}`)
}

module.exports.showPage = async (req, res,) => {
    const page = await Page.findById(req.params.id).populate({
        path: 'images',
        // path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!page) {
        req.flash('error', 'Cannot find that page!');
        return res.redirect('/pages');
    }
    res.render('pages/show', { page });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const page = await Page.findById(id)
    if (!page) {
        req.flash('error', 'Cannot find that page!');
        return res.redirect('/pages');
    }
    res.render('pages/edit', { page });
}

module.exports.updatePage = async (req, res) => {
    const { id } = req.params;
    const page = await Page.findByIdAndUpdate(id, { ...req.body.page });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    page.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await page.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await page.save();
    req.flash('success', 'Successfully updated page!');
    res.redirect(`/pages/${page._id}`)
}

module.exports.deletePage = async (req, res) => {
    const { id } = req.params;
    const page = await Page.findById(id);
    page.images.map((image) => cloudinary.uploader.destroy(image.filename));
    await Page.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted page')
    res.redirect('/pages');
}
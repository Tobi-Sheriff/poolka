const Page = require('../models/page');
const Request = require('../models/request');

module.exports.createRequest = async (req, res) => {
    const page = await Page.findById(req.params.id);
    const request = new Request(req.body.request);
    request.author = req.user._id;
    page.requests.push(request);
    await request.save();
    await page.save();
    req.flash('success', 'Created new request!');
    res.redirect(`/pages/${page._id}`);
}

module.exports.deleteRequest = async (req, res) => {
    const { requestId } = req.params;
    // await Page.findByIdAndUpdate(id, { $pull: { requests: requestId } });
    await Request.findByIdAndDelete(requestId);
    req.flash('success', 'Successfully deleted request')
    res.redirect(`/pages/show`);
}
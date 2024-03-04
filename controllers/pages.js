if (process.env.NOD_ENV !== "production") {
    require('dotenv').config();
}
const Page = require('../models/page');
const Request = require('../models/request');
const User = require('../models/user');
const { cloudinary } = require("../cloudinary");
// const {Client} = require("@googlemaps/google-maps-services-js");
// const client = new Client({});



// BEGIN
// // const express = require('express');
// const axios = require('axios');
// // const app = express();
// // const PORT = 3000;

// // Google Places Autocomplete API endpoint
// const GOOGLE_PLACES_AUTOCOMPLETE_API = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

// // Your Google Places API key
// const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY; // Replace with your Google API key

// module.exports.autoComplete = async (req, res) => {
//   const input = req.query.input;

//   try {
//     const response = await axios.get(GOOGLE_PLACES_AUTOCOMPLETE_API, {
//       params: {
//         input: input,
//         key: GOOGLE_API_KEY,
//       },
//     });

//     const predictions = response.data.predictions;
//     res.json(predictions);
//   } catch (error) {
//     console.error('Error fetching autocomplete predictions:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
// END





// Proxy endpoint
// module.exports.placesProxy = async (req, res) => {
//     const { input } = req.query;
//     const apiKey = GOOGLE_API_KEY; // Replace with your actual API key

//     try {
//         const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
//             params: {
//                 input,
//                 key: apiKey,
//             },
//         });

//         res.json(response.data);
//     } catch (error) {
//         console.error('Error making Google API request:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
// Proxy END



module.exports.renderNewForm = (req, res) => {
    res.render('pages/new');
}

// const args = {
//     params: {
//         address: 'Imo Owerri, Nigeria',
//         // location: [{lat:4.8472226, lng:6.974604}],
//         key: process.env.GOOGLE_MAPS_API_KEY
//     }
// };
module.exports.index = async (req, res) => {
    // const profile = await Profile.findById(req.params.id);
    // const user = await User.find({});
    // const currentUser = req.user;
    // profile.author = req.user._id;
    // client
    //     .geocode(args)
    //     .then(r => {
    //         const userPlace = r.data.results[0].geometry;
    //         console.log(userPlace);
    //         res.render('pages/index');
    //     })
    //     .catch(e => {
    //         console.log(e);
    //     });
    const requests = await Request.find({}).populate('author');
    res.render('pages/index', { requests });
}

module.exports.adminShowPage = async (req, res,) => {
    // const { id } = req.params;
    res.render('pages/show');
}
module.exports.pageShow = async (req, res) => {
    // const {location, destination} = req.query;
    // const { id } = req.params;
    // const request = await Request.findById(id).populate('author');
    // const users = await User.find({});
    // console.log(request);
    // console.log(users);
    // const requests = await Request.find({}).populate('author');
    // res.render('pages/show', { request, users });
}
module.exports.requestRide = async (req, res, next) => {
    const request = new Request(req.body.address);
    request.author = req.user._id;
    await request.save();
    req.flash('success', 'Successfully made a new page!');
    res.redirect(`/pages/${request._id}`);
}

module.exports.showPage = async (req, res,) => {
    // const page = await Page.findById(req.params.id).populate({
    //     path: 'images',
    //     path: 'reviews',
    //     populate: {
    //         path: 'author'
    //     }
    // }).populate('author');
    // if (!page) {
    //     req.flash('error', 'Cannot find that page!');
    //     return res.redirect('/pages');
    // }
    const { id } = req.params;
    const users = await User.find({});
    console.log(users);
    const request = await Request.findById(id);
    res.render('pages/show', { request, users });
}

module.exports.renderEditForm = async (req, res) => {
    // const { id } = req.params;
    // const page = await Page.findById(id)
    // if (!page) {
    //     req.flash('error', 'Cannot find that page!');
    //     return res.redirect('/pages');
    // }
    // res.render('pages/edit', { page });
    res.render('pages/edit');
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
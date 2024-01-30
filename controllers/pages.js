if (process.env.NOD_ENV !== "production") {
    require('dotenv').config();
}
const Page = require('../models/page');
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
    res.render('pages/index');
}

module.exports.pageShow = (req, res) => {
    const {location, destination} = req.query;
    res.render('pages/show', { location, destination});
}
module.exports.requestRide = (req, res, next) => {
    // const page = new Page(req.body.page);
    // page.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // page.author = req.user._id;
    // await page.save();
    req.flash('success', 'Successfully made a new page!');
    res.redirect(`/pages/show`);
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
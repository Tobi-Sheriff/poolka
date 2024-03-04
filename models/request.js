const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RequestSchema = new Schema({
    location: String,
    destination: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Request', RequestSchema);
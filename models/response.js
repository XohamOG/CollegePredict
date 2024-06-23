const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true },
    timestamp: { type: Date, required: true, unique: true }
}, { timestamps: true });

const response = mongoose.model('Response',responseSchema);
module.exports = response;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    contacts: [String],
    excavations: [String]
});

module.exports = mongoose.model('Project', projectSchema);

const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    domain: String,
    scope: [String],
    outOfScope: [String],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    program: String,
    status: {
        type: String,
        enum: ['active', 'paused', 'archived'],
        default: 'active'
    },
    metadata: {
        status: String,
        subdomains: [String],
        technologies: [String],
        lastRecon: Date,
        ports: [Number],
        services: [String]
    }
}, { timestamps: true });

module.exports = mongoose.model('Target', targetSchema);

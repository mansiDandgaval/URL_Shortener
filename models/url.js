const mongoose = require('mongoose')

const shortUrlSchema = new mongoose.Schema({
	originalUrl: {
		type: String,
		required: true
	},
	shortUrl: {
		type: String
	},
	count: {
		type: Number,
		required: true,
		default: 0
	},
	callTime: {
		type: Date
	}
}
)

module.exports = mongoose.model('ShortUrl', shortUrlSchema)

const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: String,
    currentSeaTemperature: String,
    weatherText: String,
    temperatureC: Number,
    temperatureF: Number,
    weatherDescription: String,
    weatherIcon: String,
    humidity: String,
    windSpeed: String,
    temperatureDetail: {
        MinC: [Number],
        MaxC: [Number],
        MinF: [Number],
        MaxF: [Number],
    },
    weekTideForecast: {
        daysOfWeek: [String],
        tideForecasts: [[[String]]]
    },

    latitude: { type: Number, index: true, },
    longitude: { type: Number, index: true, },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WaterTemperature', schema);

schema.index({ "location": "2dsphere" })

const DiveCenter = require('../../model/dive-center');
const DiveSite = require('../../model/dive-site');
const DivePoint = require('../../model/dive-point');

module.exports = {

    DiveCenter: {
        diveSites(_, args) {
            return DiveSite.find({ _id: _.diveSiteId });
        },

        managers(_, args) {
            return Image.find({ _id: _.profileImageId });
        },
    },

    Query: {
        diveCenters() {
            return DiveCenter.find()
        },
        diveSites() {
            return DiveSite.find()
        },
        divePoints() {
            return DivePoint.find()
        },
        getDiveCenterById(id) {
            return DiveCenter.find({ _id: id });
        },
        getDiveSiteById(id) {
            return DiveSite.find({ _id: id });
        },
        getDivePointById(id) {
            return DivePoint.find({ _id: id });
        },
    },
};
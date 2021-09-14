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
        async diveCenters() {
            let result = await DiveCenter.find()
            return result
        },
        async diveSites() {
            let result = await DiveSite.find()
            return result
        },
        async divePoints() {
            let result = await DivePoint.find()
            return result
        },
        async getDiveCenterById(id) {
            let result = await DiveCenter.find({ _id: id })
            return result
        },
        async getDiveSiteById(id) {
            let result = await DiveSite.find({ _id: id })
            return result
        },
        async getDivePointById(id) {
            let result = await DivePoint.find({ _id: id })
            return result
        },
    },

    Mutation: {
        createDiveSite(_, args) {
            const diveSite = new DiveSite({
                ...args,
            })
            return diveSite.save()
        },

        async createDiveSites(_, args) {
            console.log(`createDiveSites: diveSite=${JSON.stringify(args)}`)
            let result = await DiveSite.insertMany(...args)
            console.log(`createDiveSites: result=${JSON.stringify(result)}`)
            return JSON.stringify(result)
        },
    }
};
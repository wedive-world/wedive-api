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
            return await DiveCenter.find()
        },
        async diveSites() {
            return await DiveSite.find()
        },
        async divePoints() {
            return await DivePoint.find()
        },
        async getDiveCenterById(id) {
            return await DiveCenter.find({ _id: id })
        },
        async getDiveSiteById(id) {
            return await DiveSite.find({ _id: id })
        },
        async getDivePointById(id) {
            return await DivePoint.find({ _id: id })
        },
    },

    Mutation: {
        async createDiveSite(_, args) {
            console.log(`createDiveSite: args=${args}`)
            let diveSite = new DiveSite(args.diveSiteInput)
            return await diveSite.save()
        },

        async createDiveSites(_, args) {
            console.log(`createDiveSites: args=${args}`)

            let result = []

            for (arg of args) {
                const divesite = new DiveSite(arg)
                const savedDiveSite = await divesite.save()
                result.push(savedDiveSite)
            }

            return result
        },
    }
};
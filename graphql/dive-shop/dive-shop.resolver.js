const schema = require('../../model').schema;

const DiveShop = schema.DiveShop

const translator = require('../common/util/translator')

const {
    queryGeocoding,
    queryReverseGeocoding
} = require('../../controller/geocoding-client')
const {
    fetchPhotoByReference,
    queryPlaceDetailByPlaceId
} = require('../../controller/google-place-client')

module.exports = {
    DiveSite: {
        async diveShops(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveShops = await DiveShop.find({ diveSites: parent._id }).lean()
            return diveShops.map(diveShop => translator.translateOut(diveShop, languageCode))
        }
    },

    DivePoint: {
        async diveShops(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveShops = await DiveShop.find({ divePoints: parent._id }).lean()
            return diveShops.map(diveShop => translator.translateOut(diveShop, languageCode))
        }
    },

    Diving: {
        async diveShops(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveShops = await DiveShop.find({ _id: { $in: parent.diveShops } }).lean()
            return diveShops.map(diveShop => translator.translateOut(diveShop, languageCode))
        }
    },

    Instructor: {
        async diveShops(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveShops = await DiveShop.find({ _id: { $in: parent.diveShops } }).lean()
            return diveShops.map(diveShop => translator.translateOut(diveShop, languageCode))
        }
    },

    Reservation: {
        async diveShop(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveShop = await DiveShop.findById(parent.diveShop)
                .lean()

            return translator.translateOut(diveShop, languageCode)
        }
    },


    // placeName: String,
    // placeAddress: String,
    // placeProvider: String,
    // placeProviderId: String,
    // placeRating: String,
    // placeRatingsTotal: Number,
    // placeBusinessStatus: String,
    // placeAddress: String,
    // placeTypes: [String],
    // placePhoneNumber: String,
    // placeWebSite: String,
    // placeOpeningHours: [String],
    DiveShop: {
        async name(parent, args, context, info) {
            return parent.name ? parent.name : parent.placeName
        },
        async address(parent, args, context, info) {
            return parent.address ? parent.address : parent.placeAddress
        },
        async adminScore(parent, args, context, info) {
            return parent.adminScore ? parent.adminScore : parent.placeRating ? parent.placeRating * 20 : 0
        },
        async phoneNumber(parent, args, context, info) {
            return parent.phoneNumber ? parent.phoneNumber : parent.placePhoneNumber
        },
        async webPageUrl(parent, args, context, info) {
            return parent.webPageUrl ? parent.webPageUrl : parent.placeWebSite
        },
        async openingHours(parent, args, context, info) {
            return parent.openingHours ? parent.openingHours : parent.placeOpeningHours
        },

        // backgroundImages: async (parent, args, context, info) => {
        //     if (parent.backgroundImages && parent.backgroundImages.length > 2) {
        //         return parent.backgroundImages
        //     }

        //     let backgroundImages = await getBackgroundImages(parent.placeProviderId)
        //     await DiveShop.findByIdAndUpdate(parent._id, { backgroundImages: backgroundImages })
        //     return backgroundImages
        // },
    },

    Query: {
        // async ___DiveShops(parent, args, context, info) { },
        async getAllDiveShops(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveShops = await DiveShop.find()
                .lean()
            return diveShops.map(diveShop => translator.translateOut(diveShop, languageCode))
        },

        async getDiveShops(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | getAllDiveShops: languageCode=${languageCode}`)

            console.log(`query | getAllDiveShops: args=${JSON.stringify(args)}`)
            let skip = args.skip
            let limit = args.limit

            let diveShops = await DiveShop.find()
                .skip(skip)
                .limit(limit)
                .lean()

            return diveShops.map(diveShop => translator.translateOut(diveShop, languageCode))
        },

        async getDiveShopById(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveShop = await DiveShop.findOne({ _id: args._id })
                .lean()

            return translator.translateOut(diveShop, languageCode)
        },

        async getDiveShopByUniqueName(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveShop = await DiveShop.findOne({ uniqueName: args.uniqueName })
                .lean()

            return translator.translateOut(diveShop, languageCode)
        },

        async getDiveShopsNearBy(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveShops = await DiveShop.find({
                $and: [
                    { latitude: { $gt: Math.min(args.lat1, args.lat2) } },
                    { longitude: { $gt: Math.min(args.lon1, args.lon2) } },
                    { latitude: { $lt: Math.max(args.lat1, args.lat2) } },
                    { longitude: { $lt: Math.max(args.lon1, args.lon2) } },
                ]
            })
                .limit(args.limit)
                .sort('-adminScore')
                .lean()

            return diveShops.map(diveShop => translator.translateOut(diveShop, languageCode))
        },

        async searchDiveShopsByName(parent, args, context, info) {

            console.log(`query | searchDiveShopsByName: args=${JSON.stringify(args)}`)

            let languageCode = context.languageCode
            let diveShops = await DiveShop.find({ $text: { $search: args.query } })
                .lean()
            return diveShops.map(diveShop => translator.translateOut(diveShop, languageCode))
        },

    },

    Mutation: {

        async upsertDiveShop(parent, args, context, info) {

            console.log(`mutation | upsertDiveShop: args=${args}`)
            let languageCode = context.languageCode

            let diveShop = null

            if (!args.input._id) {
                diveShop = new DiveShop(args.input)

            } else {
                diveShop = await DiveShop.findOne({ _id: args.input._id })
                Object.assign(diveShop, args.input)
                diveShop.updatedAt = Date.now()
            }

            if (diveShop.divePoints) {
                await diveShop.populate('divePoints')
                diveShop.divePoints.forEach(divePoint => {
                    if (!diveShop.diveSites) {
                        diveShop.diveSites = [];
                    }

                    if (diveShop.diveSites.includes(divePoint.diveSiteId)) {
                        return;
                    }

                    diveShop.diveSites.push(divePoint.diveSiteId)
                });
            }

            diveShop.location.type = 'Point'
            diveShop.location.coordinates = [diveShop.latitude, diveShop.longitude]


            let geocoding = await queryGeocoding(diveShop.geoAddress, context.languageCode)
            if (geocoding) {
                let location = geocoding.location
                diveShop.address = geocoding.refinedAddress

                diveShop.latitude = location.lat
                diveShop.longitude = location.lng
                diveShop.location.type = 'Point'
                diveShop.location.coordinates = [location.lng, location.lat]
            }

            diveShop = translator.translateIn(diveShop, args.input, languageCode)
            await diveShop.save()

            let result = await DiveShop.findOne({ _id: diveShop._id })
                .lean()

            return translator.translateOut(result, languageCode)
        },

        async deleteDiveShopById(parent, args, context, info) {
            let result = await DiveShop.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDiveShopById: result=${JSON.stringify(result)}`)
            return args._id
        },
    }
};

async function getBackgroundImages(placeId) {
    let placeDetail = await queryPlaceDetailByPlaceId(placeId)
    let backgroundImages = []
    if (placeDetail.photos && placeDetail.photos.length > 0) {
        let count = 0
        for (let photo of placeDetail.photos) {
            if (++count > 3) {
                break
            }

            let image = await fetchPhotoByReference(photo.photo_reference)
            backgroundImages.push(image._id)
        }
    }
    console.log(`getBackgroundImages: found ${backgroundImages.length}`)

    return backgroundImages
}
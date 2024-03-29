const {
    DiveCenter,
    DivePoint,
    DiveSite,
    DiveShop
} = require('../../model').schema;

const {
    queryGeocoding,
    queryReverseGeocoding
} = require('../../controller/geocoding-client')

const {
    searchDiveResort,
    queryDiveResortByLocation
} = require('../../controller/google-place-client')

const {
    queryNaverPlace
} = require('../../controller/naver-search-client')

module.exports = {

    Mutation: {
        async updateAddressByLocation(parent, args, context, info) {
            console.log(`mutation | updateAddressByLocation: args=${JSON.stringify(args)}`)

            const count = await getModel(args.targetType).count()
            const limit = 10

            let failed = ''

            for await (let skip of asyncGenerator(limit, count)) {
                let models = await getModel(args.targetType).find()
                    .skip(skip)
                    .limit(limit)

                for (let model of models) {
                    try {
                        if (!args.force && model.location) {
                            continue
                        }

                        let result = await queryReverseGeocoding(model.latitude, model.longitude, context.languageCode)

                        if (!model.addressTranslation) {
                            model.addressTranslation = new Map()
                        }
                        model.addressTranslation.set(context.languageCode, result.refinedAddress)

                        model.location.type = 'Point'
                        model.location.coordinates = [model.longitude, model.latitude]
                        model.countryCode = result.countryCode

                        await model.save()
                    } catch (err) {
                        failed += model.name + ' '
                        continue
                    }
                }
            }

            return {
                success: true,
                reason: failed
            }
        },
        async updateCountryCodeByLocation(parent, args, context, info) {
            console.log(`mutation | updateAddressByLocation: args=${JSON.stringify(args)}`)

            const count = await getModel(args.targetType).count()
            const limit = 10

            let failed = ''

            for await (let skip of asyncGenerator(limit, count)) {
                let models = await getModel(args.targetType).find()
                    .skip(skip)
                    .limit(limit)

                for (let model of models) {
                    try {
                        if (!args.force && model.countryCode) {
                            continue
                        }

                        let result = await queryReverseGeocoding(model.latitude, model.longitude, context.languageCode)
                        model.countryCode = result.countryCode
                        await model.save()

                    } catch (err) {
                        failed += model.name + ' '
                        continue
                    }
                }
            }

            return {
                success: true,
                reason: failed
            }
        },

        async updateDiveCenterLatLngByAddress(parent, args, context, info) {
            console.log(`mutation | updateLatLngByAddress: args=${JSON.stringify(args)}`)

            let diveCenters = await DiveCenter.find()
            let failed = ''
            for (let diveCenter of diveCenters) {
                if (!diveCenter.geoAddress) {
                    failed += diveCenter.name + ' '
                    continue
                }

                let result = await queryGeocoding(diveCenter.geoAddress, context.languageCode)
                let location = result.location
                let refinedAddress = result.refinedAddress
                diveCenter.latitude = location.lat
                diveCenter.longitude = location.lng
                diveCenter.location.type = 'Point'
                diveCenter.location.coordinates = [location.lng, location.lat]
                if (!diveCenter.addressTranslation) {
                    diveCenter.addressTranslation = new Map()
                }
                diveCenter.addressTranslation.set(context.languageCode, refinedAddress)

                try {
                    await diveCenter.save()
                } catch (err) {
                    failed += diveCenter.name + ' '
                    continue
                }
            }

            return {
                success: true,
                reason: failed
            }
        },
        async updateLatLngByAddress(parent, args, context, info) {
            console.log(`mutation | updateLatLngByAddress: args=${JSON.stringify(args)}`)

            let models = await getModel(args.targetType).find()
            let failed = ''
            for (let model of models) {
                if (!model.geoAddress) {
                    failed += model.name + ' '
                    continue
                }

                let result = await queryGeocoding(model.geoAddress, context.languageCode)
                let location = result.location
                let refinedAddress = result.refinedAddress
                if (args.targetType == 'diveCenter') {
                    model.latitude = location.lat
                    model.longitude = location.lng
                }
                model.location.type = 'Point'
                model.location.coordinates = [model.longitude, model.latitude]
                if (!model.addressTranslation) {
                    model.addressTranslation = new Map()
                }
                model.addressTranslation.set(context.languageCode, refinedAddress)

                try {
                    await model.save()
                } catch (err) {
                    failed += model.name + ' '
                    continue
                }
            }

            return {
                success: true,
                reason: failed
            }
        },

        async queryDiveResort(parent, args, context, info) {
            let totalSize = 0

            const count = await DiveSite.count({ countryCode: { $in: ['KR', 'kr'] } })
            const limit = 1
            console.log(`count=${count}`)

            for await (let skip of asyncGenerator(limit, count)) {
                let diveSites = await DiveSite.find({ countryCode: { $in: ['KR', 'kr'] } })
                    .select('latitude longitude')
                    .limit(limit)
                    .skip(skip)

                for (let diveSite of diveSites) {
                    const query = '다이브 샵'

                    let result = await queryReverseGeocoding(diveSite.latitude, diveSite.longitude, context.languageCode)
                    totalSize += await queryDiveResortByLocation(diveSite.latitude, diveSite.longitude, query, args.force, result.countryCode)
                }
            }
        },

        async updateTypeDef(parent, args, context, info) {
            await DiveSite.updateMany({}, { typeDef: 'DiveSite' })
            await DivePoint.updateMany({}, { typeDef: 'DivePoint' })
            await DiveCenter.updateMany({}, { typeDef: 'DiveCenter' })

            return {
                success: true
            }
        },

        updateDiveShopInfoByNaver: async (parent, args, context, info) => {
            let data = await updateDiveShopByNaver()
            return {
                success: true,
                reason: JSON.stringify(data, null, 2)
            }
        }
    }
};

function getModel(targetType) {

    switch (targetType) {

        case 'diveCenter':
            return DiveCenter

        case 'divePoint':
            return DivePoint

        case 'diveSite':
            return DiveSite

        case 'diveShop':
            return DiveShop
    }
}

async function* asyncGenerator(limit, count) {
    let skip = 0;
    while (skip <= count) {
        yield skip;
        skip += limit
    }
}

async function updateDiveShopByNaver() {
    const query = 'ok다이브리조트'
    return await queryNaverPlace(query)
}
const {
    DiveCenter,
    DivePoint,
    DiveSite
} = require('../../model').schema;

const {
    queryGeocoding,
    queryReverseGeocoding
} = require('../../controller/geocoding-client')

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
                        if (!args.force && model.location) {
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
    }
}

async function* asyncGenerator(limit, count) {
    let skip = 0;
    while (skip <= count) {
        yield skip;
        skip += limit
    }
}
const {
    Recommendation,
    DiveSite,
    DivePoint,
    DiveCenter,
    Diving,
    Instructor,
    User
} = require('../../model').schema;

const SearchResolver = require('../search/search.resolver')
const RECOMMEND_COUNT = 5

module.exports = {
    RecommendationPreview: {
        async __resolveType(obj, context, info) {
            if (obj.hostUser) {
                return 'Diving'
            } else if (obj.diveSiteId) {
                return 'DivePoint'
            } else if (obj.webPageUrl || obj.email || obj.phoneNumber || obj.educationScore) {
                return 'DiveCenter'
            } else if (obj.user) {
                return 'Instructor'
            } else {
                return 'DiveSite'
            }
        }
    },

    Recommendation: {
        async previews(parent, args, context, info) {
            let result = await getPreviews(parent, context)
            result.sort(item => Math.random() - 0.5)
            return result
        },

        async previewsTotalCount(parent, args, context, info) {
            return await getTotalPreviewsCount(parent, contex)
        },

    },

    Query: {
        async getUserRecommendations(parent, args, context, info) {
            console.log(`query | getUserRecommendations: context=${JSON.stringify(context)}`)

            let user = await User.findOne({ uid: context.uid })
                .lean()

            let recommendations = await Recommendation.find({ interests: { $in: user.interests } })
                .lean()

            // console.log(`query | getUserRecommendations: recommendations=${JSON.stringify(recommendations)}`)

            let seed = user.recommendationSeed ? user.recommendationSeed : 0

            let randomRecommendations = await Recommendation.find()
                .skip(seed)
                .limit(RECOMMEND_COUNT)
                .lean()

            // console.log(`query | getUserRecommendations: randomRecommendations=${JSON.stringify(randomRecommendations)}`)

            let recommendsCount = await Recommendation.count()
            let nextSeed = (seed + RECOMMEND_COUNT) % recommendsCount
            await User.updateOne({ uid: context.uid }, { recommendationSeed: nextSeed })

            let result = Array.from(new Set(
                recommendations.concat(randomRecommendations)
            ))
            result.sort(item => Math.random() - 0.5)
            return result
        },

        async getUserRecommendationsByTargetType(parent, args, context, info) {
            console.log(`query | getUserRecommendationsByTargetType: context=${JSON.stringify(context)}`)

            let user = await User.findOne({ uid: context.uid })
                .lean()

            let recommendations = await Recommendation.find({
                interests: { $in: user.interests },
                targetType: args.targetType
            })
                .lean()

            // console.log(`query | getUserRecommendationsByTargetType: recommendations=${JSON.stringify(recommendations)}`)

            let seed = user.recommendationSeed ? user.recommendationSeed : 0

            let randomRecommendations = await Recommendation.find({
                targetType: args.targetType
            })
                .skip(seed)
                .limit(RECOMMEND_COUNT)
                .lean()

            // console.log(`query | getUserRecommendationsByTargetType: randomRecommendations=${JSON.stringify(randomRecommendations)}`)

            let recommendsCount = await Recommendation.count()
            let nextSeed = (seed + RECOMMEND_COUNT) % recommendsCount
            await User.updateOne({ uid: context.uid }, { recommendationSeed: nextSeed })


            let result = Array.from(new Set(
                recommendations.concat(randomRecommendations)
            ))
            result.sort(item => Math.random() - 0.5)
            return result
        },

        async getAllRecommendations(parent, args, context, info) {
            console.log(`query | getAllRecommendations: context=${JSON.stringify(context)}`)
            return await Recommendation.find()
        },

        async getPreviewsByRecommendationId(parent, args, context, info) {
            console.log(`query | getPreviewsByRecommendationId: context=${JSON.stringify(context)}`)
            let recommendation = await Recommendation.findById(args._id)
                .lean()
                
            return await getTotalPreviews(recommendation, context)
        },
    },

    Mutation: {
        async upsertRecommendation(parent, args, context, info) {
            console.log(`mutation | upsertRecommendation: args=${JSON.stringify(args)}`)

            if (args.input) {
                args.input.searchParams = JSON.stringify(args.input.searchParams)
            }

            let recommendation = null
            if (args.input._id) {
                recommendation = await Recommendation.findById(args.input._id)
            } else {
                recommendation = new Recommendation(args.input)
            }

            Object.assign(recommendation, args.input)

            await recommendation.save()
            return recommendation
        },

        async deleteRecommendation(parent, args, context, info) {
            console.log(`mutation | deleteRecommendation: args=${JSON.stringify(args)}`)

            await Recommendation.findByIdAndDelete(args._id)
            return {
                success: true
            }
        }
    },
};

function getModel(targetType) {

    switch (targetType) {

        case 'diveCenter':
            return DiveCenter

        case 'divePoint':
            return DivePoint

        case 'diveSite':
            return DiveSite

        case 'diving':
            return Diving

        case 'instructor':
            return Instructor
    }
}

async function getTotalPreviews(recommend, context) {
    recommend.previewCount = 0

    switch (recommend.type) {
        case 'new':
            return await getNewRecommendation(recommend)
        case 'interest':
            return await getInterestRecommendation(recommend)
        case 'search':
            return await getSearchRecommendation(recommend, context)
    }
}

async function getTotalPreviewsCount(recommend, context) {
    let previews = await getTotalPreviews(recommend, context)
    return previews.length
}

async function getPreviews(recommend, context) {
    if (recommend.previewCount < 1) {
        return []
    }

    switch (recommend.type) {
        case 'new':
            return await getNewRecommendation(recommend)
        case 'interest':
            return await getInterestRecommendation(recommend)
        case 'search':
            return await getSearchRecommendation(recommend, context)

    }
}

async function getNewRecommendation(recommend) {
    return await getModel(recommend.targetType)
        .find()
        .sort('-createdAt')
        .limit(recommend.previewCount)
        .lean()
}

async function getInterestRecommendation(recommend) {
    console.log(`recommendation-resolver | getInterestRecommendation: recommend=${JSON.stringify(recommend)}`)
    return await getModel(recommend.targetType)
        .find({ interests: { $in: recommend.interests } })
        .sort('-adminScore')
        .limit(recommend.previewCount)
        .lean()
}

async function getSearchRecommendation(recommend, context) {
    const searchParams = JSON.parse(recommend.searchParams)

    switch (recommend.targetType) {
        case 'diving':
            return await SearchResolver.Query.searchDivings(
                null,
                { limit: recommend.previewCount, searchParams: searchParams },
                null,
                null
            )
        case 'diveCenter':
        case 'diveSite':
        case 'divePoint':
            return await SearchResolver.Query.searchPlaces(
                null,
                { limit: recommend.previewCount, searchParams: searchParams },
                context,
                null
            )
    }
}
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
            return await getTotalPreviewsCount(parent, context)
        },

    },

    Query: {
        async getUserRecommendations(parent, args, context, info) {
            console.log(`query | getUserRecommendations: context=${JSON.stringify(context)}`)
            return await getRecommendationsByTargetType(context.uid, null, args.count)
        },

        async getUserRecommendationsByTargetType(parent, args, context, info) {
            console.log(`query | getUserRecommendationsByTargetType: context=${JSON.stringify(context)}`)
            return await getRecommendationsByTargetType(context.uid, args.targetType, args.count)
        },

        async getAllRecommendations(parent, args, context, info) {
            console.log(`query | getAllRecommendations: context=${JSON.stringify(context)}`)
            return await Recommendation.find()
        },

        async getPreviewsByRecommendationId(parent, args, context, info) {
            console.log(`query | getPreviewsByRecommendationId: context=${JSON.stringify(context)}`)
            let recommendation = await Recommendation.findById(args._id)
                .lean()
            
            if (!recommendation) {
                return null
            }

            return {
                recommendationTitle: recommendation.title,
                previews: await getTotalPreviews(recommendation, context)
            }
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
    let clone = JSON.parse(JSON.stringify(recommend))
    clone.previewCount = 0
    return await getPreviewsInternal(clone, context)
}

async function getTotalPreviewsCount(recommend, context) {
    let previews = await getTotalPreviews(recommend, context)
    return previews.length
}

async function getPreviews(recommend, context) {
    if (recommend.previewCount < 1) {
        return []
    }

    return await getPreviewsInternal(recommend, context)
}

async function getPreviewsInternal(recommend, context) {

    switch (recommend.type) {
        case 'new':
            return await getNewRecommendation(recommend)
        case 'interest':
            return await getInterestRecommendation(recommend)
        case 'search':
            return await getSearchRecommendation(recommend, context)
        default:
            return []
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

async function getRecommendationsByTargetType(uid, targetType, count) {

    let recommendsCount = await Recommendation.count()

    let resultRecommendations = []
    let seed = getRandomInt(0, recommendsCount)

    let user = await User.findOne({ uid: uid })
        .lean()

    if (user) {
        if (Math.random() <= 0.4) {
            let searchParam = {
                interests: { $in: user.interests }
            }

            if (targetType) {
                searchParam.targetType = targetType
            }
            let userRecommendationCount = await Recommendation.count(searchParam)
            if (userRecommendationCount > 0) {
                let userRecommendations = await Recommendation.find(searchParam)
                    .skip(getRandomInt(0, userRecommendationCount))
                    .limit(1)
                    .lean()

                resultRecommendations = resultRecommendations.concat(userRecommendations)
            }
        }
        seed = user.recommendationSeed

        let nextSeed = (seed + count) % recommendsCount
        await User.updateOne({ uid: uid }, { recommendationSeed: nextSeed })
    }

    let searchParam = targetType
        ? { targetType: targetType }
        : {}

    let randomRecommendations = await Recommendation.find(searchParam)
        .skip(seed)
        .limit(count)
        .lean()

    resultRecommendations = resultRecommendations.concat(randomRecommendations)

    if (seed + count > recommendsCount) {
        let remainedRecommendations = await Recommendation.find(searchParam)
            .skip(0)
            .limit(seed + count - recommendsCount)
            .lean()

        resultRecommendations = resultRecommendations.concat(remainedRecommendations)
    }

    let result = Array.from(new Set(resultRecommendations))

    return result.sort(item => Math.random() - 0.5)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}
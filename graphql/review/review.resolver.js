const {
    User,
    Review,
} = require('../../model').schema;

const {
    createHistoryFromReview
} = require('../../controller/diving-history-manager')

const DEFAULT_REVIEW_COUNT = 5

module.exports = {

    Query: {
        async getReviewsByCurrentUser(parent, args, context, info) {
            console.log(`query | getReviewsByCurrentUser: context=${JSON.stringify(context)}`)

            let user = await User.findOne({ uid: context.uid }).lean()

            return await Review.find({ author: user._id })
                .lean()
        },

        async getReviewsByTargetId(parent, args, context, info) {
            console.log(`query | getReviewsByTargetId: args=${JSON.stringify(args)}`)

            return await Review.find({ targetId: args.targetId })
                .sort('-createdAt')
                .skip(args.skip)
                .limit(args.limit)
                .lean()
        },
    },

    Mutation: {
        async upsertReview(parent, args, context, info) {
            console.log(`mutation | upsertReview: args=${JSON.stringify(args)}`)

            let review = null
            const isNewReview = !args.input._id

            if (!isNewReview) {
                review = await Review.findById(args.input._id)

            } else {
                review = new Review(args.input)
            }

            Object.assign(review, args.input)

            let user = await User.findOne({ uid: context.uid }).lean()
            review.author = user._id

            await review.save()

            if (isNewReview) {
                await createHistoryFromReview(review._id)
            }

            return review
        },

        async deleteReviewById(parent, args, context, info) {
            console.log(`mutation | deleteReviewById: args=${JSON.stringify(args)}`)

            await Review.findByIdAndDelete(args._id)
            return {
                success: true
            }
        }
    },

    DiveCenter: {
        async reviews(parent, args, context, info) {
            return await Review.find({ targetId: { $in: parent._id } })
                .limit(DEFAULT_REVIEW_COUNT)
                .sort('-createdAt')
                .lean()
        },
    },

    DivePoint: {
        async reviews(parent, args, context, info) {
            return await Review.find({ targetId: { $in: parent._id } })
                .limit(DEFAULT_REVIEW_COUNT)
                .sort('-createdAt')
                .lean()
        },
    },

    DiveSite: {
        async reviews(parent, args, context, info) {
            return await Review.find({ targetId: { $in: parent._id } })
                .limit(DEFAULT_REVIEW_COUNT)
                .sort('-createdAt')
                .lean()
        },
    },

    Review: {
        async reviews(parent, args, context, info) {
            return await Review.find({ targetId: { $in: parent._id } })
                .limit(DEFAULT_REVIEW_COUNT)
                .sort('-createdAt')
                .lean()
        },
    },

    Diving: {
        async reviews(parent, args, context, info) {
            return await Review.find({ targetId: { $in: parent._id } })
                .limit(DEFAULT_REVIEW_COUNT)
                .sort('-createdAt')
                .lean()
        },
    },

    InstructorProfile: {
        async reviews(parent, args, context, info) {
            return await Review.find({ targetId: { $in: parent._id } })
                .limit(DEFAULT_REVIEW_COUNT)
                .sort('-createdAt')
                .lean()
        },
    },

    Agenda: {
        async reviews(parent, args, context, info) {
            return await Review.find({ targetId: { $in: parent._id } })
                .limit(DEFAULT_REVIEW_COUNT)
                .sort('-createdAt')
                .lean()
        },
    },
};
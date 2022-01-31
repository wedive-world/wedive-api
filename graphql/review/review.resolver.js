const {
    User,
    Review
} = require('../../model').schema;

const DEFAULT_REVIEW_COUNT = 5

module.exports = {

    Query: {
        async getReviewsByCurrentUser(parent, args, context, info) {
            console.log(`query | getReviewsByCurrentUser: context=${JSON.stringify(context)}`)

            let user = await User.findOne({ uid: context.uid }).lean()

            return await Review.find({ author: user._id })
        },
        
        async getReviewsByTargetId(parent, args, context, info) {
            console.log(`query | getReviewsByTargetId: args=${JSON.stringify(args)}`)

            return await Review.find({ targetId: args.targetId })
                .skip(args.skip)
                .limit(args.limit)
        },
    },

    Mutation: {
        async upsertReview(parent, args, context, info) {
            console.log(`mutation | upsertReview: args=${JSON.stringify(args)}`)

            let review = null
            if (args.input._id) {
                review = await Review.findById(args.input._id)
            } else {
                review = new Review(args.input)
            }

            Object.assign(review, args.input)

            let user = await User.findOne({ uid: context.uid }).lean()
            review.author = user._id
            await review.save()

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
                .lean()
        },
    },

    DivePoint: {
        async reviews(parent, args, context, info) {
            return await Review.find({ targetId: { $in: parent._id } })
                .limit(DEFAULT_REVIEW_COUNT)
                .lean()
        },
    },

    DiveSite: {
        async reviews(parent, args, context, info) {
            return await Review.find({ targetId: { $in: parent._id } })
                .limit(DEFAULT_REVIEW_COUNT)
                .lean()
        },
    },

    Review: {
        async reviews(parent, args, context, info) {
            return await Review.find({ targetId: { $in: parent._id } })
                .limit(DEFAULT_REVIEW_COUNT)
                .lean()
        },
    },

    Diving: {
        async reviews(parent, args, context, info) {
            return await Review.find({ targetId: { $in: parent._id } })
                .limit(DEFAULT_REVIEW_COUNT)
                .lean()
        },
    },

    InstructorProfile: {
        async reviews(parent, args, context, info) {
            return await Review.find({ targetId: { $in: parent._id } })
                .limit(DEFAULT_REVIEW_COUNT)
                .lean()
        },
    },
};
const {
    Diving,
    DivePoint,
    DiveSite,
    DiveCenter,
    DiveShop,
    Image,
    User,
    Review,
    Like,
    Dislike,
    Subscribe,
    View,
    Community,
    Agenda,
    Reservation
} = require('../../model').schema;

const {
    createHistoryFromReview
} = require('../../controller/diving-history-manager')

const {
    getUserIdByUid
} = require('../../controller/user-controller')

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
                Object.assign(review, args.input)

            } else {
                review = new Review(args.input)
                review.author = await getUserIdByUid(context.uid)
            }            

            await review.save()
            console.log(`isNewReview=${isNewReview} args.targetId=${args.targetId}`)

            if (isNewReview) {
                await getModel(review.targetType).findByIdAndUpdate(
                    review.targetId,
                    { $inc: { reviewCount: 1 } }
                )
                await createHistoryFromReview(review._id)
            }

            return review
        },

        async deleteReviewById(parent, args, context, info) {
            console.log(`mutation | deleteReviewById: args=${JSON.stringify(args)}`)
            const review = await Review.findById(args._id)
                .lean()

            await Review.findByIdAndDelete(args._id)

            await getModel(review.targetType).findByIdAndUpdate(
                review.targetId,
                { $inc: { reviewCount: -1 } }
            )
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

    DiveShop: {
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

function getModel(targetType) {

    switch (targetType) {

        case 'diveCenter':
            return DiveCenter

        case 'diveShop':
            return DiveShop

        case 'divePoint':
            return DivePoint

        case 'diveSite':
            return DiveSite

        case 'diving':
            return Diving

        case 'image':
            return Image

        case 'user':
            return User

        case 'review':
            return Review

        case 'recommendation':
            return Review

        case 'agenda':
            return Agenda

        case 'reservation':
            return Reservation
    }
}
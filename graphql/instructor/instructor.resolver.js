const {
    User,
    Instructor
} = require('../../model').schema;

module.exports = {
    User: {
        async instructorProfile(parent, args, context, info) {
            return await Instructor.findById(parent.instructorProfile)
        }
    },

    DiveSite: {
        async instructors(parent, args, context, info) {
            return await Instructor.find({ diveSites: parent._id })
        }
    },

    DiveCenter: {
        async instructors(parent, args, context, info) {
            return await Instructor.find({ diveCenters: parent._id })
        }
    },

    DivePoint: {
        async instructors(parent, args, context, info) {
            return await Instructor.find({ divePoints: parent._id })
        }
    },

    // Query: {
    //     async (parent, args, context, info) {
    //         console.log(`query | getReviewsByCurrentUser: context=${JSON.stringify(context)}`)

    //         let user = await User.findOne({ uid: context.uid }).lean()

    //         return await Review.find({ author: user._id })
    //     },
    // },

    Mutation: {
        async upsertInstructor(parent, args, context, info) {
            console.log(`mutation | upsertInstructor: args=${JSON.stringify(args)}`)

            let instructor = null
            if (args.input._id) {
                instructor = await Instructor.findById(args.input._id)
            } else {
                instructor = new Instructor(args.input)
            }

            Object.assign(instructor, args.input)

            let user = await User.findOne({ uid: context.uid })
                .select('_id')
                .lean()
            instructor.user = user._id

            await instructor.save()

            return instructor
        },
    }
    //     async deleteReviewById(parent, args, context, info) {
    //         console.log(`mutation | deleteReviewById: args=${JSON.stringify(args)}`)

    //         await Review.findByIdAndDelete(args._id)
    //         return {
    //             success: true
    //         }
    //     }
    // },

    // DiveCenter: {
    //     async reviews(parent, args, context, info) {
    //         return await Review.find({ targetId: { $in: parent.reviews } })
    //             .lean()
    //     },
    // },

    // DivePoint: {
    //     async reviews(parent, args, context, info) {
    //         return await Review.find({ targetId: { $in: parent.reviews } })
    //             .lean()
    //     },
    // },

    // DiveSite: {
    //     async reviews(parent, args, context, info) {
    //         return await Review.find({ targetId: { $in: parent.reviews } })
    //             .lean()
    //     },
    // },

    // Review: {
    //     async reviews(parent, args, context, info) {
    //         return await Review.find({ targetId: { $in: parent.reviews } })
    //             .lean()
    //     },
    // },

    // Diving: {
    //     async reviews(parent, args, context, info) {
    //         return await Review.find({ targetId: { $in: parent.reviews } })
    //             .lean()
    //     },
    // },

    // InstructorProfile: {
    //     async reviews(parent, args, context, info) {
    //         return await Review.find({ targetId: { $in: parent.reviews } })
    //             .lean()
    //     },
    // },
};
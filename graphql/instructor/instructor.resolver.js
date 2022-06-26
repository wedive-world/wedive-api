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
    
    DiveShop: {
        async instructors(parent, args, context, info) {
            return await Instructor.find({ diveCenters: parent._id })
        }
    },

    DivePoint: {
        async instructors(parent, args, context, info) {
            return await Instructor.find({ divePoints: parent._id })
        }
    },

    Query: {
        async searchInstructor(parent, args, context, info) {

            if (args.searchParams) {
                let mongooseParams = createMongooseParams(args.searchParams)
                return await Instructor.find(mongooseParams)
            }

            return await Instructor.find()
        },
        async getInstructorByCurrentUser(parent, args, context, info) {

            const user = await User.findOne({ uid: context.uid })
                .lean()
                .select('_id')

            if (!user) {
                return null
            }

            return await Instructor.find({ user: user._id })
        },
        async getInstructorById(parent, args, context, info) {
            return await Instructor.find(args._id)
        },

    },

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

async function createMongooseParams(searchParams) {

    let mongooseParams = { $and: [] }

    if (args.searchParams.query) {
        mongooseParams['$and'].push({ $text: { $search: searchParams.query } })
    }

    if (searchParams.divingTypes && searchParams.divingTypes.length > 0) {
        mongooseParams['$and'].push({ divingType: { $in: searchParams.divingTypes } })
    }

    return mongooseParams
}
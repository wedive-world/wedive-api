const {
    InstructorVerification,
    Instructor
} = require('../../model').schema

module.exports = {

    User: {
        async instructorVerifications(parent, args, context, info) {
            return await InstructorVerification.find({ user: parent._id });
        },
    },

    Mutation: {
        async upsertInstructorVerification(parent, args, context, info) {

            console.log(`mutation | upsertInstructorVerification: args=${JSON.stringify(args)}`)

            let instructorVerification = null

            if (!args.input._id) {
                instructorVerification = new InstructorVerification(args.input)

            } else {
                instructorVerification = await InstructorVerification.findById(args.input._id)
                Object.assign(instructorVerification, args.input)
                instructorVerification.updatedAt = Date.now()
            }

            await instructorVerification.save()
            return instructorVerification
        },

        async verifyInstructor(parent, args, context, info) {

            console.log(`mutation | verifyInstructor: args=${JSON.stringify(args)}`)
            if (args.isVerified) {

                let instructorVerification = await InstructorVerification.findById(args.instructorVerificationId)
                    .lean()
                let instructor = new Instructor(instructorVerification)
                await instructor.save()
            }

            await InstructorVerification.findByIdAndUpdate(args.instructorVerificationId,
                {
                    isVerified: args.isVerified,
                    verificationReason: args.reason,
                    updatedAt: Date.now()
                }
            )

            return {
                result: 'success'
            }
        },
    },
};
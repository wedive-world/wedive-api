const { InstructorVerification, User } = require('../../model').schema

const objectHelper = require('../common/util/object-helper')

module.exports = {

    User: {
        async instructorVerifications(parent, args, context, info) {
            return await InstructorVerification.find({ _id: { $in: parent.instructorVerifications } });
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
                objectHelper.updateObject(args.input, instructorVerification)
                instructorVerification.updatedAt = Date.now()
            }

            await instructorVerification.save()
            return instructorVerification
        },

        async verifyInstructor(parent, args, context, info) {

            console.log(`mutation | verifyInstructor: args=${JSON.stringify(args)}`)

            let instructorVerification = await InstructorVerification.findByIdAndUpdate(args.instructorVerificationId,
                {
                    isVerified: args.isVerified,
                    verificationReason: verificationReason,
                    updatedAt: Date.now()
                },
                {
                    returnDocument: 'after',
                    lean: true,
                }
            )

            let user = await User.findById(instructorVerification.user)
            if (!user.instructorTypes.includes(instructorVerification.instructorType)) {
                user.instructorLicenseImages.push(instructorVerification.instructorLicenseImage)
                user.instructorTypes.push(instructorVerification.instructorType)
                await user.save()
            }

            return {
                result: 'success'
            }
        },
    },
};
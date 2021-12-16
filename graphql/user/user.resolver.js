const { User, Instructor } = require('../../model').schema

module.exports = {

    InstructorVerification: {
        async user(parent, args, context, info) {
            return await await User.findOne({ _id: parent.user });
        },
    },

    Diving: {
        async hostUser(parent, args, context, info) {
            return await await User.findOne({ _id: parent.hostUser });
        },
    },

    Query: {
        async getAllUsers(parent, args, context, info) {
            return await User.find()
        },

        async getUserById(parent, args, context, info) {
            return await User.findOne({ _id: args._id });
        },

        async getUserByEmail(parent, args, context, info) {
            return await User.findOne({ email: args.email })
        },

        async getUserByNickName(parent, args, context, info) {
            return await User.findOne({ nickName: args.nickName })
        },
    },

    Mutation: {
        async upsertUser(parent, args, context, info) {

            console.log(`mutation | upsertUser: args=${JSON.stringify(args)}`)

            let user = null

            if (!args.input._id) {
                user = new User(args.input)

            } else {
                user = await User.findOne({ _id: args.input._id })
                Object.assign(user, args.input)
                user.updatedAt = Date.now()
            }

            await user.save()
            return user
        },
        async updateFcmToken(parent, args, context, info) {

            console.log(`mutation | updateFcmToken: args=${JSON.stringify(args)}`)

            let result = await User.updateOne(
                { firebaseUid: args.firebaseUid },
                { fcmToken: args.fcmToken, updatedAt: Date.now() },
                { upsert: true }
            )
            console.log(`mutation | updateFcmToken: result=${JSON.stringify(result)}`)

            return {
                result: 'success'
            }
        },
    },
};
const { User, Instructor } = require('../../model').schema
const ChatServiceProxy = require('../../proxy/chat-service-proxy')

module.exports = {

    InstructorVerification: {
        async user(parent, args, context, info) {
            return await User.findOne({ _id: parent.user });
        },
    },

    Diving: {
        async hostUser(parent, args, context, info) {
            return await User.findOne({ _id: parent.hostUser });
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

        async getUserByUid(parent, args, context, info) {
            return await User.findOne({ uid: args.uid })
        },
    },

    Mutation: {
        async upsertUser(parent, args, context, info) {

            console.log(`mutation | upsertUser: args=${JSON.stringify(args)}`)

            let user = null
            const isNewUser = !args.input._id

            if (isNewUser) {
                user = new User(args.input)

            } else {
                user = await User.findOne({ _id: args.input._id })
                Object.assign(user, args.input)
                user.updatedAt = Date.now()
            }

            await user.save()

            const chatServiceProxy = new ChatServiceProxy()

            if (isNewUser) {
                await chatServiceProxy.createUser(user, context.idToken)

            } else {

            }

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
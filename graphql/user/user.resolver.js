const { User, Instructor } = require('../../model').schema
const ChatServiceProxy = require('../../proxy/chat-service-proxy')

module.exports = {

    Instructor: {
        async user(parent, args, context, info) {
            return await User.findOne({ _id: parent.user });
        },
    },

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

    Participant: {
        async user(parent, args, context, info) {
            return await User.findById(parent.user);
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

            await chatServiceProxy.updateUser({
                name: user.nickName,
                profileImageUrl: user.profileImages ? user.profileImages[0].thumbnail : ""
            }, context.idToken)

            return user
        },
        async updateFcmToken(parent, args, context, info) {

            console.log(`mutation | updateFcmToken: args=${JSON.stringify(args)}`)

            let input = args.input
            input.updatedAt = Date.now()

            let user = await User.findOne({ uid: input.uid })
            let isNewUser = user == null

            let result = await User.updateOne(
                { uid: input.uid },
                input,
                { upsert: true }
            )
            console.log(`mutation | updateFcmToken: result=${JSON.stringify(result)}`)

            user = await User.findOne({ uid: input.uid })
            if (isNewUser) {
                await chatServiceProxy.createUser(user, context.idToken)

            } else {

            }

            await chatServiceProxy.updateUser({
                name: user.nickName,
                profileImageUrl: user.profileImages ? user.profileImages[0].thumbnail : ""
            }, context.idToken)

            return {
                result: 'success'
            }
        },
    },
};
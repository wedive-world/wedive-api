const { User, Instructor } = require('../../model').schema
const ChatServiceProxy = require('../../proxy/chat-service-proxy')
const {
    ApolloServer,
    AuthenticationError,
    ForbiddenError,
  } = require('apollo-server-express');
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

    Review: {
        async author(parent, args, context, info) {
            return await User.findById(parent.author);
        },
    },

    Agenda: {
        async author(parent, args, context, info) {
            return await User.findById(parent.author);
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

        async getUsersByUid(parent, args, context, info) {
            return await User.find({ uid: { $in: args.uids } })
        },

        async findUserByNickName(parent, args, context, info) {
            return await User.find({ $text: { $search: args.nickName } })
        },

        async getCurrentUser(parent, args, context, info) {
            return await User.findOne({ uid: context.uid });
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
                    .populate('profileImages')
                
                if (user.uid != context.uid) {
                    throw new ForbiddenError()
                }

                Object.assign(user, args.input)
                user.updatedAt = Date.now()
            }
            console.log(`mutation | upsertUser: user=${JSON.stringify(user)}`)

            await user.save()

            const chatServiceProxy = new ChatServiceProxy()

            if (isNewUser) {
                await chatServiceProxy.createUser(user, context.idToken)

            } else {

            }

            await chatServiceProxy.updateUser({
                name: user.nickName ? user.nickName : user.uid,
                profileImageUrl: user.profileImages && user.profileImages.length > 0 ? user.profileImages[0].thumbnailUrl : ""
            }, context.idToken)

            return user
        },
        async updateFcmToken(parent, args, context, info) {

            console.log(`mutation | updateFcmToken: args=${JSON.stringify(args)}`)

            let user = await User.findOne({ uid: args.input.uid })
            // console.log(`mutation | updateFcmToken: args=${JSON.stringify(user)}`)
            const isNewUser = user == null

            if (isNewUser) {
                // console.log(`mutation | updateFcmToken: isNewUser=${isNewUser}`)

                user = new User(args.input)
            } else {
                // console.log(`mutation | updateFcmToken: found user=${JSON.stringify(user)}`)

                Object.assign(user, args.input)
                user.updatedAt = Date.now()
            }

            await user.save()

            const chatServiceProxy = new ChatServiceProxy()

            if (isNewUser) {
                await chatServiceProxy.createUser(user, context.idToken)

            } else {

            }

            await chatServiceProxy.updateFcmToken({
                uid: args.input.uid,
                fcmToken: args.input.fcmToken
            }, context.idToken)

            return {
                success: true
            }
        },
    },
};
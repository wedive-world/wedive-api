const {
    User,
    Instructor,
    Subscribe
} = require('../../model').schema
const ChatServiceProxy = require('../../proxy/chat-service-proxy')
const {
    ApolloServer,
    AuthenticationError,
    ForbiddenError,
} = require('apollo-server-express');
const {
    getUserIdByUid
} = require('../../controller/user-controller')

module.exports = {
    Instructor: {
        async user(parent, args, context, info) {
            return await findUserById(parent.user)
        },
    },

    InstructorVerification: {
        async user(parent, args, context, info) {
            return await findUserById(parent.user)
        },
    },

    Diving: {
        async hostUser(parent, args, context, info) {
            return await findUserById(parent.hostUser)
        },
    },

    Participant: {
        async user(parent, args, context, info) {
            if (!parent.user) {
                return await getAnonymousParticipant(parent)
            }

            return await findUserById(parent.user)
        },
    },

    Review: {
        async author(parent, args, context, info) {
            return await findUserById(parent.author)
        },
    },

    Agenda: {
        async author(parent, args, context, info) {
            return await findUserById(parent.author)
        },
    },

    Community: {
        async users(parent, args, context, info) {
            let userIds = await Subscribe.find({ targetId: parent._id, value: true })
                .sort('-createdAt')
                .select('userId')
                .distinct('userId')
                .lean()
            return await User.find({ _id: { $in: userIds } });
        },

        async owners(parent, args, context, info) {
            return await User.find({ _id: { $in: parent.owners } });
        }
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
            await updateUserFcmTokenByUid(args.input)
            return {
                success: true
            }
        },

        deleteCurrentUser: async (parent, args, context, info) => {
            await deleteUserByUid(context.uid)
            return {
                success: true
            }
        },
    },
};

async function updateUserFcmTokenByUid(userInput) {

    let user = await User.findOne({ uid: userInput.uid })
    // console.log(`mutation | updateFcmToken: args=${JSON.stringify(user)}`)
    const isNewUser = user == null

    if (isNewUser) {
        // console.log(`mutation | updateFcmToken: isNewUser=${isNewUser}`)

        user = new User(userInput)
    } else {
        // console.log(`mutation | updateFcmToken: found user=${JSON.stringify(user)}`)
        Object.assign(user, userInput)
        user.updatedAt = Date.now()
    }

    await user.save()

    if (isNewUser) {
        const chatServiceProxy = new ChatServiceProxy()
        await chatServiceProxy.createUser(user, context.idToken)
    }
}

async function deleteUserByUid(uid) {
    let userId = await getUserIdByUid(uid)
    await User.findByIdAndDelete(userId)
}

async function findUserById(userId) {
    let user = await User.findById(userId)
    if (!user) {
        return getResignedUser()
    }

    return user
}

function getResignedUser() {
    return {
        _id: 'resigned',
        nickName: '탈퇴한 유저입니다'
    }
}

function getAnonymousParticipant(participant) {
    return {
        _id: 'anonymous',
        nickName: participant.gender == 'm'
            ? "남성 다이버"
            : "여성 다이버"
    }
}
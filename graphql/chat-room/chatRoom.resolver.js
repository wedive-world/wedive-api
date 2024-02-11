const {
    User,
    Review,
    ChatRoom,
    DivingHistory,
    DiveCenter,
    DiveSite,
    DivePoint,
    Subscribe,
} = require('../../model').schema;

const Mongoose = require('mongoose');

module.exports = {

    Query: {
        async getChatRooms(parent, args, context, info) {
            console.log(`query | getChatRooms: context=${JSON.stringify(context)}`)
            return await ChatRoom.find()
                .sort('priority')
                .lean()
        },

        async getChatRoomsJoinedByCurrentUser(parent, args, context, info) {
            console.log(`query | getChatRoomsJoinedByCurrentUser: context=${JSON.stringify(context)}`)
            let user = await User.findOne({ uid: context.uid })
            let result = await ChatRoom.find({users: {$in: user._id}})
                .sort('-updatedAt')
                .lean()
            
            return result
        },
    },

    Mutation: {
        async upsertChatRoom(parent, args, context, info) {
            console.log(`mutation | upsertChatRoom: args=${JSON.stringify(args)}`)

            let chatRoom = null
            const isNewChatRoom = !args.input._id

            if (!isNewChatRoom) {
                chatRoom = await ChatRoom.findById(args.input._id)

            } else {
                chatRoom = new ChatRoom(args.input)
            }
            Object.assign(chatRoom, args.input)

            await chatRoom.save()
            return chatRoom
        },
    },
};
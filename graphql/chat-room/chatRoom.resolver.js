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

    Diving: {
        async diveCenters(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveCenters = await DiveCenter.find({ _id: { $in: parent.diveCenters } }).lean()
            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, languageCode))
        }
    },

    Query: {
        async getChatRooms(parent, args, context, info) {
            console.log(`query | getChatRooms: context=${JSON.stringify(context)}`)
            return await ChatRoom.find()
                .sort('priority')
        },

        async getChatRoomsJoinedByCurrentUser(parent, args, context, info) {
            console.log(`query | getChatRoomsJoinedByCurrentUser: context=${JSON.stringify(context)}`)
            let user = await User.findOne({ uid: context.uid })

            return await ChatRoom.find({
                users: {
                    '_id': user._id
                }
            })
            .sort('-updatedAt')
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
const {
    User,
    Chat,
    Diving,
    DiveCenter,
    DivePoint,
    DiveSite,
    ChatRoom
} = require('../../model').schema;

module.exports = {
    Chat: {
        async chatParent(parent, args, context, info) {
            let chatRoom = await ChatRoom.findById(parent.chatRoomId)
            if (chatRoom) {
                return chatRoom
            }

            return await ChatRoom.findById(parent.chatRoomId)
        },
    },

    
    ChatParent: {
        async __resolveType(obj, context, info) {
            return 'ChatRoom'
        },
    },

    Query: {
        async getChatsByChatRoomId(parent, args, context, info) {
            console.log(`query | getChatssByChatRoomId: args=${JSON.stringify(args)}`)
            let searchParam = { chatRoomId: args.chatRoomId }
            
            return await Chat.find(searchParam)
                .sort('-createdAt')
                .skip(args.skip)
                .limit(args.limit)
        },

        async getChatById(parent, args, context, info) {
            console.log(`query | getChatById: args=${JSON.stringify(args)}`)

            return await Chat.findById(args._id)
        },

        async searchChat(parent, args, context, info) {
            console.log(`query | searchChat: args=${JSON.stringify(args)}`)

            return await Chat.find({ $text: { $search: args.query } })
                .lean()
        },

        async getRecentChatByChatroom(parent, args, context, info) {
            console.log(`query | getRecentChatByChatroom: args=${JSON.stringify(args)}`)
            let user = await User.findOne({ uid: context.uid })
                .select('_id')
                .lean()
            return await getRecentChatByChatroom(user._id, args.skip, args.limit)
        },
    },

    Mutation: {
        async upsertChat(parent, args, context, info) {
            console.log(`mutation | upsertChat: args=${JSON.stringify(args)}`)

            let chat = null
            const isNewChat = !args.input._id

            if (!isNewChat) {
                chat = await Chat.findById(args.input._id)

            } else {
                chat = new Chat(args.input)
            }

            Object.assign(chat, args.input)

            let user = await User.findOne({ uid: context.uid }).lean()
            chat.author = user._id
            chat.content = args.input.content
            chat.chatRoomId = args.input.chatRoomId
            await chat.save()

            let chatRoom = await ChatRoom.findOne({ _id: args.input.chatRoomId }).lean()
            chatRoom.latestChat = args.input.content
            await chatRoom.save()
            
            return chat
        },

        async deleteChatById(parent, args, context, info) {
            console.log(`mutation | deleteChatById: args=${JSON.stringify(args)}`)

            await Chat.findByIdAndDelete(args._id)
            return {
                success: true
            }
        },
    },

    ChatRoom: {
        async chats(parent, args, context, info) {
            return await Chat.find({ chatRoomId: { $in: parent._id } })
                .limit(10)
                .lean()
        },
    },
};

async function getRecentChatByChatroom(userId, skip, limit) {
    let chatRoomIds = await ChatRoom.find({
        userId: userId,
        targetType: 'chatRoom',
        value: true
    })
        .select('chatRoomId')
        .distinct('chatRoomId')
        .lean()

    return await Chat.find({ chatRoomId: { $in: chatRoomIds } })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean()
}
const {
    User,
    Community,
    Subscribe,
    Agenda
} = require('../../model').schema;

module.exports = {
    Community: {
        async subscriptionCount(parent, args, context, info) {
            return await Subscribe.count({
                targetId: parent._id,
                value: true
            })
        }
    },
    Query: {
        async searchCommunities(parent, args, context, info) {
            if (!args.query) {
                return []
            }

            return await Community.find({ $text: { $search: args.query } })
        },
        async getAllCommunities(parent, args, context, info) {
            return await Community.find()
        },
        async getCommunityById(parent, args, context, info) {
            return await Community.findById(args._id)
        },
    },

    Mutation: {
        async upsertCommunity(parent, args, context, info) {
            console.log(`mutation | upsertCommunity: args=${JSON.stringify(args)}`)

            const user = await User.findOne({ uid: context.uid }).lean()

            let community = null
            const isNewCommunity = !args.input._id

            if (!isNewCommunity) {
                community = await Community.findById(args.input._id)
                if (!community.owners.includes(user._id)) {
                    return null
                }

            } else {
                community = new Community(args.input)
                community.owners = [user._id]
            }

            Object.assign(community, args.input)
            await community.save()

            if (isNewCommunity) {
                await Subscribe.create({
                    userId: user._id,
                    targetId: community._id,
                    targetType: 'community',
                    value: true
                })
            }

            return community
        },

        async registerNotice(parent, args, context, info) {
            console.log(`mutation | registerNotice: args=${JSON.stringify(args)}`)

            const agenda = await Agenda.findById(args.agendaId)
            if (!agenda) {
                return {
                    success: false,
                    reason: 'agendaNotFound'
                }
            }
            await Community.findOneAndUpdate(args.communityId, {
                $push: { notices: agendaId }
            })
            return {
                success: true
            }
        },

        async unregisterNotice(parent, args, context, info) {
            console.log(`mutation | deleteAgendaById: args=${JSON.stringify(args)}`)

            const agenda = await Agenda.findById(args.agendaId)
            if (!agenda) {
                return {
                    success: false,
                    reason: 'agendaNotFound'
                }
            }
            await Community.findOneAndUpdate(args.communityId, {
                $pull: { notices: agendaId }
            })
            return {
                success: true
            }
        }
    },

    Forum: {
        async agendas(parent, args, context, info) {
            return await Agenda.find({ targetId: { $in: parent._id } })
                .limit(10)
                .lean()
        },
    },
};
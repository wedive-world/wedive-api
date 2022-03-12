const {
    User,
    Agenda,
    AgendaType,
    Diving,
    DiveCenter,
    DivePoint,
    DiveSite,
    Subscribe
} = require('../../model').schema;

module.exports = {
    Agenda: {
        async agendaPlaces(parent, args, context, info) {
            let divings = await Diving.find({ _id: { $in: parent.agendaPlaces } })
            let diveCenters = await DiveCenter.find({ _id: { $in: parent.agendaPlaces } })
            let diveSites = await DiveSite.find({ _id: { $in: parent.agendaPlaces } })
            let divePoints = await DivePoint.find({ _id: { $in: parent.agendaPlaces } })

            return divings.concat(diveCenters)
                .concat(divePoints)
                .concat(diveSites)
        },
        async types(parent, args, context, info) {
            return await AgendaType.find({ _id: { $in: parent.types } })
        },
        async agendaParent(parent, args, context, info) {
            let forum = await Forum.findById(parent.agendaParent)
            if (forum) {
                return forum
            }

            return await Community.findById(parent.agendaParent)
        },
    },

    AgendaPlace: {
        async __resolveType(obj, context, info) {
            if (obj.hostUser) {
                return 'Diving'
            } else if (obj.diveSiteId) {
                return 'DivePoint'
            } else if (obj.webPageUrl || obj.email || obj.phoneNumber || obj.educationScore) {
                return 'DiveCenter'
            } else {
                return 'DiveSite'
            }
        },
    },

    AgendaParent: {
        async __resolveType(obj, context, info) {
            if (obj.owners) {
                return 'Community'
            } else {
                return 'Forum'
            }
        },
    },

    Query: {
        async getAgendasByTargetId(parent, args, context, info) {
            console.log(`query | getAgendasByTargetId: args=${JSON.stringify(args)}`)

            return await Agenda.find({ targetId: args.targetId })
                .sort('-createdAt')
                .skip(args.skip)
                .limit(args.limit)
        },

        async getAllAgendaTypes(parent, args, context, info) {
            console.log(`query | getAllAgendaTypes: args=${JSON.stringify(args)}`)

            return await AgendaType.find()
        },

        async getAgendaById(parent, args, context, info) {
            console.log(`query | getAgendaById: args=${JSON.stringify(args)}`)

            return await Agenda.findById(args._id)
        },

        async searchAgenda(parent, args, context, info) {
            console.log(`query | searchAgenda: args=${JSON.stringify(args)}`)

            return await DiveSite.find({ $text: { $search: args.query } })
                .lean()
        },

        async getRecentAgendaBySubscribedCommunity(parent, args, context, info) {
            console.log(`query | getRecentAgendaBySubscribedCommunity: args=${JSON.stringify(args)}`)
            let user = await User.findOne({ uid: context.uid })
                .select('_id')
                .lean()
            return await getRecentAgendaBySubscribedCommunity(user._id, args.skip, args.limit)
        },
    },

    Mutation: {
        async upsertAgenda(parent, args, context, info) {
            console.log(`mutation | upsertAgenda: args=${JSON.stringify(args)}`)

            let agenda = null
            const isNewAgenda = !args.input._id

            if (!isNewAgenda) {
                agenda = await Agenda.findById(args.input._id)

            } else {
                agenda = new Agenda(args.input)
            }

            Object.assign(agenda, args.input)

            let user = await User.findOne({ uid: context.uid }).lean()
            agenda.author = user._id

            await agenda.save()
            return agenda
        },

        async deleteAgendaById(parent, args, context, info) {
            console.log(`mutation | deleteAgendaById: args=${JSON.stringify(args)}`)

            await Agenda.findByIdAndDelete(args._id)
            return {
                success: true
            }
        },

        async upsertAgendaType(parent, args, context, info) {
            console.log(`mutation | upsertAgendaType: args=${JSON.stringify(args)}`)

            let agendaType = null
            const isNewAgendaType = !args.input._id

            if (!isNewAgendaType) {
                agendaType = await AgendaType.findById(args.input._id)

            } else {
                agendaType = new AgendaType(args.input)
            }

            Object.assign(agendaType, args.input)
            await agendaType.save()

            return agendaType
        },

        async deleteAgendaTypeById(parent, args, context, info) {
            console.log(`mutation | deleteAgendaTypeById: args=${JSON.stringify(args)}`)

            await AgendaType.findByIdAndDelete(args._id)
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

async function getRecentAgendaBySubscribedCommunity(userId, skip, limit) {
    let subscribeIds = await Subscribe.find({
        userId: userId,
        targetType: 'community',
        value: true
    })
        .select('targetId')
        .distinct('targetId')
        .lean()

    return await Agenda.find({ targetId: { $in: subscribeIds } })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean()
}
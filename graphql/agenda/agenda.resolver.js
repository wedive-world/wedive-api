const {
    User,
    Agenda,
    AgendaType
} = require('../../model').schema;

module.exports = {

    Query: {
        async getAgendasByTargetId(parent, args, context, info) {
            console.log(`query | getAgendasByTargetId: args=${JSON.stringify(args)}`)

            return await Agenda.find({ targetId: args.targetId })
                .skip(args.skip)
                .limit(args.limit)
        },

        async getAllAgendaTypes(parent, args, context, info) {
            console.log(`query | getAllAgendaTypes: args=${JSON.stringify(args)}`)

            return await Agenda.find()
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
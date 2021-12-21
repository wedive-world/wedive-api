const {
    Diving,
    User
} = require('../../model').schema;

const translator = require('../common/util/translator')

module.exports = {

    Query: {
        async getAllDivings(parent, args, context, info) {

            return await Diving.find()
                .lean()
        },

        async getDivingById(parent, args, context, info) {
            return await Diving.findOne({ _id: args._id })
                .lean()
        },

        async getDivingsByHostUserId(parent, args, context, info) {
            return await Diving.find({ hostUser: args.hostUserId })
                .lean()
        },
    },

    Mutation: {
        async upsertDiving(parent, args, context, info) {
            console.log(`mutation | upsertDiving: args=${JSON.stringify(args)}`)
            //TODO check host user

            let diving = null

            if (!args.input._id) {
                diving = new Diving(args.input)

            } else {
                diving = await Diving.findOne({ _id: args.input._id })

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof diving[key] == typeof args.input[key])
                    .forEach(key => { diving[key] = args.input[key] })

                diving.updatedAt = Date.now()
            }

            await diving.save()

            return diving
        },

        async deleteDivingById(parent, args, context, info) {
            let result = await Diving.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDivingById: result=${JSON.stringify(result)}`)
            return args._id
        },

        async joinDiving(parent, args, context, info) {
            console.log(`mutation | joinDiving: args=${JSON.stringify(args)}`)

            let diving = await Diving.findOne({ _id: args.input._id })
                .populate('participants.user')

            if (diving.status != 'searchable') {
                return {
                    success: false,
                    reason: 'publicEnded'
                }
            }

            let userUid = context.uid

            let userExist = diving.participants
                .filter(participant => participant.user)
                .map(participant => participant.user)
                .find(user => user.uid == userUid)

            if (userExist) {
                return {
                    success: false,
                    reason: 'alreadyApplied'
                }
            }

            let user = await User.findOne({ uid: uid })
                .lean()

            if (diving.hostUser == user._id) {
                return {
                    success: false,
                    reason: 'hostCannotApply'
                }
            }

            diving.push({
                user: user._id,
                status: applied,
                name: user.nickName,
                birth: user.birth,
                gender: user.gender
            })

            await diving.save()

            return {
                success: true
            }
        },

        async acceptParticipant(parent, args, context, info) {
            let diving = await Diving.findOne({ _id: args.input._id })

        },
    }
};
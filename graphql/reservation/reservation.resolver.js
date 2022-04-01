const {
    Reservation,
    Review,
    User
} = require('../../model').schema;

const Mongoose = require('mongoose');
const WEDIVES_ID = Mongoose.Types.ObjectId('61c90d4d63207bf94901c3fa')

module.exports = {

    Query: {
        async getReservationsByCurrentUser(parent, args, context, info) {
            console.log(`query | getReservationsByCurrentUser: context=${JSON.stringify(context)}`)

            let user = await User.findOne({ uid: context.uid })
                .select('_id')
                .lean()

            return await Reservation.find({ user: user._id })
                .skip(args.skip)
                .limit(args.limit)
                .lean()
        },

        async getOpenedReservation(parent, args, context, info) {
            console.log(`query | getOpenedReservation: args=${JSON.stringify(args)}`)

            return await Reservation.find({ adminStatus: { $ne: 'closed' } })
                .sort('createdAt')
                .skip(args.skip)
                .limit(args.limit)
                .lean()
        },
    },

    Mutation: {
        async upsertReservation(parent, args, context, info) {
            console.log(`mutation | upsertReservation: args=${JSON.stringify(args)}`)

            let reservation = null
            const isNewReservation = !args.input._id

            if (!isNewReservation) {
                reservation = await Reservation.findById(args.input._id)

            } else {
                reservation = new Reservation(args.input)
            }

            Object.assign(reservation, args.input)

            let user = await User.findOne({ uid: context.uid }).lean()
            reservation.user = user._id
            await reservation.save()

            if (!isNewReservation) {
                await Review.create({
                    title: '예약 변경',
                    content: `예약이 변경되었습니다.`,
                    author: WEDIVES_ID,
                    targetType: 'reservation',
                    targetId: args._id
                })
            }

            return reservation
        },

        async acceptReservationById(parent, args, context, info) {
            console.log(`mutation | acceptReservationById: args=${JSON.stringify(args)}`)
            const reservation = await Reservation.findById(args._id)
                .lean()

            const status = reservation.status

            if (status != 'requested' && status != 'cancelRequested') {
                return {
                    success: false,
                    reason: `Unknown stats, ${status}`
                }
            }

            const nextStatus = status == 'requested'
                ? 'accepted'
                : 'cancelAccepted'

            const currentUser = await User.findOne({ uid: context.uid })
                .select('_id')
                .leam()

            await Reservation.findByIdAndUpdate(args._id, {
                status: nextStatus,
                adminStatus: 'assigned',
                admin: currentUser._id,
                updatedAt: new Date()
            })

            return {
                success: true
            }
        },

        async completeReservationById(parent, args, context, info) {
            console.log(`mutation | completeReservationById: args=${JSON.stringify(args)}`)
            const reservation = await Reservation.findById(args._id)
                .lean()

            const status = reservation.status

            if (status != 'accepted' && status != 'cancelAccepted') {
                return {
                    success: false,
                    reason: `Unknown stats, ${status}`
                }
            }
            
            const nextStatus = status == 'accepted'
                ? 'complete'
                : 'canceled'

            const currentUser = await User.findOne({ uid: context.uid })
                .select('_id')
                .leam()

            await Reservation.findByIdAndUpdate(args._id, {
                status: nextStatus,
                adminStatus: 'closed',
                admin: currentUser._id,
                updatedAt: new Date()
            })

            await Review.create({
                title: '예약 완료',
                content: '예약이 완료되었습니다.\n즐거운 다이빙되세요 :)',
                author: WEDIVES_ID,
                targetType: 'reservation',
                targetId: args._id
            })

            return {
                success: true
            }
        },
        async rejectReservationById(parent, args, context, info) {
            console.log(`mutation | rejectReservationById: args=${JSON.stringify(args)}`)
            const reservation = await Reservation.findById(args._id)
                .lean()

            const nextStatus = 'rejected'

            const currentUser = await User.findOne({ uid: context.uid })
                .select('_id')
                .leam()

            await Reservation.findByIdAndUpdate(args._id, {
                status: nextStatus,
                adminStatus: 'closed',
                admin: currentUser._id,
                updatedAt: new Date()
            })

            await Review.create({
                title: '예약 불가',
                content: `예약이 실패하였습니다.\n사유:${args.reason}`,
                author: WEDIVES_ID,
                targetType: 'reservation',
                targetId: args._id
            })

            return {
                success: true
            }
        },
    },

};
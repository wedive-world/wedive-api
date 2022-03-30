const {
    Reservation,
} = require('../../model').schema;

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
                .sort('+createdAt')
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
            reservation.author = user._id

            await reservation.save()

            if (isNewReservation) {
                await getModel(reservation.targetType).findOneAndUpdate(
                    { _id: args.targetId },
                    { $inc: { 'reservationCount': 1 } }
                )
                await createHistoryFromReservation(reservation._id)
            }

            return reservation
        },

        async assignReservationById(parent, args, context, info) {
            console.log(`mutation | deleteReservationById: args=${JSON.stringify(args)}`)
            const reservation = await Reservation.findById(args._id)
                .lean()

            await Reservation.findByIdAndDelete(args._id)

            await getModel(reservation.targetType).findOneAndUpdate(
                { _id: args.targetId },
                { $inc: { 'reservationCount': -1 } }
            )
            return {
                success: true
            }
        },
        async completeReservationById(parent, args, context, info) {
            console.log(`mutation | deleteReservationById: args=${JSON.stringify(args)}`)
            const reservation = await Reservation.findById(args._id)
                .lean()

            await Reservation.findByIdAndDelete(args._id)

            await getModel(reservation.targetType).findOneAndUpdate(
                { _id: args.targetId },
                { $inc: { 'reservationCount': -1 } }
            )
            return {
                success: true
            }
        },
        async rejectReservationById(parent, args, context, info) {
            console.log(`mutation | deleteReservationById: args=${JSON.stringify(args)}`)
            const reservation = await Reservation.findById(args._id)
                .lean()

            await Reservation.findByIdAndDelete(args._id)

            await getModel(reservation.targetType).findOneAndUpdate(
                { _id: args.targetId },
                { $inc: { 'reservationCount': -1 } }
            )
            return {
                success: true
            }
        },
    },

};
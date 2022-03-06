const {
    Diving,
    DivePoint,
    DiveSite,
    DiveCenter,
    Image,
    User,
    Review,
    Like,
    Dislike,
    Subscribe,
    View,
    Community
} = require('../../model').schema;

module.exports = {

    //TODO refactor relocate into different resolver
    UserReaction: {
        async diveCenters(parent, args, context, info) {
            return await DiveCenter.find({ _id: { $in: parent.targetIds } }).lean()
        },
        async divePoints(parent, args, context, info) {
            return await DivePoint.find({ _id: { $in: parent.targetIds } }).lean()
        },
        async diveSites(parent, args, context, info) {
            return await DiveSite.find({ _id: { $in: parent.targetIds } }).lean()
        },
        async divings(parent, args, context, info) {
            return await Diving.find({ _id: { $in: parent.targetIds } }).lean()
        },
        async images(parent, args, context, info) {
            return await Image.find({ _id: { $in: parent.targetIds } }).lean()
        },
        async users(parent, args, context, info) {
            return await User.find({ _id: { $in: parent.targetIds } }).lean()
        },
        async communities(parent, args, context, info) {
            return await Community.find({ _id: { $in: parent.targetIds } }).lean()
        },
    },

    DiveCenter: {
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },
    DivePoint: {
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },
    DiveSite: {
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },
    Diving: {
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },
    Image: {
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },
    User: {
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },

    Agenda: {
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },

    Query: {
        async getUserLikes(parent, args, context, info) {
            let user = await User.findOne({ uid: context.uid })
            return await Like.find({ userId: user._id, value: true }).lean()
        },

        async getUserDislikes(parent, args, context, info) {
            let user = await User.findOne({ uid: context.uid })
            return await Dislike.find({ userId: user._id }).lean()
        },

        async getUserSubsciption(parent, args, context, info) {
            let user = await User.findOne({ uid: context.uid })
            return {
                targetIds: await Subscribe.find({ userId: user._id, value: true })
                    .select('targetId')
                    .distinct('targetId')
                    .lean()
            }
        },
    },

    Mutation: {
        async view(parent, args, context, info) {
            console.log(`mutation | view: args=${JSON.stringify(args)} context=${JSON.stringify(context)}`)
            await getModel(args.targetType).findOneAndUpdate({ _id: args.targetId }, { $inc: { 'views': 1 } })

            let user = await User.findOne({ uid: context.uid })
                .select('_id')

            await View.create({
                userId: user._id,
                targetId: args.targetId,
                targetType: args.targetType
            })

            return true
        },

        async dislike(parent, args, context, info) {
            console.log(`mutation | dislike: args=${JSON.stringify(args)} context=${JSON.stringify(context)}`)

            let user = await User.findOne({ uid: context.uid })

            let result = await Dislike.findOneAndUpdate(
                {
                    userId: user._id,
                    targetId: args.targetId
                },
                [{ $set: { value: { $ne: [true, '$value'] } } }],
                {
                    upsert: true,
                    new: true
                }
            )

            console.log(`mutation | dislike: result=${JSON.stringify(result)}`)

            await getModel(args.targetType).findOneAndUpdate(
                { _id: args.targetId },
                { $inc: { 'dislikes': result.value ? 1 : -1 } }
            )
            return result.value
        },

        async like(parent, args, context, info) {
            console.log(`mutation | like: args=${JSON.stringify(args)} context=${JSON.stringify(context)}`)

            let user = await User.findOne({ uid: context.uid })
                .lean()

            if (!user) {
                return null
            }

            let result = await Like.findOneAndUpdate(
                {
                    userId: user._id,
                    targetId: args.targetId
                },
                [{ $set: { value: { $ne: [true, '$value'] } } }],
                {
                    upsert: true,
                    new: true
                }
            )

            console.log(`mutation | like: result=${JSON.stringify(result)}`)

            await getModel(args.targetType).findOneAndUpdate(
                { _id: args.targetId },
                { $inc: { 'likes': result.value ? 1 : -1 } }
            )
            return result.value
        },

        async subscribe(parent, args, context, info) {
            console.log(`mutation | subscribe: args=${JSON.stringify(args)} context=${JSON.stringify(context)}`)
            let user = await User.findOne({ uid: context.uid })

            if (!user) {
                return null
            }

            let result = await Subscribe.findOneAndUpdate(
                {
                    userId: user._id,
                    targetId: args.targetId
                },
                [{ $set: { value: { $ne: [true, '$value'] } } }],
                {
                    upsert: true,
                    new: true
                }
            )

            console.log(`mutation | subscribe: result=${JSON.stringify(result)}`)
            return result.value
        },
    }
};

async function isUserSubscribe(context, parent) {
    let user = await User.findOne({ uid: context.uid });

    if (user == null) {
        console.log(`user-reaction-resolver | isUserSubscribe: cannot find user, uid=${context.uid}`)
    }

    let subscribe = await Subscribe.findOne(
        {
            userId: user._id,
            targetId: parent._id
        }
    ).lean();

    return subscribe != null && subscribe.value
}

async function isUserLike(context, parent) {
    let user = await User.findOne({ uid: context.uid });

    if (!user) {
        console.log(`user-reaction-resolver | isUserLike: cannot find user, uid=${context.uid}`)
    }

    let like = await Like.findOne(
        {
            userId: user._id,
            targetId: parent._id
        }
    ).lean();

    return like && like.value
}

function getModel(targetType) {

    switch (targetType) {

        case 'diveCenter':
            return DiveCenter

        case 'divePoint':
            return DivePoint

        case 'diveSite':
            return DiveSite

        case 'diving':
            return Diving

        case 'image':
            return Image

        case 'user':
            return User

        case 'review':
            return Review

        case 'recommendation':
            return Review
    }
}
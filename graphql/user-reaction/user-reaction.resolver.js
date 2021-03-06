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
    Community,
    Agenda
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
        async views(parent, args, context, info) {
            return parent.views != null
                ? parent.views
                : 0
        },
        async likes(parent, args, context, info) {
            return parent.likes != null
                ? parent.likes
                : 0
        },
        async dislikes(parent, args, context, info) {
            return parent.dislikes != null
                ? parent.dislikes
                : 0
        },
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserDislike(parent, args, context, info) {
            return await isUserDislike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },

    DiveShop: {
        async views(parent, args, context, info) {
            return parent.views != null
                ? parent.views
                : 0
        },
        async likes(parent, args, context, info) {
            return parent.likes != null
                ? parent.likes
                : 0
        },
        async dislikes(parent, args, context, info) {
            return parent.dislikes != null
                ? parent.dislikes
                : 0
        },
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserDislike(parent, args, context, info) {
            return await isUserDislike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },

    DivePoint: {
        async views(parent, args, context, info) {
            return parent.views != null
                ? parent.views
                : 0
        },
        async likes(parent, args, context, info) {
            return parent.likes != null
                ? parent.likes
                : 0
        },
        async dislikes(parent, args, context, info) {
            return parent.dislikes != null
                ? parent.dislikes
                : 0
        },
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserDislike(parent, args, context, info) {
            return await isUserDislike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },
    DiveSite: {
        async views(parent, args, context, info) {
            return parent.views != null
                ? parent.views
                : 0
        },
        async likes(parent, args, context, info) {
            return parent.likes != null
                ? parent.likes
                : 0
        },
        async dislikes(parent, args, context, info) {
            return parent.dislikes != null
                ? parent.dislikes
                : 0
        },
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserDislike(parent, args, context, info) {
            return await isUserDislike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },
    Diving: {
        async views(parent, args, context, info) {
            return parent.views != null
                ? parent.views
                : 0
        },
        async likes(parent, args, context, info) {
            return parent.likes != null
                ? parent.likes
                : 0
        },
        async dislikes(parent, args, context, info) {
            return parent.dislikes != null
                ? parent.dislikes
                : 0
        },
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserDislike(parent, args, context, info) {
            return await isUserDislike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },
    Image: {
        async views(parent, args, context, info) {
            return parent.views != null
                ? parent.views
                : 0
        },
        async likes(parent, args, context, info) {
            return parent.likes != null
                ? parent.likes
                : 0
        },
        async dislikes(parent, args, context, info) {
            return parent.dislikes != null
                ? parent.dislikes
                : 0
        },
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserDislike(parent, args, context, info) {
            return await isUserDislike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },
    User: {
        async views(parent, args, context, info) {
            return parent.views != null
                ? parent.views
                : 0
        },
        async likes(parent, args, context, info) {
            return parent.likes != null
                ? parent.likes
                : 0
        },
        async dislikes(parent, args, context, info) {
            return parent.dislikes != null
                ? parent.dislikes
                : 0
        },
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserDislike(parent, args, context, info) {
            return await isUserDislike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },

    Agenda: {
        async views(parent, args, context, info) {
            return parent.views != null
                ? parent.views
                : 0
        },
        async likes(parent, args, context, info) {
            return parent.likes != null
                ? parent.likes
                : 0
        },
        async dislikes(parent, args, context, info) {
            return parent.dislikes != null
                ? parent.dislikes
                : 0
        },
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserDislike(parent, args, context, info) {
            return await isUserDislike(context, parent);
        },
        async isUserSubscribe(parent, args, context, info) {
            return await isUserSubscribe(context, parent);
        }
    },

    Review: {
        async views(parent, args, context, info) {
            return parent.views != null
                ? parent.views
                : 0
        },
        async likes(parent, args, context, info) {
            return parent.likes != null
                ? parent.likes
                : 0
        },
        async dislikes(parent, args, context, info) {
            return parent.dislikes != null
                ? parent.dislikes
                : 0
        },
        async isUserLike(parent, args, context, info) {
            return await isUserLike(context, parent);
        },
        async isUserDislike(parent, args, context, info) {
            return await isUserDislike(context, parent);
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
                return false
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
    if (!context.uid) {
        return false
    }

    let user = await User.findOne({ uid: context.uid });

    if (!user) {
        console.log(`user-reaction-resolver | isUserSubscribe: cannot find user, uid=${context.uid}`)
        return false
    }

    let subscribe = await Subscribe.findOne(
        {
            userId: user._id,
            targetId: parent._id
        }
    )
        .select('value')
        .lean()

    return subscribe != null && subscribe.value
}

async function isUserLike(context, parent) {
    if (!context.uid) {
        return false
    }

    let user = await User.findOne({ uid: context.uid });

    if (!user) {
        console.log(`user-reaction-resolver | isUserLike: cannot find user, uid=${context.uid}`)
        return false
    }

    let like = await Like.findOne(
        {
            userId: user._id,
            targetId: parent._id
        }
    )
        .select('value')
        .lean()

    return like != null && like.value
}

async function isUserDislike(context, parent) {
    if (!context.uid) {
        return false
    }

    let user = await User.findOne({ uid: context.uid });

    if (!user) {
        console.log(`user-reaction-resolver | isUserDislike: cannot find user, uid=${context.uid}`)
        return false
    }

    let dislike = await Dislike.findOne(
        {
            userId: user._id,
            targetId: parent._id
        }
    )
        .select('value')
        .lean()

    return dislike != null && dislike.value
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

        case 'agenda':
            return Agenda
    }
}
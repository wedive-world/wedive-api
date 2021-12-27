const {
    Diving,
    DivePoint,
    DiveSite,
    DiveCenter,
    Image,
    User,
    Review,
    Like,
    Subscribe
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

    Query: {
        async getUserLikes(parent, args, context, info) {
            let user = await User.findOne({ uid: context.uid })
            return await Like.findOne({ userId: user._id }).lean()
        },

        async getUserSubsciption(parent, args, context, info) {
            let user = await User.findOne({ uid: context.uid })
            return await Subscribe.findOne({ userId: user._id }).lean()
        },
    },

    Mutation: {
        async view(parent, args, context, info) {
            console.log(`mutation | view: args=${JSON.stringify(args)} context=${JSON.stringify(context)}`)
            await getModel(args.targetType).findOneAndUpdate({ _id: args.targetId }, { $inc: { 'views': 1 } })
            return true
        },

        async like(parent, args, context, info) {
            console.log(`mutation | like: args=${JSON.stringify(args)} context=${JSON.stringify(context)}`)

            let user = await User.findOne({ uid: context.uid })

            let like = await Like.findOne({ userId: user._id })
            if (like == null) {
                like = new Like({ userId: user._id })
            }

            if (!like.targetIds) {
                like.targetIds = []
            }

            let isLike = !like.targetIds.includes(args.targetId)
            let increament = isLike ? 1 : -1

            if (isLike) {
                like.targetIds.push(args.targetId)
            } else {
                let index = like.targetIds.indexOf(args.targetId)
                if (index > -1) {
                    like.targetIds.splice(index, 1)
                }
            }

            await like.save()
            await getModel(args.targetType).findOneAndUpdate({ _id: args.targetId }, { $inc: { 'likes': increament } })
            return isLike
        },

        async subscribe(parent, args, context, info) {
            console.log(`mutation | subscribe: args=${JSON.stringify(args)} context=${JSON.stringify(context)}`)
            let user = await User.findOne({ uid: context.uid })

            let subscribe = await Subscribe.findOne({ userId: user._id })
            if (subscribe == null) {
                subscribe = new Subscribe({ userId: user._id })
            }

            if (!subscribe.targetIds) {
                subscribe.targetIds = []
            }

            let isSubscribe = !subscribe.targetIds.includes(args.targetId)

            if (isSubscribe) {
                subscribe.targetIds.push(args.targetId)
            } else {
                let index = subscribe.targetIds.indexOf(args.targetId)
                if (index > -1) {
                    subscribe.targetIds.splice(index, 1)
                }
            }

            await subscribe.save()
            return isSubscribe
        },
    }
};

async function isUserSubscribe(context, parent) {
    let user = await User.findOne({ uid: context.uid });
    let subscribe = await Subscribe.find({ userId: user._id, targetIds: parent._id });

    return subscribe != null;
}

async function isUserLike(context, parent) {
    let user = await User.findOne({ uid: context.uid });
    let like = await Like.find({ userId: user._id, targetIds: parent._id });

    return like != null;
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
    }
}
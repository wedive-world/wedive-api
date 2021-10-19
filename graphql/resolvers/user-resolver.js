const schema = require('../../model')

const User = schema.User
const Instructor = require('../../model/instructor');
const Image = require('../../model/image');

module.exports = {

    User: {
        async instructor(parent, args, context, info) {
            return await Instructor.find({ _id: args.instructor });
        },

        async profileImages(parent, args, context, info) {
            return await Image.find({ _id: args.profileImage });
        },
    },

    Query: {
        async getAllUsers(parent, args, context, info) {
            return await User.find()
        },

        async getUserById(parent, args, context, info) {
            return await User.findOne({ _id: args._id });
        },

        async getUserByEmail(parent, args, context, info) {
            return await User.findOne({ email: args.email })
        }
    },

    Mutation: {
        async upsertUser(parent, args, context, info) {

            console.log(`mutation | user: args=${JSON.stringify(args)}`)

            let user = null

            if (!args.input._id) {
                user = new User(args.input)

            } else {
                user = await User.findOne({ _id: args.input._id })
                    .lean()

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof key == typeof args.input[key])
                    .forEach(key => { user[key] = args.input[key] })

                user.updatedAt = Date.now()
            }

            await user.save()
            return user
        },
    },
};
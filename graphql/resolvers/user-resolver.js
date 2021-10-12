const schema = require('../../model')

const User = schema.User
const Instructor = require('../../model/instructor');
const Image = require('../../model/image');

module.exports = {

    User: {
        instructor(parent, args, context, info) {
            return Instructor.find({ _id: _.instructor });
        },

        profileImages(parent, args, context, info) {
            return Image.find({ _id: _.profileImage });
        },
    },

    Query: {
        getAllUsers() {
            return User.find()
        },
        getUserById(id) {
            return User.find({ _id: id });
        },
    },

    Mutation: {
        async upsertUser(parent, args, context, info) {
            return await new User(args).save()
        },
    },
};
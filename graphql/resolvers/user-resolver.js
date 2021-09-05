
const User = require('../../model/user');
const Instructor = require('../../model/instructor');
const Image = require('../../model/image');

module.exports = {
    Query: {
        getUserById(id) {
            return User.find({ _id: id });
        },
    },

    Mutation: {
        createUser(_, args) {
            const user = new User({
                ...args,
            });
            return user.save();
        },
    },

    User: {
        Instructor(_, args) {
            return Instructor.find({ _id: _.instructor });
        },
        
        Image(_, args) {
            return Image.find({ _id: _.profileImage });
        },
    },
};
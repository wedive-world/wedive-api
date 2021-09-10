const User = require('../../model/user');
const Instructor = require('../../model/instructor');
const Image = require('../../model/image');

module.exports = {

    User: {
        instructor(_, args) {
            return Instructor.find({ _id: _.instructor });
        },

        profileImage(_, args) {
            return Image.find({ _id: _.profileImage });
        },
    },
    
    Query: {
        users() {
            return User.find()
        },
        getUserById(id) {
            return User.find({ _id: id });
        },
    },

    Mutation: {
        createUser(_, args) {
            const user = new User({
                ...args,
            })
            return user.save()
        },
    },
};
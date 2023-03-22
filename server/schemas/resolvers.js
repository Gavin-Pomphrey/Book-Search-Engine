const {AuthenticationError} = require('apollo-server-express');
const {User, Book} = require('../models');
const {signToken} = require('../utils/auth');

// This is the resolver function that we'll use to create the user
const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                // If the user is logged in, return the user's data
                const userData = await User.findOne({_id: context.user._id})
                    .select('-__v -password')
                    .populate('savedBooks')
                return userData;
            }
            // If the user is not logged in, return an error
            throw new AuthenticationError('Not logged in');
        },
    },

    // This is the resolver function that we'll use to create the user
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user};
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);
            return {token, user};
        },
        // This is the resolver function that we'll use to save a book
        saveBook: async (parent, {bookData}, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {savedBooks: bookData}},
                    {new: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        // This is the resolver function that we'll use to remove a book
        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId: bookId}}},
                    {new: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }
};

module.exports = resolvers;




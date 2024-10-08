const { User } = require('../models');
const {signToken, AuthenticationError} = require('../utils/auth')

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      const data = await User.findOne({ _id: context.user._id });
      return data;
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      console.log('hit', username, email, password);
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, {bookData},context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id:context.user._id },
        { $addToSet: { savedBooks: bookData } },
        { new: true, runValidators: true }
      );
      return updatedUser
    },
    removeBook: async (parent, {bookId},context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id:context.user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
  return updatedUser
    }
  },
};

module.exports = resolvers;

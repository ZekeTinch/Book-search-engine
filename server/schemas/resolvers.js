const { User, Book} = require('../models');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      const data = await User.find({ _id: context.user._id });
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
    saveBook: async (parent, {bookData}) => {
      const {updateBook} = await Book.find({update});

      await Book.findOneAndUpdate(
        {Book: bookData},
        { $addToSet: {BookId: updateBook}}
      );
    },
    removeBook: async (parent, {bookId}) => {
      return Book.findOneAndDelete({_id: bookId})
    }
  },
};

module.exports = resolvers;

const { gql } = require('apollo-server-express');

// This is the typeDefs that we'll use to create the user
const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: ID
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookData: BookInput!): User
        removeBook(bookId: ID!): User
    }

    input BookInput {
        bookId: ID
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
    `;

module.exports = typeDefs;
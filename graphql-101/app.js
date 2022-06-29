const express = require("express");
const app = express();
const PORT = 5000;

// GraphQL API
const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require("graphql");


// GraphQL Schema
// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: "Hello",
//     fields: () => ({
//       message: {
//         type: GraphQLString,
//         resolve: () => "Hello there..."
//       }
//     })
//   })
// });

// Dummy data
const authors = [
  { id: 1, name: 'J. K. Rowling' },
  { id: 2, name: 'J. R. R. Tolkien' },
  { id: 3, name: 'Brent Weeks' }
];

const books = [
  { id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
  { id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
  { id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
  { id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
  { id: 5, name: 'The Two Towers', authorId: 2 },
  { id: 6, name: 'The Return of the King', authorId: 2 },
  { id: 7, name: 'The Way of Shadows', authorId: 3 },
  { id: 8, name: 'Beyond the Shadows', authorId: 3 }
];

// Book type
const BookType = new GraphQLObjectType({
  name: "Book",
  description: "Represent a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    authors: {
      // NOTE: A book is written by one author hence AuthorType (not GraphQLList)
      type: AuthorType,
      description: "Get authors of a book",
      resolve: (book) => {
        return authors.find(author => author.id === book.authorId)
      }
    }
  })
});

// Author Type
const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "Get author details",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      // NOTE: An author can have multiple books hence GraphQLList
      type: new GraphQLList(BookType),
      description: "Get books of an author",
      // Can use "parent" instead of "author" as argument
      resolve: (author) => {
        return books.filter(book => book.authorId === author.id)
      }
    }
  })
});

// IMP: Root query
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    /* Get single book */
    book: {
      type: BookType,
      description: "Get a book",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    /* Get list of books and map author */
    books: {
      type: new GraphQLList(BookType),
      description: "List of books",
      resolve: () => books
    },
    /* Get an author */
    author: {
      type: AuthorType,
      description: "Get an author",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    },
    /* Get list of authors and map books */
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of authors",
      resolve: () => authors
    }
  })
});

// IMP: Mutation query
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    /* Add a book */
    addBook: {
      type: BookType,
      description: "Add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
        books.push(book)
        return book
      }
    },
    /* Add an author */
    addAuthor: {
      type: AuthorType,
      description: "Add an author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name }
        authors.push(author)
        return author
      }
    }
  })
});

// Schema
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

// GraphQL endpoint
app.use("/graphql", expressGraphQL({
  schema: schema,
  // Gives UI to access graphql instead of using POSTMAN
  graphiql: true,
}));

// Express server
app.listen(PORT, () => {
  console.log("Server listening on PORT:", PORT);
});
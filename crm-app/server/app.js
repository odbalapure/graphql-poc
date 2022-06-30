const express = require("express");
require("colors");
require("dotenv").config();
const app = express();

const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const connectDb = require("./config/db");

// Connect to the db
connectDb();

const PORT = process.env.PORT || 5000;

app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: process.env.NODE_ENV === 'dev'
}));

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
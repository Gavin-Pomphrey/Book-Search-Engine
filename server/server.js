const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const path = require('path');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;
// construct ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// integrate ApolloServer with Express application as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// set up routes for client-side
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

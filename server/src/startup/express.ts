import express from 'express';

import server from '../graphql/server';

const app = express();

server.applyMiddleware({ app, path: '/' });

app.listen({ port: process.env.PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`),
);

import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import context from './context';
import dataSources from '../datasources';

const config = {
  schema,
  dataSources,
  context,
  tracing: true,
  introspection: process.env.ENV_NAME !== 'production',
  playground: process.env.ENV_NAME !== 'production',
};

const server = new ApolloServer(config);

export default server;

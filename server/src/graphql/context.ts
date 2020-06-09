import { DataSourceConfig } from 'apollo-datasource';
import { PrismaClient, User } from '@prisma/client';
import { IncomingMessage } from 'http';

import prisma from '../prisma-client';
import { ApolloDataSources } from '../datasources';
import { UsersAPI } from '../datasources/users';

export interface InitialContext {
  prisma: PrismaClient;
  user: User | null;
}

export interface Context extends InitialContext {
  dataSources: ApolloDataSources;
}

export default async ({ req, connection }: { req: IncomingMessage; connection: any }): Promise<InitialContext> => {
  const context: InitialContext = {
    prisma,
    user: null,
  };

  const usersAPI = new UsersAPI();
  usersAPI.initialize({ context } as DataSourceConfig<Context>);

  const authorization = req ? req?.headers?.authorization : connection?.context?.authorization;
  if (authorization) {
    context.user = await usersAPI.findUserByToken(authorization);
  }

  return context;
};

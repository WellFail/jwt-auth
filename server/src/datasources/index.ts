import { DataSources } from 'apollo-server-core/dist/graphqlOptions';

import { UsersAPI } from './users';

const getDataSources = () => ({
  usersAPI: new UsersAPI(),

});

export interface ApolloDataSources extends DataSources<any> {
  usersAPI: UsersAPI;
}

export default getDataSources;

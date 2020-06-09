import { extendType, inputObjectType, arg } from '@nexus/schema';

export const UserMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('signUp', {
      type: 'AuthPayload',
      args: { data: arg({ type: SignUpInput, required: true }) },
      resolve: (_, { data }, { dataSources }) => dataSources.usersAPI.createUser(data),
    });
    t.field('signIn', {
      type: 'AuthPayload',
      args: { data: arg({ type: SignInInput, required: true }) },
      resolve: (_, { data }, { dataSources }) => dataSources.usersAPI.signIn(data),
    });
  },
});

export const SignUpInput = inputObjectType({
  name: 'SignUpInput',
  definition(t) {
    t.string('email', { required: true });
    t.string('password', { required: true });
  },
});

export const SignInInput = inputObjectType({
  name: 'SignInInput',
  definition(t) {
    t.string('email', { required: true });
    t.string('password', { required: true });
  },
});


import { objectType, enumType } from '@nexus/schema';

export * from './query';
export * from './mutation';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.email();
  },
});

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token');
    t.field('user', { type: 'User' });
  },
});

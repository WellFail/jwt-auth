import { DataSourceConfig } from 'apollo-datasource';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserInputError, ForbiddenError } from 'apollo-server-express';
import { PrismaClient, User } from '@prisma/client';

import { Context } from '../graphql/context';
import { createToken } from '../integrations/jwt';

export class UsersAPI {
  private readonly jwtSecret = process.env.JWT_SECRET || 'secret';
  private prisma!: PrismaClient;
  private context!: Context;

  public initialize(config: DataSourceConfig<Context>) {
    this.context = config.context;
    this.prisma = config.context.prisma;
  }

  public async findUserByToken(authorization: string): Promise<User | null> {
    if (!authorization) return null;

    try {
      const token: any = jwt.verify(authorization.replace('Bearer ', ''), this.jwtSecret);
      const user = token?.sub && await this.prisma.user.findOne({ where: { id: token.sub } });
      if (user) delete user.password;

      return user;
    } catch (err) {
      return null;
    }
  }

  public async createUser({ email, password }: CreateUserArgs): Promise<CreateUser> {
    const existingUser = await this.prisma.user.findOne({ where: { email } });
    if (existingUser) throw new UserInputError('This email is already exist');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = createToken(user);

    return { token, user };
  }

  async signIn({ email, password }: SignInUserArgs): Promise<SignInUser> {
    const user = await this.prisma.user.findOne({ where: { email } });
    if (!user || !user.password) throw new ForbiddenError('Incorrect email or password');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new ForbiddenError('Incorrect email or password');

    const token = createToken(user);

    return { token, user };
  }

}

interface CreateUser {
  token: string;
  user: User;
}

interface CreateUserArgs {
  email: string;
  password: string;
}

interface SignInUser {
  token: string;
  user: User;
}

interface SignInUserArgs {
  email: string;
  password: string;
}


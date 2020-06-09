import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import server from '../graphql/server';
import prisma from '../prisma-client';
import { createToken, createRefreshToken } from '../integrations/jwt';

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true } ));
app.use(cookieParser());

app.post("/refresh_token", async (req, res) => {
  const token = req.cookies.jid;
  if (!token) return res.send({ ok: false, accessToken: '' });

  let payload: any = null;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: '' });
  }

  const user = await prisma.user.findOne({ where: { id: payload.userId } });
  if (!user) return res.send({ ok: false, accessToken: '' });
  if (user.tokenVersion !== payload.tokenVersion) return res.send({ ok: false, accessToken: '' });

  res.cookie("jid", createRefreshToken(user), { httpOnly: true, path: '/refresh_token' });

  return res.send({ ok: true, accessToken: createToken(user) });
});

server.applyMiddleware({ app, path: '/', cors: false });

app.listen({ port: process.env.PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`),
);

import Bcryptjs from "bcryptjs";
import Users from "../models/users";
import Token from "../config/jwt";
import Jwt from "jsonwebtoken";
import {generateId,EntityType} from "../schemas/generate-ids"
import { UserInputError } from 'apollo-server-errors';

export const resolvers = {
  Query: {
    hello: (): String => {
      return "WEW";
    },
  },
  Mutation: {
    signUp: async (_: never, { input }) => {
      const { emailAddress, firstname, lastname, password } = input;
      const id = generateId(EntityType.Account);

      const user = new Users({
        id,
        emailAddress,
        firstname,
        lastname,
        password: await Bcryptjs.hash(password, 10),
      });

      const userExists = await Users.exists({ emailAddress });
      if (userExists) {
        throw new UserInputError('Email address already used.');
      }

      const postUser = await Users.create(user);

      if (postUser) {
          const timeInMilliseconds = new Date().getTime();
          const expirationTime =
            timeInMilliseconds + Number(Token.expireTime) * 10_000;
          const expireTimeInSeconds = Math.floor(expirationTime / 1_000);

          const token = await Jwt.sign(
            {
                id:postUser._id
            },
            Token.secret,
            {
              issuer: Token.issUser,
              algorithm: "HS256",
              expiresIn: expireTimeInSeconds,
            }
          );

          return { token };
      } else {
        throw new UserInputError("Error in posting User");
      }
    },
  },
};

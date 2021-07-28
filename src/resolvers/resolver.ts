import Bcryptjs from "bcryptjs";
import Users from "../models/users";
import Products from "../models/products";
import Token from "../config/jwt";
import Jwt from "jsonwebtoken";
import { generateId, EntityType } from "../schemas/generate-ids";
import { UserInputError } from "apollo-server-errors";
import { EmailAddressResolver } from "graphql-scalars";
import BinaryResolver from "../schemas/scalars/binary";

export const resolvers = {
  Query: {
    hello: (): String => {
      return "WEW";
    },
  },
  Product: {
    owner: async (root, _params, _context) => {
      return Users.findOne({ _id: root.ownerId });
    },
  },

  Mutation: {
    signUp: async (_: never, { input }) => {
      const { emailAddress, firstname, lastname, password } = input;
      const id = generateId(EntityType.Account);

      const userExists = await Users.exists({ emailAddress });
      if (userExists) {
        throw new UserInputError("Email address already used.");
      }

      const postUser = await Users.create({
        id,
        emailAddress,
        firstname,
        lastname,
        password: await Bcryptjs.hash(password, 10),
      });

      const timeInMilliseconds = new Date().getTime();
      const expirationTime =
        timeInMilliseconds + Number(Token.expireTime) * 10_000;
      const expireTimeInSeconds = Math.floor(expirationTime / 1_000);

      const token = await Jwt.sign(
        {
          id: postUser._id,
        },
        Token.secret,
        {
          issuer: Token.issUser,
          algorithm: "HS256",
          expiresIn: expireTimeInSeconds,
        }
      );

      return { token };
    },

    authenticate: async (_: never, { input }) => {
      const { emailAddress, password } = input;

      const foundUser = await Users.findOne({ emailAddress });
      if (!foundUser) {
        throw new UserInputError("User not registerd");
      }

      const passwordIsValid = await Bcryptjs.compare(
        password,
        foundUser.password
      );

      if (passwordIsValid) {
        const timeInMilliseconds = new Date().getTime();
        const expirationTime =
          timeInMilliseconds + Number(Token.expireTime) * 10_000;
        const expireTimeInSeconds = Math.floor(expirationTime / 1_000);

        const token = await Jwt.sign(
          {
            id: foundUser._id,
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
        throw new UserInputError("Unauthorized");
      }
    },

    createProduct: async (_: never, { input }, ctx) => {
      const { name, description } = input;
      const ownerId = ctx.user.id;

      const id = generateId(EntityType.Product);

      const createdAt = new Date();
      const cursor = Buffer.concat([
        Buffer.from(`${createdAt.getTime()}`),
        Buffer.from(id),
      ]);

      return await Products.create({
        id,
        name,
        description,
        ownerId,
        cursor,
      });
    },
  },

  EmailAddress: EmailAddressResolver,
  Binary: BinaryResolver,
};

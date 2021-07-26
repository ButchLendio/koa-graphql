import Bcryptjs from "bcryptjs";
import Users from "../models/users";
import Token from "../config/jwt";
import Jwt from "jsonwebtoken";
import {generateId} from "../schemas/generate-ids"

export const resolvers = {
  Query: {
    hello: (): String => {
      return "WEW";
    },
  },
  Mutation: {
    signUp: async (_: never, { input }) => {
      const { emailAddress, firstname, lastname, password } = input;

      const user = new Users({
        id: await generateId(0),
        emailAddress,
        firstname,
        lastname,
        password: await Bcryptjs.hash(password, 10),
      });

      const userExists = await Users.exists({ emailAddress });
      if (userExists) {
        throw new Error("email already exist");
      }

      const postUser = await Users.create(user);

      if (postUser) {
          const id=postUser._id
        const passwordIsValid = await Bcryptjs.compare(password, postUser.password);

        if (passwordIsValid) {
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
          throw new Error("Error");
        }
      } else {
        throw new Error("Error in posting User");
      }
    },
  },
};

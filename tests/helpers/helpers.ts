import Request from "supertest";
import { internet, name, commerce } from "faker";
import { startServer } from "../../src/index";
import Token from "../../src/config/jwt";
import Users from "../../src/models/users";
import Products from "../../src/models/products";
import { generateId, EntityType } from "../../src/schemas/generate-ids";
import R from "ramda";
import Jwt from "jsonwebtoken";

export function generateFakeUser() {
  return {
    emailAddress: internet.email(),
    firstname: name.firstName(),
    lastname: name.lastName(),
    password: internet.password(),
  };
}

export function generateFakeProduct() {
  return {
    name: commerce.product(),
    description: `This is ${commerce.product()}`,
  };
}

export async function getToken(fakeUser: {
  emailAddress: string;
  password: string;
}) {
  const foundUser = await Users.findOne({
    emailAddress: fakeUser.emailAddress,
  });

  const timeInMilliseconds = new Date().getTime();
  const expirationTime = timeInMilliseconds + Number(Token.expireTime) * 10_000;
  const expireTimeInSeconds = Math.floor(expirationTime / 1_000);

  const token = await Jwt.sign(
    {
      id: foundUser?.id,
    },
    Token.secret,
    {
      issuer: Token.issUser,
      algorithm: "HS256",
      expiresIn: expireTimeInSeconds,
    }
  );

  return token ;
}

export async function addFakeProduct(body: Object) {
  const generateProduct = generateFakeProduct();
  const id = body;
  const cursor = Buffer.concat([
    Buffer.from(generateProduct.name),
    Buffer.from(id),
  ]);
  const product = { ...generateProduct, id, cursor, ownerId: id };
  return Products.create(product);
}

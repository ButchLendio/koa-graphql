import Request from "supertest";
import { internet, name, commerce } from "faker";
import { startServer } from "../../src/index";
import Users from "../../src/models/users";
import Products from "../../src/models/products";
import { generateId, EntityType } from "../../src/schemas/generate-ids";
import R from 'ramda';


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
  const authenticatepMutation = `
    mutation($input:AuthenticateInput!){
      authenticate(input: $input){
            token
        }
    }
`;

  const res = await Request(startServer)
    .post("/graphql")
    .send({
      query: authenticatepMutation,
      variables: {
        input: {
          emailAddress: fakeUser.emailAddress,
          password: fakeUser.password,
        },
      },
    });

    const body =JSON.parse(res.text)

  return body.data.authenticate.token;
}

export async function addFakeProduct() {
  const generateProduct = generateFakeProduct()
  const user = await Users.find()
  const id = generateId(EntityType.Product);
  const cursor = Buffer.concat([
        Buffer.from(generateProduct.name),
        Buffer.from(id),
      ]);
  const product = { ...generateProduct, id,cursor,ownerId: R.head(user).id }
  return Products.create(product)
}

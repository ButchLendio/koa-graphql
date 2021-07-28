import Request from "supertest";
import Bcryptjs from "bcryptjs";
import R from 'ramda'
import { expect } from "chai";
import { startServer } from "../../src/index";
import Products from "../../src/models/products";
import Users from "../../src/models/users";
import {
  generateFakeUser,
  generateFakeProduct,
  addFakeProduct,
  getToken,
} from "../helpers/helpers";
import { generateId, EntityType } from "../../src/schemas/generate-ids";

const updateProductMutation = `
            mutation($input:UpdateProductInput!){
                updateProduct(input: $input){
                    id
                    name
                    description
                }
            }
        `;

describe("Mutation.updateProduct", () => {
  after(async function () {
    await Products.deleteMany({});
  });

  it("should update product", async function () {
    const createdUser = generateFakeUser();
    const createdProduct = generateFakeProduct()
    await Users.create({
      ...createdUser,
      id: generateId(EntityType.Account),
      password: await Bcryptjs.hash(createdUser.password, 10),
    });
    const token = await getToken(createdUser);
    await addFakeProduct(createdProduct,token)
    const foundProduct= await Products.find()
    const product = R.head(foundProduct)

    const res = await Request(startServer)
      .post("/graphql")
      .send({
        query: updateProductMutation,
        variables: {
          input: {
            id:product.id.toString("base64"),
            body:generateFakeProduct(),
          }
        },
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
  });

  it("should error if not the owner", async function () {
    const createdUser = generateFakeUser();
    const createdProduct = generateFakeProduct()
    const fakecreatedUser = generateFakeUser();
    const fakecreatedProduct = generateFakeProduct()
    await Users.create({
      ...createdUser,
      id: generateId(EntityType.Account),
      password: await Bcryptjs.hash(createdUser.password, 10),
    });
    const token = await getToken(createdUser);

    await Users.create({
        ...fakecreatedUser,
        id: generateId(EntityType.Account),
        password: await Bcryptjs.hash(fakecreatedUser.password, 10),
      });
      const faketoken = await getToken(fakecreatedUser);

    await addFakeProduct(createdProduct,token)
    await addFakeProduct(fakecreatedProduct,faketoken)

    const foundProduct= await Products.find()
    const product = R.last(foundProduct)

    const res = await Request(startServer)
      .post("/graphql")
      .send({
        query: updateProductMutation,
        variables: {
          input: {
            id:product.id.toString("base64"),
            body:generateFakeProduct(),
          }
        },
      })
      .set("Authorization", `Bearer ${token}`);

      const body = JSON.parse(res.text);
      console.log(body)
    expect(body.errors[0].message).to.equal("Not the owner of the product");

  });

  it("should error if no token", async function () {
    const createdUser = generateFakeUser();
    const createdProduct = generateFakeProduct()
    await Users.create({
      ...createdUser,
      id: generateId(EntityType.Account),
      password: await Bcryptjs.hash(createdUser.password, 10),
    });
    const token = await getToken(createdUser);
    await addFakeProduct(createdProduct,token)
    const foundProduct= await Products.find()
    const product = R.head(foundProduct)

    const res = await Request(startServer)
      .post("/graphql")
      .send({
        query: updateProductMutation,
        variables: {
          input: {
            id:product.id.toString("base64"),
            body:generateFakeProduct(),
          }
        },
      })

      const body = JSON.parse(res.text);
      expect(body.errors[0].message).to.equal("Invalid authentication header.");
  });

  it("should Error if product does not exist", async function () {
    const createdUser = generateFakeUser();
    const createdProduct = generateFakeProduct()
    await Users.create({
      ...createdUser,
      id: generateId(EntityType.Account),
      password: await Bcryptjs.hash(createdUser.password, 10),
    });
    const token = await getToken(createdUser);

    const res = await Request(startServer)
      .post("/graphql")
      .send({
        query: updateProductMutation,
        variables: {
          input: {
            id:"ahksdjhfkjalhsdfkjh",
            body:generateFakeProduct(),
          }
        },
      })
      .set("Authorization", `Bearer ${token}`);

      const body = JSON.parse(res.text);
      expect(body.errors[0].message).to.equal("Product does not exist");
  });
});

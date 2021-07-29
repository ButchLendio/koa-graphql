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
  afterEach(async function () {
    await Products.deleteMany({});
  });

  it("should update product", async function () {
    const createdUser = generateFakeUser();
    const bodyProduct = generateFakeProduct()
    const id =  generateId(EntityType.Account)
    await Users.create({
      ...createdUser,
      id,
      password: await Bcryptjs.hash(createdUser.password, 10),
    });
    const product = await addFakeProduct(id)
    const token = await getToken(createdUser);

    const { body } = await Request(startServer)
      .post("/graphql")
      .send({
        query: updateProductMutation,
        variables: {
          input: {
            id:product.id.toString("base64"),
            body:bodyProduct,
          }
        },
      })
      .set("Authorization", `Bearer ${token}`);
    
    expect(body.data.updateProduct.name).to.equal(bodyProduct.name)
  });

  it("should error if not the owner", async function () {
    const createdUser = generateFakeUser();
    const id =  generateId(EntityType.Account)
    await Users.create({
      ...createdUser,
      id,
      password: await Bcryptjs.hash(createdUser.password, 10),
    });
    const token = await getToken(createdUser);
    const product = await addFakeProduct(generateId(EntityType.Account))

    const { body } = await Request(startServer)
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

    expect(body.errors[0].message).to.equal("Not the owner of the product");

  });

  it("should error if no token", async function () {
    const createdUser = generateFakeUser();
    const id =  generateId(EntityType.Account)
    await Users.create({
      ...createdUser,
      id,
      password: await Bcryptjs.hash(createdUser.password, 10),
    });
    const product = await addFakeProduct(generateId(EntityType.Account))

    const { body } = await Request(startServer)
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

      expect(body.errors[0].message).to.equal("Invalid authentication header.");
  });

  it("should Error if product does not exist", async function () {
    const createdUser = generateFakeUser();
    await Users.create({
      ...createdUser,
      id: generateId(EntityType.Account),
      password: await Bcryptjs.hash(createdUser.password, 10),
    });
    const token = await getToken(createdUser);

    const { body } = await Request(startServer)
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

      expect(body.errors[0].message).to.equal("Product does not exist");
  });
});

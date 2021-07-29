import Request from "supertest";
import Bcryptjs from "bcryptjs";
import { expect } from "chai";
import { startServer } from "../../src/index";
import Products from "../../src/models/products";
import Users from "../../src/models/users";
import {
  addFakeProduct,
  addFakeUserRegister,
  getToken,
} from "../helpers/helpers";
import { generateId, EntityType } from "../../src/schemas/generate-ids";

const nodeQuery = `
            query($id:Binary!){
                node(id: $id){
                    ... on Account{
                        emailAddress,
                        firstname,
                        lastname
                      }
                      ... on Product{
                        name,
                        description
                      }
                }
            }
        `;

describe("Query.node", () => {
  after(async function () {
    await Products.deleteMany({});
    await Users.deleteMany({});
  });

  it("should return product", async function () {
    const ownerId = generateId(EntityType.Account);
    await addFakeUserRegister({ ownerId });
    const product = await addFakeProduct({ ownerId });
    const token = await getToken({ ownerId });

    console.log(product.id.toString("base64"))


    const { body } = await Request(startServer)
      .post("/graphql")
      .send({
        query: nodeQuery,
        variables: {
            id: product.id.toString("base64"),
        },
      })
      .set("Authorization", `Bearer ${token}`);

    expect(body.data.node.name).to.equal(product.name);
  });

  it("should return user", async function () {
    const ownerId = generateId(EntityType.Account);
    const user = await addFakeUserRegister({ ownerId });
    const token = await getToken({ ownerId });

    const { body } = await Request(startServer)
      .post("/graphql")
      .send({
        query: nodeQuery,
        variables: {
            id: user.id.toString("base64"),
        },
      })
      .set("Authorization", `Bearer ${token}`);

    expect(body.data.node.emailAddress).to.equal(user.emailAddress);
  });
});

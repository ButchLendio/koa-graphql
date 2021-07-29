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
    // await Products.deleteMany({});
    // await Users.deleteMany({});
  });

  it.only("should return user", async function () {
    const ownerId = generateId(EntityType.Account);
    await addFakeUserRegister({ ownerId });
    const foundUser = await Users.findOne({id:ownerId})
    const product = await addFakeProduct({ ownerId });
    const token = await getToken({ ownerId });


    const { body } = await Request(startServer)
      .post("/graphql")
      .send({
        query: nodeQuery,
        variables: {
            id: product.id.toString("base64"),
        },
      })
      .set("Authorization", `Bearer ${token}`);

    expect(body.data.node.emailAddress).to.equal(foundUser.emailAddress);
  });

//   it("should error if no token", async function () {

//     const res = await Request(startServer)
//       .post("/graphql")
//       .send({
//         query: createProductMutation,
//         variables: {
//           input: generateFakeProduct(),
//         },
//       });
//     const body = JSON.parse(res.text);
//     expect(body.errors[0].message).to.equal("Invalid authentication header.");
//   });

//   it("should error if invalid token", async function () {
//     const createdUser = generateFakeUser();

//     await Users.create({
//       ...createdUser,
//       id: generateId(EntityType.Account),
//       password: await Bcryptjs.hash(createdUser.password, 10),
//     });

//     const res = await Request(startServer)
//       .post("/graphql")
//       .send({
//         query: createProductMutation,
//         variables: {
//           input: generateFakeProduct(),
//         },
//       })
//       .set("Authorization", `Bearer 2sdjflskdjfklsdj5`);

//     const body = JSON.parse(res.text);
//     expect(body.errors[0].message).to.equal("jwt malformed");
//   });
});

import Request from "supertest";
import Bcryptjs from "bcryptjs";
import { expect } from "chai";
import { startServer } from "../../src/index";
import Products from "../../src/models/products";
import Users from "../../src/models/users";
import {
  generateFakeUser,
  generateFakeProduct,
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

  it("should return user", async function () {
    const createdUser = generateFakeUser();

    await Users.create({
      ...createdUser,
      id: generateId(EntityType.Account),
      password: await Bcryptjs.hash(createdUser.password, 10),
    });
    const token = await getToken(createdUser);

    const res = await Request(startServer)
      .post("/graphql")
      .send({
        query: nodeQuery,
        variables: {
          id: generateFakeProduct(),
        },
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
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

import Request from "supertest";
import { expect } from "chai";
import { startServer } from "../../src/index";
import Users from "../../src/models/users";
import { addFakeUserRegister, getToken } from "../helpers/helpers";
import { generateId, EntityType } from "../../src/schemas/generate-ids";

describe("Mutation.signUp", () => {
  after(async function () {
    // await Users.deleteMany({});
  });
  const meQuery = `
            query(){
                me{
                    lastname
                    firstname
                    emailAddress
                  }
            }
        `;

  it.only("should display account", async function () {
    const ownerId = generateId(EntityType.Account);

    const user = await addFakeUserRegister({ ownerId });
    console.log(user)
    const token = await getToken({ ownerId });

    const { body } = await Request(startServer)
      .post("/graphql")
      .send({
        query: meQuery,
      })
      .set("Authorization", `Bearer ${token}`);

    console.log(body);

    // expect(res.statusCode).to.equal(200);
  });
});

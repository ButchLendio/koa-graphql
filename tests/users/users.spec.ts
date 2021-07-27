import Request from "supertest";
import { expect } from "chai";
import { startServer } from "../../src/index";
import Users from "../../src/models/users";
import { generateFakeUser } from "../helpers/helpers";

describe("User Test", () => {
  afterEach(async function () {
    await Users.deleteMany({});
  });

  it("SignUp", async function () {
    const signUpMutation = `
            mutation($input:SignUpInput!){
                signUp(input: $input){
                    token
                }
            }
        `;

    const res = await Request(startServer)
      .post("/graphql")
      .send({
        query: signUpMutation,
        variables: {
          input:generateFakeUser(),
        },
      });

    expect(res.statusCode).to.equal(200);
  });
});

import Request from "supertest";
import { expect } from "chai";
import { startServer } from "../../src/index";
import Users from "../../src/models/users";
import Bcryptjs from "bcryptjs";
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
          input: {
            emailAddress: generateFakeUser().emailAddress,
            firstname: generateFakeUser().firstname,
            lastname: generateFakeUser().lastname,
            password: generateFakeUser().password,
          },
        },
      });

    expect(res.statusCode).to.equal(200);
  });
});

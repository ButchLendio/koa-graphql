import Request from "supertest";
import { expect } from "chai";
import { startServer } from "../../src/index";
import Users from "../../src/models/users";
import Bcryptjs from "bcryptjs";
import { generateFakeUser } from "../helpers/helpers";

describe("User Test", () => {
  // afterEach(async function() {
  //        await Users.deleteMany({})
  //     })

  it("SignUp", async function (done) {
    const signUpMutation = `
            mutation($input:SignUpInput!){
                signUp(input: $input){
                    token
                }
            }
        `;
    const userCreate = generateFakeUser();

    const res = await Request(startServer)
      .post("/graphql")
      .send({
        query: signUpMutation,
        variables: {
          input: {
            emailAddress: userCreate.emailAddress,
            firstname: userCreate.firstname,
            lastname: userCreate.lastname,
            password: userCreate.password,
          },
        },
      });
    
    expect(res.statusCode).to.equal(200)
    done();

    // .auth(generateFakeUser().username,generateFakeUser().password)
    //  expect(res.status).to.equal(200)
  });
});

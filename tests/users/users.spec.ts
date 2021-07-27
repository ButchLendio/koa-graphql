import Request from "supertest";
import Bcryptjs from "bcryptjs";
import { expect } from "chai";
import { startServer } from "../../src/index";
import Users from "../../src/models/users";
import { generateFakeUser } from "../helpers/helpers";
import { generateId, EntityType } from "../../src/schemas/generate-ids";



describe("Mutation.authenticate", () => {
  after(async function () {
    await Users.deleteMany({});
  });

  it("should sign up", async function () {
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
          input: generateFakeUser(),
        },
      });

    expect(res.statusCode).to.equal(200);
  });

  it("should authenticate successfully", async function () {
    const userCreate = generateFakeUser();

    await Users.create({
      ...userCreate,
      id:generateId(EntityType.Account),
      password: await Bcryptjs.hash(userCreate.password, 10),
    });
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
            emailAddress:userCreate.emailAddress,
            password:userCreate.password
          }
        },
      });
    expect(res.statusCode).to.equal(200);
  });

  it("should error if password is invalid", async function () {
    const userCreate = generateFakeUser();

    await Users.create({
      ...userCreate,
      id:generateId(EntityType.Account),
      password: await Bcryptjs.hash(userCreate.password, 10),
    });
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
            emailAddress:userCreate.emailAddress,
            password:"lkajsdf"
          }
        },
      });

      const body =JSON.parse(res.text)
    expect(body.errors[0].message).to.equal("Unauthorized");
  });

  it("should error if password is invalid", async function () {
    const userCreate = generateFakeUser();

    await Users.create({
      ...userCreate,
      id:generateId(EntityType.Account),
      password: await Bcryptjs.hash(userCreate.password, 10),
    });
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
            emailAddress:"kasjhdfkjashfda",
            password:userCreate.password
          }
        },
      });

      const body =JSON.parse(res.text)
    expect(body.errors[0].message).to.equal("User not registerd");
  });
});

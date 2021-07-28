import Request from "supertest";
import { internet, name, commerce } from "faker";
import { startServer } from "../../src/index";


export function generateFakeUser() {
  return {
    emailAddress: internet.email(),
    firstname: name.firstName(),
    lastname: name.lastName(),
    password: internet.password(),
  };
}

export function generateFakeProduct() {
  return {
    name: commerce.product(),
    description: `This is ${commerce.product()}`,
  };
}

export async function getToken(fakeUser: {
  emailAddress: string;
  password: string;
}) {
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
          emailAddress: fakeUser.emailAddress,
          password: fakeUser.password,
        },
      },
    });

    const body =JSON.parse(res.text)

  return body.data.authenticate.token;
}

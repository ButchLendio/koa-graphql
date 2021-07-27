import {internet,name} from "faker"

export function generateFakeUser() {
    return {
        emailAddress: internet.email(),
        firstname: name.firstName(),
        lastname: name.lastName(),
        password: internet.password(),
    }
}

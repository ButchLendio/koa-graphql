import {internet,commerce,datatype,name} from "faker"
import Products from '../../src/models/products';
import  Request  from 'supertest';
import { generateId, EntityType } from "../../src/schemas/generate-ids";

import {SERVER} from '../../src/index'
import R from 'ramda'

export function generateFakeUser() {
    return {
        emailAddress: internet.email(),
        firstname: name.firstName(),
        lastname: name.lastName(),
        password: internet.password(),
    }
}

export function generateFakeProduct() {
    return {
        id:datatype.uuid(),
        name: commerce.product(),
        price: commerce.price()
    }
}

export async function addFakeUser(fakeUser:{name:string,username:string,password:string}) {
     await Request(SERVER).post("/users")
    .send({name:fakeUser.name})
    .auth(fakeUser.username,fakeUser.password,{type: "basic"})
   
    const res = await Request(SERVER).post("/auth")
    .auth(fakeUser.username,fakeUser.password,{type: "basic"})
    
    return (res.body.token)
    
}

export async function addFakeProduct(fakeProduct:{id:string,name:string,price:string},token:string) {

    const res = await Request(SERVER).post("/products")
    .send({
        id:fakeProduct.id,
        name:fakeProduct.name,
        price:Number(fakeProduct.price)})
    .set('Authorization',`Bearer ${token}`)

    return(res.body.res)
}

export async function populateProduct() {
    Products.create(R.times(() => generateFakeProduct())(20))
     
}

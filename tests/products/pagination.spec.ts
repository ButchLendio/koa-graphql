import Request from "supertest";
import R from "ramda"
import { expect } from "chai";
import { startServer } from "../../src/index";
import Products from "../../src/models/products";
import {
    populateProduct,
} from "../helpers/helpers";
import { generateId, EntityType } from "../../src/schemas/generate-ids";

const productQuery = `
    query($first:Int, $after:Binary, $filter: ProductsFilter,$sort:ProductSortInput){
        products(first: $first, after: $after, filter: $filter, sort:$sort){
            edges{
                cursor,
                node{
                    id,
                    name,
                    description
                }
            }
            pageInfo{
                hasNextPage
                endCursor
            }
        }
    }
`;

describe("Query.product", () => {
  after(async function () {
    // await Products.deleteMany({});
  });

  it("should get the first 5", async function () {
    const ownerId = generateId(EntityType.Account);
    await populateProduct({ownerId,count:10});

    const { body } = await Request(startServer)
      .post("/graphql")
      .send({   
        query: productQuery,
        variables: {
            first:5      
        },
      })
    expect(body.data.products.edges.length).to.equal(5);
  });

  it.only("should get the first 5 with given cursor", async function () {
    const ownerId = generateId(EntityType.Account);
    const product = await populateProduct({ownerId,count:10});
    console.log(R.head(product).cursor.toString("base64")  )
    const { body } = await Request(startServer)
      .post("/graphql")
      .send({   
        query: productQuery,
        variables: {
            first:5,
            after: R.head(product).cursor.toString("base64")   
        },
      })
      console.log(body.data.products.edges.length)
    expect(body.data.products.edges.length).to.equal(5);
  });

  it("should get the first 5 with given cursor and filter:name eq", async function () {
    const ownerId = generateId(EntityType.Account);
    const product = await populateProduct({ownerId,count:10});

    const { body } = await Request(startServer)
      .post("/graphql")
      .send({   
        query: productQuery,
        variables: {
            first:5,
            after: R.head(product).cursor.toString("base64"),
            filter:{
                name:{
                    eq:R.last(product).name
                }
            } 
        },
      })
    expect(body.data.products.edges.length).to.not.equal(0);
  });

  it("should get the first 5 with given cursor and filter:name ne", async function () {
    const ownerId = generateId(EntityType.Account);
    const product = await populateProduct({ownerId,count:10});

    const { body } = await Request(startServer)
      .post("/graphql")
      .send({   
        query: productQuery,
        variables: {
            first:5,
            after: R.head(product).cursor.toString("base64"),
            filter:{
                name:{
                    ne:R.head(product).name
                }
            } 
        },
      })

    expect(body.data.products.edges.length).to.equal(5);
  });

  it("should get the first 5 with given cursor and filter:name in", async function () {
    const ownerId = generateId(EntityType.Account);
    const product = await populateProduct({ownerId,count:10});

    const { body } = await Request(startServer)
      .post("/graphql")
      .send({   
        query: productQuery,
        variables: {
            first:5,
            after: R.head(product).cursor.toString("base64"),
            filter:{
                name:{
                    in:R.head(product).name
                }
            } 
        },
      })
    expect(body.data.products.edges.length).to.not.equal(0)
  });

  it("should get the first 5 with given cursor and filter:name nin", async function () {
    const ownerId = generateId(EntityType.Account);
    const product = await populateProduct({ownerId,count:10});

    const { body } = await Request(startServer)
      .post("/graphql")
      .send({   
        query: productQuery,
        variables: {
            first:5,
            after: R.head(product).cursor.toString("base64"),
            filter:{
                name:{
                    nin:R.head(product).name
                }
            } 
        },
      })

    expect(body.data.products.edges.length).to.not.equal(0)
  });

  it("should get the first 5 with given cursor, a filter:name in and sort:name asc", async function () {
    const ownerId = generateId(EntityType.Account);
    const product = await populateProduct({ownerId,count:10});

    const { body } = await Request(startServer)
      .post("/graphql")
      .send({   
        query: productQuery,
        variables: {
            first:5,
            after: R.head(product).cursor.toString("base64"),
            filter:{
                name:{
                    in:R.head(product).name
                }
            },
            sort:{
                name:1
              }
        },
      })
    expect(body.data.products.edges.length).to.not.equal(0)
  });

  it("should get the first 5 with given cursor, a filter:name in and sort:name desc", async function () {
    const ownerId = generateId(EntityType.Account);
    const product = await populateProduct({ownerId,count:10});

    const { body } = await Request(startServer)
      .post("/graphql")
      .send({   
        query: productQuery,
        variables: {
            first:5,
            after: R.head(product).cursor.toString("base64"),
            filter:{
                name:{
                    in:R.head(product).name
                }
            },
            sort:{
                name:0
              }
        },
      })
    expect(body.data.products.edges.length).to.not.equal(0)
  });
});

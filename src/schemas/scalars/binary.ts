import { GraphQLScalarType } from "graphql";

const BinaryResolver = new GraphQLScalarType({
  name: "Binary",
  description: "String representation of a Buffer ID.",

  serialize(value) {
    if (!(value instanceof Buffer)) {
      throw new Error("Invalid return type for Binary");
    }
    console.log("1")
    return value.toString("base64");
  },

  parseValue(value) {
    console.log("2")

    return Buffer.from(value, "base64");
  },

  parseLiteral(ast: any) {
    console.log("3")

    return Buffer.from(ast.value, "base64");
  },
});

export default BinaryResolver;

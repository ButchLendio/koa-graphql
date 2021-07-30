import R from "ramda";
import {
  BinaryQueryOperatorInput,
  StringQueryOperatorInput,
} from "./convert-mongoose";

function escape(value: string) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export function convertToMongooseQuery(queryOperator: {
  id: BinaryQueryOperatorInput;
  name: StringQueryOperatorInput;
}) {
  let filter: Record<string, object> = {};
  for (let index = 0; index < Object.keys(queryOperator).length; index++) {
    const elementKey = Object.keys(queryOperator)[index];

    if (!filter[elementKey]) {
      filter[elementKey] = {};
    }

    for (let i = 0; i < Object.keys(queryOperator[elementKey]).length; i++) {
      const key = Object.keys(queryOperator[elementKey])[i];

      if (key === "startsWith") {
        const value = queryOperator[elementKey][key]
        filter[elementKey]["$regex"] = new RegExp(`^${escape(value)}.*$`, 'i');
      }
      else if (key === "contains") {
        const value = queryOperator[elementKey][key]
        filter[elementKey]["$regex"] = new RegExp(`^.*${escape(value)}.*$`, 'i');
      }
      else{
        filter[elementKey][`$${key}`] = queryOperator[elementKey][key]

      }
    }
  }

  return filter
}

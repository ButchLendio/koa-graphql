import mongoose from "mongoose";
import debug from "debug";

const log: debug.IDebugger = debug("app:mongoose-service");

export async function MongooseService() {
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    useFindAndModify: false,
  };
  log("Attempting MongoDB connection (will retry if needed)");
  const connect = await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/testing",
    mongooseOptions
  );

  if (connect) {
    console.log("MongoDB is connected");
  } else {
    throw new Error("Cannot connect to DB");
  }
}

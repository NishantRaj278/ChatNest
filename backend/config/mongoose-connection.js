import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(`Database Connected Successfully`);
  } catch (error) {
    console.log(`Mongodb Error: ${error}`);
  }
};

export default connectDB;

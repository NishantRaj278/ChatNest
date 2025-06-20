import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/chatnest`);
        console.log(`Mongodb Connection: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(`Mongodb Error: ${error}`);
    }
}

export default connectDB;
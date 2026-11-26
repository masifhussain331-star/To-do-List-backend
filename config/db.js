
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");

        const connection = await mongoose.connect(
            process.env.MONGO_URI,
            {
                serverSelectionTimeoutMS: 10000
            }
        );

        console.log(
            `MongoDB Connected Successfully: ${connection.connection.host}`
        );

    } catch (error) {
        console.error("MongoDB Connection Failed!");
        console.error("Reason:", error.message);
        throw error;
    }
};

export default connectDB;

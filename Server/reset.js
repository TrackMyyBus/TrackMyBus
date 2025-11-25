import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const resetDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    await mongoose.connection.dropDatabase();
    console.log("🔥 Database wiped completely!");

    mongoose.connection.close();
};

resetDB();

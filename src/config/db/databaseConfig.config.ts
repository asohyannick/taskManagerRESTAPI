import 'dotenv/config';
import mongoose from 'mongoose';
const dbURL: string  = process.env.MONGODB_URL as string;
const databaseConfiguration = async() => {
    try {
        await mongoose.connect(dbURL);
        console.log("Database connection is successful.")
    } catch (error) {
        console.log("Failed to connect to the database");
        process.exit(1);
    }
}

export default databaseConfiguration;

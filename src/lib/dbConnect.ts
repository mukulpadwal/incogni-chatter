import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

export default async function connectToDb(): Promise<void> {
    // Check if database is already connected or not
    if (connection.isConnected) {
        console.log(`Already connected to database...`);
        return;
    }

    try {
        const dbConnection = await mongoose.connect(`${process.env.MONGODB_URI!}/incogni-chatter`);

        connection.isConnected = dbConnection.connections[0].readyState;

        console.log(`DB connected successfully...`);


    } catch (error: any) {
        console.log(`Database connection failed : ERROR : ${error.message}`);
        process.exit(1);
    }
}

import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number;
};
const connection: connectionObject = {};

async function dbConnect() {
    if (connection.isConnected) {
        console.log("Already Connected to DataBase")
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        connection.isConnected = db.connections[0].readyState;
        console.log("DataBase Connected Sucessfully")
    } catch (error) {
        console.log("Error while connecting to DataBase", error)
        process.exit(1);
    }
}

export default dbConnect;

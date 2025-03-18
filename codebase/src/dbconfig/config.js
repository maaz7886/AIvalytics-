import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("connected to db");
        })

        connection.on("error", (error) => {
            console.log("something went wrong during connection indb ", error);
            process.exit(1);
        })

    } catch (error) {
        console.log("something went wrong during connection indb ", error);
    }
}
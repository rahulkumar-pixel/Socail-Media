import mongoose from "mongoose";

const connectdb = async () => {
    const Url = "mongodb+srv://rahulkumar801:Rahul801503@cluster0.quv0dz4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    try {
        await mongoose.connect(Url)
        console.log("MongoDb Connected");
        
    } catch (error) {
        console.log("MongoDb Connection Failed");
        process.exit(1);
    }
}

export default connectdb;
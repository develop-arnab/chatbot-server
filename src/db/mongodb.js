import mongoose from "mongoose";

mongoose.Promise = global.Promise;


mongoose.connection.on("connected", () => {

    console.log("MongoDB Connection Established");
  
  });
  
  
  mongoose.connection.on("reconnected", () => {
  
    console.log("MongoDB Connection Reestablished");
  
  });
  
  
  mongoose.connection.on("disconnected", () => {
  
    console.log("MongoDB Connection Disconnected");
  
  });
  
  
  mongoose.connection.on("close", () => {
  
    console.log("MongoDB Connection Closed");
  
  });
  
  
  mongoose.connection.on("error", error => {
  
    console.log("MongoDB ERROR: " + error);
  
    process.exit(1);
  
  });
  


  
const connectMongo = async () => {

    let connectionuri = "mongodb+srv://create:3.14ToInfinity@createapp.fhl1vbl.mongodb.net/?retryWrites=true&w=majority"
    mongoose
      .connect(
        connectionuri,
        //'mongodb://localhost:27017/upload-files-database'
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: true
        }
      )
      .then(() => console.log("Connected to Mongodb......"));
  }

  
export default connectMongo;


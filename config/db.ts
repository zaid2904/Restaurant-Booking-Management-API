// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     console.log("Connecting to:", process.env.MONGODB_URI);

//     await mongoose.connect(process.env.MONGODB_URI!, {
//       serverSelectionTimeoutMS: 10000,
//     });

//     console.log("✅ MongoDB Connected");
//   } catch (err) {
//     console.error(err);
//   }
// };

// export default connectDB;


import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI!);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
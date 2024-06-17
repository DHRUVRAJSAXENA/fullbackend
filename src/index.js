import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
// dotenv.config({
//   path: "./.env",
// });

import "dotenv/config";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

/*

one of the approch where we are connecting mongodb and express

import express from "express";
import "dotenv";

const app = express()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

    app.on("error", (error) => {
      console.log("error occur in express part");
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log("express listning");
    });
  } catch (error) {
    console.error();
    throw error;
  }
})();

*/

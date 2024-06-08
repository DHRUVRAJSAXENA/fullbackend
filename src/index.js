import connectDB from "./db/index.js";
import "dotenv/config";

connectDB();

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

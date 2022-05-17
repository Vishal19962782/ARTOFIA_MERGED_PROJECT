const mongoose = require("mongoose");
const imageSchema = new ItemSchema(
    {   email: { type: String, required: [true], index: { unique: true } },
        img: 
        { data: Buffer, contentType: String }
    }
  );
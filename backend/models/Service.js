const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true } // Cloudinary URL
},
  { timestamps: true });


module.exports = mongoose.model("Service", ServiceSchema);

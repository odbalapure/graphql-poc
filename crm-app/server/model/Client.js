const mongoose = require("mongoose");

const ClientSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

module.exports = mongoose.model("Client", ClientSchema);
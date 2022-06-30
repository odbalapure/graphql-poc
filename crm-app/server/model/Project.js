const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  status: {
    type: String,
    enum: ["Not started", "In Progress", "Completed"]
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  }
});

module.exports = mongoose.model("Project", ProjectSchema);
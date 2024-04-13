const mongoose = require("mongoose");

const messagesSchema = mongoose.Schema(
  {
    message: {
      text: { 
        type: String, 
        required: true 
      }, 
    },
    users: Array, // Array of users involved in the message (could be recipients, etc.)
    sender: {
      type:String, 
     
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds "createdAt" and "updatedAt" fields
  }
);

module.exports = mongoose.model("messagesDetails", messagesSchema); // Export the model named "messages" based on the messagesSchema
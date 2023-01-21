const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InvestSchema = Schema(
  {
    userid: {
        type: Schema.Types.ObjectId,
        ref: "AdminUser",
        required: true,
      },


    amount: {
      type: Number,
      required: true
    },

    sortNumber: {
      type: Number
 
    },

    accountNumber: {
      type: Number
    
    },
    
    accountName: {
      type: String
    
    },

    PaymentMethod: {
        type: String,
        required: true,
        index: true
   
      },

    history:{
      type:String,
      enum: ["deposit", "withdrew"],
      required:true
  },
    
    Status: {
      type: String,
      enum: ["Pending", "Approved", "Cancel", "Completed"],
      required: true,
      default:"Pending",
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", InvestSchema);
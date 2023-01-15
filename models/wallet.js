const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WalletSchema = Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },

    ACCOUNTBALANCE: {
      type: Number,
      required: true,
      default: 0,
    },

    ACCOUNTNUMBER: {
        type: Number,
        required: true,
        unique: true,
      },

    DEPOSIT: {
        type: Number,
        required: true,
        default: 0,
      },

    TRANSACTION: {
      type: Number,
      required: true,
      default: 0,
    },
    WITHDRAWAL: {
      type: Number,
      required: true,
      default: 0,
    },
    FDR: {
      type: Number,
      required: true,
      default: 0,
    },
    DPS: {
        type: Number,
        required: true,
        default: 0,
      },
    LOAN: {
        type: Number,
        required: true,
        default: 0,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", WalletSchema);
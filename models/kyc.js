const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const KycSchema = Schema(
    {
        userid: {
            type: Schema.Types.ObjectId,
            ref: "AdminUser",
            required: true,
        },


        address: {
            type: String,
            required: true
        },

        fullname: {
            type: String,
            required: true,
            index: true

        },

        fathername: {
            type: String,
            required: true,
            index: true

        },
        mothername: {
            type: String,
            required: true,
            index: true

        },

        secure_url: {
            required: true,
            type: String,
        },

        public_id: {
            required: true,
            type: String,
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("kyc", KycSchema);
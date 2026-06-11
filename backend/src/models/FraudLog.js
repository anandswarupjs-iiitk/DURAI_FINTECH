const mongoose=
require("mongoose");


const fraudLogSchema=

new mongoose.Schema(

{

    transaction:{

        type:
        mongoose.Schema.Types.ObjectId,

        ref:
        "Transaction"

    },

    user:{

        type:
        mongoose.Schema.Types.ObjectId,

        ref:
        "User"

    },

    riskScore:{

        type:Number

    },

    riskLevel:{

        type:String

    },

    reasons:[

        String

    ]

},

{

    timestamps:true

}

);


module.exports=

mongoose.model(

    "FraudLog",

    fraudLogSchema

);
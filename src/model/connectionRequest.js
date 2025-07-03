const mongoose = require("mongoose");
const connectionReqSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
         ref:"User",
        required:true,
        
    },
    status: {
        type: String,
        required:true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `{VALUE} is  incorrect status type`,

        },
    
    },
    
},{
    timestamps:true
} 
);

 connectionReqSchema.index({fromUserId:1, toUserId:1},{unique:true})
connectionReqSchema.pre("save", function (next) {
    if (this.fromUserId.equals(this.toUserId)) {
        return next(new Error("Cannot send connection request to yourself!"));
    }
    next();
});


 const ConnectionRequestModel= new mongoose.model("ConnectionRequest",connectionReqSchema)

module.exports=ConnectionRequestModel;

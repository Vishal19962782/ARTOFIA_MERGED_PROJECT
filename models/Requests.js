const mongoose=require('mongoose');
const Request=mongoose.Schema({
userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
image:{type:String},
description:{type:String},
status:{type:String,default:'pending'},
date:{type:Date,default:Date.now()}
})
const RequestModel=mongoose.model('Request',Request);
module.exports=RequestModel;
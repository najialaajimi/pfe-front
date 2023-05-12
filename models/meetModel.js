var mongoose = require('mongoose');
 
var meetingSchema = mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },
    uid: 
    {
        type: String,/* 
        required: true */
    },
    date:{
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    creator: { 
        type: String
    },
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
},{
    timestamps: true,
  });

meetingSchema.pre('save', function(next) {
    if (!this.uid) {
        this.uid = `A${this._id.toString().substr(-8)}`;
    }
    next();
});

 
module.exports = mongoose.model('Meeting', meetingSchema);
 
/* module.exports = Meeting; */
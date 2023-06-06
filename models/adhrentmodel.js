const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const Adherentschema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        
        unique:true,
    },
    mdp:{
        type:String,
        required:true,
    },
    
    refreshToken: {
        type : String,
    },
    codeAdherent: {
        type: String,
        unique: true,
      },

      childrenL:[ {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "adherent",
                 }],
                 childrenR:[
                     {
                         type: mongoose.Schema.Types.ObjectId,
                         ref: "adherent",
                     }
                 ],

                gender:{
                    type:String,
                    default:"femme"
                },
// bureau:[{
//     bureau1:{
//         nom:{type:String},
//         code:{type:String,unique:true},
        
//         childrenL:[ {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "adherent",
//         }],
//         childrenR:[
//             {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "adherent",
//             }
//         ]
//     }
// }],



    passwordChangedAt:Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps:true
});
Adherentschema.pre('save', function(next) {
    if (!this.codeAdherent) {
        this.codeAdherent = `A${this._id.toString().substr(-8)}`;
    }
    next();
});

Adherentschema.pre("save" , async function (next) {
    if (!this.isModified('mdp')) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.mdp = await bcrypt.hash(this.mdp ,salt);
});

Adherentschema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword , this.mdp);
}

Adherentschema.methods.createPasswordResetToken = async function () {
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resettoken)
    .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 minutes
    return resettoken;
};

module.exports = mongoose.model("adherent", Adherentschema);

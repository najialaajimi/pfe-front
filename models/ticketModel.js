const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  nTicket: {
    type: String, 
    unique: true,
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  type:String,
  statut: {
    type: String,
    default:"Ouvert",
    enum:["Ouvert", "Fermer"]
  },
  sujet: {
    type: String,
    required: true
  },
  description: [{
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    description: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
},{
  timestamps: true,
});

ticketSchema.pre("save", async function (next) {
  if (!this.nTicket) {
    let ticketNumber = Math.random().toString(36).substr(2, 5).toUpperCase(); // génère un nombre aléatoire de 5 caractères
    this.nTicket = ticketNumber;
  }
  next();
});



module.exports = mongoose.model('Ticket', ticketSchema)

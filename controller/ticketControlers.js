const asyncHandler = require("express-async-handler");
const Ticket = require("../models/ticketModel");
const { validateMongodbID } = require("../utils/validateMongodbid");

const createTicket = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbID(_id);
  try {
    const { type, sujet, description } = req.body;
    const newTicket = await Ticket.create({
      userId: _id,
      type,
      sujet,
      description: [{ description }], // ajout de la première description
    });
    res.json(newTicket);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllTicket = asyncHandler ( async (req, res) => {
  // const { _id } = req.user;
  //   validateMongodbID(_id);
  try {
      const allTicket = await Ticket.find().populate("userId");
      res.json(allTicket);
  } catch (error) {
      throw new Error(error);
  }
});
const getTicket = asyncHandler ( async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
      const ATicket = await Ticket.findById(id).populate("userId");
      res.json(ATicket);
  } catch (error) {
      throw new Error(error);
  }
});
const addDescription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const { description } = req.body;
  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new Error("Ticket non trouvé");
    }
    // Ajout de la nouvelle description
    ticket.description.push({ description });
    await ticket.save();
    res.json({result:ticket});
  } catch (error) {
    throw new Error(error);
  }
});
const openTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new Error("Ticket non trouvé");
    }
    if (ticket.statut !== "Ouvert") {
      throw new Error("Impossible d'ouvrir un ticket fermé");
    }
    ticket.statut = "Ouvert";
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    throw new Error(error);
  }
});

/* const addDescription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  validateMongodbID(id);

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      res.status(404);
      throw new Error("Ticket non trouvé");
    }

    // Ajouter la nouvelle description au ticket
    ticket.description.push({
      description,
      createdAt: new Date()
    });

    // Enregistrer le ticket modifié dans la base de données
    const updatedTicket = await ticket.save();
    res.json(updatedTicket);
  } catch (error) {
    throw new Error(error);
  }
}); */


module.exports = {
  createTicket,
  getAllTicket,
  getTicket,
  addDescription,
  openTicket,
};

/* 
const updateTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const { _id } = req.user;

  try {
    // Vérifier que l'ID du ticket est valide
    validateMongodbID(id);

    // Récupérer le ticket existant
    const ticket = await Ticket.findById(id);

    // Vérifier si l'utilisateur est autorisé à modifier ce ticket
    if (ticket.userId.toString() !== _id.toString()) {
      throw new Error("Unauthorized access");
    }

    // Ajouter la nouvelle description et la nouvelle date
    ticket.descriptions.push({
      description,
      date: Date.now(),
    });

    // Enregistrer le ticket mis à jour
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    throw new Error(error);
  }
 });
 const addDescription = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  validateMongodbID(_id);

  try {
    const ticket = await Ticket.findById(_id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Ajouter la nouvelle description et la nouvelle date à l'objet Ticket existant
    const newDescription = req.body.description;
    const newDate = new Date();
    ticket.descriptions.push({ description: newDescription, date: newDate });

    // Enregistrer l'objet mis à jour dans la base de données
    const updatedTicket = await Ticket.findByIdAndUpdate(_id, ticket, { new: true });

    res.json(updatedTicket);
  } catch (error) {
    throw new Error(error);
  }
});
*/
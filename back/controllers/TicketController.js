const ticketModel = require("../models/ticket");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports.add_ticket = async (req, res) => {
   /*  #swagger.parameters['parameter_name'] = {
      in: 'body',
      schema:   {
        "objet": "ticket 1",
        "date_demande": "03-30-2023",
        "description": "description description description",
        "log": "this is log",
        "etat":"a traiter",
        "id_demandeur":"1",
        "id_agence":"2"
      
      }
    }
  } */
  
  try {
    const ticket = await ticketModel.create({...req.body,
    });
    res.status(201).json({ message: "ticket created successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

//get all tickets
module.exports.get_tickets = async (req, res) => {
    try {
      const tickets = await ticketModel.find({});
      res.status(200).json({
        tickets,
        message: "All tickets retrieved successfully",
        status: "success",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Failed to retrieve tickets",
        status: "error",
      });
    }
  };

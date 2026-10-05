const express = require("express");
const Ticket = require("../models/Ticket");

const router = express.Router();

// CREATE TICKET
router.post("/", async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      subject,
      description
    } = req.body;

    const ticket = await Ticket.create({
      ticket_id: `TKT-${Date.now()}`,
      customer_name,
      customer_email,
      subject,
      description
    });

    res.status(201).json({
      ticket_id: ticket.ticket_id,
      created_at: ticket.createdAt
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create ticket",
      error: error.message
    });
  }
});

// GET ALL TICKETS + SEARCH + STATUS FILTER
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;

    const filter = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { ticket_id: { $regex: search, $options: "i" } },
        { customer_name: { $regex: search, $options: "i" } },
        { customer_email: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const tickets = await Ticket.find(filter).sort({
      createdAt: -1
    });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tickets",
      error: error.message
    });
  }
});

// GET SINGLE TICKET
router.get("/:ticket_id", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      ticket_id: req.params.ticket_id
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ticket",
      error: error.message
    });
  }
});

module.exports = router;
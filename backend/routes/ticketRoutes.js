
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

    // Validate required fields
    if (!customer_name || !customer_email || !subject || !description) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }

    const ticket = await Ticket.create({
      ticket_id: `TKT-${Date.now()}`,
      customer_name,
      customer_email,
      subject,
      description
    });

    return res.status(201).json({
      message: "Ticket created successfully.",
      ticket_id: ticket.ticket_id,
      created_at: ticket.createdAt
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create ticket.",
      error: error.message
    });
  }
});

// GET ALL TICKETS + SEARCH + STATUS FILTER
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    // Filter by status
    if (status) {
      const allowedStatuses = ["Open", "In Progress", "Closed"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid ticket status."
        });
      }

      filter.status = status;
    }

    // Search by ticket ID, customer, email, subject or description
    if (search && search.trim()) {
      const searchRegex = {
        $regex: search.trim(),
        $options: "i"
      };

      filter.$or = [
        { ticket_id: searchRegex },
        { customer_name: searchRegex },
        { customer_email: searchRegex },
        { subject: searchRegex },
        { description: searchRegex }
      ];
    }

    const tickets = await Ticket.find(filter).sort({
      createdAt: -1
    });

    return res.status(200).json(tickets);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch tickets.",
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
        message: "Ticket not found."
      });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch ticket.",
      error: error.message
    });
  }
});

// UPDATE TICKET STATUS + ADD NOTE
router.put("/:ticket_id", async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { status, notes } = req.body;

    const ticket = await Ticket.findOne({ ticket_id });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found."
      });
    }

    // Update ticket status
    if (status !== undefined) {
      const allowedStatuses = ["Open", "In Progress", "Closed"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid ticket status."
        });
      }

      ticket.status = status;
    }

    // Add a new note
    if (typeof notes === "string" && notes.trim()) {
      ticket.notes.push({
        note_text: notes.trim()
      });
    }

    await ticket.save();

    return res.status(200).json({
      message: "Ticket updated successfully.",
      ticket
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update ticket.",
      error: error.message
    });
  }
});

// DELETE A NOTE FROM A TICKET
router.delete("/:ticket_id/notes/:note_id", async (req, res) => {
  try {
    const { ticket_id, note_id } = req.params;

    const ticket = await Ticket.findOne({ ticket_id });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found."
      });
    }

    // Find the note by its MongoDB subdocument ID
    const note = ticket.notes.id(note_id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found."
      });
    }

    // Delete the selected note only
    note.deleteOne();

    await ticket.save();

    return res.status(200).json({
      message: "Note deleted successfully.",
      ticket
    });
  } catch (error) {
    console.error("Delete note error:", error);

    return res.status(500).json({
      message: "Failed to delete note.",
      error: error.message
    });
  }
});

module.exports = router;

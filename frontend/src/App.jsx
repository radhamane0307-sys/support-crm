
import { useEffect, useState } from "react";
import API from "./services/api";
import "./App.css";

function App() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [newStatus, setNewStatus] = useState("Open");
  const [newNote, setNewNote] = useState("");

  // Automatically clear success messages after 2 seconds.
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => setSuccess(""), 2000);
    return () => clearTimeout(timer);
  }, [success]);

  // Fetch tickets when search or status changes.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets(search, status);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status]);

  const fetchTickets = async (
    searchValue = "",
    statusValue = ""
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/tickets", {
        params: {
          search: searchValue,
          status: statusValue,
        },
      });

      setTickets(response.data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setError("Unable to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Create a new ticket.
  const handleCreateTicket = async (event) => {
    event.preventDefault();
    setFormError("");
    setSuccess("");

    try {
      setSaving(true);

      const response = await API.post("/tickets", {
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim(),
        subject: formData.subject.trim(),
        description: formData.description.trim(),
      });

      setFormData({
        customer_name: "",
        customer_email: "",
        subject: "",
        description: "",
      });

      setShowForm(false);
      setSearch("");
      setStatus("");
      setSuccess(
        `Ticket created successfully! Ticket ID: ${response.data.ticket_id}`
      );

      await fetchTickets("", "");
    } catch (err) {
      console.error("Create ticket failed:", err);
      setFormError(
        err.response?.data?.message ||
          "Unable to create the ticket. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Load full ticket details.
  const openTicketDetails = async (ticketId) => {
    setSelectedTicket(null);
    setDetailError("");
    setNewNote("");
    setDetailLoading(true);

    try {
      const response = await API.get(
        `/tickets/${encodeURIComponent(ticketId)}`
      );

      setSelectedTicket(response.data);
      setNewStatus(response.data.status);
    } catch (err) {
      console.error("Failed to load ticket details:", err);
      setDetailError("Unable to load ticket details.");
    } finally {
      setDetailLoading(false);
    }
  };

  // Update status and optionally add a note.
  const handleUpdateTicket = async (event) => {
    event.preventDefault();

    if (!selectedTicket) return;

    if (
      newStatus === selectedTicket.status &&
      !newNote.trim()
    ) {
      setDetailError(
        "Please change the status or enter a new note before saving."
      );
      return;
    }

    setSaving(true);
    setDetailError("");

    try {
      const payload = { status: newStatus };

      if (newNote.trim()) {
        payload.notes = newNote.trim();
      }

      const response = await API.put(
        `/tickets/${encodeURIComponent(selectedTicket.ticket_id)}`,
        payload
      );

      setSelectedTicket(response.data.ticket);
      setNewStatus(response.data.ticket.status);
      setNewNote("");
      setSuccess("Ticket updated successfully.");

      await fetchTickets(search, status);
    } catch (err) {
      console.error("Ticket update failed:", err);
      setDetailError(
        err.response?.data?.message ||
          "Unable to update the ticket. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete a specific note.
  const handleDeleteNote = async (noteId) => {
    if (!selectedTicket || !noteId || saving) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this note? This action cannot be undone."
    );

    if (!confirmed) return;

    setSaving(true);
    setDetailError("");

    try {
      const response = await API.delete(
        `/tickets/${encodeURIComponent(selectedTicket.ticket_id)}/notes/${encodeURIComponent(noteId)}`
      );

      setSelectedTicket(response.data.ticket);
      setSuccess("Note deleted successfully.");

      await fetchTickets(search, status);
    } catch (err) {
      console.error("Delete note failed:", err);
      setDetailError(
        err.response?.data?.message ||
          "Unable to delete the note. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const closeDetails = () => {
    if (saving) return;

    setSelectedTicket(null);
    setDetailError("");
    setNewNote("");
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Support CRM</h1>
          <p>Customer Support Ticket Management</p>
        </div>

        <button
          className="create-btn"
          type="button"
          onClick={() => {
            setFormError("");
            setShowForm(true);
          }}
        >
          + Create Ticket
        </button>
      </header>

      {success && (
        <div className="success-message" role="status">
          {success}
        </div>
      )}

      <section className="toolbar">
        <input
          type="search"
          className="search-input"
          placeholder="Search by name, email, ticket ID, or description..."
          aria-label="Search tickets"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="status-filter"
          aria-label="Filter tickets by status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </section>

      <section className="stats">
        <div className="stat-card">
          <h3>Total Tickets</h3>
          <p>{tickets.length}</p>
        </div>

        <div className="stat-card">
          <h3>Open</h3>
          <p>
            {tickets.filter((ticket) => ticket.status === "Open").length}
          </p>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <p>
            {tickets.filter((ticket) => ticket.status === "In Progress").length}
          </p>
        </div>

        <div className="stat-card">
          <h3>Closed</h3>
          <p>
            {tickets.filter((ticket) => ticket.status === "Closed").length}
          </p>
        </div>
      </section>

      <section className="tickets-section">
        <div className="section-header">
          <h2>Tickets</h2>
          <span>{tickets.length} ticket(s)</span>
        </div>

        {loading ? (
          <div className="ticket-card">
            <p>Loading tickets...</p>
          </div>
        ) : error ? (
          <div className="ticket-card">
            <p role="alert">{error}</p>
            <button
              className="view-btn"
              type="button"
              onClick={() => fetchTickets(search, status)}
            >
              Try Again
            </button>
          </div>
        ) : tickets.length === 0 ? (
          <div className="ticket-card empty-state">
            <h3>No tickets found</h3>
            <p>Try a different search term or status filter.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <article className="ticket-card" key={ticket.ticket_id}>
              <div className="ticket-top">
                <div>
                  <h3>{ticket.subject}</h3>
                  <p className="ticket-id">{ticket.ticket_id}</p>
                </div>

                <span
                  className={`status-badge status-${ticket.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="ticket-info">
                <p>
                  <strong>Customer:</strong> {ticket.customer_name}
                </p>
                <p>
                  <strong>Email:</strong> {ticket.customer_email}
                </p>
                <p>
                  <strong>Description:</strong> {ticket.description}
                </p>
              </div>

              <div className="ticket-footer">
                <span>
                  Created: {new Date(ticket.createdAt).toLocaleString()}
                </span>

                <button
                  className="view-btn"
                  type="button"
                  onClick={() => openTicketDetails(ticket.ticket_id)}
                >
                  View Details →
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Create ticket modal */}
      {showForm && (
        <div
          className="modal-overlay"
          onClick={() => !saving && setShowForm(false)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-ticket-heading"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="create-ticket-heading">Create New Ticket</h2>
              <button
                className="close-btn"
                type="button"
                aria-label="Close form"
                disabled={saving}
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            {formError && (
              <p className="error-message" role="alert">
                {formError}
              </p>
            )}

            <form onSubmit={handleCreateTicket} className="form-layout">
              <label className="form-label">
                Customer Name *
                <input
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                  placeholder="Enter customer name"
                />
              </label>

              <label className="form-label">
                Customer Email *
                <input
                  name="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  required
                  maxLength={254}
                  placeholder="customer@example.com"
                />
              </label>

              <label className="form-label">
                Subject *
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  maxLength={150}
                  placeholder="Enter issue title"
                />
              </label>

              <label className="form-label">
                Description *
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  maxLength={3000}
                  rows={4}
                  placeholder="Describe the issue"
                />
              </label>

              <div className="button-row">
                <button
                  type="button"
                  className="secondary-btn"
                  disabled={saving}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="create-btn"
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket details modal */}
      {(selectedTicket || detailLoading || detailError) && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-details-heading"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="ticket-details-heading">Ticket Details</h2>
              <button
                className="close-btn"
                type="button"
                aria-label="Close ticket details"
                disabled={saving}
                onClick={closeDetails}
              >
                ×
              </button>
            </div>

            {detailLoading ? (
              <p>Loading ticket details...</p>
            ) : detailError && !selectedTicket ? (
              <p className="error-message" role="alert">
                {detailError}
              </p>
            ) : selectedTicket ? (
              <>
                <div className="details-box">
                  <h3>{selectedTicket.subject}</h3>
                  <p>
                    <strong>Ticket ID:</strong> {selectedTicket.ticket_id}
                  </p>
                  <p>
                    <strong>Customer:</strong> {selectedTicket.customer_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedTicket.customer_email}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedTicket.description}
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(selectedTicket.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Current Status:</strong> {selectedTicket.status}
                  </p>
                </div>

                <h3 className="notes-heading">Notes / Comments</h3>

                {selectedTicket.notes?.length > 0 ? (
                  <div className="notes-list">
                    {selectedTicket.notes.map((note, index) => (
                      <div className="note-card" key={note._id || index}>
                        <p className="note-text">{note.note_text}</p>

                        <div className="note-footer">
                          <small>
                            {note.created_at
                              ? new Date(note.created_at).toLocaleString()
                              : ""}
                          </small>

                          {note._id && (
                            <button
                              type="button"
                              className="delete-note-btn"
                              disabled={saving}
                              onClick={() => handleDeleteNote(note._id)}
                            >
                              {saving ? "Deleting..." : "Delete"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="muted-text">No notes have been added yet.</p>
                )}

                <form onSubmit={handleUpdateTicket} className="form-layout">
                  <label className="form-label">
                    Update Status
                    <select
                      value={newStatus}
                      onChange={(event) => setNewStatus(event.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </label>

                  <label className="form-label">
                    Add Note (Optional)
                    <textarea
                      value={newNote}
                      onChange={(event) => setNewNote(event.target.value)}
                      rows={3}
                      maxLength={2000}
                      placeholder="Enter an internal support note..."
                    />
                  </label>

                  {detailError && (
                    <p className="error-message" role="alert">
                      {detailError}
                    </p>
                  )}

                  <div className="button-row">
                    <button
                      type="button"
                      className="secondary-btn"
                      disabled={saving}
                      onClick={closeDetails}
                    >
                      Close
                    </button>

                    <button
                      type="submit"
                      className="create-btn"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

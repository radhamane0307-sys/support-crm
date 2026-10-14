# Support CRM — Customer Support Ticket Management System

A full-stack Customer Support CRM application built using React, Node.js, Express.js, and MongoDB.


## Live Demo

- **Live Application:** https://support-crm-frontend-4bqt.onrender.com/
- **Backend API:** https://support-crm-backend-hspw.onrender.com
- **GitHub Repository:** https://github.com/radhamane0307-sys/support-crm


## About the Project

Support CRM is a web application designed to manage customer support tickets in one place. It helps users create tickets, view customer issues, search and filter tickets, update ticket statuses, and manage ticket notes.

This project demonstrates full-stack web development, REST API integration, database operations, form validation, and data persistence.

## Features

- Create new customer support tickets
- Generate unique ticket IDs
- View ticket details
- Display tickets on a dashboard
- Search and filter tickets
- Filter tickets by status
- Update ticket status
- Add notes to tickets
- Delete individual notes
- Validate required form fields
- Validate customer email addresses
- Store ticket data in MongoDB
- Preserve saved changes after refreshing the page

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- HTML5
- CSS3
- Axios

### Backend
- Node.js
- Express.js
- Mongoose
- REST APIs

### Database
- MongoDB Atlas

### Development and Testing Tools
- Visual Studio Code
- Postman
- Git
- GitHub

## Application Architecture

The application follows a client-server architecture.

```text
User
  |
  v
React Frontend
  |
  v
Axios HTTP Requests
  |
  v
Node.js + Express Backend
  |
  v
Mongoose
  |
  v
MongoDB Atlas
```

The frontend sends HTTP requests to the backend API. The backend processes requests, communicates with MongoDB through Mongoose, and returns responses to the frontend.

## Project Structure

```text
support-crm/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

Note: This is a simplified overview. Refer to the actual project files for the complete directory structure. Keep `.env.example` entries only if those files exist in the repository.

## Prerequisites

Before running the project, install:

- Node.js and npm
- Git
- Visual Studio Code (recommended)
- A MongoDB Atlas account or an accessible MongoDB instance
- Postman (optional, for API testing)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/radhamane0307-sys/support-crm.git
cd support-crm
```

### 2. Set Up the Backend

Open a terminal in the project root and run:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory. Configure the required environment variables according to the backend code.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Replace the example MongoDB value with your own connection string. Never publish your real credentials.

Start the backend:

```bash
npm run dev
```

The backend is expected to run at:

`http://localhost:5000`

### 3. Set Up the Frontend

Open a second terminal in VS Code and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal by Vite. It is commonly:

`http://localhost:5173`

If your frontend uses a configurable API base URL, set the appropriate variable in the frontend environment file according to the existing frontend code.

### 4. Verify the Application

1. Open the frontend in your browser.
2. Create a test ticket.
3. Check that the ticket appears on the dashboard.
4. Open the ticket details.
5. Search for a ticket and test the status filters.
6. Update a ticket status.
7. Add and delete a note.
8. Refresh the page and verify that saved changes remain.
9. Verify the stored ticket data in MongoDB Atlas.

## API Documentation

The backend exposes REST API routes for ticket management.

The exact endpoint paths and HTTP methods must match the implementation in `backend/routes/ticketRoutes.js`.

Common ticket operations include:

| Operation | HTTP Method | Purpose |
|---|---|---|
| Create ticket | POST | Create a new support ticket |
| List tickets | GET | Retrieve support tickets |
| View ticket | GET | Retrieve a specific ticket |
| Update ticket | PUT or PATCH | Update ticket details or status |

For exact URLs, request parameters, request bodies, and response examples, refer to the actual route definitions and controller logic in the backend.

## Environment Variables

The backend may use the following variables, depending on its implementation:

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the backend server |
| `MONGO_URI` | MongoDB connection string |

If the frontend supports a configurable API URL, document its actual environment variable name after verifying the frontend source code.

**Security:** Never commit `.env` files, database passwords, access tokens, or API keys to GitHub. Use `.env.example` to document variable names with placeholder values only.

## Testing

The following application features have been manually tested during development:

- Ticket creation
- Unique ticket ID generation
- Ticket details viewing
- Status filtering
- Ticket status updates
- Adding and deleting notes
- Required-field validation
- Invalid email validation
- Whitespace-only name validation
- Data persistence after refreshing the page
- Verification of saved ticket data in MongoDB Atlas

## Future Improvements

- User authentication and authorization
- Support agent assignment
- Ticket priority management
- Advanced search and pagination
- Automated unit and integration tests
- Email notifications
- Production deployment and monitoring

## Author

**Radha Mane**

Project: Support CRM — Customer Support Ticket Management System

GitHub Repository:  
https://github.com/radhamane0307-sys/support-crm

## License

No open-source license is specified currently. Add a suitable license file if you decide to distribute the project under an open-source license.

# Problem: Deploy a Three-Tier Student Information Management System

## Objective

Design, develop, and deploy a Student Information Management System using a three-tier cloud architecture. The three tiers must be independently hosted and communicate through secure REST APIs:

```text
Web Browser → Netlify Frontend → Render Backend/API → MongoDB Atlas
```

The completed system must be accessible through a public web URL and support end-to-end student record management.

## Required tiers

### 1. Presentation tier — Netlify

Build a browser-based frontend using HTML/CSS/JavaScript or React. It must provide interfaces for:

- adding a student;
- viewing all students;
- searching for a student;
- editing student details; and
- deleting a student.

The frontend must call the Render API over HTTPS and must not connect directly to MongoDB Atlas.

### 2. Application tier — Render

Build and deploy a Node.js/Express REST API on Render. The API must validate requests, perform business logic, communicate with MongoDB Atlas, and return useful success and error responses.

Implement these endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/students` | Return all students |
| `GET` | `/api/students/:id` | Return one student |
| `POST` | `/api/students` | Create a student |
| `PUT` | `/api/students/:id` | Update a student |
| `DELETE` | `/api/students/:id` | Delete a student |

### 3. Database tier — MongoDB Atlas

Create a MongoDB Atlas database named `studentDB` with a `students` collection. Each student must contain at least:

```json
{
  "studentId": "ST101",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "department": "Computer Science",
  "semester": 5,
  "contact": "9876543210"
}
```

`studentId` must uniquely identify a student.

## Functional requirements

The application must:

1. Add a student after validating required fields and valid semester data.
2. Display all stored students.
3. Search for a student by `studentId`.
4. Update an existing student.
5. Delete a student.
6. Display clear confirmation messages for successful operations.
7. Display suitable error messages for invalid input, missing records, duplicate IDs, and server/database failures.

## Security and deployment requirements

- Store the MongoDB connection string in the Render environment variable `MONGODB_URI`.
- Configure `PORT` through an environment variable, with a suitable local default.
- Configure `FRONTEND_URL` to contain the deployed Netlify URL.
- Configure CORS so that only the authorized frontend origin can call the API.
- Use HTTPS for deployed communication.
- Never expose database credentials in frontend code or committed source files.
- Validate all important input on the backend, even if the frontend also validates it.
- Do not return database credentials, stack traces, or other confidential server details in API responses.

## Expected project structure

Keep the frontend and backend as independently deployable applications. A possible backend structure is:

```text
backend/
├── server.js
├── package.json
├── models/
│   └── Student.js
├── routes/
│   └── studentRoutes.js
├── controllers/
│   └── studentController.js
└── config/
    └── database.js
```

The frontend must obtain the backend URL from configuration rather than hard-coding database details.

## Acceptance tests

Use the following data for an end-to-end demonstration:

```json
{
  "studentId": "ST101",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "department": "CSE",
  "semester": 5,
  "contact": "9876543210"
}
```

Verify that:

1. `POST /api/students` creates the record and the frontend reports success.
2. `GET /api/students` returns the record and displays it in the frontend.
3. `GET /api/students/ST101` returns the correct student.
4. `PUT /api/students/ST101` changes the semester from `5` to `6`.
5. `DELETE /api/students/ST101` removes the record.
6. MongoDB Atlas reflects every create, update, and delete operation.
7. A request from an unauthorized origin is rejected by CORS.
8. Invalid input and nonexistent student IDs produce appropriate HTTP error responses.

## Deliverables

Submit:

- the frontend source code;
- the backend source code;
- deployment URLs for Netlify and Render;
- the MongoDB database and collection names;
- a README containing local setup and deployment instructions;
- a list of environment variables without revealing secret values; and
- screenshots or a short demonstration proving the acceptance tests passed.

## Learning goal

Demonstrate that presentation, application, and database tiers can be developed, secured, deployed, scaled, and tested independently while operating as one cloud-hosted application.

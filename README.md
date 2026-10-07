# Aqua Nexus

Aqua Nexus is a full-stack web application designed to connect and manage interactions between **farmers and vendors** through a centralized platform.

The project is built with a **Django backend** and a **React + Vite frontend**, providing a structured architecture for backend APIs, business logic, and a modern web interface.

---

## Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- SQLite for local development

### Frontend
- React
- TypeScript
- Vite
- CSS

### Development Tools
- Git
- GitHub
- npm
- Python virtual environment

---

## Project Structure

```text
Aqua-Nexus/
│
├── backend/
│   ├── product/
│   │   ├── migrations/
│   │   ├── models.py
│   │   └── ...
│   ├── manage.py
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Farmer/
│   │   │   └── Vendor/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

## Key Areas

### Farmer

The farmer-facing section provides functionality for farmers to interact with the platform and manage their activities related to vendors and products.

### Vendor

The vendor-facing section provides functionality for vendors to interact with farmer-related data and manage their activities through the platform.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/jowinjoe10-alt/Aqua-Nexus.git
cd Aqua-Nexus
```

---

## Backend Setup

Move into the backend directory:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend will normally be available at:

```text
http://127.0.0.1:8000/
```

---

## Frontend Setup

Open another terminal and move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

---

## Environment Variables

Environment-specific configuration should be stored in `.env` files.

**Do not commit secrets or credentials to GitHub.**

A sample environment file can be provided as:

```text
.env.example
```

with placeholder values instead of real credentials.

---

## Database

Aqua Nexus currently uses **SQLite for local development**.

The local database file is intentionally excluded from Git through `.gitignore`:

```text
backend/db.sqlite3
```

After cloning the repository, create the database structure using:

```bash
python manage.py migrate
```

---

## Git Workflow

The project uses Git for version control.

Typical workflow:

```bash
git status
git add .
git commit -m "Describe your changes"
git push
```

Before committing, make sure sensitive files and generated dependencies are excluded through `.gitignore`.

---

## Development Notes

The repository intentionally excludes files and directories that should not be stored in source control, including:

- Python virtual environments
- `node_modules`
- Build output
- `.env` files
- SQLite database
- Python cache files
- IDE configuration
- Operating-system generated files

---

## Future Improvements

Potential areas for continued development include:

- Additional farmer/vendor workflows
- Improved authentication and authorization
- API validation and error handling
- Automated testing
- Production database configuration
- Dockerization
- Production deployment
- CI/CD pipeline
- Improved documentation

---

## Project Status

**Active Development**

Aqua Nexus is currently under development and may undergo changes to its architecture, features, and API structure.

---

## Repository

GitHub:

https://github.com/jowinjoe10-alt/Aqua-Nexus

---

## License

No license has currently been specified for this project.

# Kano Case Filing System

A full-stack automated case filing management system built as a Kano State case study.

## Structure

- `backend/`: Express + TypeScript API, SQLite persistence, audit logging, analytics.
- `frontend/`: React + Vite dashboard for case filing and management.

## Setup

1. Open terminal in `backend`
   - `npm install`
   - `npm run dev`

2. Open terminal in `frontend`
   - `npm install`
   - `npm run dev`

3. Backend API runs at `http://localhost:4000`
   Frontend runs at `http://localhost:5173`

Login credential for seeded admin:
- email: `admin@kano.gov.ng`
- password: `Admin123!`

## Features

- Case creation and listing
- User and court management
- Document upload API model
- Audit trail storage
- Simple analytic summaries
- Kano State configuration defaults

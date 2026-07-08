# MSME Financial Health Card - Credit Assessment Platform

An AI/ML-driven alternative data credit scoring engine designed for New-to-Credit (NTC) and New-to-Bank (NTB) MSMEs, matching the IDBI Innovate hackathon submission template criteria. 

This prototype aggregates alternate data sources (GST, UPI, Account Aggregator, EPFO payroll records) to generate a multi-dimensional, explainable score mapped to the 300-900 Credit Score range.

## 🚀 Key Features
1. **Consent-Based Data Aggregation Flow**: Simulated integration of Account Aggregator (AA), GSTN APIs, EPFO, and UPI QR merchants.
2. **5-Dimensional Scoring Engine**: Computes risk dimensions (Liquidity, Stability, Growth, Compliance, and Repayment Behavior) instead of an opaque black-box number.
3. **Explainable AI (SHAP-Based Reasoning)**: Features live SHAP impact charts for every dimension so lenders and underwriters can understand the exact reason behind a score.
4. **Lender Weight Configurator**: Allows underwriters to adjust scoring weights in real-time according to product type (Term Loan vs. Working Capital Line).
5. **ULI / OCEN Payloads**: Exposes fully standardized JSON payload structures ready for Unified Lending Interface plug-and-play handoff.

---

## 🛠️ Tech Stack
- **Backend**: Python 3.14+, FastAPI, Uvicorn
- **Frontend**: React, Vite, Recharts, Lucide Icons

---

## 📋 How to Run the Project

### 1. Run the Python FastAPI Backend (Optional)
The frontend has a built-in client-side calculation fallback, but you can run the FastAPI server to access the API endpoints and test ULI payloads:

```bash
# From the project root (d:\Idbi)
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows (PowerShell):
venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic numpy

# Start the server
python -m uvicorn backend.main:app --reload
```

The API docs will be available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Run the React Frontend
Open another terminal or command prompt:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start the local development server
npm run dev
```

Open your browser at: [http://localhost:5173](http://localhost:5173) (or the URL printed by Vite).

---

## 📂 Project Structure
- `backend/`
  - `main.py`: FastAPI server configuration & routing
  - `scoring_engine.py`: Numerical rules, scoring algorithms, and SHAP calculations
  - `mock_data.py`: Pre-configured MSME customer profiles
- `frontend/`
  - `src/App.jsx`: Fully interactive dashboard component & simulations
  - `src/App.css`: Premium layout design system (neon highlights, glassmorphism)
  - `package.json`: NPM package configuration

# WTTJ Salary Predictor – Browser Extension + Flask API

A lightweight browser extension that automatically predicts the salary of job offers on **Welcome to the Jungle (WTTJ)** using a Machine Learning model (**CatBoost**) trained on job‑market data.

When you open any WTTJ job offer page, the extension:

- Extracts key job information
- Sends it to a local Flask API
- Runs a CatBoost regression model
- Displays the **predicted salary directly on the page**

---

## Features

### Automatic Job Data Extraction

The browser extension scrapes the following fields from the job page:

- Job title
- Job description
- Location
- Company name
- Number of employees
- Year of creation
- Technical skills (Python, R, Spark, AWS, Excel)
- Seniority level
- Simplified job title
- Description length

---

## Machine Learning Model

- **Algorithm**: `CatBoostRegressor`
- Handles text, categorical, and numeric features
- Very fast and efficient inference
- Fully integrated in the local Flask API

---

## On‑Page Salary Display

The extension injects a clean UI widget showing:

**Estimated salary: _XX.X k€_**

This appears dynamically on any WTTJ job offer page.

---

## Project Structure

```
project/
│
├── backend/
│   ├── app.py
│   ├── final_catboost_model.pkl
│   └── requirements.txt
│
└── extension/
    ├── manifest.json
    ├── content.js
    ├── icon.png
    └── styles.css
```

---

## Installation & Setup

### Clone the repository

```bash
git clone https://github.com/LunaGrandjean/salary-prediction
cd salary-prediction
```

---

## Backend (Flask API)

### Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Run the server

```bash
python app.py
```

The API will be available at:

**http://127.0.0.1:5000/predict**

---

## Browser Extension

### Load the extension in Chrome

1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension/` folder

Once loaded, the extension automatically activates on WTTJ job pages.

---

## 🔗 Workflow

1. User opens a WTTJ job offer
2. `content.js` extracts job fields
3. The script sends data to the Flask API
4. CatBoost predicts the salary
5. The extension displays the result on the page

---

## Privacy

- Runs **100% locally**
- **No data sent to third‑party servers**
- No tracking, no persistence, no analytics

Your job browsing stays private.

---

## Author

**Luna Grandjean Stefano**
**Anna Bordachar**

---

# WTTJ Salary Predictor – Browser Extension + Flask API

A lightweight browser extension that automatically **predicts the salary** of job offers on *Welcome to the Jungle* (WTTJ) using a **Machine Learning model (CatBoost)** trained on job market data.

When you visit any job offer page on WTTJ, the extension:
- Extracts key information from the page (title, description, company, location…)
- Sends the data to a local Flask API
- Runs a **CatBoost regression model**
- Displays the **estimated salary** directly on the page

---

## Features

### Automatic Job Data Extraction
The extension scrapes:
- Job title  
- Job description  
- Location  
- Company name  
- **Number of employees**  
- **Year of creation**  
- Technical skills (Python, R, Spark, AWS, Excel)  
- Seniority level  
- Job title simplification (data scientist / analyst / engineer)  
- Description length  

### Machine Learning Model
- Trained using **CatBoostRegressor**
- Handles text + categorical + numerical features
- Model loaded using `joblib`
- Prediction is returned in milliseconds

### On-Page Salary Display
The extension injects a clean UI component in the page:


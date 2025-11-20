from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load model
model = joblib.load("final_catboost_model.pkl")
print("CatBoost model loaded")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    X = pd.DataFrame([{
        "job_description": data.get("job_description", ""),
        "rating": data.get("rating", 0),
        "location": data.get("location", ""),
        "founded": data.get("founded", 0),
        "type_of_ownership": data.get("type_of_ownership", ""),
        "sector": data.get("sector", ""),
        "company_txt": data.get("company_txt", ""),
        "age": data.get("age", 0),
        "python_yn": data.get("python_yn", 0),
        "r_yn": data.get("r_yn", 0),
        "spark": data.get("spark", 0),
        "aws": data.get("aws", 0),
        "excel": data.get("excel", 0),
        "job_simp": data.get("job_simp", ""),        # même si vide → string OK
        "seniority": data.get("seniority", ""),      # idem
        "desc_len": data.get("desc_len", 0),
        "size_min_employees": data.get("size_min_employees", 0),
        "size_max_employees": data.get("size_max_employees", 0),
        "revenue_min": data.get("revenue_min", 0),
        "revenue_max": data.get("revenue_max", 0),
    }])

# à changer car catboost est capable de gerer les na plutot que de les remplacer par 0

    # FORCER LES TYPES EXACTS ATTENDUS PAR LE MODÈLE
    numeric_cols = [
        "rating", "founded", "age",
        "python_yn", "r_yn", "spark", "aws", "excel",
        "desc_len",
        "size_min_employees", "size_max_employees",
        "revenue_min", "revenue_max"
    ]

    for col in numeric_cols:
        X[col] = X[col].astype(float)

    # CatBoost prediction
    y_pred = model.predict(X)[0]

    return jsonify({"pred_salary": float(y_pred)})

if __name__ == "__main__":
    app.run(debug=True)

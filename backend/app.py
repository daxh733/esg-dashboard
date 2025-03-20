from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Allow frontend access

# Full ESG Data for multiple companies (unchanged)
esg_data = {
    "Infosys Limited": {
        "carbon_footprint": 50.3,
        "energy_efficiency": 85,
        "waste_management": 90,
        "employee_diversity": 45,
        "board_diversity": 30,
        "compliance_score": 95
    },
    "Tata Steel Limited": {
        "carbon_footprint": 70.1,
        "energy_efficiency": 80,
        "waste_management": 88,
        "employee_diversity": 42,
        "board_diversity": 35,
        "compliance_score": 90
    },
    "BSE Limited": {
        "carbon_footprint": 40.5,
        "energy_efficiency": 90,
        "waste_management": 93,
        "employee_diversity": 50,
        "board_diversity": 25,
        "compliance_score": 97
    },
    "Reliance Industries": {
        "carbon_footprint": 95.2,
        "energy_efficiency": 70,
        "waste_management": 85,
        "employee_diversity": 38,
        "board_diversity": 28,
        "compliance_score": 88
    },
    "HDFC Bank": {
        "carbon_footprint": 30.0,
        "energy_efficiency": 92,
        "waste_management": 95,
        "employee_diversity": 55,
        "board_diversity": 40,
        "compliance_score": 99
    }
}

# Function to calculate risk and investment recommendation
def analyze_esg(data):
    risk_factor = "Low Risk" if data["carbon_footprint"] < 50 and data["compliance_score"] > 90 else (
        "Moderate Risk" if data["carbon_footprint"] < 65 else "High Risk"
    )
    
    recommendation = "Good for Long-term Investment" if risk_factor == "Low Risk" else (
        "Potential but Requires ESG Improvements" if risk_factor == "Moderate Risk" else "Risky for Growth"
    )

    data["risk_factor"] = risk_factor
    data["investment_recommendation"] = recommendation
    return data

# API to get the list of available companies
@app.route("/api/companies", methods=["GET"])
def get_companies():
    return jsonify(list(esg_data.keys()))

# API to get ESG data for a selected company
@app.route("/api/esg/<string:company_name>", methods=["GET"])
def get_esg_data(company_name):
    company_name = company_name.strip()

    if company_name in esg_data:
        company_esg = analyze_esg(esg_data[company_name])
        return jsonify({"company": company_name, **company_esg})
    
    return jsonify({"error": "Company not found"}), 404

if __name__ == "__main__":
    app.run(port=5050, debug=True)
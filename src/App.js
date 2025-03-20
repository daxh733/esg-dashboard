import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ESGDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [esgData, setEsgData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5050/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  const fetchESGData = (company) => {
    setSelectedCompany(company);
    fetch(`http://127.0.0.1:5050/api/esg/${encodeURIComponent(company)}`)
      .then((res) => res.json())
      .then((data) => setEsgData(data))
      .catch((err) => console.error("Error fetching ESG data:", err));
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-green-900 text-white p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold">🌱 ESG Analysis</h1>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8 flex flex-col">
        {/* Search Dropdown - Right aligned */}
        <div className="flex justify-end mb-6">
          <select
            value={selectedCompany}
            onChange={(e) => fetchESGData(e.target.value)}
            className="p-3 border rounded-lg text-lg bg-white shadow-md"
          >
            <option value="">Select a Company</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        {/* ESG Data Display */}
        {esgData && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">{esgData.company}</h2>
            <ul className="mt-4 space-y-2">
              {Object.entries(esgData).map(([key, value]) =>
                key !== "company" ? (
                  <li key={key} className="text-lg">
                    <strong className="capitalize text-green-700">{key.replace("_", " ")}:</strong> {value}
                  </li>
                ) : null
              )}
            </ul>

            {/* Risk Factor and Investment Recommendation */}
            <div
              className="mt-6 p-4 text-center rounded-lg text-white font-bold text-lg"
              style={{
                backgroundColor: esgData.risk_factor === "Low Risk" ? "green" :
                  esgData.risk_factor === "Moderate Risk" ? "orange" : "red"
              }}
            >
              {esgData.investment_recommendation}
            </div>

            {/* ESG Data Visualization */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-700 text-center">ESG Metrics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "Carbon Footprint", value: esgData.carbon_footprint },
                    { name: "Energy Efficiency", value: esgData.energy_efficiency },
                    { name: "Waste Management", value: esgData.waste_management },
                    { name: "Employee Diversity", value: esgData.employee_diversity },
                    { name: "Board Diversity", value: esgData.board_diversity },
                    { name: "Compliance Score", value: esgData.compliance_score }
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#2ECC71" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ESGDashboard;

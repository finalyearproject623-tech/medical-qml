import { useEffect, useState } from "react";
import API from "../api/api";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const colors = [
  "bg-purple-600",
  "bg-blue-600",
  "bg-pink-600",
  "bg-green-600",
  "bg-orange-500",
  "bg-indigo-600"
];

const formatIST = (time) => {
  const date = new Date(time);
  const ist = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));

  return ist.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};

const AdminDashboard = ({ setIsLoggedIn }) => {

  const [history, setHistory] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {

    API.get("/admin/history")
      .then((res) => setHistory(res.data.reverse()))
      .catch(() => console.log("History not available"));

  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  const userMap = {};

  history.forEach((item) => {
    if (!userMap[item.email]) {
      userMap[item.email] = [];
    }
    userMap[item.email].push(item);
  });

  const users = Object.keys(userMap);

  const totalUsers = users.length;
  const totalPredictions = history.length;

  const diseaseTotal = history.filter(
    (p) => p.final_prediction === "Heart Disease"
  ).length;

  const normalTotal = totalPredictions - diseaseTotal;

  const diseasePercent =
    totalPredictions === 0
      ? 0
      : ((diseaseTotal / totalPredictions) * 100).toFixed(1);

  const normalPercent =
    totalPredictions === 0
      ? 0
      : ((normalTotal / totalPredictions) * 100).toFixed(1);

  const topUser =
    users.sort((a, b) => userMap[b].length - userMap[a].length)[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-purple-100">

      {/* HEADER */}
      <div className="flex justify-between items-center bg-white shadow px-8 py-4">
        <h1 className="text-3xl font-bold text-purple-700">
          👑 Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="p-8">

        {/* ANALYTICS CARDS */}
        {!selectedUser && (
          <div className="grid md:grid-cols-5 gap-6 mb-10">

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">Total Users</p>
              <h2 className="text-3xl font-bold text-purple-600">
                {totalUsers}
              </h2>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">Total Predictions</p>
              <h2 className="text-3xl font-bold text-blue-600">
                {totalPredictions}
              </h2>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">Heart Disease %</p>
              <h2 className="text-3xl font-bold text-red-500">
                {diseasePercent}%
              </h2>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">Normal %</p>
              <h2 className="text-3xl font-bold text-green-500">
                {normalPercent}%
              </h2>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">Top Active User</p>
              <h2 className="text-sm font-semibold text-gray-800">
                {topUser || "N/A"}
              </h2>
            </div>

          </div>
        )}

        {/* USER LIST */}
        {!selectedUser && (
          <>
            <h2 className="text-2xl font-bold mb-6">
              Users & Prediction Count
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {users.map((email, index) => {

                const letter = email.charAt(0).toUpperCase();
                const color = colors[index % colors.length];

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedUser(email)}
                    className="bg-white p-6 rounded-xl shadow hover:shadow-xl cursor-pointer flex items-center gap-4 border-l-4 border-purple-600 transition"
                  >

                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold ${color}`}
                    >
                      {letter}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        {email}
                      </p>

                      <p className="text-gray-500 text-sm">
                        Predictions: {userMap[email].length}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>
          </>
        )}

        {/* USER DETAILS */}
        {selectedUser && (
          <>
            <button
              onClick={() => setSelectedUser(null)}
              className="mb-6 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold mb-6">
              Predictions for {selectedUser}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {userMap[selectedUser]
              .sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))
              .map((item,index)=>(

                <div
                key={index}
                className="bg-white p-5 rounded-xl shadow border-l-4 border-purple-600"
                >

                  <p className="font-semibold text-purple-700">
                    🔥 {item.final_prediction}
                  </p>

                  <p>
                    Final Confidence:
                    {(item.final_confidence*100).toFixed(2)}%
                  </p>

                  <p>
                    ⚛️ Quantum:
                    {(item.quantum_confidence*100).toFixed(2)}%
                  </p>

                  <p>
                    🧠 Classical:
                    {(item.classical_confidence*100).toFixed(2)}%
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    {formatIST(item.created_at)}
                  </p>

                </div>

              ))}

            </div>

          </>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
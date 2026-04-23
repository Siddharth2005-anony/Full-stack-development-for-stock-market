import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Bars({ company }) {
  const revenueSeries = company?.annualRevenue || [];
  const labels = revenueSeries.length ? revenueSeries.map((entry) => entry.year) : ["N/A"];
  const values = revenueSeries.length ? revenueSeries.map((entry) => entry.value) : [0];
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#0b1220",
          font: { weight: 600 },
        },
      },
      title: {
        display: true,
        text: `${company?.symbol || "Company"} Annual Revenue Snapshot (Dummy Data)`,
        color: "#0b1220",
        font: { size: 15, weight: "bold" },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(11, 18, 32, 0.08)" },
        ticks: { color: "#3a4a68" },
      },
      y: {
        grid: { color: "rgba(11, 18, 32, 0.08)" },
        ticks: {
          color: "#3a4a68",
          callback: (value) => `₹${value}T`,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: `${company?.name || "Company"} Revenue (₹ Trillion)`,
        data: values,
        backgroundColor: "rgba(0, 179, 159, 0.55)",
        borderColor: "#007f73",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}

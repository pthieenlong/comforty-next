"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function RevenueChart() {
  const labels = [
    "Th1",
    "Th2",
    "Th3",
    "Th4",
    "Th5",
    "Th6",
    "Th7",
    "Th8",
    "Th9",
    "Th10",
    "Th11",
    "Th12",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Doanh thu (triệu VND)",
        data: labels.map(() => Math.round(50 + Math.random() * 150)),
        fill: true,
        borderColor: "#111111",
        backgroundColor: "rgba(17,17,17,0.08)",
        pointRadius: 2,
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#efefef" } },
    },
  };

  return (
    <div className="h-[320px]">
      <Line options={options} data={data} />
    </div>
  );
}

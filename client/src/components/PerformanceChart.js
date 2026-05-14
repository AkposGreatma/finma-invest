import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getPerformanceTrend } from "../services/api";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

function PerformanceChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await getPerformanceTrend();

        setChartData({
          labels: res.data.labels,
          datasets: [
            {
              label: "Portfolio Value",
              data: res.data.values,
              borderColor: "#10B981",
              backgroundColor: "rgba(16,185,129,0.1)",
              tension: 0.4,
              fill: true,
              pointRadius: 4,
            },
          ],
        });
      } catch (error) {
        console.error("Error loading performance trend:", error);
      }
    };

    fetchTrend();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => "₦" + value.toLocaleString(),
        },
      },
    },
  };

  if (!chartData) {
    return <p>Loading chart...</p>;
  }

  return <Line data={chartData} options={options} />;
}

export default PerformanceChart;
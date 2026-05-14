import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { getAssetAllocation } from "../services/api";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function AssetAllocationChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchAllocation = async () => {
      try {
        const res = await getAssetAllocation();

        setChartData({
          labels: res.data.labels,
          datasets: [
            {
              label: "Asset Allocation",
              data: res.data.values,
              backgroundColor: [
                "#10B981",
                "#0EA5E9",
                "#8B5CF6",
                "#F59E0B",
              ],
              borderColor: "#FFFFFF",
              borderWidth: 3,
              hoverOffset: 8,
            },
          ],
        });
      } catch (error) {
        console.error("Error loading asset allocation:", error);
      }
    };

    fetchAllocation();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 18,
          color: "#334155",
          font: {
            size: 13,
            family: "Inter",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;

            return `${context.label}: ₦${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  if (!chartData) {
    return <p>Loading chart...</p>;
  }

  return <Pie data={chartData} options={options} />;
}

export default AssetAllocationChart;
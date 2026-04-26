import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

function PriceChart({ history = [] }) {
  const data = {
    labels: history.map((item) =>
      new Date(item.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Price",
        data: history.map((item) => Number(item.price)),
        borderColor: "#D4AF37",
        backgroundColor: "#D4AF37",
        tension: 0.4,
      },
    ],
  };

  if (!history.length) {
    return (
      <div className="card-luxury rounded-xl p-6">
        <h3 className="font-luxury text-2xl mb-2">Price History</h3>
        <p className="text-gray-400">No price history available yet.</p>
      </div>
    );
  }

  return (
    <div className="card-luxury rounded-xl p-6">
      <h3 className="font-luxury text-2xl mb-4">Price History</h3>
      <Line data={data} />
    </div>
  );
}

export default PriceChart;
import Backoffice from "../../components/ฺBackoffice";
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, plugins,} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
function DashBoard() {

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Mothly Sales',
                data: [10, 20, 30, 40, 50],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]

    }
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Monthly Seles Data'
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }

    return <Backoffice>
        <Bar data={data} options={options} />
    </Backoffice>
}
export default DashBoard;
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Budget() {
  const navigate = useNavigate();

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('monthlyBudget');
    return saved ? Number(saved) : 3000;
  });

  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Food', amount: 450 },
    { id: 2, category: 'Rent', amount: 1200 },
    { id: 3, category: 'Transport', amount: 300 }
  ]);

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const progressPercentage = Math.min((totalExpenses / budget) * 100, 100);

  useEffect(() => {
    localStorage.setItem('monthlyBudget', budget.toString());
  }, [budget]);

  const chartData = {
    labels: ['Budget Progress'],
    datasets: [
      {
        label: 'Spent',
        data: [totalExpenses],
        backgroundColor: '#FF6384',
      },
      {
        label: 'Remaining',
        data: [Math.max(budget - totalExpenses, 0)],
        backgroundColor: '#36A2EB',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        max: budget
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 bg-gray-300 rounded-full hover:bg-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      {/* Sign Out Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center">Budget Management</h1>

      {/* Budget Setting Card */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Budget Goal</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">₹</span>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="flex-1 p-2 border rounded"
            min="0"
            step="100"
          />
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setBudget(Number(budget))}
          >
            Update
          </button>
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Budget Progress</h2>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Spent: ₹{totalExpenses.toFixed(2)}</span>
            <span className="font-medium">Remaining: ₹{Math.max(budget - totalExpenses, 0).toFixed(2)}</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-red-500 to-yellow-500"
              style={{ width: `₹{progressPercentage}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>0%</span>
            <span>{progressPercentage.toFixed(1)}%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="mt-6">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
        <div className="space-y-2">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex justify-between p-2 border-b">
              <span className="font-medium">{expense.category}</span>
              <span className="text-red-600">-₹{expense.amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between p-2 font-bold border-t">
            <span>Total Expenses</span>
            <span className="text-red-600">-₹{totalExpenses.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Load budget from localStorage
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('monthlyBudget');
    return saved ? Number(saved) : 3000;
  });

  // Sample transactions data (replace with your actual data source)
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2023-06-01', description: 'Grocery', category: 'Food', amount: 85.50, type: 'expense' },
    { id: 2, date: '2023-06-05', description: 'Salary', category: 'Income', amount: 2500.00, type: 'income' },
    { id: 3, date: '2023-06-10', description: 'Rent', category: 'Housing', amount: 1200.00, type: 'expense' },
    { id: 4, date: '2023-06-15', description: 'Freelance Work', category: 'Income', amount: 800.00, type: 'income' }
  ]);

  // Calculate financial summary
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  const budgetProgress = Math.min((expenses / budget) * 100, 100);
  const remainingBudget = budget - expenses;

  // Prepare category data for charts
  const categories = ['Food', 'Housing', 'Transport', 'Entertainment', 'Other'];
  
  const spendingData = categories.map(category => 
    transactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // Monthly trend data (sample)
  const monthlyTrends = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    income: [2500, 2400, 2600, 2450, 2550, 2700],
    expenses: [2200, 2300, 2100, 2350, 2250, 2350]
  };

  // Chart configurations
  const spendingChart = {
    labels: categories,
    datasets: [{
      label: 'Spending by Category',
      data: spendingData,
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
      ]
    }]
  };

  const trendChart = {
    labels: monthlyTrends.labels,
    datasets: [
      {
        label: 'Income',
        data: monthlyTrends.income,
        backgroundColor: '#4BC0C0'
      },
      {
        label: 'Expenses',
        data: monthlyTrends.expenses,
        backgroundColor: '#FF6384'
      }
    ]
  };

  // Handle sign out
  const handleSignOut = () => {
    // Clear any stored authentication info if needed (e.g., localStorage, sessionStorage)
    localStorage.removeItem('userAuth');  // Example of clearing stored auth data
    navigate('/login');  // Redirect to login page
  };

  return (
    <div className="p-4 max-w-6xl mx-auto relative">
      {/* Sign Out Button */}
      <button 
        onClick={handleSignOut}
        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Sign Out
      </button>

      <h1 className="text-2xl font-bold mb-6">Financial Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-sm font-medium text-green-800">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">₹{income.toFixed(2)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-sm font-medium text-red-800">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">₹{expenses.toFixed(2)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800">Current Balance</h3>
          <p className={`text-2xl font-bold ₹{
            balance >= 0 ? 'text-blue-600' : 'text-red-600'
          }`}>
            ₹{balance.toFixed(2)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="text-sm font-medium text-purple-800">Budget Remaining</h3>
          <p className={`text-2xl font-bold ₹{
            remainingBudget >= 0 ? 'text-purple-600' : 'text-red-600'
          }`}>
            ₹{remainingBudget.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Monthly Budget Progress</h2>
          <span className="text-lg font-medium">
            {budgetProgress.toFixed(1)}% Used
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div 
            className={`h-4 rounded-full ${
              budgetProgress > 90 ? 'bg-red-500' : 
              budgetProgress > 75 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${budgetProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹{0}</span>
          <span>Budget: ₹{budget.toFixed(2)}</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Spending by Category */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
          <div className="h-64">
            <Doughnut data={spendingChart} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
          <div className="h-64">
            <Bar 
              data={trendChart} 
              options={{ 
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/transactions')}
            className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
          >
            Manage Transactions
          </button>
          <button 
            onClick={() => navigate('/history')}
            className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
          >
            Transaction History
          </button>
          <button 
            onClick={() => navigate('/budget')}
            className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
          >
            Manage Budget
          </button>
        </div>
      </div>
    </div>
  );
}

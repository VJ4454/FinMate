import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom'; // For navigation

ChartJS.register(ArcElement, Tooltip, Legend);

const transactionCategories = [
  'Food', 'Travel', 'Rent', 'Entertainment', 
  'Utilities', 'Healthcare', 'Education', 'Other'
];

export default function Transactions() {
  const navigate = useNavigate(); // Hook to navigate to the login page

  const handleSignOut = () => {
    // Clear authentication data (e.g., localStorage)
    localStorage.removeItem('user'); // Modify according to your auth system
    navigate('/login'); // Redirect to login page
  };

  // Sample initial transactions
  const [transactions, setTransactions] = useState([
    { 
      id: 1, 
      date: '2023-06-01', 
      description: 'Grocery shopping', 
      category: 'Food', 
      amount: 85.50, 
      type: 'expense' 
    },
    { 
      id: 2, 
      date: '2023-06-05', 
      description: 'Monthly salary', 
      category: 'Income', 
      amount: 2500.00, 
      type: 'income' 
    }
  ]);

  const [currentTransaction, setCurrentTransaction] = useState({
    id: null,
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Food',
    amount: '',
    type: 'expense'
  });

  const [isEditing, setIsEditing] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTransaction(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing transaction
      setTransactions(transactions.map(t => 
        t.id === currentTransaction.id ? currentTransaction : t
      ));
    } else {
      // Add new transaction
      const newTransaction = {
        ...currentTransaction,
        id: Date.now(),
        amount: parseFloat(currentTransaction.amount)
      };
      setTransactions([...transactions, newTransaction]);
    }
    
    // Reset form
    setCurrentTransaction({
      id: null,
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'Food',
      amount: '',
      type: 'expense'
    });
    setIsEditing(false);
  };

  // Edit transaction
  const handleEdit = (id) => {
    const transactionToEdit = transactions.find(t => t.id === id);
    setCurrentTransaction({
      ...transactionToEdit,
      amount: transactionToEdit.amount.toString()
    });
    setIsEditing(true);
  };

  // Delete transaction
  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Prepare chart data for expenses by category
  const expenseChartData = {
    labels: transactionCategories,
    datasets: [{
      data: transactionCategories.map(category => 
        transactions
          .filter(t => t.category === category && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
      ),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#8AC24A', '#607D8B'
      ]
    }]
  };

  return (
    <div className="container mx-auto p-4">
      {/* Back Button (Redirects to Dashboard) */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate('/dashboard')} // Navigate to dashboard
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
      
      <h1 className="text-2xl font-bold mb-6 text-center">Transaction Management</h1>

      
      {/* Transaction Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={currentTransaction.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                name="description"
                value={currentTransaction.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g. Grocery shopping"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                value={currentTransaction.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={currentTransaction.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                {transactionCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={currentTransaction.amount}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEditing ? 'Update' : 'Add'} Transaction
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setCurrentTransaction({
                    id: null,
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    category: 'Food',
                    amount: '',
                    type: 'expense'
                  });
                  setIsEditing(false);
                }}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ₹{
                        transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ₹{
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(transaction.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spending Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Expense Distribution</h2>
        <div className="max-w-md mx-auto">
          <Doughnut data={expenseChartData} />
        </div>
      </div>
    </div>
  );
}

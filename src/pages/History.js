import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const categories = ['All', 'Food', 'Travel', 'Rent', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Other'];

export default function Transactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHistoryView = location.pathname === '/history';

  const [allTransactions, setAllTransactions] = useState([
    { id: 1, date: '2025-03-01', description: 'Grocery', category: 'Food', amount: 85.50, type: 'expense' },
    { id: 2, date: '2025-03-05', description: 'Salary', category: 'Income', amount: 2500.00, type: 'income' },
    { id: 3, date: '2025-02-10', description: 'Apartment Rent', category: 'Rent', amount: 1200.00, type: 'expense' },
    { id: 4, date: '2025-02-28', description: 'Electric Bill', category: 'Utilities', amount: 150.00, type: 'expense' },
    { id: 5, date: '2025-02-15', description: 'Bonus', category: 'Income', amount: 500.00, type: 'income' },
  ]);

  const [filteredTransactions, setFilteredTransactions] = useState(allTransactions);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateRange, setDateRange] = useState(null); // ✅ default: no date filter
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    let filtered = allTransactions;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (dateRange) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate >= dateRange.startDate &&
          transactionDate <= dateRange.endDate
        );
      });
    }

    setFilteredTransactions(filtered);
  }, [selectedCategory, dateRange, allTransactions]);

  return (
    <div className="container mx-auto p-4 relative">

      {/* Back Button */}
      {isHistoryView && (
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
      )}

      {/* Sign Out Button */}
      <button 
        onClick={() => navigate('/login')}
        className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Sign Out
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 text-center mx-auto">
        {isHistoryView ? 'Transaction History' : 'Transactions'}
      </h1>

      {/* Filters */}
      {isHistoryView && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full p-2 border rounded text-left"
              >
                {dateRange
                  ? `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
                  : 'Select date range'
                }
              </button>

              {showDatePicker && (
                <div className="absolute z-10 mt-1 bg-white border rounded shadow-lg">
                  <DateRangePicker
                    ranges={[
                      {
                        startDate: dateRange?.startDate || new Date(),
                        endDate: dateRange?.endDate || new Date(),
                        key: 'selection'
                      }
                    ]}
                    onChange={item => {
                      setDateRange({
                        startDate: item.selection.startDate,
                        endDate: item.selection.endDate
                      });
                      setShowDatePicker(false);
                    }}
                    staticRanges={[]}
                    inputRanges={[]}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Clear date filter button */}
          {dateRange && (
            <div className="mt-4">
              <button
                onClick={() => setDateRange(null)}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear date range filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found{isHistoryView ? ' matching your filters' : ''}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

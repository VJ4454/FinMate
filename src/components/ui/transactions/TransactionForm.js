import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { transactionService } from '../../services/transactions';

const categories = [
  'Food',
  'Transport',
  'Housing',
  'Entertainment',
  'Education',
  'Health',
  'Shopping',
  'Other',
];

const validationSchema = Yup.object().shape({
  amount: Yup.number().required('Required').positive('Must be positive'),
  type: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  date: Yup.date().required('Required'),
  description: Yup.string().max(100, 'Too long'),
});

export function TransactionForm({ onSuccess, initialValues }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: initialValues || {
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (initialValues) {
          await transactionService.updateTransaction(initialValues._id, values);
        } else {
          await transactionService.addTransaction(values);
        }
        onSuccess();
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <div className="mt-1 flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formik.values.type === 'expense'}
              onChange={formik.handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-gray-700">Expense</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formik.values.type === 'income'}
              onChange={formik.handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-gray-700">Income</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">₹</span>
          </div>
          <input
            type="number"
            name="amount"
            id="amount"
            onChange={formik.handleChange}
            value={formik.values.amount}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="0.00"
          />
        </div>
        {formik.errors.amount && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.amount}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          onChange={formik.handleChange}
          value={formik.values.category}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {formik.errors.category && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          onChange={formik.handleChange}
          value={formik.values.date}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.errors.date && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.date}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          onChange={formik.handleChange}
          value={formik.values.description}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? 'Saving...' : 'Save Transaction'}
        </button>
      </div>
    </form>
  );
}


import React from 'react';
import { Transaction, TransactionType, Currency } from '../../types';
import { USD_TO_INR_RATE } from '../../constants'; // Keep for default conversion if needed elsewhere, but not primary for display
import TrashIcon from '../icons/TrashIcon';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {
  
  const formatCurrencyDisplay = (value: number, currencyCode: Currency = 'USD') => {
      const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      };
      const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US';
      return new Intl.NumberFormat(locale, options).format(value);
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl text-center transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.01]">
        <p className="text-gray-500 dark:text-gray-400">No transactions yet. Add some to get started! Amounts are shown in their original currency. Summaries are in INR.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.01]">
      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">Transaction History</h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
        {transactions.map((transaction) => {
          // Handle older transactions that might not have currency field
          const displayCurrency = transaction.currency || 'USD'; 
          return (
            <li key={transaction.id} className="py-4 flex items-center justify-between">
              <div className="flex-grow">
                <p className="text-md font-medium text-gray-900 dark:text-gray-100">{transaction.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</p>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full
                    ${transaction.type === TransactionType.INCOME
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                    }`}
                >
                  {transaction.type === TransactionType.INCOME ? '+' : '-'}{formatCurrencyDisplay(transaction.amount, displayCurrency)}
                </span>
                <button
                  onClick={() => onDeleteTransaction(transaction)}
                  className="ml-4 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  aria-label="Delete transaction"
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TransactionList;
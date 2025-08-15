import React from 'react';
import { Transaction, TransactionType, Currency } from '../../types';
import { USD_TO_INR_RATE } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface BudgetSummaryProps {
  transactions: Transaction[];
  onOpenReport: () => void;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ transactions, onOpenReport }) => {

  const convertToInr = (amount: number, currency?: Currency): number => {
    const transactionCurrency = currency || 'USD'; // Default to USD for old transactions
    if (transactionCurrency === 'USD') {
      return amount * USD_TO_INR_RATE;
    }
    return amount; // Already INR
  };

  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + convertToInr(t.amount, t.currency), 0);

  const totalExpenses = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + convertToInr(t.amount, t.currency), 0);

  const balance = totalIncome - totalExpenses;

  const chartData = [
    { name: 'Income', value: totalIncome, color: '#34D399' }, // Emerald 400 (Greenish)
    { name: 'Expenses', value: totalExpenses, color: '#F87171' }, // Red 400
  ];
  
  const formatInrCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl space-y-6 transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.01]">
      <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">Budget Overview (INR)</h3>
          <button
            onClick={onOpenReport}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors transform hover:scale-105"
          >
            Monthly Report
          </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/50 rounded-lg">
          <p className="text-sm text-emerald-600 dark:text-emerald-300 font-medium">Total Income</p>
          <p className="text-2xl font-semibold text-emerald-700 dark:text-emerald-200">{formatInrCurrency(totalIncome)}</p>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/50 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-300 font-medium">Total Expenses</p>
          <p className="text-2xl font-semibold text-red-700 dark:text-red-200">{formatInrCurrency(totalExpenses)}</p>
        </div>
        <div className={`p-4 rounded-lg ${balance >= 0 ? 'bg-sky-50 dark:bg-sky-900/50' : 'bg-amber-50 dark:bg-amber-900/50'}`}>
          <p className={`text-sm font-medium ${balance >=0 ? 'text-sky-600 dark:text-sky-300' : 'text-amber-600 dark:text-amber-300'}`}>Balance</p>
          <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-sky-700 dark:text-sky-200' : 'text-amber-700 dark:text-amber-200'}`}>{formatInrCurrency(balance)}</p>
        </div>
      </div>

      {transactions.length > 0 && (
        <div className="h-72 sm:h-80 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
              <XAxis dataKey="name" className="text-xs text-gray-600 dark:text-gray-400" />
              <YAxis tickFormatter={formatInrCurrency} className="text-xs text-gray-600 dark:text-gray-400" />
              <Tooltip
                formatter={(value: number) => formatInrCurrency(value)}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid #ccc',
                  borderRadius: '0.5rem',
                  color: '#333',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ color: '#333', fontWeight: 'bold' }}
                itemStyle={{ color: '#333' }}
                cursor={{fill: 'rgba(200, 200, 200, 0.2)'}}
              />
              <Legend wrapperStyle={{ fontSize: '0.875rem', color: '#4A5568', paddingTop: '10px' }} />
              <Bar dataKey="value" barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="transition-opacity duration-300 hover:opacity-80" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
       {transactions.length === 0 && (
         <p className="text-center text-gray-500 dark:text-gray-400 pt-4">No data to display in chart. Input amounts in USD or INR. Summaries are shown in INR.</p>
       )}
    </div>
  );
};

export default BudgetSummary;

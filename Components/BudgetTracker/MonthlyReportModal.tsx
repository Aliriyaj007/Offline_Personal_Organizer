import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Transaction, TransactionType, Currency } from '../../types';
import { USD_TO_INR_RATE } from '../../constants';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

const Spinner: React.FC = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({ isOpen, onClose, transactions }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
    });
  }, [transactions, year, month]);

  const convertToInr = (amount: number, currency?: Currency): number => {
    const transactionCurrency = currency || 'USD';
    return transactionCurrency === 'USD' ? amount * USD_TO_INR_RATE : amount;
  };

  const formatInrCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + convertToInr(t.amount, t.currency), 0);
    const expenses = filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + convertToInr(t.amount, t.currency), 0);
    return { totalIncome: income, totalExpenses: expenses, balance: income - expenses };
  }, [filteredTransactions]);
  
  const handleGenerateAnalysis = async () => {
    if (!process.env.API_KEY) {
      setError('API key is not configured. Please set the API_KEY environment variable.');
      return;
    }
    setIsLoading(true);
    setAiAnalysis('');
    setError('');

    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
    const expenseList = filteredTransactions
      .filter(t => t.type === 'expense')
      .map(t => `- ${t.description}: ${formatInrCurrency(convertToInr(t.amount, t.currency))}`)
      .join('\n');

    const prompt = `
      You are a friendly financial advisor. Here is a summary of my financial transactions for ${monthName} ${year}:
      - Total Income: ${formatInrCurrency(totalIncome)}
      - Total Expenses: ${formatInrCurrency(totalExpenses)}
      - Net Balance: ${formatInrCurrency(balance)}

      Here is the list of my expenses:
      ${expenseList || "No expenses recorded for this month."}

      Based on this data, please provide a brief, easy-to-understand analysis of my spending habits for the month. 
      - Identify the top spending categories if possible from the descriptions.
      - Suggest 1-2 potential areas for savings.
      - Offer one positive observation or encouragement.
      Keep the entire response under 150 words. Format it with bullet points for readability.
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setAiAnalysis(response.text);
    } catch (e) {
      console.error(e);
      setError('Failed to generate AI analysis. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const years = Array.from(new Set(transactions.map(t => new Date(t.date).getFullYear()))).sort((a, b) => b - a);
  if (!years.includes(currentYear)) years.unshift(currentYear);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    name: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Monthly Report</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <select value={month} onChange={e => setMonth(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100">
            {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/50 rounded-lg"><p className="text-sm text-emerald-600 dark:text-emerald-300">Income</p><p className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">{formatInrCurrency(totalIncome)}</p></div>
              <div className="p-3 bg-red-50 dark:bg-red-900/50 rounded-lg"><p className="text-sm text-red-600 dark:text-red-300">Expenses</p><p className="text-lg font-semibold text-red-700 dark:text-red-200">{formatInrCurrency(totalExpenses)}</p></div>
              <div className={`p-3 rounded-lg ${balance >= 0 ? 'bg-sky-50 dark:bg-sky-900/50' : 'bg-amber-50 dark:bg-amber-900/50'}`}><p className={`text-sm ${balance >=0 ? 'text-sky-600 dark:text-sky-300' : 'text-amber-600 dark:text-amber-300'}`}>Balance</p><p className={`text-lg font-semibold ${balance >= 0 ? 'text-sky-700 dark:text-sky-200' : 'text-amber-700 dark:text-amber-200'}`}>{formatInrCurrency(balance)}</p></div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-300 dark:border-gray-600">AI-Powered Analysis</h3>
              <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                {isLoading && <div className="flex justify-center items-center"><Spinner /></div>}
                {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
                {aiAnalysis && <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{aiAnalysis}</p>}
                {!aiAnalysis && !isLoading && !error && <p className="text-sm text-gray-500 dark:text-gray-400">Click the button to get financial insights from AI.</p>}
              </div>
              <button onClick={handleGenerateAnalysis} disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-800 transition-colors">
                {isLoading ? <><Spinner /> Analyzing...</> : 'Get AI Analysis'}
              </button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Transactions</h3>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.map(t => (
                  <li key={t.id} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="text-md text-gray-900 dark:text-gray-100">{t.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`font-semibold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatInrCurrency(convertToInr(t.amount, t.currency))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No transactions found for the selected month and year.</p>
        )}
      </div>
    </div>
  );
};

export default MonthlyReportModal;

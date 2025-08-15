import React, { useState } from 'react';
import { Transaction } from '../../types';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import BudgetSummary from './BudgetSummary';
import MonthlyReportModal from './MonthlyReportModal';
import BudgetIcon from '../icons/BudgetIcon';

interface BudgetTrackerProps {
  transactions: Transaction[];
  setTransactions: (value: Transaction[] | ((val: Transaction[]) => Transaction[])) => void;
  onDeleteTransaction: (transaction: Transaction) => void;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ transactions, setTransactions, onDeleteTransaction }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <>
      <div className="space-y-8">
        <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <BudgetIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Budget Tracker
          </h2>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.01]">
            <TransactionForm onAddTransaction={addTransaction} />
          </div>
          
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <BudgetSummary transactions={transactions} onOpenReport={() => setIsReportModalOpen(true)} />
            <TransactionList transactions={transactions} onDeleteTransaction={onDeleteTransaction} />
          </div>
        </div>
      </div>

      <MonthlyReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        transactions={transactions}
      />
    </>
  );
};

export default BudgetTracker;
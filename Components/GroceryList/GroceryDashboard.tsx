import React, { useMemo } from 'react';
import { GroceryItem } from '../../types';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Sector } from 'recharts';

interface GroceryDashboardProps {
  items: GroceryItem[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0', '#546E7A'];

const GroceryDashboard: React.FC<GroceryDashboardProps> = ({ items }) => {
  const purchasedItems = useMemo(() => items.filter(i => i.purchased && i.price !== undefined && i.price > 0), [items]);

  const spendingByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    purchasedItems.forEach(item => {
      const category = item.category || 'Other';
      categoryMap.set(category, (categoryMap.get(category) || 0) + item.price!);
    });
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [purchasedItems]);

  const spendingByStore = useMemo(() => {
    const storeMap = new Map<string, number>();
    purchasedItems.forEach(item => {
      if (!item.store) return;
      storeMap.set(item.store, (storeMap.get(item.store) || 0) + item.price!);
    });
    return Array.from(storeMap.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [purchasedItems]);
  
  const totalSpent = useMemo(() => purchasedItems.reduce((sum, item) => sum + item.price!, 0), [purchasedItems]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  if (purchasedItems.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Shopping Dashboard</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          No data to display. Purchase some items and add their prices to see your spending analysis here.
        </p>
         <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Note: This dashboard reflects items currently marked as purchased.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Shopping Analysis</h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-sky-50 dark:bg-sky-900/50 rounded-lg">
                <p className="text-sm text-sky-600 dark:text-sky-300 font-medium">Total Spent</p>
                <p className="text-2xl font-semibold text-sky-700 dark:text-sky-200">{formatCurrency(totalSpent)}</p>
            </div>
             <div className="p-4 bg-purple-50 dark:bg-purple-900/50 rounded-lg">
                <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Purchased Items</p>
                <p className="text-2xl font-semibold text-purple-700 dark:text-purple-200">{purchasedItems.length}</p>
            </div>
             <div className="p-4 bg-teal-50 dark:bg-teal-900/50 rounded-lg">
                <p className="text-sm text-teal-600 dark:text-teal-300 font-medium">Avg. Item Price</p>
                <p className="text-2xl font-semibold text-teal-700 dark:text-teal-200">{formatCurrency(totalSpent / purchasedItems.length)}</p>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending by Category */}
        <div className="space-y-3">
            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200">Spending by Category</h4>
            <div className="h-80 w-full">
                 <ResponsiveContainer>
                    <PieChart>
                    <Pie data={spendingByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" labelLine={false}
                         label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            if (percent < 0.05) return null; // Don't render label for small slices
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                            const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                            return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12">
                                     {`${(percent * 100).toFixed(0)}%`}
                                   </text>
                         }}
                    >
                        {spendingByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend iconSize={10} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Spending by Store */}
        {spendingByStore.length > 0 && (
            <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200">Spending by Store</h4>
                <div className="h-80 w-full">
                    <ResponsiveContainer>
                        <BarChart data={spendingByStore} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-gray-200 dark:stroke-gray-700"/>
                            <XAxis type="number" tickFormatter={formatCurrency} className="text-xs text-gray-600 dark:text-gray-400"/>
                            <YAxis type="category" dataKey="name" width={80} tick={{fontSize: 12}} className="text-xs text-gray-600 dark:text-gray-400" />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{fill: 'rgba(200, 200, 200, 0.2)'}} />
                            <Bar dataKey="value" barSize={20}>
                                 {spendingByStore.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default GroceryDashboard;
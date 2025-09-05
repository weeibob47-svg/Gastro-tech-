import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MOCK_ORDERS, MOCK_MENU_ITEMS } from '../services/mockData';
import { Order, OrderStatus } from '../types';
import { generateDailySummary } from '../services/geminiService';

const StatCard = ({ title, value, icon, change, changeType }: { title: string, value: string, icon: React.ReactNode, change: string, changeType: 'increase' | 'decrease' }) => (
    <div className="bg-bunker-900 p-6 rounded-lg shadow-md border border-bunker-800">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-bunker-400 font-medium">{title}</p>
                <p className="text-3xl font-bold text-white mt-1">{value}</p>
                 <div className="flex items-center mt-2">
                    <span className={`text-xs font-semibold ${changeType === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
                        {change}
                    </span>
                    <span className="text-xs text-bunker-500 ml-1">vs hier</span>
                </div>
            </div>
            <div className="bg-amber-500/10 p-2 rounded-md">
                {icon}
            </div>
        </div>
    </div>
);

const Spinner: React.FC = () => (
    <div className="border-2 border-bunker-700 border-t-amber-500 rounded-full w-5 h-5 animate-spin"></div>
);


const Dashboard: React.FC = () => {
    const totalRevenue = MOCK_ORDERS.reduce((acc, order) => acc + order.total, 0);
    const totalOrders = MOCK_ORDERS.length;
    
    const chartData = [
        { name: 'Lun', Revenu: 4000 },
        { name: 'Mar', Revenu: 3000 },
        { name: 'Mer', Revenu: 2000 },
        { name: 'Jeu', Revenu: 2780 },
        { name: 'Ven', Revenu: 1890 },
        { name: 'Sam', Revenu: 2390 },
        { name: 'Dim', Revenu: 3490 },
    ];

    const pieData = MOCK_MENU_ITEMS.reduce((acc, item) => {
        const category = acc.find(c => c.name === item.category);
        if (category) {
            category.value += 1;
        } else {
            acc.push({ name: item.category, value: 1 });
        }
        return acc;
    }, [] as {name: string, value: number}[]);

    const PIE_COLORS = ['#f59e0b', '#ca8a04', '#a16207', '#854d0e', '#713f12'];

    const recentOrders = [...MOCK_ORDERS].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

    const [aiSummary, setAiSummary] = useState<string>('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState<string>('');

    const handleGenerateSummary = async () => {
        setIsSummaryLoading(true);
        setSummaryError('');
        setAiSummary('');
        try {
            const ordersString = JSON.stringify(MOCK_ORDERS.map(o => ({
                total: o.total,
                items: o.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
                timestamp: o.timestamp
            })), null, 2);
            const summary = await generateDailySummary(ordersString);
            setAiSummary(summary);
        } catch (err) {
            setSummaryError('Impossible de générer l\'analyse. Veuillez réessayer.');
        } finally {
            setIsSummaryLoading(false);
        }
    };

    const getStatusClass = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.New: return 'bg-blue-500/20 text-blue-300';
            case OrderStatus.InProgress: return 'bg-yellow-500/20 text-yellow-300';
            case OrderStatus.Completed: return 'bg-green-500/20 text-green-300';
            case OrderStatus.Paid: return 'bg-purple-500/20 text-purple-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Tableau de Bord</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Revenu Total" value={`${totalRevenue.toFixed(2)}€`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} change="+12.5%" changeType="increase" />
                <StatCard title="Commandes" value={totalOrders.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} change="+5" changeType="increase" />
                <StatCard title="Clients" value="84" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} change="-2.1%" changeType="decrease" />
                <StatCard title="Ticket Moyen" value={`${(totalRevenue/totalOrders).toFixed(2)}€`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} change="+1.8%" changeType="increase" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-bunker-900 p-6 rounded-lg shadow-md border border-bunker-800">
                     <h2 className="text-xl font-semibold text-white mb-4">Revenus de la Semaine</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#393e55" />
                            <XAxis dataKey="name" stroke="#b1b8cf" />
                            <YAxis stroke="#b1b8cf" />
                            <Tooltip contentStyle={{ backgroundColor: '#11131a', border: '1px solid #393e55' }} />
                            <Legend />
                            <Bar dataKey="Revenu" fill="#f59e0b" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-bunker-900 p-6 rounded-lg shadow-md border border-bunker-800">
                    <h2 className="text-xl font-semibold text-white mb-4">Catégories Populaires</h2>
                    <ResponsiveContainer width="100%" height={300}>
                         <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip contentStyle={{ backgroundColor: '#11131a', border: '1px solid #393e55' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

             <div className="bg-bunker-900 p-6 rounded-lg shadow-md border border-bunker-800">
                <h2 className="text-xl font-semibold text-white mb-4">Commandes Récentes</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-bunker-800 text-sm text-bunker-400">
                                <th className="py-3 px-4">Commande ID</th>
                                <th className="py-3 px-4">Table</th>
                                <th className="py-3 px-4">Total</th>
                                <th className="py-3 px-4">Statut</th>
                                <th className="py-3 px-4">Heure</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order: Order) => (
                                <tr key={order.id} className="border-b border-bunker-800/50 hover:bg-bunker-800/30">
                                    <td className="py-3 px-4 font-mono text-amber-500">#{order.id.slice(0, 8)}</td>
                                    <td className="py-3 px-4">{order.tableNumber}</td>
                                    <td className="py-3 px-4 font-semibold">{order.total.toFixed(2)}€</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-bunker-400">{new Date(order.timestamp).toLocaleTimeString('fr-FR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-bunker-900 p-6 rounded-lg shadow-md border border-bunker-800">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        <h2 className="text-xl font-semibold text-white">Analyse IA du Jour</h2>
                    </div>
                    {!aiSummary && (
                        <button 
                            onClick={handleGenerateSummary} 
                            disabled={isSummaryLoading}
                            className={`bg-amber-600 text-white px-4 py-2 text-sm rounded-md hover:bg-amber-500 transition-colors flex items-center space-x-2 disabled:bg-bunker-700 disabled:cursor-not-allowed ${isSummaryLoading ? 'animate-pulse' : ''}`}
                        >
                           {isSummaryLoading ? (
                               <>
                                <Spinner />
                                <span>Génération...</span>
                               </>
                           ) : (
                               <span>Générer l'analyse</span>
                           )}
                        </button>
                    )}
                </div>
                {summaryError && <p className="text-red-400 bg-red-500/10 p-3 rounded-md text-sm">{summaryError}</p>}
                {aiSummary && (
                    <div className="prose prose-invert prose-p:text-bunker-300 prose-headings:text-amber-500 prose-strong:text-white max-w-none">
                         <pre className="whitespace-pre-wrap font-sans text-bunker-200 bg-transparent p-0">{aiSummary}</pre>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Dashboard;
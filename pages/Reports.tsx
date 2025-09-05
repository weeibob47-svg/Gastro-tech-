import React, { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MOCK_ORDERS, MOCK_MENU_ITEMS } from '../services/mockData';
import { OrderStatus } from '../types';

const StatCard = ({ title, value, detail }: { title: string, value: string, detail?: string }) => (
    <div className="bg-bunker-900 p-6 rounded-lg shadow-md border border-bunker-800">
        <p className="text-sm text-bunker-400 font-medium">{title}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
        {detail && <p className="text-xs text-bunker-500 mt-2">{detail}</p>}
    </div>
);

const Reports: React.FC = () => {

    const reportData = useMemo(() => {
        const paidOrders = MOCK_ORDERS.filter(o => o.status === OrderStatus.Paid);
        const totalRevenue = paidOrders.reduce((acc, order) => acc + order.total, 0);
        const totalOrders = paidOrders.length;
        // Simulating costs as 40% of revenue for demonstration
        const totalCosts = totalRevenue * 0.4; 
        const totalProfit = totalRevenue - totalCosts;

        const salesByDay = paidOrders.reduce((acc, order) => {
            const day = new Date(order.timestamp).toLocaleDateString('fr-FR', { weekday: 'short' });
            if (!acc[day]) {
                acc[day] = 0;
            }
            acc[day] += order.total;
            return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(salesByDay).map(([name, revenu]) => ({ name, revenu })).reverse();
        
        const topSellingItems = paidOrders.flatMap(o => o.items)
            .reduce((acc, item) => {
                if (!acc[item.name]) {
                    acc[item.name] = { name: item.name, quantity: 0, revenue: 0 };
                }
                acc[item.name].quantity += item.quantity;
                acc[item.name].revenue += item.quantity * item.price;
                return acc;
            }, {} as Record<string, {name: string, quantity: number, revenue: number}>);
            
        const topItemsList = Object.values(topSellingItems).sort((a,b) => b.revenue - a.revenue).slice(0, 5);

        return { totalRevenue, totalOrders, totalCosts, totalProfit, chartData, topItemsList };
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Rapports Financiers</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Revenu Total" value={`${reportData.totalRevenue.toFixed(2)}€`} detail={`${reportData.totalOrders} commandes payées`} />
                <StatCard title="Coûts Estimés" value={`${reportData.totalCosts.toFixed(2)}€`} detail="Simulation à 40% du revenu" />
                <StatCard title="Bénéfice Net" value={`${reportData.totalProfit.toFixed(2)}€`} detail={`Marge de ${(reportData.totalProfit / reportData.totalRevenue * 100).toFixed(1)}%`} />
                <StatCard title="Panier Moyen" value={`${(reportData.totalRevenue / reportData.totalOrders).toFixed(2)}€`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-bunker-900 p-6 rounded-lg shadow-md border border-bunker-800">
                     <h2 className="text-xl font-semibold text-white mb-4">Tendances des Revenus par Jour</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={reportData.chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#393e55" />
                            <XAxis dataKey="name" stroke="#b1b8cf" />
                            <YAxis stroke="#b1b8cf" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#11131a', border: '1px solid #393e55' }}
                            />
                            <Legend wrapperStyle={{ color: '#b1b8cf' }}/>
                            <Line type="monotone" dataKey="revenu" name="Revenu" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-bunker-900 p-6 rounded-lg shadow-md border border-bunker-800">
                     <h2 className="text-xl font-semibold text-white mb-4">Top 5 des Ventes</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            layout="vertical"
                            data={[...reportData.topItemsList].reverse()}
                            margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#393e55" horizontal={false} />
                            <XAxis type="number" stroke="#b1b8cf" />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#b1b8cf"
                                tick={{ fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(110, 110, 110, 0.1)' }}
                                contentStyle={{ backgroundColor: '#11131a', border: '1px solid #393e55', borderRadius: '0.5rem' }}
                                formatter={(value: number) => [`${value.toFixed(2)}€`, 'Revenu']}
                                labelStyle={{ color: '#e6e7ee' }}
                            />
                            <Bar dataKey="revenue" fill="#f59e0b" name="Revenu" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default Reports;
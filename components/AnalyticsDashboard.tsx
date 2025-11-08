import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
// Fix: Import SparklesIcon to resolve reference errors.
import { CpuChipIcon, ChartBarIcon, SparklesIcon } from './icons';

const data = [
  { name: 'Jan', revenue: 4000, leads: 2400 },
  { name: 'Feb', revenue: 3000, leads: 1398 },
  { name: 'Mar', revenue: 2000, leads: 9800 },
  { name: 'Apr', revenue: 2780, leads: 3908 },
  { name: 'May', revenue: 1890, leads: 4800 },
  { name: 'Jun', revenue: 2390, leads: 3800 },
  { name: 'Jul', revenue: 3490, leads: 4300 },
];

const StatCard: React.FC<{ title: string; value: string; change: string; isUp: boolean }> = ({ title, value, change, isUp }) => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5 backdrop-blur-xl shadow-lg">
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-3xl font-bold my-1">{value}</p>
        <div className={`flex items-center text-sm ${isUp ? 'text-green-400' : 'text-red-400'}`}>
            <span>{change}</span>
            <span className="ml-1">{isUp ? '▲' : '▼'}</span>
        </div>
    </div>
);


const AnalyticsDashboard: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold">Analytics Cockpit</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value="$45,231.89" change="+20.1%" isUp={true} />
                <StatCard title="New Leads" value="3,102" change="+12.5%" isUp={true} />
                <StatCard title="Conversion Rate" value="23.5%" change="-1.2%" isUp={false} />
                <StatCard title="Avg. Deal Size" value="$1,458" change="+5.8%" isUp={true} />
            </div>

            <div className="bg-dark-card border border-dark-border rounded-xl p-5 backdrop-blur-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center"><ChartBarIcon className="w-6 h-6 mr-2 text-brand-accent"/> Revenue & Leads Overview</h2>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8A2BE2" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00F5A0" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#00F5A0" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4f46e5' }} />
                            <Legend />
                            <Area type="monotone" dataKey="revenue" stroke="#8A2BE2" fillOpacity={1} fill="url(#colorRevenue)" />
                            <Area type="monotone" dataKey="leads" stroke="#00F5A0" fillOpacity={1} fill="url(#colorLeads)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-xl p-5 backdrop-blur-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center"><CpuChipIcon className="w-6 h-6 mr-2 text-brand-accent"/> AI Predictive Insights</h2>
                <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start space-x-3">
                        <SparklesIcon className="w-5 h-5 mt-1 text-brand-accent flex-shrink-0"/>
                        <span><span className="font-semibold text-white">Lead Surge Forecast:</span> Expect a ~15% increase in leads from the 'Tech' sector next month based on market trends.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                        <SparklesIcon className="w-5 h-5 mt-1 text-brand-accent flex-shrink-0"/>
                        <span><span className="font-semibold text-white">Churn Risk Detected:</span> 3 high-value clients show decreased engagement. Recommend proactive outreach.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                        <SparklesIcon className="w-5 h-5 mt-1 text-brand-accent flex-shrink-0"/>
                        <span><span className="font-semibold text-white">Optimal Posting Time:</span> AI suggests scheduling social posts for Tuesday at 10 AM EST for maximum engagement.</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
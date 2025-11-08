import React, { useState } from 'react';
import { SyncModule, LogEntry, SyncStatus } from '../types';
import { ArrowPathIcon, CheckCircleIcon, CpuChipIcon, ExclamationTriangleIcon, SparklesIcon, XCircleIcon, ChevronDownIcon } from './icons';
import { getQuickResponse } from '../services/geminiService';

const mockSyncModules: SyncModule[] = [
  { id: 'contacts', name: 'Contacts Sync', description: 'Keeps contacts & tags in sync.', icon: <SparklesIcon />, direction: 'Bidirectional', status: 'OK', scopes: ['contacts.readonly', 'contacts.write'], lastSync: '2 minutes ago' },
  { id: 'pipelines', name: 'Pipelines', description: 'Syncs opportunities and stages.', icon: <SparklesIcon />, direction: 'MCP → GHL', status: 'OK', scopes: ['pipelines.readonly'], lastSync: '5 minutes ago' },
  { id: 'calendars', name: 'Calendars', description: 'Two-way event synchronization.', icon: <SparklesIcon />, direction: 'Bidirectional', status: 'Warning', scopes: ['calendars.read', 'calendars.write'], lastSync: '1 hour ago' },
  { id: 'workflows', name: 'Workflows', description: 'Triggers GHL automations.', icon: <SparklesIcon />, direction: 'MCP → GHL', status: 'OK', scopes: ['workflows.execute'], lastSync: '15 minutes ago' },
  { id: 'social', name: 'Social Suite', description: 'Publishes scheduled content.', icon: <SparklesIcon />, direction: 'MCP → GHL', status: 'Error', scopes: ['social.write'], lastSync: '3 hours ago' },
  { id: 'stripe', name: 'Entitlements', description: 'Maps Stripe plans to GHL roles.', icon: <SparklesIcon />, direction: 'Bidirectional', status: 'OK', scopes: ['users.write'], lastSync: '30 minutes ago' },
];

const mockLogEntries: LogEntry[] = [
  { id: '1', timestamp: '2025-03-15 10:30:15', module: 'Contacts Sync', user: 'mike@rocketopp.com', status: 'Success', summary: 'Synced 5 new contacts from MCP to GHL.' },
  { id: '2', timestamp: '2025-03-15 10:28:00', module: 'Social Suite', user: 'System', status: 'Failure', summary: 'API token expired. Re-authentication needed.' },
  { id: '3', timestamp: '2025-03-15 10:25:10', module: 'Pipelines', user: 'System', status: 'Success', summary: 'Updated 2 opportunities to "Won" stage.' },
  { id: '4', timestamp: '2025-03-15 09:30:05', module: 'Calendars', user: 'System', status: 'Success', summary: 'Synced 12 new events for the week.' },
];

const StatusIcon: React.FC<{ status: SyncStatus }> = ({ status }) => {
    switch(status) {
        case 'OK': return <CheckCircleIcon className="text-green-400" />;
        case 'Warning': return <ExclamationTriangleIcon className="text-yellow-400" />;
        case 'Error': return <XCircleIcon className="text-red-500" />;
        case 'Syncing': return <ArrowPathIcon className="text-blue-400 animate-spin" />;
        default: return null;
    }
}

const CrmDashboard: React.FC = () => {
    const [modules, setModules] = useState(mockSyncModules);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const handleSync = (moduleId: string) => {
        setModules(currentModules => currentModules.map(m => m.id === moduleId ? {...m, status: 'Syncing'} : m));
        setTimeout(() => {
            setModules(currentModules => currentModules.map(m => m.id === moduleId ? {...m, status: 'OK', lastSync: 'Just now'} : m));
        }, 2000);
    };

    const toggleExpand = (moduleId: string) => {
        setExpandedCard(expandedCard === moduleId ? null : moduleId);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold">CRM Command Center</h1>
                    <p className="text-gray-400 mt-1">Live dashboard for MCP ↔ GoHighLevel synchronization.</p>
                </div>
                <div>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-400">Location:</span>
                        <select className="bg-dark-card border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none">
                            <option>Crypto Goatz</option>
                            <option>RocketOpp</option>
                            <option>AppSalute</option>
                        </select>
                    </div>
                    <p className="text-xs text-yellow-400 mt-1 text-right">Warning: Switching locations may reset customizations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Modules and Logs */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Module Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {modules.map((module) => (
                            <div key={module.id} className="bg-dark-card border border-dark-border rounded-xl backdrop-blur-xl shadow-lg hover:border-brand-primary/80 transition-all duration-300 flex flex-col animate-slide-in" style={{animationDelay: `${modules.indexOf(module) * 100}ms`}}>
                                <div className="p-5">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-brand-secondary/50 p-3 rounded-lg">{React.cloneElement(module.icon as React.ReactElement, { className: "w-6 h-6 text-brand-accent"})}</div>
                                            <div>
                                                <h3 className="font-bold text-lg">{module.name}</h3>
                                                <p className="text-sm text-gray-400">{module.direction}</p>
                                            </div>
                                        </div>
                                        <StatusIcon status={module.status} />
                                    </div>
                                    <p className="text-gray-300 mt-4 text-sm">{module.description}</p>
                                </div>
                                <div className="mt-auto p-5 pt-0">
                                     <div className="text-xs text-gray-500 mb-2">Last Sync: {module.lastSync}</div>
                                    <button onClick={() => handleSync(module.id)} disabled={module.status === 'Syncing'} className="w-full bg-white/10 border border-dark-border text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-primary hover:border-brand-primary transition-colors disabled:opacity-50 flex items-center justify-center space-x-2">
                                        <ArrowPathIcon className={`w-5 h-5 ${module.status === 'Syncing' ? 'animate-spin' : ''}`} />
                                        <span>Sync Now</span>
                                    </button>
                                </div>
                                <div className="border-t border-dark-border px-5 py-2">
                                    <button onClick={() => toggleExpand(module.id)} className="w-full flex justify-between items-center text-sm text-gray-400 hover:text-white">
                                        <span>Details & Scopes</span>
                                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedCard === module.id ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                                {expandedCard === module.id && (
                                    <div className="p-5 pt-2 border-t border-dark-border bg-black/20 animate-fade-in">
                                        <h4 className="font-semibold text-sm mb-2">Required Scopes:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {module.scopes.map(scope => (
                                                <span key={scope} className="px-2 py-1 bg-brand-secondary/50 text-brand-accent/80 text-xs rounded-full">{scope}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Audit Log */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Audit Log</h2>
                        <div className="bg-dark-card border border-dark-border rounded-xl backdrop-blur-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto max-h-96">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white/5 sticky top-0">
                                        <tr>
                                            <th className="p-4 font-semibold">Timestamp</th>
                                            <th className="p-4 font-semibold">Module</th>
                                            <th className="p-4 font-semibold">Status</th>
                                            <th className="p-4 font-semibold">Summary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockLogEntries.map((log, index) => (
                                            <tr key={log.id} className={`border-t border-dark-border ${index % 2 === 0 ? 'bg-transparent' : 'bg-white/5'}`}>
                                                <td className="p-4 whitespace-nowrap text-gray-400">{log.timestamp}</td>
                                                <td className="p-4 font-medium">{log.module}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${log.status === 'Success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-300">{log.summary}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Entitlements and Community */}
                <div className="lg:col-span-1 space-y-8">
                     {/* Stripe Entitlements */}
                    <div className="bg-dark-card border border-dark-border rounded-xl p-5 backdrop-blur-xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Stripe Entitlement Mapping</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-gray-300">$19 "View-Only" Plan</span>
                                <span className="text-brand-accent">Spot Tier 1</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-gray-300">$49 "Creator" Plan</span>
                                <span className="text-brand-accent">Spot Tier 2</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-gray-300">$99 "Pro" Plan</span>
                                <span className="text-brand-accent">Spot Tier 3 (Full Access)</span>
                            </li>
                        </ul>
                    </div>

                    {/* GHL Community Widget */}
                    <div className="bg-dark-card border border-dark-border rounded-xl p-5 backdrop-blur-xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">GHL Community Feed</h3>
                        <div className="bg-black/30 h-96 rounded-lg flex items-center justify-center text-center text-gray-500">
                            {/* FIX: Replaced invalid </br> closing tag with a self-closing <br /> tag for correct JSX syntax. */}
                            <p>GoHighLevel Community Widget<br />(Scoped to CRM Admins)<br /> would be embedded here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrmDashboard;

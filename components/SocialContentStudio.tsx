import React, { useState } from 'react';
import { SocialPost } from '../types';
import { MegaphoneIcon, PencilIcon, SparklesIcon, CalendarDaysIcon, XMarkIcon, CpuChipIcon } from './icons';
import { getQuickResponse } from '../services/geminiService';

const AiNudge: React.FC<{ onAccept: () => void; text: string; isLoading: boolean }> = ({ onAccept, text, isLoading }) => (
    <div className="my-4 p-3 bg-brand-secondary/30 border border-brand-primary/50 rounded-lg flex items-center justify-between animate-fade-in">
        <div className="flex items-center space-x-3">
            <CpuChipIcon className="w-6 h-6 text-brand-accent"/>
            <p className="text-sm text-gray-200">{text}</p>
        </div>
        <button 
            onClick={onAccept}
            disabled={isLoading}
            className="px-3 py-1 text-sm font-semibold bg-brand-accent text-dark-bg rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
            {isLoading ? 'Drafting...' : 'Draft Post'}
        </button>
    </div>
);


const SocialContentStudio: React.FC = () => {
    const [postContent, setPostContent] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    const handleAiDraft = async () => {
        setIsAiLoading(true);
        const prompt = "Based on our top-performing crypto signals, draft a short, engaging social media post for Twitter. Include relevant hashtags.";
        try {
            const draft = await getQuickResponse(prompt);
            setPostContent(draft);
        } catch(e) {
            console.error(e);
            alert("Failed to generate AI draft. Check API key.");
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold">Social Content Studio</h1>
                <p className="text-gray-400 mt-1">Draft, schedule, and publish content with AI-powered creativity.</p>
            </div>
            
            <AiNudge text="Top pipeline signals are trending. Draft a social post about it?" isLoading={isAiLoading} onAccept={handleAiDraft} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Composer */}
                <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6 backdrop-blur-xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center"><PencilIcon className="w-5 h-5 mr-2 text-brand-accent"/> Composer</h2>
                    <textarea 
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        rows={8}
                        className="w-full bg-white/5 border border-dark-border rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                        placeholder="What's on your mind? Or let AI draft for you..."
                    />
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex space-x-2">
                           {/* Add media, etc. buttons here */}
                        </div>
                        <button disabled={isAiLoading} onClick={handleAiDraft} className="px-4 py-2 font-semibold bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2">
                            <SparklesIcon className="w-5 h-5 text-brand-accent"/>
                            <span>{isAiLoading ? 'Regenerating...' : 'Regenerate with AI'}</span>
                        </button>
                    </div>
                </div>

                {/* Column 2: Scheduling & Preview */}
                <div className="space-y-8">
                    <div className="bg-dark-card border border-dark-border rounded-xl p-6 backdrop-blur-xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4 flex items-center"><CalendarDaysIcon className="w-5 h-5 mr-2 text-brand-accent"/> Scheduling</h2>
                         <div className="space-y-4">
                             <div>
                                <label className="text-sm font-semibold text-gray-300">Location / Brand</label>
                                 <select className="w-full mt-1 bg-dark-card border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none">
                                    <option>Crypto Goatz</option>
                                    <option>RocketOpp</option>
                                </select>
                            </div>
                             <div>
                                <label className="text-sm font-semibold text-gray-300">Publish Date</label>
                                <input type="date" className="w-full mt-1 bg-dark-card border border-dark-border rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                             </div>
                              <div>
                                <label className="text-sm font-semibold text-gray-300">Publish Time</label>
                                <input type="time" className="w-full mt-1 bg-dark-card border border-dark-border rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                             </div>
                             <button className="w-full mt-2 px-4 py-3 font-bold bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors">Schedule Post</button>
                         </div>
                    </div>
                     <div className="bg-dark-card border border-dark-border rounded-xl p-6 backdrop-blur-xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Live Preview</h2>
                         <div className="border border-dark-border rounded-lg p-4 bg-black/20 min-h-[150px]">
                            <p className="text-sm text-gray-300 whitespace-pre-wrap">{postContent || "Your post preview will appear here."}</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialContentStudio;

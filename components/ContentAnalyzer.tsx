
import React, { useState, useRef, useCallback } from 'react';
import { analyzeImage, analyzeVideo, transcribeAudio } from '../services/geminiService';
import { PhotoIcon, VideoCameraIcon, DocumentTextIcon, SparklesIcon } from './icons';

const Card: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
    <div className={`bg-dark-card border border-dark-border rounded-xl p-6 backdrop-blur-xl shadow-lg animate-fade-in ${className}`}>
        {children}
    </div>
);

const SectionHeader: React.FC<{icon: React.ReactNode, title: string, subtitle: string}> = ({ icon, title, subtitle }) => (
    <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 bg-brand-secondary/50 rounded-lg">{icon}</div>
        <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-gray-400">{subtitle}</p>
        </div>
    </div>
);

const ContentAnalyzer: React.FC = () => {
    // State
    const [activeTab, setActiveTab] = useState<'image' | 'video' | 'audio'>('image');
    const [file, setFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState<string>('What are the key objects in this content? Provide a bulleted list.');
    const [analysisResult, setAnalysisResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAnalysisResult('');
        }
    };
    
    const resetState = () => {
        setFile(null);
        setAnalysisResult('');
        setIsLoading(false);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleTabChange = (tab: 'image' | 'video' | 'audio') => {
        setActiveTab(tab);
        resetState();
        if (tab === 'image') setPrompt('What are the key objects in this image? Provide a bulleted list.');
        if (tab === 'video') setPrompt('Summarize the likely events in this video based on its title.');
        if (tab === 'audio') setPrompt('Transcribe this audio file.');
    };

    const handleAnalysis = async () => {
        if (!file) {
            alert("Please upload a file first.");
            return;
        }
        setIsLoading(true);
        setAnalysisResult('');
        try {
            let result = '';
            switch (activeTab) {
                case 'image':
                    result = await analyzeImage(file, prompt);
                    break;
                case 'video':
                    result = await analyzeVideo(file, prompt);
                    break;
                case 'audio':
                    result = await transcribeAudio(file);
                    break;
            }
            setAnalysisResult(result);
        } catch (error) {
            console.error(`Analysis failed for ${activeTab}:`, error);
            setAnalysisResult(`Analysis failed. Please check your API key and try again. Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getAcceptType = () => {
        switch (activeTab) {
            case 'image': return 'image/*';
            case 'video': return 'video/*';
            case 'audio': return 'audio/*';
        }
    }

    const renderFilePreview = () => {
        if (!file) return null;
        const url = URL.createObjectURL(file);
        switch (activeTab) {
            case 'image': return <img src={url} alt="preview" className="max-h-64 mx-auto rounded-lg my-4" />;
            case 'video': return <video src={url} controls className="max-h-64 mx-auto rounded-lg my-4" />;
            case 'audio': return <audio src={url} controls className="w-full my-4" />;
            default: return null;
        }
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Content Analyzer</h1>
            <div className="flex space-x-2 border-b border-dark-border">
                {
                    ([
                        {id: 'image', label: 'Image Analysis', icon: <PhotoIcon/>},
                        {id: 'video', label: 'Video Analysis', icon: <VideoCameraIcon/>},
                        {id: 'audio', label: 'Audio Transcription', icon: <DocumentTextIcon/>},
                    ] as const).map(tab => (
                        <button key={tab.id} onClick={() => handleTabChange(tab.id)} className={`flex items-center space-x-2 px-4 py-3 font-semibold transition-colors ${activeTab === tab.id ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-gray-400 hover:text-white'}`}>
                            {React.cloneElement(tab.icon as React.ReactElement, { className: "w-5 h-5" })}
                            <span>{tab.label}</span>
                        </button>
                    ))
                }
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <input type="file" accept={getAcceptType()} ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="w-full mb-4 bg-white/10 border border-dark-border text-white py-8 rounded-lg hover:bg-white/20 transition-colors flex flex-col items-center justify-center border-dashed">
                        {file ? `Selected: ${file.name}` : `Click to Upload ${activeTab}`}
                    </button>
                    {renderFilePreview()}
                    <label className="font-semibold mb-2 block">Your Question / Prompt:</label>
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} className="w-full bg-white/5 border border-dark-border rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none" placeholder={`Ask something about the ${activeTab}...`}></textarea>
                    <button onClick={handleAnalysis} disabled={isLoading || !file} className="mt-4 w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 mr-2"/>
                        {isLoading ? `Analyzing ${activeTab}...` : `Analyze ${activeTab}`}
                    </button>
                </Card>
                <Card className="min-h-[300px]">
                    <h3 className="text-xl font-bold mb-4">Analysis Result</h3>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full text-gray-400">Analyzing...</div>
                    ) : analysisResult ? (
                        <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">{analysisResult}</div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Upload content and click analyze to see results here.
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ContentAnalyzer;

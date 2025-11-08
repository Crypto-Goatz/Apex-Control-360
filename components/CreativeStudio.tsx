
import React, { useState, useRef, useCallback } from 'react';
import { generateImage, editImage, generateVideo } from '../services/geminiService';
import { AspectRatio } from '../types';
import { SparklesIcon, PhotoIcon, VideoCameraIcon } from './icons';

// Define helper components within the same file to avoid circular dependencies and keep it simple
const Card: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6 backdrop-blur-xl shadow-lg animate-fade-in">
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

const CreativeStudio: React.FC = () => {
    // Image Generation State
    const [imagePrompt, setImagePrompt] = useState<string>('A neon hologram of a crypto goat on a rocket to the moon, cinematic lighting');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);

    // Image Editing State
    const [editPrompt, setEditPrompt] = useState<string>('Add a retro, vintage filter');
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isEditingImage, setIsEditingImage] = useState<boolean>(false);
    const editImageInputRef = useRef<HTMLInputElement>(null);

    // Video Generation State
    const [videoPrompt, setVideoPrompt] = useState<string>('A futuristic cityscape at night, with flying cars and neon signs');
    const [videoImage, setVideoImage] = useState<File | null>(null);
    const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
    const [videoProgress, setVideoProgress] = useState<string>('');
    const videoImageInputRef = useRef<HTMLInputElement>(null);

    const handleGenerateImage = async () => {
        if (!imagePrompt) return;
        setIsGeneratingImage(true);
        setGeneratedImage(null);
        try {
            const imageUrl = await generateImage(imagePrompt, aspectRatio);
            setGeneratedImage(imageUrl);
        } catch (error) {
            console.error("Image generation failed:", error);
            alert("Image generation failed. Check console for details.");
        } finally {
            setIsGeneratingImage(false);
        }
    };
    
    const handleEditImage = async () => {
        if (!editPrompt || !originalImage) return;
        setIsEditingImage(true);
        setEditedImage(null);
        try {
            const imageUrl = await editImage(originalImage, editPrompt);
            setEditedImage(imageUrl);
        } catch (error) {
            console.error("Image editing failed:", error);
            alert("Image editing failed. Check console for details.");
        } finally {
            setIsEditingImage(false);
        }
    };

    const handleGenerateVideo = async () => {
        if (!videoPrompt && !videoImage) {
            alert("Please provide a prompt or an image for video generation.");
            return;
        }
        setIsGeneratingVideo(true);
        setGeneratedVideo(null);
        setVideoProgress('');
        try {
            const videoUrl = await generateVideo(videoPrompt, videoImage, videoAspectRatio, setVideoProgress);
            setGeneratedVideo(videoUrl);
        } catch (error) {
            console.error("Video generation failed:", error);
            alert(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setVideoProgress(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsGeneratingVideo(false);
        }
    };


    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
        if (e.target.files && e.target.files[0]) {
            setter(e.target.files[0]);
        }
    };

    const getPreviewUrl = (file: File | null) => file ? URL.createObjectURL(file) : null;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Creative Studio</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Generation */}
                <Card>
                    <SectionHeader icon={<PhotoIcon className="w-6 h-6 text-brand-accent"/>} title="Image Generation" subtitle="Create visuals with Imagen 4" />
                    <textarea value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} rows={3} className="w-full bg-white/5 border border-dark-border rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none" placeholder="Enter a detailed prompt..."></textarea>
                    <div className="flex items-center justify-between my-4">
                        <label className="text-sm font-medium text-gray-300">Aspect Ratio</label>
                        <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value as AspectRatio)} className="bg-dark-card border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none">
                            <option value="16:9">16:9</option>
                            <option value="1:1">1:1</option>
                            <option value="9:16">9:16</option>
                             <option value="4:3">4:3</option>
                            <option value="3:4">3:4</option>
                        </select>
                    </div>
                    <button onClick={handleGenerateImage} disabled={isGeneratingImage} className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 mr-2"/>
                        {isGeneratingImage ? 'Generating...' : 'Generate Image'}
                    </button>
                    {isGeneratingImage && <div className="text-center mt-4">Creating your vision...</div>}
                    {generatedImage && <img src={generatedImage} alt="Generated" className="mt-4 rounded-lg w-full" />}
                </Card>

                {/* Image Editing */}
                <Card>
                    <SectionHeader icon={<SparklesIcon className="w-6 h-6 text-brand-accent"/>} title="Image Editor" subtitle="Modify images with a prompt" />
                     <input type="file" accept="image/*" ref={editImageInputRef} onChange={(e) => handleImageFileChange(e, setOriginalImage)} className="hidden" />
                    <button onClick={() => editImageInputRef.current?.click()} className="w-full mb-4 bg-white/10 border border-dark-border text-white py-3 rounded-lg hover:bg-white/20 transition-colors">
                        {originalImage ? `Selected: ${originalImage.name}` : 'Upload Original Image'}
                    </button>
                     {originalImage && <img src={getPreviewUrl(originalImage) || ''} alt="Original Preview" className="mb-4 rounded-lg max-h-40 mx-auto" />}
                    <textarea value={editPrompt} onChange={e => setEditPrompt(e.target.value)} rows={2} className="w-full bg-white/5 border border-dark-border rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none" placeholder="Describe your edit..."></textarea>
                    <button onClick={handleEditImage} disabled={isEditingImage || !originalImage} className="mt-4 w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 mr-2"/>
                        {isEditingImage ? 'Editing...' : 'Apply Edit'}
                    </button>
                    {isEditingImage && <div className="text-center mt-4">Applying magic touch...</div>}
                    {editedImage && <img src={editedImage} alt="Edited" className="mt-4 rounded-lg w-full" />}
                </Card>
            </div>
             {/* Video Generation */}
            <Card>
                <SectionHeader icon={<VideoCameraIcon className="w-6 h-6 text-brand-accent"/>} title="Video Generation" subtitle="Bring ideas to life with Veo" />
                <textarea value={videoPrompt} onChange={e => setVideoPrompt(e.target.value)} rows={3} className="w-full bg-white/5 border border-dark-border rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none" placeholder="Describe the video scene..."></textarea>
                <div className="flex flex-col sm:flex-row items-center justify-between my-4 gap-4">
                    <input type="file" accept="image/*" ref={videoImageInputRef} onChange={(e) => handleImageFileChange(e, setVideoImage)} className="hidden" />
                    <button onClick={() => videoImageInputRef.current?.click()} className="w-full sm:w-auto flex-grow bg-white/10 border border-dark-border text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
                        {videoImage ? `Image: ${videoImage.name}` : 'Upload Starting Image (Optional)'}
                    </button>
                    <div>
                        <label className="text-sm font-medium text-gray-300 mr-2">Aspect Ratio</label>
                        <select value={videoAspectRatio} onChange={e => setVideoAspectRatio(e.target.value as '16:9' | '9:16')} className="bg-dark-card border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none">
                            <option value="16:9">16:9 Landscape</option>
                            <option value="9:16">9:16 Portrait</option>
                        </select>
                    </div>
                </div>
                <button onClick={handleGenerateVideo} disabled={isGeneratingVideo} className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 flex items-center justify-center">
                    <VideoCameraIcon className="w-5 h-5 mr-2"/>
                    {isGeneratingVideo ? 'Generating Video...' : 'Generate Video'}
                </button>
                {(isGeneratingVideo || videoProgress) && <div className="text-center mt-4 text-brand-accent">{videoProgress}</div>}
                {generatedVideo && (
                    <div className="mt-4">
                        <video src={generatedVideo} controls autoPlay loop className="w-full rounded-lg"></video>
                        <a href={generatedVideo} download="generated-video.mp4" className="block text-center mt-2 text-brand-accent hover:underline">Download Video</a>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default CreativeStudio;

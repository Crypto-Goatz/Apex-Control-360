import React, { useState } from 'react';
import { WorkflowStep, StepType } from '../types';
import { BoltIcon, PlusCircleIcon, SparklesIcon, XMarkIcon, PencilIcon, TrashIcon, CpuChipIcon } from './icons';

const initialSteps: WorkflowStep[] = [
    { id: '1', type: 'trigger', name: 'Contact Created', description: 'When a new contact is added to GHL', icon: <SparklesIcon />, configured: true },
    { id: '2', type: 'action', name: 'Send Welcome Email', description: 'sends "welcome-email-template"', icon: <BoltIcon />, configured: true },
    { id: '3', type: 'delay', name: 'Wait 3 Days', description: 'Pause before the next step', icon: <BoltIcon />, configured: true },
    { id: '4', type: 'action', name: 'Add to "Nurture" Pipeline', description: 'Stage: "New Lead"', icon: <BoltIcon />, configured: false },
];

const AiNudge: React.FC<{ onAccept: (suggestion: string) => void; text: string; suggestion: string }> = ({ onAccept, text, suggestion }) => (
    <div className="my-4 p-3 bg-brand-secondary/30 border border-brand-primary/50 rounded-lg flex items-center justify-between animate-fade-in">
        <div className="flex items-center space-x-3">
            <CpuChipIcon className="w-6 h-6 text-brand-accent"/>
            <p className="text-sm text-gray-200">{text}</p>
        </div>
        <button 
            onClick={() => onAccept(suggestion)}
            className="px-3 py-1 text-sm font-semibold bg-brand-accent text-dark-bg rounded-md hover:opacity-90 transition-opacity"
        >
            Do it for me
        </button>
    </div>
);

const AutomationBuilder: React.FC = () => {
    const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);

    const handleAddStep = () => {
        setEditingStep(null);
        setIsModalOpen(true);
    };

    const handleEditStep = (step: WorkflowStep) => {
        setEditingStep(step);
        setIsModalOpen(true);
    };
    
    const handleSaveStep = (step: WorkflowStep) => {
        if(editingStep) {
            setSteps(steps.map(s => s.id === editingStep.id ? {...step, configured: true} : s));
        } else {
            setSteps([...steps, {...step, id: Date.now().toString(), configured: true}]);
        }
        setIsModalOpen(false);
        setEditingStep(null);
    }
    
    const handleDeleteStep = (stepId: string) => {
        setSteps(steps.filter(s => s.id !== stepId));
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Automation Builder</h1>
                    <p className="text-gray-400 mt-1">Create powerful, multi-step workflows with AI assistance.</p>
                </div>
                 <button className="px-4 py-2 font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors">Publish Workflow</button>
            </div>

            <div className="w-full max-w-3xl mx-auto">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div className="flex items-center justify-center relative group">
                            <div className={`w-full bg-dark-card border rounded-xl p-5 backdrop-blur-xl shadow-lg transition-all duration-300 ${!step.configured ? 'border-yellow-500/50 hover:border-yellow-500' : 'border-dark-border hover:border-brand-primary/80'}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-brand-secondary/50 p-3 rounded-lg">{React.cloneElement(step.icon as React.ReactElement, { className: "w-6 h-6 text-brand-accent"})}</div>
                                        <div>
                                            <h3 className="font-bold text-lg">{step.name}</h3>
                                            <p className="text-sm text-gray-400">{step.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                         {!step.configured && <span className="text-xs text-yellow-400 font-semibold">Needs Setup</span>}
                                        <button onClick={() => handleEditStep(step)} className="p-2 rounded-lg hover:bg-white/10"><PencilIcon className="w-5 h-5"/></button>
                                        {step.type !== 'trigger' && <button onClick={() => handleDeleteStep(step.id)} className="p-2 rounded-lg hover:bg-white/10"><TrashIcon className="w-5 h-5 text-red-500/70 hover:text-red-500"/></button>}
                                    </div>
                                </div>
                                {!step.configured && <AiNudge text="Need to configure this step?" suggestion={`Configure ${step.name}`} onAccept={() => handleEditStep(step)} />}
                            </div>
                        </div>
                        {index < steps.length && (
                             <div className="h-16 w-full flex items-center justify-center">
                                <div className="h-full w-0.5 bg-dark-border relative">
                                    <button onClick={handleAddStep} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-dark-bg rounded-full">
                                         <PlusCircleIcon className="w-8 h-8 text-gray-500 hover:text-brand-accent transition-colors" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {isModalOpen && (
                 <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center animate-fade-in" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-dark-bg w-full max-w-lg border border-dark-border rounded-xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
                         <div className="flex justify-between items-center mb-4">
                             <h2 className="text-2xl font-bold">{editingStep ? 'Edit Step' : 'Add New Step'}</h2>
                             <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10"><XMarkIcon /></button>
                         </div>
                         <p className="text-gray-400 mb-4">Configure the action or trigger for your workflow.</p>
                         
                         {/* This would be a more complex form based on the selected step type */}
                         <div className="space-y-4">
                             <div>
                                 <label className="font-semibold text-sm">Step Name</label>
                                 <input type="text" defaultValue={editingStep?.name || 'Add to "Nurture" Pipeline'} className="w-full mt-1 bg-white/5 border border-dark-border rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                             </div>
                             <div>
                                 <label className="font-semibold text-sm">Description</label>
                                 <input type="text" defaultValue={editingStep?.description || 'Stage: "New Lead"'} className="w-full mt-1 bg-white/5 border border-dark-border rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                             </div>
                              <AiNudge text="Want help writing the email copy for this step?" suggestion="Write welcome email" onAccept={(s) => alert(`AI is now writing: ${s}`)} />
                         </div>

                         <div className="mt-6 flex justify-end space-x-4">
                             <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-semibold bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
                             <button onClick={() => handleSaveStep({...(editingStep || steps[3]), name: 'New Step Name'})} className="px-4 py-2 font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors">Save Step</button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutomationBuilder;

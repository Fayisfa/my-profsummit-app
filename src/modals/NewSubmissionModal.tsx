// NewSubmissionModal.tsx
import React, { useState, useEffect } from 'react';
import type { Event, Submission, User } from '../utils/types';
import ModalWrapper from './ModalWrapper';
import { CloudUpload } from 'lucide-react';


interface NewSubmissionModalProps {
    visible: boolean;
    onHide: () => void;
    event: Event | null;
    user: User;
    onSubmit: (submissionData: Partial<Submission>, file?: File | null) => void;
    existingSubmission: Submission | null;
}

const NewSubmissionModal: React.FC<NewSubmissionModalProps> = ({ visible, onHide, event, user, onSubmit, existingSubmission }) => {
    const [link, setLink] = useState('');
    const [text, setText] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (visible && event) {
            if (existingSubmission) {
                setLink(existingSubmission.data?.link || '');
                setText(existingSubmission.data?.text || '');
                setQuantity(existingSubmission.data?.quantity || 1);
            } else {
                setLink('');
                setText('');
                setQuantity(1);
                setFile(null);
            }
        }
    }, [visible, event, existingSubmission]);

    if (!visible || !event) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const data: Submission['data'] = {};

        // Loop through the event's submission types to gather all data
        event?.submissionType.forEach(type => {
            switch (type) {
                case 'Media Upload': data.link = link; break;
                case 'Text Submission': data.text = text; break;
                case 'Quantitative Input': data.quantity = quantity; break;
                // The file URL will be handled separately
            }
        });

        await onSubmit({ data }, file);
        setIsSubmitting(false);
        onHide();
    };

    const renderFormFields = () => {
        return event?.submissionType.map(type => {
            switch (type) {
                case 'Text Submission':
                    return (
                    <div key="text">
                        <label className="text-sm font-medium text-slate-700 mb-1 block">Report</label>
                        <textarea 
                        value={text} 
                        onChange={e => setText(e.target.value)} 
                        // Use the event's placeholder, or a default empty string
                        placeholder={event.placeholder || ''}
                        rows={5} 
                        className="w-full p-2 border border-slate-300 rounded-lg" 
                        />
                    </div>
                    );
                case 'Media Upload':
                    return (
                    <div key="media">
                        <label className="text-sm font-medium text-slate-700 mb-1 block">Social Media Link</label>
                        <input 
                        type="url" 
                        value={link} 
                        onChange={e => setLink(e.target.value)}
                        // Use the event's placeholder, or a default value
                        placeholder={event.placeholder || 'Paste the link to your Instagram Reel here...'}
                        className="w-full p-2 border border-slate-300 rounded-lg" 
                        />
                    </div>
                    );
                case 'Quantitative Input':
                    return (
                        <div key="quantity">
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Quantity</label>
                            <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" className="w-full p-2 border border-slate-300 rounded-lg" />
                        </div>
                    );
                case 'Image Upload':
                    return (
                        <div key="image">
                            <label className="text-sm font-medium text-slate-700 mb-1 block">
                                Image Upload
                            </label>

                            <div className="relative">
                                <input
                                type="file"
                                accept="image/*"
                                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                                className="w-full p-2 pl-10 border border-slate-300 rounded-lg cursor-pointer file:cursor-pointer"
                                />

                                {/* Icon inside input (left side, visual only) */}
                                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                                <CloudUpload className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    );
                case 'Video Upload':
                    return (
                        <div key="video">
                            <label className="text-sm font-medium text-slate-700 mb-1 block">
                                Video Upload
                            </label>

                            <div className="relative">
                                <input
                                type="file"
                                accept="video/*"
                                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                                className="w-full p-2 pl-10 border border-slate-300 rounded-lg cursor-pointer file:cursor-pointer"
                                />

                                {/* Icon inside the input on the left side */}
                                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                                <CloudUpload className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                            </div>
                    );
                default:
                    return null;
            }
        });
    };

    return (
        <ModalWrapper visible={visible} onHide={onHide} size="lg">
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{existingSubmission ? 'Update Submission' : event?.title}</h2>
                <p className="text-slate-600 mb-6">{existingSubmission ? 'Update your entry for this event.' : 'Submit your entry for this event.'}</p>
                <div className="space-y-4 mb-6">
                    {renderFormFields()}
                </div>
                <div className="flex justify-end gap-4">
                    <button onClick={onHide} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300" disabled={isSubmitting}>Cancel</button>
                    <button onClick={handleSubmit} className="bg-indigo-600 text-white px-6 py-2 rounded-lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : (existingSubmission ? 'Update Entry' : 'Submit Entry')}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default NewSubmissionModal;
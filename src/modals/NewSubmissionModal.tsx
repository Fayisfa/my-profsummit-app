// NewSubmissionModal.tsx
import React, { useState, useEffect } from 'react';
import type { Event, Submission, User } from '../utils/types';
import ModalWrapper from './ModalWrapper';
import { CloudUpload } from 'lucide-react';

const InfoIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

interface NewSubmissionModalProps {
  visible: boolean;
  onHide: () => void;
  event: Event | null;
  user: User;
  onSubmit: (submissionData: Partial<Submission>, files?: File[]) => void;
  existingSubmission: Submission | null;
}

const NewSubmissionModal: React.FC<NewSubmissionModalProps> = ({
  visible,
  onHide,
  event,
  user,
  onSubmit,
  existingSubmission
}) => {
  const [link, setLink] = useState('');
  const [text, setText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Populate form when modal opens
  useEffect(() => {
    if (visible && event) {
      if (existingSubmission) {
        setLink(existingSubmission.data?.link || '');
        setText(existingSubmission.data?.text || '');
        setQuantity(existingSubmission.data?.quantity || 1);
        setExistingImages(existingSubmission.data?.images || []);
      } else {
        setLink('');
        setText('');
        setQuantity(1);
        setExistingImages([]);
      }
      setFiles([]); // always reset new files when modal opens
    }
  }, [visible, event, existingSubmission]);

  // Cleanup when modal closes
  useEffect(() => {
    if (!visible) {
      setFiles([]);
      setExistingImages([]);
      setLink('');
      setText('');
      setQuantity(1);
    }
  }, [visible]);

  if (!visible || !event) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const data: Submission['data'] = {};

    // Fill in other submission fields
    event?.submissionType.forEach(type => {
      switch (type) {
        case 'Media Upload':
          data.link = link;
          break;
        case 'Text Submission':
          data.text = text;
          break;
        case 'Quantitative Input':
          data.quantity = quantity;
          break;
      }
    });

    // Keep previously uploaded images if any
    data.images = existingImages;

    await onSubmit({ data }, files);
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
                placeholder={event.placeholder || 'Paste the link to your Instagram Reel here...'}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
          );

        case 'Quantitative Input':
          return (
            <div key="quantity">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                min="1"
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
          );

        case 'Image Upload':
          return (
            <div key="image">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Image Upload</label>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files);
                      setFiles(newFiles); // replace instead of append
                    }
                  }}
                  className="w-full p-2 pl-10 border border-slate-300 rounded-lg cursor-pointer file:cursor-pointer"
                />

                {/* Already uploaded images */}
                {existingImages.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {existingImages.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`existing-${index}`}
                        className="w-24 h-24 object-cover rounded-lg border flex-shrink-0"
                      />
                    ))}
                  </div>
                )}

                {/* Newly selected images */}
                {files.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {files.map((file, index) =>
                      file.type.startsWith('image/') ? (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`preview-${index}`}
                          className="w-24 h-24 object-cover rounded-lg border flex-shrink-0"
                        />
                      ) : null
                    )}
                  </div>
                )}

                {/* Icon inside input */}
                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                  <CloudUpload className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>
          );

        case 'Video Upload':
          return (
            <div key="video">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Video Upload</label>

              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={e => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files);
                      setFiles(newFiles); // replace instead of append
                    }
                  }}
                  className="w-full p-2 pl-10 border border-slate-300 rounded-lg cursor-pointer file:cursor-pointer"
                />

                {/* Newly selected videos */}
                {files.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {files.map((file, index) =>
                      file.type.startsWith('video/') ? (
                        <video key={index} controls className="w-full h-32 rounded-lg border">
                          <source src={URL.createObjectURL(file)} type={file.type} />
                          Your browser does not support the video tag.
                        </video>
                      ) : null
                    )}
                  </div>
                )}

                {/* Icon inside input */}
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
       <div className="p-6 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">
                    {/* [OPTIONAL] Better title for resubmission */}
                    {existingSubmission?.status === 'rejected' ? 'Resubmit Entry' : (existingSubmission ? 'Update Submission' : event?.title)}
                </h2>
        <p className="text-slate-600 mb-6">
          {existingSubmission ? 'Update your entry for this event.' : 'Submit your entry for this event.'}
        </p>

        {existingSubmission?.status === 'rejected' && existingSubmission.feedback && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <InfoIcon className="h-5 w-5 text-amber-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-bold text-amber-800">Admin Feedback</p>
                                <p className="mt-1 text-sm text-amber-700 whitespace-pre-wrap">
                                    {existingSubmission.feedback}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

        <div className="space-y-4 mb-6">{renderFormFields()}</div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onHide}
            className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : existingSubmission ? 'Update Entry' : 'Submit Entry'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default NewSubmissionModal;

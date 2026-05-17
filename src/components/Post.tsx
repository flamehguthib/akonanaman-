import { useState, useEffect } from "react";
import { MapPin, Clock, DollarSign, Bookmark, Share2, Check } from 'lucide-react';

interface JobPostProps {
    company: string;
    companyLogo?: string;
    jobTitle: string;
    location: string;
    jobType: string;
    salary?: string;
    description: string;
    image?: string;
    postedTime: string;
    applicants: number;
    saves: number;
    onApply?: () => void;
}

export function JobPost ({
    company,
    companyLogo,
    jobTitle,
    location,
    jobType,
    salary,
    description,
    image,
    postedTime,
    applicants,
    saves,
    onApply,
}: JobPostProps){
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

        const handleShare = () => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
        };

        useEffect(() => {
            if (!copied) return
            const t = setTimeout(() => setCopied(false), 2000)
            return () => clearTimeout(t)
        }, [copied])
    return (
        <>
        <article className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-400"
            aria-labelledby="job-title">
            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-400">
                        {companyLogo ? <img src={companyLogo} alt={company} /> : company[0]}
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {jobTitle}
                </h3>
                <p className="text-sm font-medium text-gray-600">{company}</p>
                <button 
                    onClick={() => setSaved(!saved)}
                    className={`rounded-full p-2 transition-colors ${saved ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
                </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={14} /> {location}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock size={14} /> {jobType}
                </div>
                {salary && (
                    <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                        <DollarSign size={14} /> {salary}
                    </div>
                )}
            </div>
            <p className="mt-4 line-clamp-2 text-sm text-gray-600 leading-relaxed">
                {description}
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                <span className="text-xs text-gray-400">{postedTime} • {applicants} applicants</span>
                <button
                    onClick={() => setShowDetail(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                    Apply Now
                </button>
            </div>
            <div className="flex items-center gap-2">
          {/* Share Button */}
          <button 
            onClick={handleShare}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:bg-gray-50 hover:text-blue-600"
            title="Share Job"
          >
            {copied ? (
              <Check size={18} className="text-green-500" />
            ) : (
              <Share2 size={18} />
            )}
            
            {/* Tooltip */}
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-[10px] font-medium text-white">
                Copied!
              </span>
            )}
          </button>
          </div>
        </article>
        <JobPostDetailModal
          open={showDetail}
          onClose={() => setShowDetail(false)}
          job={{ company, companyLogo, jobTitle, location, jobType, salary, description, image, postedTime, applicants }}
          onApply={onApply}
        />
        </>
    );
}

// Detail modal rendered outside to avoid nesting issues
export function JobPostDetailModal({ open, onClose, job, onApply }:{ open:boolean, onClose:()=>void, job: any, onApply?:()=>void }){
        if (!open) return null
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                <div className="relative z-10 max-w-2xl w-full p-6 bg-white rounded-2xl shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="font-extrabold text-lg text-indigo-950">{job?.jobTitle || job?.title}</h2>
                            <p className="text-sm text-gray-500">{job?.company || job?.companyName}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">Close</button>
                    </div>
                    <div className="mt-4 text-sm text-gray-700">
                        <p className="mb-3">{job?.description}</p>
                        <div className="text-sm text-gray-600">
                            <div><strong>Location:</strong> {job?.location}</div>
                            <div><strong>Schedule:</strong> {job?.jobType}</div>
                            <div><strong>Pay:</strong> {job?.salary || job?.pay}</div>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2">
                        <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
                        <button onClick={() => { onApply?.(); onClose(); }} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Apply</button>
                    </div>
                </div>
            </div>
        )
}
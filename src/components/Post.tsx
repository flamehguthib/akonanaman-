import { useState } from "react";
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
}: JobPostProps){
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
    // Logic to copy the current URL or a specific job link
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    };
    
    // Reset the "Copied" state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
    return(
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
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
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
    );
}
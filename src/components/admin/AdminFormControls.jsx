import React from 'react';
import { Input as BaseInput } from '@/components/ui/input';
import { Textarea as BaseTextarea } from '@/components/ui/textarea';

export const Input = ({ label, className, ...props }) => (
    <div className="admin-form-group">
        {label && <label className="admin-label">{label}</label>}
        <BaseInput 
            {...props} 
            className={`admin-input ${className || ''}`} 
        />
    </div>
);

export const Textarea = ({ label, className, ...props }) => (
    <div className="admin-form-group">
        {label && <label className="admin-label">{label}</label>}
        <BaseTextarea 
            {...props} 
            className={`admin-input min-h-[100px] ${className || ''}`} 
        />
    </div>
);

export const ImagePreviewInput = ({ label, value, ...props }) => (
    <div className="admin-form-group">
        <Input label={label} value={value || ''} {...props} />
        {value && (
            <div className="mt-3 p-2 border border-slate-700 rounded-lg bg-[#0a0a0a]/50 inline-block">
                <div className="relative group">
                    <img 
                        src={value} 
                        alt="Önizleme" 
                        className="h-32 w-auto object-contain rounded" 
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400?text=Görsel+Hatas'; }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center text-xs text-white pointer-events-none">
                        Önizleme
                    </div>
                </div>
            </div>
        )}
    </div>
);
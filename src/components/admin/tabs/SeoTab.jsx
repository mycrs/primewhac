import React from 'react';
import { Input, Textarea } from '@/components/admin/AdminFormControls';

export const SeoTab = ({ siteData, setSiteData }) => {
    const { seoData } = siteData;
    const { setSeoData } = setSiteData;

    const handleChange = (page, field, value) => {
        setSeoData(prev => ({
            ...prev,
            [page]: {
                ...prev[page],
                [field]: value
            }
        }));
    };

    const pages = [
        { id: 'home', name: 'Ana Sayfa' },
        { id: 'about', name: 'Hakkımızda Sayfası' },
        { id: 'packages', name: 'Paketler Sayfası' },
        { id: 'channels', name: 'Kanallar Sayfası' },
        { id: 'installation', name: 'Kurulum Sayfası' },
        { id: 'faq', name: 'S.S.S. Sayfası' },
        { id: 'reseller', name: 'Bayilik Sayfası' },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">SEO Ayarları</h3>
            <p className="text-gray-300">Arama motorlarında daha iyi sıralamalar elde etmek için her sayfanın başlığını, açıklamasını ve anahtar kelimelerini düzenleyin.</p>
            
            {pages.map(page => (
                <div key={page.id} className="glass-effect rounded-lg p-6 space-y-4">
                    <h4 className="text-xl font-bold text-yellow-400">{page.name}</h4>
                    <Input 
                        label="Sayfa Başlığı (Title)" 
                        value={seoData?.[page.id]?.title || ''} 
                        onChange={e => handleChange(page.id, 'title', e.target.value)} 
                    />
                    <Textarea 
                        label="Sayfa Açıklaması (Description)" 
                        value={seoData?.[page.id]?.description || ''} 
                        onChange={e => handleChange(page.id, 'description', e.target.value)}
                        rows={3}
                    />
                    <Input 
                        label="Anahtar Kelimeler (Keywords, virgülle ayırın)" 
                        value={seoData?.[page.id]?.keywords || ''} 
                        onChange={e => handleChange(page.id, 'keywords', e.target.value)} 
                    />
                </div>
            ))}
        </div>
    );
};

export default SeoTab;
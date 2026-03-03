import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit, Save, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

export const GenericListEditor = ({ title, singularName, data, setData, fields }) => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [editingItem, setEditingItem] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    
    // Pagination
    const itemsPerPage = 10;
    
    const safeData = Array.isArray(data) ? data : [];

    const filteredData = useMemo(() => {
        return safeData.filter(item => 
            Object.values(item).some(val => 
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [safeData, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newItem = {};
        
        fields.forEach(field => {
            newItem[field.name] = formData.get(field.name);
        });

        if (editingItem) {
            const updatedData = safeData.map(item => 
                (item.id === editingItem.id) ? { ...item, ...newItem } : item
            );
            setData(updatedData);
            toast({ title: "Güncellendi", description: `${singularName} başarıyla güncellendi.` });
            setEditingItem(null);
        } else {
            const itemWithId = { ...newItem, id: Date.now().toString() };
            setData([...safeData, itemWithId]);
            toast({ title: "Eklendi", description: `Yeni ${singularName} eklendi.` });
            setIsCreating(false);
        }
    };

    const handleDelete = (id) => {
        if (confirm(`Bu ${singularName} kaydını silmek istediğinize emin misiniz?`)) {
            setData(safeData.filter(item => item.id !== id));
            toast({ title: "Silindi", description: "Kayıt silindi." });
        }
    };

    const EditorForm = ({ defaultValues = {}, onCancel }) => (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-700 p-6 rounded-xl space-y-4 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">
                    {defaultValues.id ? `${singularName} Düzenle` : `Yeni ${singularName}`}
                </h3>
                <Button type="button" variant="ghost" size="sm" onClick={onCancel}><X className="w-5 h-5"/></Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(field => (
                    <div key={field.name} className="space-y-2">
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <Input 
                            id={field.name}
                            name={field.name} 
                            defaultValue={defaultValues[field.name] || ''} 
                            placeholder={field.label}
                            required={field.required !== false}
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={onCancel}>İptal</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                    <Save className="w-4 h-4 mr-2" /> Kaydet
                </Button>
            </div>
        </form>
    );

    return (
        <div className="space-y-6">
            {(isCreating || editingItem) ? (
                <EditorForm 
                    defaultValues={editingItem || {}} 
                    onCancel={() => { setIsCreating(false); setEditingItem(null); }} 
                />
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                                placeholder={`${singularName} ara...`} 
                                className="pl-9 bg-slate-900/50 border-slate-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setIsCreating(true)} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" /> Yeni Ekle
                        </Button>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
                                    <tr>
                                        {fields.slice(0, 3).map(f => (
                                            <th key={f.name} className="px-6 py-4">{f.label}</th>
                                        ))}
                                        <th className="px-6 py-4 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {paginatedData.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                                            {fields.slice(0, 3).map(f => (
                                                <td key={f.name} className="px-6 py-4 truncate max-w-[200px]">
                                                    {f.name === 'image' || f.name === 'logoUrl' ? (
                                                        <img src={item[f.name]} alt="img" className="h-8 w-8 object-contain rounded bg-white/5" />
                                                    ) : (
                                                        item[f.name]
                                                    )}
                                                </td>
                                            ))}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)} className="h-8 w-8 p-0 hover:text-blue-400"><Edit className="w-4 h-4"/></Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="h-8 w-8 p-0 hover:text-red-400"><Trash2 className="w-4 h-4"/></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {paginatedData.length === 0 && (
                                        <tr>
                                            <td colSpan={fields.length + 1} className="px-6 py-12 text-center text-slate-500">
                                                Kayıt bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
                                <span className="text-xs text-slate-500">
                                    Toplam {filteredData.length} kayıt, sayfa {currentPage} / {totalPages}
                                </span>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
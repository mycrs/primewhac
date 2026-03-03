import React from 'react';
import { Button } from '@/components/ui/button';
import { Input as BaseInput } from '@/components/ui/input';
import { Textarea as BaseTextarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, Edit } from 'lucide-react';

export const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <BaseInput {...props} className="bg-white bg-opacity-10 border-gray-600 text-white" />
    </div>
);

export const Textarea = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <BaseTextarea {...props} className="bg-white bg-opacity-10 border-gray-600 text-white" />
    </div>
);

export const ItemEditor = ({ item, onSave, onCancel, fields }) => {
    const [formData, setFormData] = React.useState(item);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    }
    return (
        <div className="glass-effect rounded-lg p-6">
             <h4 className="text-xl font-bold text-white mb-4">{item.id ? 'Düzenle' : 'Yeni Ekle'}</h4>
             <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map(field => (
                    <Input key={field.name} label={field.label} name={field.name} value={formData[field.name] || ''} onChange={(e) => setFormData(p => ({...p, [e.target.name]: e.target.value}))} />
                ))}
                <div className="flex space-x-4">
                    <Button type="submit"><Save className="mr-2 h-4 w-4" />Kaydet</Button>
                    <Button type="button" onClick={onCancel} variant="outline">İptal</Button>
                </div>
             </form>
        </div>
    )
};

export const GenericListEditor = ({ title, data, setData, fields, singularName }) => {
    const [list, setList] = React.useState(data);
    const [editingItem, setEditingItem] = React.useState(null);

    const handleSave = (item) => {
        let savedItem;
        if (editingItem.isNew) {
            savedItem = { ...item, id: Date.now(), isNew: undefined };
            setList(prev => [...prev, savedItem]);
        } else {
            savedItem = item;
            setList(prev => prev.map(i => i.id === item.id ? item : i));
        }
        setEditingItem(null);
    }
    
    React.useEffect(() => {
        setData(list);
    }, [list, setData]);

    if (editingItem) {
        return <ItemEditor item={editingItem} onSave={handleSave} onCancel={() => setEditingItem(null)} fields={fields} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">{title} Yönetimi</h3>
                <Button onClick={() => setEditingItem({ isNew: true })} className="bg-green-600 hover:bg-green-700"><Plus className="w-4 h-4 mr-2" /> Yeni {singularName} Ekle</Button>
            </div>
            <div className="space-y-4">
            {list.map(item => (
                <div key={item.id} className="glass-effect rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <p className="text-white font-bold">{item.title || item.name}</p>
                        {item.genre && <p className="text-sm text-gray-400">{item.genre}</p>}
                    </div>
                    <div className="flex space-x-2">
                         <Button onClick={() => setEditingItem(item)} variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                         <Button onClick={() => setList(list.filter(i => i.id !== item.id))} variant="destructive" size="sm"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
};
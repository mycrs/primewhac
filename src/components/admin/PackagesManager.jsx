
import React, { useEffect, useState } from 'react';
import { useAdminData } from '@/hooks/useAdminData';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AdminPackageForm from './AdminPackageForm';
import PackagesPageContentTab from './tabs/PackagesPageContentTab';
import { getPackageCurrencySymbol } from '@/utils/buildPackagePayload';
import { packagesNeedTierMigration, packagesTierMigrationHint } from '@/utils/packageTierMigration';

const PackagesManager = ({ siteData, setSiteData }) => {
  const { fetchPackages, deletePackage, loading } = useAdminData();
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState('');
  const [editingPkg, setEditingPkg] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  const loadPackages = async () => {
    const data = await fetchPackages();
    setPackages(data);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bu paketi silmek istediğinize emin misiniz?')) {
      const success = await deletePackage(id);
      if (success) loadPackages();
    }
  };

  const filteredPackages = packages.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const tierMigrationPending = packagesNeedTierMigration(packages);

  if (editingPkg || isCreating) {
    return (
      <AdminPackageForm
        pkg={editingPkg}
        onSuccess={() => { setEditingPkg(null); setIsCreating(false); loadPackages(); }}
        onCancel={() => { setEditingPkg(null); setIsCreating(false); }}
      />
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="bg-[#0a0a0a] border border-slate-800">
        <TabsTrigger value="list">Paketler</TabsTrigger>
        <TabsTrigger value="page-content">Sayfa İçeriği (tier metinleri)</TabsTrigger>
      </TabsList>

      <TabsContent value="list" className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Paket Yönetimi</h2>
          <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary text-white">
            <Plus className="w-4 h-4 mr-2" /> Yeni Paket
          </Button>
        </div>

        {tierMigrationPending && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {packagesTierMigrationHint()}
          </div>
        )}

        <div className="flex items-center gap-2 bg-[#0a0a0a] p-2 rounded-lg border border-slate-800">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <Input
            placeholder="Paketlerde ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none bg-transparent text-white focus-visible:ring-0"
          />
        </div>

        <div className="bg-[#0a0a0a] rounded-lg border border-slate-800 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-300">İsim</TableHead>
                <TableHead className="text-slate-300">Tier</TableHead>
                <TableHead className="text-slate-300">Bölge</TableHead>
                <TableHead className="text-slate-300">Fiyat</TableHead>
                <TableHead className="text-slate-300">Süre</TableHead>
                <TableHead className="text-slate-300">Durum</TableHead>
                <TableHead className="text-right text-slate-300">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center text-slate-400">Yükleniyor...</TableCell></TableRow>
              ) : filteredPackages.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-slate-400">Paket bulunamadı.</TableCell></TableRow>
              ) : (
                filteredPackages.map((pkg) => (
                  <TableRow key={pkg.id} className="border-slate-800 text-slate-300">
                    <TableCell className="font-medium text-white">
                      {pkg.name} {pkg.popular && <Badge className="ml-2 bg-primary text-white">Popüler</Badge>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-slate-300 border-slate-600">
                        {pkg.tier || 'standard'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={pkg.region === 'EU' ? 'text-blue-400 border-blue-400/30' : 'text-red-400 border-red-400/30'}>
                        {pkg.region === 'EU' ? 'Avrupa' : 'Türkiye'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {pkg.price} {getPackageCurrencySymbol(pkg, pkg.region)}
                    </TableCell>
                    <TableCell>{pkg.duration}</TableCell>
                    <TableCell>
                      {pkg.enabled ? (
                        <Badge className="bg-green-600 text-white">Aktif</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-black">Pasif</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setEditingPkg(pkg)} className="text-blue-400 hover:text-blue-300 hover:bg-[#141414]/10">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(pkg.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="page-content" className="mt-4">
        {siteData && setSiteData ? (
          <PackagesPageContentTab siteData={siteData} setSiteData={setSiteData} />
        ) : (
          <p className="text-slate-400 text-sm">Sayfa içeriği için site verisi yüklenemedi. Sayfayı yenileyin.</p>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default PackagesManager;

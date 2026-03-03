
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Search, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import ChatBotDataManager from './ChatBotDataManager';

const ChatBotDataTable = ({ refreshTrigger, onRefresh }) => {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: responses, error: err } = await supabase
        .from('chatbot_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setData(responses || []);
    } catch (err) {
      console.error("Error fetching chatbot responses:", err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Veri Yükleme Hatası",
        description: "Chatbot verileri alınırken bir sorun oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Filtering Logic
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (item.keyword && item.keyword.toLowerCase().includes(term)) ||
      (item.response && item.response.toLowerCase().includes(term))
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  
  // Ensure current page is valid after filtering
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredData.length, totalPages, currentPage]);

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Soru veya cevap ara..." 
            value={searchTerm}
            onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
            className="pl-9 bg-slate-900 border-slate-800 text-white w-full"
          />
        </div>
        <div className="text-sm text-slate-400">
          Toplam <span className="text-white font-medium">{filteredData.length}</span> kayıt
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchData} variant="outline" className="border-slate-700">
              Tekrar Dene
            </Button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            {searchTerm ? "Aramanızla eşleşen sonuç bulunamadı." : "Henüz hiç kayıt eklenmemiş."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-950/50">
                <TableRow className="border-slate-800 hover:bg-slate-950/50">
                  <TableHead className="w-[80px] text-slate-400">ID</TableHead>
                  <TableHead className="w-[250px] text-slate-400">Soru (Anahtar Kelimeler)</TableHead>
                  <TableHead className="text-slate-400">Cevap</TableHead>
                  <TableHead className="w-[100px] text-slate-400">Durum</TableHead>
                  <TableHead className="w-[120px] text-slate-400 text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item) => (
                  <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <TableCell className="text-slate-500 font-mono text-xs">
                      {item.id.substring(0, 6)}...
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      {item.keyword}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <div className="line-clamp-2 text-sm">{item.response}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.active ? "default" : "secondary"} className={item.active ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}>
                        {item.active ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ChatBotDataManager item={item} onSuccess={onRefresh} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && filteredData.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-800 p-4 bg-slate-950/30">
            <div className="text-sm text-slate-400">
              Sayfa <span className="text-white">{currentPage}</span> / {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Önceki
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white disabled:opacity-50"
              >
                Sonraki <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBotDataTable;

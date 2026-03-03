import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, User, Calendar, Clock, Loader2, Info } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use supabase functions to invoke our edge function
      const { data, error } = await supabase.functions.invoke('list-users');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: tr });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h3 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h3>
           <p className="text-gray-400 text-sm">Sisteme kayıtlı kullanıcıların listesi.</p>
        </div>
        <Button onClick={fetchUsers} disabled={loading} variant="outline" className="border-gray-600 hover:bg-gray-800 text-gray-300">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Yenile
        </Button>
      </div>

      {/* Test Requests Info Alert */}
      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
             <Info className="w-5 h-5" />
          </div>
          <div>
             <h4 className="text-blue-400 font-bold mb-1">Test İstekleri Hakkında</h4>
             <p className="text-sm text-blue-300/80 leading-relaxed">
                Test istekleri artık doğrudan WordPress sistemine gönderilmektedir ve burada listelenmemektedir. 
                Sadece kayıtlı sistem kullanıcılarını aşağıda görüntüleyebilirsiniz.
             </p>
          </div>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-200">
        <CardHeader>
            <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-500" />
                <CardTitle className="text-lg">Kayıtlı Kullanıcılar</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
                Toplam {users.length} kullanıcı bulundu.
            </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
               <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">
               <p>Kullanıcılar yüklenirken bir hata oluştu.</p>
               <p className="text-xs mt-2 opacity-70">{error}</p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-950">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">Email</TableHead>
                    <TableHead className="text-slate-400">Rol</TableHead>
                    <TableHead className="text-slate-400">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Kayıt Tarihi
                        </div>
                    </TableHead>
                    <TableHead className="text-slate-400">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Son Giriş
                        </div>
                    </TableHead>
                    <TableHead className="text-right text-slate-400">ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="font-medium text-white">
                         {user.email}
                      </TableCell>
                      <TableCell>
                         <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
                             {user.role || 'user'}
                         </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                         {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                         {formatDate(user.last_sign_in_at)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-slate-500">
                         {user.id.slice(0, 8)}...
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                      <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                              Hiç kullanıcı bulunamadı.
                          </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;
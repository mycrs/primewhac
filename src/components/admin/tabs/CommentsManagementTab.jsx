import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
    CheckCircle, 
    XCircle, 
    Trash2, 
    Search, 
    MessageSquare, 
    Calendar, 
    Mail, 
    Loader2, 
    AlertTriangle,
    FileText,
    RefreshCw,
    CornerDownRight
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TIMEOUT_DURATION = 5000; // 5 seconds timeout

const CommentsManagementTab = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Track loading state for specific operations on specific comments
    // Format: { [commentId]: 'approve' | 'reject' | 'delete' }
    const [processingOperations, setProcessingOperations] = useState({});
    
    const { toast } = useToast();

    // Helper for timeout protection
    const withTimeout = (promise, operationName = 'İşlem') => {
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new Error(`${operationName} zaman aşımına uğradı (5 saniye).`));
            }, TIMEOUT_DURATION);
        });
        return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
    };

    // Fetch comments from Supabase
    const fetchComments = useCallback(async () => {
        setLoading(true);
        setFetchError(null);
        console.log("[FETCH] Starting to fetch comments...");
        
        try {
            const queryPromise = supabase
                .from('blog_comments')
                .select(`
                    *,
                    blog_posts (
                        title,
                        slug
                    )
                `)
                .order('created_at', { ascending: false });

            const { data, error } = await withTimeout(queryPromise, 'Veri yükleme');

            if (error) {
                console.error("[FETCH] Supabase error:", error);
                throw error;
            }
            
            console.log(`[FETCH] Successfully fetched ${data?.length || 0} comments.`);
            setComments(data || []);
        } catch (error) {
            console.error("[FETCH] Catch block error:", error);
            setFetchError(error.message);
            toast({
                variant: "destructive",
                title: "Yükleme Hatası",
                description: "Yorumlar yüklenirken bir sorun oluştu: " + error.message
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Handle approval/rejection status update
    const handleStatusUpdate = useCallback(async (commentId, newStatus) => {
        if (processingOperations[commentId]) return;

        console.log(`[UPDATE] Starting status update for comment ${commentId} to ${newStatus}`);
        const actionType = newStatus ? 'approve' : 'reject';
        setProcessingOperations(prev => ({ ...prev, [commentId]: actionType }));

        try {
            const updatePromise = supabase
                .from('blog_comments')
                .update({ is_approved: newStatus })
                .eq('id', commentId);

            const { error } = await withTimeout(updatePromise, newStatus ? 'Onaylama' : 'Reddetme');

            if (error) throw error;

            console.log(`[UPDATE] Success: Comment ${commentId} status updated.`);
            
            toast({
                title: newStatus ? "Başarılı: Yorum Onaylandı" : "Başarılı: Yorum Reddedildi",
                description: `Yorum başarıyla ${newStatus ? 'yayına alındı' : 'yayından kaldırıldı'}.`,
                className: newStatus ? "bg-green-600 border-none text-white" : "bg-yellow-600 border-none text-white"
            });
            
            // Optimistic update
            setComments(prev => prev.map(c => c.id === commentId ? { ...c, is_approved: newStatus } : c));
        } catch (error) {
            console.error(`[UPDATE] Error updating comment ${commentId}:`, error);
            const actionText = newStatus ? "Onay işlemi" : "Ret işlemi";
            toast({
                variant: "destructive",
                title: `${actionText} Başarısız`,
                description: error.message || "Beklenmeyen bir hata oluştu."
            });
        } finally {
            setProcessingOperations(prev => {
                const next = { ...prev };
                delete next[commentId];
                return next;
            });
        }
    }, [processingOperations, toast]);

    // Handle comment deletion
    const handleDelete = useCallback(async (commentId) => {
        if (!commentId) {
            console.warn("[DELETE] No comment ID provided.");
            return;
        }
        
        if (processingOperations[commentId]) {
            console.warn(`[DELETE] Operation already in progress for comment ${commentId}.`);
            return;
        }

        console.log(`[DELETE] Starting delete process for comment ID: ${commentId}`);
        setProcessingOperations(prev => ({ ...prev, [commentId]: 'delete' }));
        
        try {
            console.log(`[DELETE] Sending delete request to Supabase for ID: ${commentId}`);
            
            const deletePromise = supabase
                .from('blog_comments')
                .delete()
                .eq('id', commentId);

            const { error } = await withTimeout(deletePromise, 'Silme işlemi');

            if (error) {
                console.error(`[DELETE] Supabase returned error for ID ${commentId}:`, error);
                throw error;
            }

            console.log(`[DELETE] Successfully deleted comment ID: ${commentId}`);

            toast({
                title: "Başarılı: Silindi",
                description: "Yorum kalıcı olarak veritabanından silindi.",
                className: "bg-green-600 border-none text-white"
            });
            
            setComments(prev => {
                const filtered = prev.filter(c => c.id !== commentId);
                console.log(`[DELETE] State updated. Remaining comments: ${filtered.length}`);
                return filtered;
            });
        } catch (error) {
            console.error(`[DELETE] Exception caught during delete for ID ${commentId}:`, error);
            
            let errorMessage = "Yorum silinemedi.";
            if (error.code === '23503') { 
                errorMessage = "Bu yoruma verilmiş cevaplar var. Önce alt yorumları silmelisiniz.";
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast({
                variant: "destructive",
                title: "Silme İşlemi Başarısız",
                description: errorMessage
            });
        } finally {
            console.log(`[DELETE] Cleaning up loading state for ID: ${commentId}`);
            setProcessingOperations(prev => {
                const next = { ...prev };
                delete next[commentId];
                return next;
            });
        }
    }, [processingOperations, toast]);

    // Helper to find parent author name for threaded comments
    const getParentAuthor = (parentId) => {
        const parent = comments.find(c => c.id === parentId);
        return parent ? parent.author_name : 'Bilinmeyen';
    };

    // Filtering logic with useMemo
    const filteredComments = useMemo(() => {
        return comments.filter(comment => {
            if (filterStatus === 'approved' && !comment.is_approved) return false;
            if (filterStatus === 'pending' && comment.is_approved) return false;
    
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    (comment.author_name || '').toLowerCase().includes(searchLower) ||
                    (comment.author_email || '').toLowerCase().includes(searchLower) ||
                    (comment.content || '').toLowerCase().includes(searchLower) ||
                    (comment.blog_posts?.title || "").toLowerCase().includes(searchLower)
                );
            }
            return true;
        });
    }, [comments, filterStatus, searchTerm]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Tarih yok';
        try {
            return format(new Date(dateString), 'd MMMM yyyy HH:mm', { locale: tr });
        } catch (e) {
            return dateString;
        }
    };

    const totalCount = comments.length;
    const pendingCount = comments.filter(c => !c.is_approved).length;

    // Loading Skeleton
    if (loading && comments.length === 0) {
        return (
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <div className="h-8 w-48 bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-8 w-64 bg-slate-800 rounded animate-pulse"></div>
                 </div>
                 <div className="h-10 w-full bg-slate-800 rounded animate-pulse"></div>
                 {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 w-full bg-slate-900 border border-slate-800 rounded-xl animate-pulse"></div>
                 ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-purple-500" />
                        Yorum Yönetimi
                    </h2>
                    <div className="flex gap-4 mt-2 text-sm text-slate-400">
                        <span>Toplam: <strong className="text-white">{totalCount}</strong></span>
                        <span>Bekleyen: <strong className="text-yellow-400">{pendingCount}</strong></span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 overflow-x-auto">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setFilterStatus('all')}
                        className={`text-xs ${filterStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Tümü
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setFilterStatus('approved')}
                        className={`text-xs ${filterStatus === 'approved' ? 'bg-green-900/30 text-green-400' : 'text-slate-400 hover:text-green-400'}`}
                    >
                        Onaylı
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setFilterStatus('pending')}
                        className={`text-xs ${filterStatus === 'pending' ? 'bg-yellow-900/30 text-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`}
                    >
                        Bekleyen
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={fetchComments}
                        title="Yenile"
                        disabled={loading}
                        className={`ml-2 text-slate-400 hover:text-white hover:bg-slate-800 ${loading ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input 
                    placeholder="Yazar, e-posta, içerik veya yazı başlığı ara..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-purple-500"
                />
            </div>

            {fetchError ? (
                <div className="text-center py-20 border border-red-900/50 rounded-xl bg-red-900/10">
                    <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-900/50">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Yorumlar Yüklenemedi</h3>
                    <p className="text-red-300 mt-2 max-w-md mx-auto">{fetchError}</p>
                    <Button 
                        onClick={fetchComments} 
                        variant="outline" 
                        className="mt-4 border-red-800 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tekrar Dene
                    </Button>
                </div>
            ) : filteredComments.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Sonuç Bulunamadı</h3>
                    <p className="text-slate-500 mt-1">
                        {searchTerm ? "Arama kriterlerinize uygun yorum yok." : "Henüz yorum yapılmamış."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredComments.map((comment) => {
                        const isProcessing = !!processingOperations[comment.id];
                        const operationType = processingOperations[comment.id];

                        return (
                            <div 
                                key={comment.id} 
                                className={`
                                    relative p-4 rounded-xl border transition-all duration-200
                                    ${comment.is_approved 
                                        ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
                                        : 'bg-slate-900 border-yellow-900/30 shadow-[0_0_15px_-3px_rgba(234,179,8,0.1)]'
                                    }
                                    ${isProcessing ? 'opacity-70 pointer-events-none' : 'opacity-100'}
                                `}
                            >
                                <div className="flex flex-col md:flex-row gap-4 justify-between">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 text-sm">
                                            <Badge 
                                                variant="outline" 
                                                className={comment.is_approved 
                                                    ? "bg-green-950 text-green-400 border-green-900" 
                                                    : "bg-yellow-950 text-yellow-400 border-yellow-900"
                                                }
                                            >
                                                {comment.is_approved ? "Yayında" : "Onay Bekliyor"}
                                            </Badge>
                                            <span className="text-slate-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(comment.created_at)}
                                            </span>
                                            {comment.parent_comment_id && (
                                                <span className="flex items-center gap-1 text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded text-xs border border-purple-900/50">
                                                    <CornerDownRight className="w-3 h-3" />
                                                    Cevap: {getParentAuthor(comment.parent_comment_id)}
                                                </span>
                                            )}
                                            {comment.blog_posts?.title && (
                                                <span className="text-slate-500 flex items-center gap-1 opacity-70 border-l border-slate-700 pl-2">
                                                    <FileText className="w-3 h-3" />
                                                    <span className="max-w-[200px] truncate">{comment.blog_posts.title}</span>
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0 border border-slate-700">
                                                {comment.author_name ? comment.author_name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-white flex items-center gap-2">
                                                    {comment.author_name}
                                                </h4>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {comment.author_email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                            {comment.content}
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-2 justify-end md:justify-start min-w-[140px] pt-4 md:pt-0 md:border-l md:border-slate-800 md:pl-4">
                                        {!comment.is_approved ? (
                                            <Button 
                                                className="bg-green-600 hover:bg-green-700 text-white w-full justify-start h-8 text-xs disabled:opacity-50"
                                                size="sm"
                                                onClick={() => handleStatusUpdate(comment.id, true)}
                                                disabled={isProcessing}
                                            >
                                                {operationType === 'approve' ? (
                                                    <>
                                                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                                        Onaylanıyor...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-3 h-3 mr-2" />
                                                        Onayla
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <Button 
                                                className="bg-yellow-600 hover:bg-yellow-700 text-white w-full justify-start h-8 text-xs disabled:opacity-50"
                                                size="sm"
                                                onClick={() => handleStatusUpdate(comment.id, false)}
                                                disabled={isProcessing}
                                            >
                                                {operationType === 'reject' ? (
                                                    <>
                                                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                                        Reddediliyor...
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-3 h-3 mr-2" />
                                                        Reddet
                                                    </>
                                                )}
                                            </Button>
                                        )}

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button 
                                                    variant="destructive" 
                                                    className="bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 w-full justify-start h-8 text-xs disabled:opacity-50"
                                                    size="sm"
                                                    disabled={isProcessing}
                                                >
                                                    {operationType === 'delete' ? (
                                                        <>
                                                            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                                            Siliniyor...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Trash2 className="w-3 h-3 mr-2" />
                                                            Sil
                                                        </>
                                                    )}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="flex items-center gap-2">
                                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                                        Yorumu Sil
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-slate-400">
                                                        Bu işlem geri alınamaz. Yorum kalıcı olarak silinecektir.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                
                                                <div className="bg-slate-950 p-3 rounded-md border border-slate-800 text-sm text-slate-300 my-2 max-h-[100px] overflow-y-auto italic">
                                                    "{comment.content}"
                                                </div>

                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="bg-transparent border-slate-700 text-white hover:bg-slate-800 hover:text-white">İptal</AlertDialogCancel>
                                                    <AlertDialogAction 
                                                        onClick={() => handleDelete(comment.id)}
                                                        className="bg-red-600 hover:bg-red-700 border-none text-white"
                                                    >
                                                        Sil
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CommentsManagementTab;
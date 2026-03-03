
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Star, Calendar, Clock, Film, ArrowLeft, Play, Users, Loader2, Share2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import useMovieDatabase from '@/hooks/useMovieDatabase';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import SimilarContentSlider from '@/components/what-to-watch/SimilarContentSlider';

const WhatToWatchDetailPage = ({ siteData }) => {
  const { imdbID } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'movie';
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getMovieDetails, getTVDetails, loading, error } = useMovieDatabase();
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (imdbID) {
        try {
          let data;
          if (type === 'movie') {
            data = await getMovieDetails(imdbID);
          } else {
            data = await getTVDetails(imdbID);
          }
          setContent(data);
          window.scrollTo(0, 0);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchData();
  }, [imdbID, type, getMovieDetails, getTVDetails]);

  if (loading && !content) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-slate-400">Yükleniyor...</p>
      </div>
    );
  }

  if (error || (!content && !loading)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-red-400 mb-6 text-lg">İçerik bulunamadı veya bir hata oluştu.</p>
        <Button onClick={() => navigate('/what-to-watch')} variant="outline" className="text-white border-slate-700">
          <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
        </Button>
      </div>
    );
  }

  const { title, name, overview, poster_path, backdrop_path, vote_average, release_date, first_air_date, genres, runtime, episode_run_time, credits, similar } = content;
  const displayTitle = title || name;
  const year = (release_date || first_air_date)?.substring(0, 4);
  const cast = credits?.cast?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <SEOHead title={`${displayTitle} - Ne İzlesem`} description={overview || 'Detaylar'} />
      <Header contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />

      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <main className="container mx-auto px-4 -mt-40 relative z-10 pb-20">
        <Button onClick={() => navigate('/what-to-watch')} variant="ghost" className="text-slate-300 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Geri
        </Button>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <div className="w-64 md:w-80 shrink-0 mx-auto md:mx-0">
            <img src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'https://via.placeholder.com/500x750'} alt={displayTitle} className="w-full rounded-2xl shadow-2xl border border-slate-800" />
            <Button onClick={() => navigate('/packages')} className="w-full mt-6 bg-purple-600 hover:bg-purple-700 h-12 rounded-xl text-lg font-bold">
              <Play className="w-5 h-5 mr-2 fill-current" /> Hemen İzle
            </Button>
            <Button variant="outline" onClick={() => toast({ title: "Paylaşıldı", description: "Bağlantı kopyalandı" })} className="w-full mt-3 border-slate-700 hover:bg-slate-800 text-white h-12">
              <Share2 className="w-4 h-4 mr-2" /> Paylaş
            </Button>
          </div>

          <div className="flex-1 pt-4">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{displayTitle}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-slate-300">
              <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 font-bold">
                <Star className="w-4 h-4 fill-current" /> {vote_average?.toFixed(1)}
              </div>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {year}</span>
              {(runtime || episode_run_time?.[0]) && (
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {runtime || episode_run_time[0]} dk</span>
              )}
            </div>

            <div className="flex gap-2 mb-8 flex-wrap">
              {genres?.map(g => <Badge key={g.id} className="bg-slate-800 text-slate-300 hover:bg-slate-700">{g.name}</Badge>)}
            </div>

            <div className="mb-10">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><Film className="w-5 h-5 text-purple-400" /> Özet</h3>
              <p className="text-slate-300 leading-relaxed text-lg">{overview || 'Bu içerik için özet bulunmuyor.'}</p>
            </div>

            {cast.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-purple-400" /> Oyuncular</h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {cast.map(actor => (
                    <div key={actor.id} className="text-center w-24 shrink-0">
                      <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/150'} alt={actor.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-2 border-slate-800" />
                      <p className="text-sm font-bold truncate">{actor.name}</p>
                      <p className="text-xs text-slate-500 truncate">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {similar?.results?.length > 0 && (
          <div className="mt-20 pt-10 border-t border-slate-800">
            <h2 className="text-2xl font-bold mb-6">Benzer İçerikler</h2>
            <SimilarContentSlider items={similar.results} type={type} />
          </div>
        )}
      </main>

      <Footer contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
    </div>
  );
};

export default WhatToWatchDetailPage;

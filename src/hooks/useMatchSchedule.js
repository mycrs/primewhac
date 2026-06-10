import { useState, useEffect, useCallback } from 'react';
import { fetchGroupedFootballMatches } from '@/utils/liveMatchFixtures';

function formatDate(d) {
  const date = new Date(d);
  return date.toISOString().split('T')[0];
}

export function useMatchSchedule() {
  const getInitialDate = () => {
    const today = formatDate(new Date());
    if (typeof window === 'undefined') return today;
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get('date');
      return fromUrl || today;
    } catch {
      return today;
    }
  };

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getInitialDate);

  const fetchFixtures = useCallback(async (date) => fetchGroupedFootballMatches(date), []);

  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchFixtures(selectedDate)
      .then((data) => setMatches(data))
      .catch((e) => setError(e.message || 'Yüklenemedi'))
      .finally(() => setLoading(false));
  }, [selectedDate, fetchFixtures, retryCount]);

  const retry = useCallback(() => setRetryCount((c) => c + 1), []);

  const changeDate = (dateStr) => {
    setSelectedDate(dateStr);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('date', dateStr);
        window.history.replaceState({}, '', url.toString());
      } catch {
        // ignore URL update errors
      }
    }
  };

  const getDateOptions = (locale = 'tr') => {
    const opts = [];
    const isDe = locale === 'de';
    const shortDay = isDe ? ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] : ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const todayLabel = isDe ? 'Heute' : 'Bugün';
    for (let i = 0; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      opts.push({
        value: formatDate(d),
        label: i === 0 ? `${todayLabel} ${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}` : `${shortDay[d.getDay()]} ${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`,
      });
    }
    return opts;
  };

  return { matches, loading, error, selectedDate, changeDate, getDateOptions, retry };
}

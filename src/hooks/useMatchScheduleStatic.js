import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchGroupedFootballMatches } from '@/utils/liveMatchFixtures';

const FIXTURES_URL = '/data/fixtures.json';
const FIXTURES_BASKETBALL_URL = '/data/fixtures-basketball.json';
const FIXTURES_TENNIS_URL = '/data/fixtures-tennis.json';

export const SPORT_FOOTBALL = 'football';
export const SPORT_BASKETBALL = 'basketball';
export const SPORT_TENNIS = 'tennis';

function formatDate(d) {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const emptyData = () => ({ days: {} });

function staticDayHasMatches(groups) {
  return Array.isArray(groups) && groups.some((g) => (g.matches?.length ?? 0) > 0);
}

export function useMatchScheduleStatic() {
  const getInitialDate = () => {
    const today = formatDate(new Date());
    if (typeof window === 'undefined') return today;
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('date') || today;
    } catch {
      return today;
    }
  };

  const [sport, setSport] = useState(SPORT_FOOTBALL);
  const [footballData, setFootballData] = useState(null);
  const [basketballData, setBasketballData] = useState(null);
  const [tennisData, setTennisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getInitialDate);

  const [liveFootballGroups, setLiveFootballGroups] = useState([]);
  const [liveFootballDate, setLiveFootballDate] = useState(null);
  const [liveFetching, setLiveFetching] = useState(false);
  const [liveFootballError, setLiveFootballError] = useState(null);

  const activeData = sport === SPORT_FOOTBALL
    ? footballData
    : sport === SPORT_BASKETBALL
      ? basketballData
      : tennisData;

  const matches = useMemo(() => {
    if (sport === SPORT_BASKETBALL || sport === SPORT_TENNIS) {
      return activeData?.days?.[selectedDate] ?? [];
    }
    const staticGroups = footballData?.days?.[selectedDate] ?? [];
    if (staticDayHasMatches(staticGroups)) return staticGroups;
    if (liveFootballDate === selectedDate && Array.isArray(liveFootballGroups)) return liveFootballGroups;
    return [];
  }, [sport, activeData, selectedDate, footballData, liveFootballDate, liveFootballGroups]);

  const fetchAll = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(FIXTURES_URL).then((r) => {
        if (!r.ok) throw new Error('Maç verisi yüklenemedi.');
        return r.json();
      }),
      fetch(FIXTURES_BASKETBALL_URL).then((r) => (r.ok ? r.json() : emptyData())).catch(() => emptyData()),
      fetch(FIXTURES_TENNIS_URL).then((r) => (r.ok ? r.json() : emptyData())).catch(() => emptyData()),
    ])
      .then(([football, basketball, tennis]) => {
        setFootballData(football);
        setBasketballData(basketball || emptyData());
        setTennisData(tennis || emptyData());
      })
      .catch((e) => setError(e.message || 'Yüklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    if (retryCount === 0) return;
    fetchAll();
  }, [retryCount, fetchAll]);

  useEffect(() => {
    if (sport !== SPORT_FOOTBALL) {
      setLiveFootballError(null);
      setLiveFootballGroups([]);
      setLiveFootballDate(null);
      setLiveFetching(false);
    }
  }, [sport]);

  useEffect(() => {
    if (sport !== SPORT_FOOTBALL) return;
    if (loading || !footballData) return;

    const staticGroups = footballData.days?.[selectedDate] ?? [];
    if (staticDayHasMatches(staticGroups)) {
      setLiveFetching(false);
      setLiveFootballGroups([]);
      setLiveFootballDate(null);
      setLiveFootballError(null);
      return;
    }

    let cancelled = false;
    setLiveFetching(true);
    setLiveFootballError(null);

    fetchGroupedFootballMatches(selectedDate)
      .then((groups) => {
        if (!cancelled) {
          setLiveFootballGroups(groups);
          setLiveFootballDate(selectedDate);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setLiveFootballGroups([]);
          setLiveFootballDate(selectedDate);
          setLiveFootballError(e.message || 'Yüklenemedi');
        }
      })
      .finally(() => {
        if (!cancelled) setLiveFetching(false);
      });

    return () => { cancelled = true; };
  }, [sport, selectedDate, footballData, loading, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  const changeDate = useCallback((dateStr) => {
    setSelectedDate(dateStr);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('date', dateStr);
        window.history.replaceState({}, '', url.toString());
      } catch {}
    }
  }, []);

  const getDateOptions = useCallback((locale = 'tr', sportType = SPORT_FOOTBALL) => {
    const opts = [];
    const isDe = locale === 'de';
    const shortDay = isDe ? ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] : ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const todayLabel = isDe ? 'Heute' : 'Bugün';
    const dayCount = (sportType === SPORT_BASKETBALL || sportType === SPORT_TENNIS) ? 59 : 13;
    for (let i = 0; i <= dayCount; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      opts.push({
        value: formatDate(d),
        label: i === 0
          ? `${todayLabel} ${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`
          : `${shortDay[d.getDay()]} ${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`,
      });
    }
    return opts;
  }, []);

  const staticGroupsForDay = footballData?.days?.[selectedDate] ?? [];
  const footballNeedsLive = sport === SPORT_FOOTBALL && !loading && !!footballData && !staticDayHasMatches(staticGroupsForDay);
  const listLoading = loading || (sport === SPORT_FOOTBALL && liveFetching && footballNeedsLive);

  const resolvedError = error
    || (sport === SPORT_FOOTBALL && footballNeedsLive && !liveFetching && liveFootballError ? liveFootballError : null);

  return {
    matches,
    loading: listLoading,
    error: resolvedError,
    selectedDate,
    changeDate,
    getDateOptions,
    retry,
    sport,
    setSport,
  };
}

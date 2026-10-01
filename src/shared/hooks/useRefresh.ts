import { useEffect, useRef, useState } from 'react';
import { QueryObserverResult } from '@tanstack/react-query';

type RefetchableQuery = Pick<QueryObserverResult, 'refetch' | 'isRefetching'>;

const MIN_SPINNER_MS = 600;
const MAX_SPINNER_MS = 8000;

export function useRefresh(...queries: RefetchableQuery[]) {
  const [refreshing, setRefreshing] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const stop = () => {
    clearTimers();
    setRefreshing(false);
  };

  const onRefresh = () => {
    if (refreshing) return;
    clearTimers();
    setRefreshing(true);

    const startedAt = Date.now();
    const done = () => {
      const wait = Math.max(0, MIN_SPINNER_MS - (Date.now() - startedAt));
      timers.current.push(setTimeout(stop, wait));
    };

    Promise.all(
      queries.map((q) => Promise.resolve(q.refetch()).catch(() => {})),
    ).then(done, done);

    // failsafe: never leave the spinner stuck if a request hangs
    timers.current.push(setTimeout(stop, MAX_SPINNER_MS));
  };

  return { refreshing, onRefresh };
}

import { useCallback, useEffect, useState } from 'react';

/**
 * Minimal data-fetching hook.
 *
 *   const { data, loading, error, refetch } = useApi(() => api.get('/camps'));
 *
 * Pass a `deps` array to re-run the loader when inputs change:
 *
 *   const { data } = useApi(() => api.get(`/victims?campId=${id}`), [id]);
 */
export default function useApi(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loader();
      setData(res?.data ?? null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run, setData };
}

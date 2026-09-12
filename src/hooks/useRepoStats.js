import { useState, useEffect } from 'react';

// In-memory session cache to prevent duplicate GitHub API calls across page navigations
const statsCache = new Map();

/**
 * Custom React Hook: useRepoStats
 * 
 * Fetches GitHub repository metadata (stars, forks, language) with:
 * - In-memory caching to respect GitHub's 60 req/hr unauthenticated limit.
 * - AbortController cleanup to cancel pending fetch requests if the component unmounts.
 * - Silent fallback on 403 rate-limits or offline state.
 * 
 * @param {string} repo - "owner/repo" format (e.g. "manu-k06/civic-pulse")
 * @returns {{ stats: { stars: number, forks: number, language: string } | null, loading: boolean }}
 */
export function useRepoStats(repo) {
  const [stats, setStats] = useState(() => (repo ? statsCache.get(repo) || null : null));
  const [loading, setLoading] = useState(() => (repo ? !statsCache.has(repo) : false));

  useEffect(() => {
    if (!repo) return;

    // Use cached response if available
    if (statsCache.has(repo)) {
      setStats(statsCache.get(repo));
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchStats() {
      try {
        setLoading(true);
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
          signal: controller.signal,
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        });

        // If rate limited or not found, degrade gracefully without throwing
        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();
        const extractedStats = {
          stars: data.stargazers_count,
          forks: data.forks_count,
          language: data.language,
          updatedAt: data.updated_at,
        };

        statsCache.set(repo, extractedStats);
        setStats(extractedStats);
      } catch (error) {
        // Ignore expected abort errors on unmount
        if (error.name !== 'AbortError') {
          console.debug(`[useRepoStats] Silently falling back for ${repo}:`, error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchStats();

    // Cleanup: cancel in-flight request if user navigates away before fetch resolves
    return () => {
      controller.abort();
    };
  }, [repo]);

  return { stats, loading };
}

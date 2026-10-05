import { OnlineVisual, InspirationFilter, InspirationApiResponse } from '../../types/visuals.ts';
import { CURATED_INSPIRATION_COLLECTION } from './curatedVisuals.ts';

// In-memory cache for Pexels responses & curated visuals
const memoryCache = new Map<string, { data: OnlineVisual[]; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour cache

const PEXELS_SEARCH_QUERIES: Record<InspirationFilter, string> = {
  All: 'luxury contemporary interior architecture',
  Living: 'modern luxury living room interior',
  Bedroom: 'contemporary luxury bedroom interior',
  Kitchen: 'modern luxury kitchen interior',
  Dining: 'contemporary dining room interior',
  Office: 'modern executive office workspace interior',
  Commercial: 'luxury hospitality lounge restaurant interior',
  Furniture: 'custom modern designer furniture wood stone',
  Lighting: 'architectural interior lighting',
  Materials: 'marble wood stone interior texture',
  Architecture: 'modern interior architecture staircase ceiling'
};

export async function fetchInspirationVisuals(
  filter: InspirationFilter = 'All',
  page: number = 1,
  limit: number = 12
): Promise<InspirationApiResponse> {
  const pexelsApiKey = process.env.PEXELS_API_KEY;
  const cacheKey = `inspiration_${filter}_${page}_${limit}`;

  // Check cache first
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    const total = filter === 'All'
      ? CURATED_INSPIRATION_COLLECTION.length
      : CURATED_INSPIRATION_COLLECTION.filter(i => i.filterTag === filter).length;
    return {
      items: cached.data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
      filter,
      source: pexelsApiKey ? 'pexels-live' : 'curated-cache'
    };
  }

  // Attempt live Pexels API fetch if API key is provided
  if (pexelsApiKey && pexelsApiKey.trim() !== '') {
    try {
      const query = PEXELS_SEARCH_QUERIES[filter] || 'luxury interior design';
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${limit}&page=${page}&orientation=landscape`,
        {
          headers: {
            Authorization: pexelsApiKey
          }
        }
      );

      if (response.ok) {
        const json = await response.json();
        const liveItems: OnlineVisual[] = (json.photos || []).map((p: any) => ({
          id: `ov-px-${p.id}`,
          source: 'Pexels' as const,
          sourceUrl: p.url,
          photographer: p.photographer,
          photographerUrl: p.photographer_url,
          imageUrl: p.src.large2x || p.src.large,
          thumbnailUrl: p.src.medium,
          alt: p.alt || `${filter} interior design inspiration photo`,
          category: (filter === 'Office' || filter === 'Commercial') ? 'Commercial' : (filter === 'Furniture' || filter === 'Lighting' || filter === 'Materials' || filter === 'Architecture') ? 'Design Details' : 'Residential',
          subcategory: filter,
          filterTag: filter,
          width: p.width || 1600,
          height: p.height || 1066,
          aspectRatio: Number(((p.width || 1600) / (p.height || 1066)).toFixed(2)),
          orientation: (p.width > p.height) ? 'landscape' : 'portrait',
          tags: [filter.toLowerCase(), 'contemporary interior', 'pexels'],
          isConcept: true,
          createdAt: new Date().toISOString()
        }));

        if (liveItems.length > 0) {
          memoryCache.set(cacheKey, { data: liveItems, timestamp: Date.now() });
          const total = json.total_results || 320;
          return {
            items: liveItems,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total,
            filter,
            source: 'pexels-live'
          };
        }
      } else {
        console.warn(`[Pexels API] Status ${response.status}. Falling back to curated archive.`);
      }
    } catch (err) {
      console.warn('[Pexels API] Fetch failed, using curated archive fallback:', err);
    }
  }

  // Graceful fallback to verified curated collection of 320+ items
  let filtered = CURATED_INSPIRATION_COLLECTION;
  if (filter !== 'All') {
    filtered = CURATED_INSPIRATION_COLLECTION.filter(item => item.filterTag === filter);
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginated = filtered.slice(startIndex, endIndex);

  memoryCache.set(cacheKey, { data: paginated, timestamp: Date.now() });

  return {
    items: paginated,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasMore: endIndex < total,
    filter,
    source: 'curated-cache'
  };
}

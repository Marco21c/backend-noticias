# 🔍 Ejemplos Prácticos - Sistema de Búsqueda de Noticias

## Índice Rápido

1. [cURL / REST](#curl-rest)
2. [JavaScript / Fetch API](#javascript-fetch-api)
3. [TypeScript / Node.js](#typescript-nodejs)
4. [React Hooks](#react-hooks)
5. [Casos de Uso Reales](#casos-de-uso-reales)

---

## cURL / REST

### Búsqueda Simple

```bash
# Búsqueda básica: "AI"
curl -X GET "http://localhost:3000/api/news/search?q=AI&page=1&limit=10"

# URL encoded: con espacios
curl -X GET "http://localhost:3000/api/news/search?q=machine%20learning&page=1&limit=10"

# Con caracteres especiales (seguros)
curl -X GET "http://localhost:3000/api/news/search?q=C%2B%2B&page=1&limit=10"
```

### Búsqueda Avanzada con cURL

```bash
# Búsqueda en campos específicos
curl -X GET "http://localhost:3000/api/news/advanced" \
  --data-urlencode "q=python" \
  --data-urlencode "searchFields=title" \
  -G

# Con todos los parámetros
curl -X GET "http://localhost:3000/api/news/advanced" \
  -G \
  --data-urlencode "q=javascript" \
  --data-urlencode "searchType=regex" \
  --data-urlencode "searchFields=title,summary" \
  --data-urlencode "status=published" \
  --data-urlencode "sortBy=recent" \
  --data-urlencode "page=1" \
  --data-urlencode "limit=20"

# Guardar respuesta en archivo
curl -X GET "http://localhost:3000/api/news/search?q=test" > results.json
```

---

## JavaScript / Fetch API

### Búsqueda Simple

```javascript
// Función básica de búsqueda
async function searchNews(query) {
  const params = new URLSearchParams({
    q: query,
    page: 1,
    limit: 10
  });

  try {
    const response = await fetch(
      `/api/news/search?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      console.log(`✓ Encontrados: ${data.data.pagination.total} resultado(s)`);
      displayResults(data.data.items);
      return data.data;
    } else {
      console.error('✗ Error:', data.error.message);
      return null;
    }
  } catch (error) {
    console.error('Error en búsqueda:', error);
    return null;
  }
}

// Uso
const results = await searchNews('inteligencia artificial');
```

### Búsqueda Avanzada

```javascript
async function advancedSearch(options) {
  const {
    query = '',
    searchType = 'regex',
    searchFields = 'all',
    status = 'published',
    sortBy = 'date',
    page = 1,
    limit = 10
  } = options;

  const params = new URLSearchParams({
    q: query,
    searchType,
    searchFields: Array.isArray(searchFields) ? searchFields.join(',') : searchFields,
    status: Array.isArray(status) ? status.join(',') : status,
    sortBy,
    page,
    limit
  });

  const response = await fetch(`/api/news/advanced?${params}`);
  return await response.json();
}

// Uso
const results = await advancedSearch({
  query: 'machine learning',
  searchType: 'regex',
  searchFields: ['title', 'summary'],
  status: ['published', 'approved'],
  sortBy: 'recent',
  page: 1,
  limit: 20
});
```

### Búsqueda con Paginación

```javascript
// Clase para gestionar búsquedas paginadas
class NewsSearchPaginator {
  constructor(query) {
    this.query = query;
    this.currentPage = 1;
    this.limit = 10;
    this.totalPages = 0;
    this.results = [];
  }

  async fetch() {
    const params = new URLSearchParams({
      q: this.query,
      page: this.currentPage,
      limit: this.limit
    });

    const response = await fetch(`/api/news/search?${params}`);
    const data = await response.json();

    if (data.success) {
      this.results = data.data.items;
      this.totalPages = data.data.pagination.totalPages;
      return data.data;
    }
    return null;
  }

  async nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      return await this.fetch();
    }
    return null;
  }

  async prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      return await this.fetch();
    }
    return null;
  }

  async goToPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      return await this.fetch();
    }
    return null;
  }
}

// Uso
const paginator = new NewsSearchPaginator('python');
const firstPage = await paginator.fetch();

console.log(`Página 1 de ${paginator.totalPages}`);
console.log(`Resultados: ${paginator.results.length}`);

// Ir a página siguiente
const nextPage = await paginator.nextPage();
console.log(`Página 2 de ${paginator.totalPages}`);
```

### Búsqueda con Manejo de Errores

```javascript
async function safeSearch(query) {
  // Validar en cliente
  if (!query) {
    console.error('Query vacío');
    return { items: [], pagination: {} };
  }

  if (query.length > 100) {
    console.warn('Query demasiado largo, truncando...');
    query = query.substring(0, 100);
  }

  try {
    const response = await fetch(
      `/api/news/search?q=${encodeURIComponent(query)}&page=1&limit=10`
    );

    if (response.status === 400) {
      const error = await response.json();
      console.error('Validación failed:', error.error.message);
      return { items: [], pagination: {} };
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error en búsqueda:', error.message);
    return { items: [], pagination: {} };
  }
}
```

---

## TypeScript / Node.js

### Búsqueda en Servicio Backend

```typescript
import axios, { AxiosError } from 'axios';
import type { ISearchApiResponse, INews } from './interfaces';

class NewsSearchService {
  private baseUrl: string = process.env.API_URL || 'http://localhost:3000/api';

  /**
   * Búsqueda simple
   */
  async search(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ISearchApiResponse<INews> | null> {
    try {
      const response = await axios.get<any>(`${this.baseUrl}/news/search`, {
        params: { q: query, page, limit }
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   * Búsqueda avanzada
   */
  async advancedSearch(options: {
    query: string;
    searchType?: 'regex' | 'text';
    searchFields?: string | string[];
    status?: string | string[];
    sortBy?: 'date' | 'relevance' | 'recent';
    page?: number;
    limit?: number;
  }): Promise<ISearchApiResponse<INews> | null> {
    try {
      const response = await axios.get<any>(`${this.baseUrl}/news/advanced`, {
        params: options
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   * Búsqueda con reintentos automáticos
   */
  async searchWithRetry(
    query: string,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<ISearchApiResponse<INews> | null> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.search(query);
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        console.log(`Reintentando... (${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return null;
  }

  /**
   * Búsqueda paralela de múltiples queries
   */
  async searchMultiple(
    queries: string[]
  ): Promise<Map<string, ISearchApiResponse<INews>>> {
    const results = new Map();

    const promises = queries.map(async q => {
      const result = await this.search(q);
      if (result) {
        results.set(q, result);
      }
      return { query: q, result };
    });

    await Promise.all(promises);
    return results;
  }

  private handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 400) {
        const data: any = axiosError.response.data;
        console.error(`Validación error: ${data.error?.message}`);
      } else {
        console.error(`API error: ${axiosError.message}`);
      }
    } else {
      console.error('Error desconocido:', error);
    }
  }
}

// Exportar singleton
export const newsSearchService = new NewsSearchService();
```

### Uso en Express Middleware

```typescript
import express from 'express';
import { newsSearchService } from './services/newsSearchService';

const router = express.Router();

// Endpoint que usa el servicio de búsqueda
router.get('/search-news', async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({
      error: 'Query parameter "q" es requerido'
    });
  }

  const results = await newsSearchService.search(
    String(q),
    Number(page),
    Number(limit)
  );

  if (!results) {
    return res.status(500).json({
      error: 'Error interno en búsqueda'
    });
  }

  res.json(results);
});

export default router;
```

---

## React Hooks

### Hook useNewsSearch

```typescript
import { useState, useCallback, useEffect } from 'react';
import type { INews } from '../interfaces';

interface SearchState {
  items: INews[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useNewsSearch(initialQuery: string = '') {
  const [state, setState] = useState<SearchState>({
    items: [],
    loading: false,
    error: null,
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
  });

  const search = useCallback(
    async (query: string, page: number = 1, limit: number = 10) => {
      if (!query.trim()) {
        setState(s => ({ ...s, items: [], error: null }));
        return;
      }

      setState(s => ({ ...s, loading: true, error: null }));

      try {
        const params = new URLSearchParams({ q: query, page: String(page), limit: String(limit) });
        const response = await fetch(`/api/news/search?${params}`);

        if (!response.ok) {
          throw new Error('Error en búsqueda');
        }

        const data = await response.json();

        if (data.success) {
          setState({
            items: data.data.items,
            pagination: data.data.pagination,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        setState(s => ({
          ...s,
          error: error instanceof Error ? error.message : 'Error desconocido',
          loading: false
        }));
      }
    },
    []
  );

  return { ...state, search };
}
```

### Componente de Búsqueda

```tsx
import React, { useState, useRef } from 'react';
import { useNewsSearch } from './useNewsSearch';

export function SearchNoticias() {
  const [query, setQuery] = useState('');
  const { items, pagination, loading, error, search } = useNewsSearch();
  const debounceRef = useRef<NodeJS.Timeout>();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debouncer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      search(value, 1);
    }, 500);
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      search(query, pagination.page + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      search(query, pagination.page - 1);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Buscar noticias..."
        disabled={loading}
      />

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Buscando...</div>}

      {!loading && items.length > 0 && (
        <>
          <div className="results">
            {items.map(item => (
              <article key={item.id} className="news-item">
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <small>Por: {item.author.name}</small>
              </article>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={pagination.page === 1}
            >
              Anterior
            </button>

            <span>
              Página {pagination.page} de {pagination.totalPages}
              ({pagination.total} resultados)
            </span>

            <button
              onClick={handleNextPage}
              disabled={pagination.page === pagination.totalPages}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {!loading && items.length === 0 && query && (
        <div className="no-results">No se encontraron resultados</div>
      )}
    </div>
  );
}
```

### Hook useAdvancedSearch

```typescript
import { useState, useCallback } from 'react';

interface AdvancedSearchOptions {
  query: string;
  searchType?: 'regex' | 'text';
  searchFields?: string | string[];
  status?: string | string[];
  sortBy?: 'date' | 'relevance' | 'recent';
  page?: number;
  limit?: number;
}

export function useAdvancedSearch() {
  const [state, setState] = useState({
    items: [],
    loading: false,
    error: null,
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
    searchType: 'regex'
  });

  const search = useCallback(async (options: AdvancedSearchOptions) => {
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const params = new URLSearchParams({
        q: options.query,
        ...(options.searchType && { searchType: options.searchType }),
        ...(options.searchFields && {
          searchFields: Array.isArray(options.searchFields)
            ? options.searchFields.join(',')
            : options.searchFields
        }),
        ...(options.status && {
          status: Array.isArray(options.status)
            ? options.status.join(',')
            : options.status
        }),
        ...(options.sortBy && { sortBy: options.sortBy }),
        page: String(options.page || 1),
        limit: String(options.limit || 10)
      });

      const response = await fetch(`/api/news/advanced?${params}`);
      const data = await response.json();

      setState({
        items: data.data.items,
        pagination: data.data.pagination,
        searchType: data.data.searchType,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(s => ({
        ...s,
        error: error instanceof Error ? error.message : 'Error',
        loading: false
      }));
    }
  }, []);

  return { ...state, search };
}
```

---

## Casos de Uso Reales

### Caso 1: Buscador de Noticias en Tiempo Real

```typescript
// search.ts - User-facing search component
import debounce from 'lodash/debounce';

async function handleRealtimeSearch(inputValue: string) {
  if (inputValue.length < 2) {
    // No buscar palabras muy cortas
    return;
  }

  const results = await fetch(
    `/api/news/search?q=${encodeURIComponent(inputValue)}&limit=5`
  ).then(r => r.json());

  displayQuickSearchResults(results.data.items);
}

// Debounced version
const debouncedSearch = debounce(handleRealtimeSearch, 300);
```

### Caso 2: Búsqueda Facetada (Filtrado Avanzado)

```typescript
interface SearchFilters {
  query: string;
  categories: string[]; // Post-filter en frontend
  dateRange: [Date, Date];
  sortBy: 'relevance' | 'recent' | 'popular';
}

async function applyFilters(filters: SearchFilters) {
  // Búsqueda en backend
  const results = await fetch(
    `/api/news/advanced?q=${filters.query}&sortBy=${filters.sortBy}`
  ).then(r => r.json());

  // Filtrado adicional en frontend
  let filtered = results.data.items;

  if (filters.categories.length > 0) {
    filtered = filtered.filter(item =>
      filters.categories.includes(item.category.name)
    );
  }

  if (filters.dateRange) {
    const [start, end] = filters.dateRange;
    filtered = filtered.filter(item => {
      const pubDate = new Date(item.publicationDate);
      return pubDate >= start && pubDate <= end;
    });
  }

  return filtered;
}
```

### Caso 3: Auto-Completar / Sugerencias

```typescript
async function getSuggestions(partial: string) {
  // Búsqueda rápida de sugerencias
  const response = await fetch(
    `/api/news/search?q=${encodeURIComponent(partial)}&limit=5`
  );
  const data = await response.json();

  // Extraer títulos como sugerencias
  return data.data.items.map(news => ({
    label: news.title,
    value: news.title,
    url: `/news/${news.slug}`
  }));
}

// Uso con autocomplete library
$(
```

### Caso 4: Búsqueda por Voz

```typescript
async function handleVoiceSearch(transcript: string) {
  // El navegador proporciona el transcript
  // Sanitizar y buscar
  const cleanTranscript = transcript.trim();

  try {
    const results = await fetch(
      `/api/news/search?q=${encodeURIComponent(cleanTranscript)}`
    ).then(r => r.json());

    if (results.success) {
      speakResults(results.data.items);
    }
  } catch (error) {
    console.error('Error en búsqueda por voz:', error);
  }
}

function speakResults(items: any[]) {
  const synth = window.speechSynthesis;
  const text = `Se encontraron ${items.length} resultados. 
                 ${items.slice(0, 3).map(i => i.title).join('. ')}`;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  synth.speak(utterance);
}
```

### Caso 5: Análisis de Búsquedas (Analytics)

```typescript
interface SearchAnalytics {
  query: string;
  resultsFound: number;
  executionTime: number;
  userLocation: string;
  timestamp: Date;
}

async function trackSearch(query: string, results: any) {
  const analytics: SearchAnalytics = {
    query,
    resultsFound: results.pagination.total,
    executionTime: results.executionTimeMs || 0,
    userLocation: getUserLocation(),
    timestamp: new Date()
  };

  // Enviar a servicio de analytics
  await fetch('/api/analytics/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(analytics)
  });
}
```

---

**Última actualización:** Febrero 2024

import axios from 'axios';

export interface SearchResult {
    title: string;
    url: string;
    content: string;
    score?: number;
}

export class WebSearchService {
    private apiKey: string;
    private apiUrl: string;

    constructor() {
        this.apiKey = process.env.TAVILY_API_KEY || '';
        this.apiUrl = process.env.TAVILY_API_URL || 'https://api.tavily.com/search';
    }

    async search(query: string, maxResults: number = 5): Promise<SearchResult[]> {
        if (!this.apiKey) {
            console.warn('⚠️ Tavily API key no configurada. No se realizarán búsquedas web.');
            return [];
        }
        try {
            const response = await axios.post(this.apiUrl, {
                api_key: this.apiKey,
                query: query,
                max_results: maxResults,
                include_answer: false,
                include_raw_content: false,
            });
            return response.data.results.map((r: any) => ({
                title: r.title,
                url: r.url,
                content: r.content,
                score: r.score,
            }));
        } catch (error) {
            console.error('Error en búsqueda web:', error);
            return [];
        }
    }
}
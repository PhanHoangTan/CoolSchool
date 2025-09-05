/**
 * API Configuration
 * Cấu hình kết nối với Backend API
 */
const API_CONFIG = {
  BASE_URL: "http://localhost:3000",
  ENDPOINTS: {
    NEWS: "/api/news",
    NEWS_SEARCH: "/api/news/search",
    NEWS_CATEGORIES: "/api/news/categories",
    NEWS_BY_ID: "/api/news/:id",
    NEWS_BY_SLUG: "/api/news/slug/:slug",
  },
  DEFAULT_PARAMS: {
    page: 1,
    limit: 6,
  },
};

/**
 * HTTP Request Helper
 * Utility function để thực hiện HTTP requests
 */
class HttpClient {
  static async request(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  static async get(url, params = {}) {
    const urlWithParams = new URL(url);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        urlWithParams.searchParams.append(key, params[key]);
      }
    });

    return this.request(urlWithParams.toString(), {
      method: "GET",
    });
  }

  static async post(url, data = {}) {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async put(url, data = {}) {
    return this.request(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async delete(url) {
    return this.request(url, {
      method: "DELETE",
    });
  }
}

export { API_CONFIG, HttpClient };

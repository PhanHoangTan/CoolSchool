/**
 * News API Service
 * Service để tương tác với News API endpoints
 */
import { API_CONFIG, HttpClient } from "./config.js";

class NewsAPI {
  /**
   * Lấy danh sách tin tức
   * @param {Object} params - Parameters cho request
   * @param {number} params.page - Số trang (default: 1)
   * @param {number} params.limit - Số item trên trang (default: 6)
   * @param {string} params.category - Danh mục lọc
   * @param {string} params.search - Từ khóa tìm kiếm
   * @returns {Promise<Object>} Response data
   */
  static async getNews(params = {}) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NEWS}`;
    const queryParams = {
      ...API_CONFIG.DEFAULT_PARAMS,
      ...params,
    };

    try {
      const response = await HttpClient.get(url, queryParams);
      return {
        success: true,
        data: response.data || [],
        pagination: response.pagination || {},
        total: response.pagination?.totalItems || 0,
      };
    } catch (error) {
      console.error("Error fetching news:", error);
      return {
        success: false,
        error: error.message,
        data: [],
        pagination: {},
        total: 0,
      };
    }
  }

  /**
   * Lấy tin tức theo ID
   * @param {number} id - ID của tin tức
   * @returns {Promise<Object>} Response data
   */
  static async getNewsById(id) {
    const url = `${
      API_CONFIG.BASE_URL
    }${API_CONFIG.ENDPOINTS.NEWS_BY_ID.replace(":id", id)}`;

    try {
      const response = await HttpClient.get(url);
      return {
        success: true,
        data: response.data || null,
      };
    } catch (error) {
      console.error("Error fetching news by ID:", error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Lấy tin tức theo slug
   * @param {string} slug - Slug của tin tức
   * @returns {Promise<Object>} Response data
   */
  static async getNewsBySlug(slug) {
    const url = `${
      API_CONFIG.BASE_URL
    }${API_CONFIG.ENDPOINTS.NEWS_BY_SLUG.replace(":slug", slug)}`;

    try {
      const response = await HttpClient.get(url);
      return {
        success: true,
        data: response.data || null,
      };
    } catch (error) {
      console.error("Error fetching news by slug:", error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Tìm kiếm tin tức
   * @param {string} keyword - Từ khóa tìm kiếm
   * @param {Object} params - Parameters cho request
   * @param {number} params.page - Số trang
   * @param {number} params.limit - Số item trên trang
   * @param {string} params.category - Danh mục lọc
   * @returns {Promise<Object>} Response data
   */
  static async searchNews(keyword, params = {}) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NEWS_SEARCH}`;
    const queryParams = {
      keyword,
      ...API_CONFIG.DEFAULT_PARAMS,
      ...params,
    };

    try {
      const response = await HttpClient.get(url, queryParams);
      return {
        success: true,
        data: response.data || [],
        pagination: response.pagination || {},
        searchInfo: response.searchInfo || {},
        total: response.pagination?.totalItems || 0,
      };
    } catch (error) {
      console.error("Error searching news:", error);
      return {
        success: false,
        error: error.message,
        data: [],
        pagination: {},
        searchInfo: {},
        total: 0,
      };
    }
  }

  /**
   * Lấy danh sách danh mục
   * @returns {Promise<Object>} Response data
   */
  static async getCategories() {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NEWS_CATEGORIES}`;

    try {
      const response = await HttpClient.get(url);
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  /**
   * Tạo tin tức mới
   * @param {Object} newsData - Dữ liệu tin tức
   * @returns {Promise<Object>} Response data
   */
  static async createNews(newsData) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NEWS}`;

    try {
      const response = await HttpClient.post(url, newsData);
      return {
        success: true,
        data: response.data || null,
        message: response.message || "Tạo tin tức thành công",
      };
    } catch (error) {
      console.error("Error creating news:", error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Cập nhật tin tức
   * @param {number} id - ID tin tức
   * @param {Object} newsData - Dữ liệu cập nhật
   * @returns {Promise<Object>} Response data
   */
  static async updateNews(id, newsData) {
    const url = `${
      API_CONFIG.BASE_URL
    }${API_CONFIG.ENDPOINTS.NEWS_BY_ID.replace(":id", id)}`;

    try {
      const response = await HttpClient.put(url, newsData);
      return {
        success: true,
        data: response.data || null,
        message: response.message || "Cập nhật tin tức thành công",
      };
    } catch (error) {
      console.error("Error updating news:", error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Xóa tin tức
   * @param {number} id - ID tin tức
   * @returns {Promise<Object>} Response data
   */
  static async deleteNews(id) {
    const url = `${
      API_CONFIG.BASE_URL
    }${API_CONFIG.ENDPOINTS.NEWS_BY_ID.replace(":id", id)}`;

    try {
      const response = await HttpClient.delete(url);
      return {
        success: true,
        data: response.data || null,
        message: response.message || "Xóa tin tức thành công",
      };
    } catch (error) {
      console.error("Error deleting news:", error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }
}

export default NewsAPI;

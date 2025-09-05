/**
 * News Page Handler
 * Quản lý việc render và tương tác trên trang tin tức
 */
import NewsAPI from "./api/newsAPI.js";

class NewsPageHandler {
  constructor() {
    this.currentPage = 1;
    this.itemsPerPage = 6;
    this.currentCategory = "";
    this.currentKeyword = "";
    this.isLoading = false;

    this.init();
  }

  /**
   * Khởi tạo page handler
   */
  init() {
    this.setupEventListeners();
    this.loadNews();
    this.loadCategories();
  }

  /**
   * Thiết lập event listeners
   */
  setupEventListeners() {
    // Search functionality
    const searchForm = document.querySelector(".search-form");
    const searchInput = document.querySelector(".search-input");
    const searchButton = document.querySelector(".search-button");

    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSearch();
      });
    }

    if (searchButton) {
      searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleSearch();
      });
    }

    // Category filter
    const categorySelect = document.querySelector("#categoryFilter");
    if (categorySelect) {
      categorySelect.addEventListener("change", (e) => {
        this.currentCategory = e.target.value;
        this.currentPage = 1;
        this.loadNews();
      });
    }

    // Pagination
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("pagination-btn")) {
        const page = parseInt(e.target.dataset.page);
        if (page && page !== this.currentPage) {
          this.currentPage = page;
          this.loadNews();
        }
      }
    });
  }

  /**
   * Xử lý tìm kiếm
   */
  async handleSearch() {
    const searchInput = document.querySelector(".search-input");
    const keyword = searchInput ? searchInput.value.trim() : "";

    this.currentKeyword = keyword;
    this.currentPage = 1;

    if (keyword) {
      await this.searchNews(keyword);
    } else {
      await this.loadNews();
    }
  }

  /**
   * Tải danh sách tin tức
   */
  async loadNews() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoading();

    try {
      const params = {
        page: this.currentPage,
        limit: this.itemsPerPage,
      };

      if (this.currentCategory) {
        params.category = this.currentCategory;
      }

      const response = await NewsAPI.getNews(params);

      if (response.success) {
        this.renderNews(response.data);
        this.renderPagination(response.pagination);
        this.updateResultsInfo(response.total);
      } else {
        this.showError("Không thể tải tin tức. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error loading news:", error);
      this.showError("Đã xảy ra lỗi khi tải tin tức!");
    } finally {
      this.isLoading = false;
      this.hideLoading();
    }
  }

  /**
   * Tìm kiếm tin tức
   */
  async searchNews(keyword) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoading();

    try {
      const params = {
        page: this.currentPage,
        limit: this.itemsPerPage,
      };

      if (this.currentCategory) {
        params.category = this.currentCategory;
      }

      const response = await NewsAPI.searchNews(keyword, params);

      if (response.success) {
        this.renderNews(response.data, response.searchInfo);
        this.renderPagination(response.pagination);
        this.updateResultsInfo(response.total, keyword);
      } else {
        this.showError("Không thể tìm kiếm tin tức. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error searching news:", error);
      this.showError("Đã xảy ra lỗi khi tìm kiếm!");
    } finally {
      this.isLoading = false;
      this.hideLoading();
    }
  }

  /**
   * Tải danh mục
   */
  async loadCategories() {
    try {
      // Tạo categories từ dữ liệu có sẵn thay vì gọi API riêng
      const categories = [
        { value: "program", label: "Chương trình học" },
        { value: "culture", label: "Văn hóa" },
        { value: "events", label: "Sự kiện" },
        { value: "education", label: "Giáo dục" },
      ];

      this.renderCategories(categories);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  /**
   * Render danh sách tin tức
   */
  renderNews(newsData, searchInfo = null) {
    const newsContainer =
      document.querySelector(".news-list") ||
      document.querySelector(".news-grid");

    if (!newsContainer) {
      console.warn("News container not found");
      return;
    }

    if (!newsData || newsData.length === 0) {
      newsContainer.innerHTML = `
        <div class="no-results">
          <p>Không tìm thấy tin tức nào.</p>
        </div>
      `;
      return;
    }

    const newsHTML = newsData
      .map((news) => this.createNewsHTML(news, searchInfo))
      .join("");
    newsContainer.innerHTML = newsHTML;
  }

  /**
   * Tạo HTML cho một tin tức
   */
  createNewsHTML(news, searchInfo = null) {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Xử lý highlight nếu có search
    let title = news.title;
    let description = news.description;

    if (searchInfo && searchInfo.highlightedContent) {
      const highlighted = searchInfo.highlightedContent.find(
        (h) => h.id === news.id
      );
      if (highlighted) {
        title = highlighted.title || title;
        description = highlighted.description || description;
      }
    }

    return `
      <div class="news-item" data-id="${news.id}">
        <div class="news-image">
          <a href="#" onclick="viewNewsDetail(${news.id})" title="${
      news.title
    }">
            <img
              src="${
                news.image ||
                "https://bizweb.dktcdn.net/thumb/large/100/347/562/articles/default-news.jpg?v=1550778252097"
              }"
              alt="${news.title}"
              onerror="this.src='https://via.placeholder.com/400x250/cccccc/666666?text=No+Image'"
            />
          </a>
        </div>
        <div class="news-date">
          <span>${formatDate(news.createdAt)}</span>
        </div>
        <div class="news-info">
          <h3>
            <a href="#" onclick="viewNewsDetail(${news.id})" title="${
      news.title
    }">
              ${title}
            </a>
          </h3>
          <div class="news-author">
            <span><i class="fas fa-user"></i> Đăng bởi: Cool Team</span>
          </div>
          <div class="news-desc">
            <p>${description}</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render pagination
   */
  renderPagination(pagination) {
    const paginationContainer = document.querySelector(".pagination");

    if (!paginationContainer || !pagination || pagination.totalPages <= 1) {
      if (paginationContainer) {
        paginationContainer.innerHTML = "";
      }
      return;
    }

    let paginationHTML = "";

    // Previous button
    if (pagination.currentPage > 1) {
      paginationHTML += `
        <button class="pagination-btn" data-page="${
          pagination.currentPage - 1
        }">
          &laquo; Trước
        </button>
      `;
    }

    // Page numbers
    const startPage = Math.max(1, pagination.currentPage - 2);
    const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2);

    if (startPage > 1) {
      paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span class="pagination-dots">...</span>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const activeClass = i === pagination.currentPage ? "active" : "";
      paginationHTML += `
        <button class="pagination-btn ${activeClass}" data-page="${i}">
          ${i}
        </button>
      `;
    }

    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        paginationHTML += `<span class="pagination-dots">...</span>`;
      }
      paginationHTML += `<button class="pagination-btn" data-page="${pagination.totalPages}">${pagination.totalPages}</button>`;
    }

    // Next button
    if (pagination.currentPage < pagination.totalPages) {
      paginationHTML += `
        <button class="pagination-btn" data-page="${
          pagination.currentPage + 1
        }">
          Tiếp &raquo;
        </button>
      `;
    }

    paginationContainer.innerHTML = paginationHTML;
  }

  /**
   * Render categories
   */
  renderCategories(categories) {
    const categorySelect = document.querySelector("#categoryFilter");

    if (!categorySelect || !categories) return;

    const optionsHTML = categories
      .map(
        (category) =>
          `<option value="${category.value}">${category.label}</option>`
      )
      .join("");

    categorySelect.innerHTML = `
      <option value="">Tất cả danh mục</option>
      ${optionsHTML}
    `;
  }

  /**
   * Cập nhật thông tin kết quả
   */
  updateResultsInfo(total, searchKeyword = "") {
    const resultsInfo = document.querySelector(".results-info");

    if (!resultsInfo) return;

    let infoText = "";
    if (searchKeyword) {
      infoText = `Tìm thấy ${total} kết quả cho từ khóa "${searchKeyword}"`;
    } else {
      infoText = `Hiển thị ${total} tin tức`;
    }

    resultsInfo.textContent = infoText;
  }

  /**
   * Hiển thị loading
   */
  showLoading() {
    const newsContainer =
      document.querySelector(".news-list") ||
      document.querySelector(".news-grid");
    if (newsContainer) {
      newsContainer.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Đang tải...</p>
        </div>
      `;
    }
  }

  /**
   * Ẩn loading
   */
  hideLoading() {
    // Loading sẽ được thay thế bởi content khi render
  }

  /**
   * Hiển thị lỗi
   */
  showError(message) {
    const newsContainer =
      document.querySelector(".news-list") ||
      document.querySelector(".news-grid");
    if (newsContainer) {
      newsContainer.innerHTML = `
        <div class="error-container">
          <p class="error-message">${message}</p>
          <button onclick="location.reload()" class="retry-btn">Thử lại</button>
        </div>
      `;
    }
  }
}

// Global function để xem chi tiết tin tức
window.viewNewsDetail = async function (newsId) {
  // Chuyển hướng đến trang chi tiết với ID
  window.location.href = `news-detail.html?id=${newsId}`;
};

// Khởi tạo khi DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  new NewsPageHandler();
});

export default NewsPageHandler;

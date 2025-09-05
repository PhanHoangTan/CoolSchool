/**
 * News Detail Page Handler
 * Quản lý việc load và hiển thị chi tiết tin tức
 */
import NewsAPI from "./api/newsAPI.js";

class NewsDetailHandler {
  constructor() {
    this.newsId = null;
    this.newsSlug = null;
    this.newsData = null;
    this.isLoading = false;

    this.init();
  }

  /**
   * Khởi tạo handler
   */
  init() {
    this.getNewsIdFromUrl();
    this.setupEventListeners();
    this.loadNewsDetail();
  }

  /**
   * Lấy ID hoặc slug từ URL
   */
  getNewsIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    this.newsId = urlParams.get("id");
    this.newsSlug = urlParams.get("slug");

    if (!this.newsId && !this.newsSlug) {
      // Nếu không có ID hoặc slug, chuyển về trang news
      window.location.href = "news.html";
      return;
    }
  }

  /**
   * Thiết lập event listeners
   */
  setupEventListeners() {
    // Search functionality
    const searchForm = document.querySelector(".search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchInput = document.querySelector(".search-input");
        const keyword = searchInput ? searchInput.value.trim() : "";
        if (keyword) {
          window.location.href = `news.html?search=${encodeURIComponent(
            keyword
          )}`;
        } else {
          window.location.href = "news.html";
        }
      });
    }

    // Comment form
    const commentForm = document.querySelector(".comment-form-container");
    if (commentForm) {
      const submitBtn = commentForm.querySelector(".comment-submit-btn");
      if (submitBtn) {
        submitBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleCommentSubmit();
        });
      }
    }
  }

  /**
   * Tải chi tiết tin tức
   */
  async loadNewsDetail() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoading();

    try {
      let response;

      if (this.newsId) {
        response = await NewsAPI.getNewsById(this.newsId);
      } else if (this.newsSlug) {
        response = await NewsAPI.getNewsBySlug(this.newsSlug);
      }

      if (response && response.success && response.data) {
        this.newsData = response.data;
        this.renderNewsDetail();
        this.loadRelatedNews();
        this.showContent();
      } else {
        this.showError("Tin tức không tồn tại hoặc đã bị xóa!");
      }
    } catch (error) {
      console.error("Error loading news detail:", error);
      this.showError("Đã xảy ra lỗi khi tải tin tức!");
    } finally {
      this.isLoading = false;
      this.hideLoading();
    }
  }

  /**
   * Render chi tiết tin tức
   */
  renderNewsDetail() {
    if (!this.newsData) return;

    const news = this.newsData;

    // Update page title
    document.title = `Cool School - ${news.title}`;
    document.getElementById(
      "page-title"
    ).textContent = `Cool School - ${news.title}`;

    // Update breadcrumb
    document.getElementById("breadcrumb-title").textContent = news.title;

    // Update meta tags
    document
      .getElementById("meta-url")
      .setAttribute("content", window.location.href);
    document
      .getElementById("meta-description")
      .setAttribute("content", news.description || "");
    document
      .getElementById("meta-headline")
      .setAttribute("content", news.title);
    document
      .getElementById("meta-image")
      .setAttribute("content", news.image || "");
    document
      .getElementById("meta-published")
      .setAttribute("content", news.createdAt);
    document
      .getElementById("meta-modified")
      .setAttribute("content", news.updatedAt);

    // Update article content
    document.getElementById("article-title").textContent = news.title;
    document.getElementById("article-subtitle").textContent = news.title;
    document.getElementById("article-summary").textContent =
      news.description || "";

    // Update article image
    const articleImage = document.getElementById("article-image");
    if (articleImage && news.image) {
      articleImage.src = news.image;
      articleImage.alt = news.title;
      articleImage.title = news.title;
    }

    // Update date
    this.updateDateDisplay(news.createdAt);

    // Update author
    document.getElementById("article-author").textContent =
      news.author || "Cool Team";

    // Update category
    const categoryNames = {
      program: "Chương trình học",
      culture: "Văn hóa",
      events: "Sự kiện",
      education: "Giáo dục",
    };
    document.getElementById("article-category").textContent =
      categoryNames[news.category] || news.category;

    // Update content
    document.getElementById("article-content-body").innerHTML =
      this.formatContent(news.content);

    // Update tags
    this.renderTags(news.category);

    // Update share buttons
    this.setupShareButtons();
  }

  /**
   * Cập nhật hiển thị ngày tháng
   */
  updateDateDisplay(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Tháng 01",
      "Tháng 02",
      "Tháng 03",
      "Tháng 04",
      "Tháng 05",
      "Tháng 06",
      "Tháng 07",
      "Tháng 08",
      "Tháng 09",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    const month = monthNames[date.getMonth()];

    document.getElementById("date-number").textContent = day;
    document.getElementById("date-month").textContent = month;
  }

  /**
   * Format nội dung bài viết
   */
  formatContent(content) {
    if (!content) return "<p>Nội dung đang được cập nhật...</p>";

    // Xử lý các đoạn văn bản thành HTML
    let formattedContent = content
      .split("\n\n")
      .map((paragraph) => {
        if (paragraph.trim()) {
          // Xử lý text in đậm
          paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
          // Xử lý text in nghiêng
          paragraph = paragraph.replace(/\*(.*?)\*/g, "<i>$1</i>");
          return `<p>${paragraph.trim()}</p>`;
        }
        return "";
      })
      .filter((p) => p)
      .join("");

    return formattedContent || `<p>${content}</p>`;
  }

  /**
   * Render tags
   */
  renderTags(category) {
    const tagsContainer = document.getElementById("article-tags");
    if (!tagsContainer) return;

    const tagMap = {
      program: ["chương trình học", "giáo dục", "quốc tế"],
      culture: ["văn hóa", "truyền thống", "học tập"],
      events: ["sự kiện", "hoạt động", "cool school"],
      education: ["giáo dục", "phát triển", "trẻ em"],
    };

    const tags = tagMap[category] || ["cool school", "tin tức"];

    const tagsHTML = tags
      .map(
        (tag) =>
          `<a href="news.html?search=${encodeURIComponent(
            tag
          )}" class="tag-link">${tag}</a>`
      )
      .join("");

    tagsContainer.innerHTML = tagsHTML;
  }

  /**
   * Thiết lập nút share
   */
  setupShareButtons() {
    const currentUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(
      this.newsData?.title || "Cool School News"
    );
    const description = encodeURIComponent(this.newsData?.description || "");

    // Facebook
    const facebookBtn = document.getElementById("share-facebook");
    if (facebookBtn) {
      facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
      facebookBtn.target = "_blank";
    }

    // Twitter
    const twitterBtn = document.getElementById("share-twitter");
    if (twitterBtn) {
      twitterBtn.href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${title}`;
      twitterBtn.target = "_blank";
    }

    // LinkedIn
    const linkedinBtn = document.getElementById("share-linkedin");
    if (linkedinBtn) {
      linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
      linkedinBtn.target = "_blank";
    }
  }

  /**
   * Tải tin tức liên quan
   */
  async loadRelatedNews() {
    if (!this.newsData) return;

    try {
      const response = await NewsAPI.getNews({
        category: this.newsData.category,
        limit: 3,
        page: 1,
      });

      if (response.success && response.data) {
        // Lọc bỏ tin tức hiện tại
        const relatedNews = response.data
          .filter((news) => news.id !== this.newsData.id)
          .slice(0, 3);
        this.renderRelatedNews(relatedNews);
      }
    } catch (error) {
      console.error("Error loading related news:", error);
    }
  }

  /**
   * Render tin tức liên quan
   */
  renderRelatedNews(relatedNews) {
    const container = document.getElementById("related-news");
    if (!container || !relatedNews.length) {
      const section = document.querySelector(".related-news-section");
      if (section) section.style.display = "none";
      return;
    }

    const relatedHTML = relatedNews
      .map(
        (news) => `
      <div class="related-news-item">
        <div class="related-news-image">
          <a href="news-detail.html?id=${news.id}" title="${news.title}">
            <img 
              src="${
                news.image ||
                "https://via.placeholder.com/300x200/cccccc/666666?text=No+Image"
              }"
              alt="${news.title}"
              onerror="this.src='https://via.placeholder.com/300x200/cccccc/666666?text=No+Image'"
            />
          </a>
        </div>
        <div class="related-news-content">
          <h4 class="related-news-title">
            <a href="news-detail.html?id=${news.id}" title="${news.title}">
              ${news.title}
            </a>
          </h4>
          <p class="related-news-desc">
            ${news.description || ""}
          </p>
          <div class="related-news-date">
            ${this.formatRelatedDate(news.createdAt)}
          </div>
        </div>
      </div>
    `
      )
      .join("");

    container.innerHTML = relatedHTML;
  }

  /**
   * Format ngày cho tin tức liên quan
   */
  formatRelatedDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Xử lý gửi comment
   */
  handleCommentSubmit() {
    const authorInput = document.querySelector('input[name="Author"]');
    const emailInput = document.querySelector('input[name="Email"]');
    const bodyInput = document.querySelector('textarea[name="Body"]');

    const author = authorInput?.value.trim();
    const email = emailInput?.value.trim();
    const body = bodyInput?.value.trim();

    if (!author || !email || !body) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email không hợp lệ!");
      return;
    }

    // Simulate comment submission
    alert("Cảm ơn bạn đã bình luận! Comment sẽ được duyệt và hiển thị sớm.");

    // Clear form
    if (authorInput) authorInput.value = "";
    if (emailInput) emailInput.value = "";
    if (bodyInput) bodyInput.value = "";
  }

  /**
   * Hiển thị loading
   */
  showLoading() {
    document.getElementById("news-loading").style.display = "block";
    document.getElementById("news-content").style.display = "none";
    document.getElementById("news-error").style.display = "none";
  }

  /**
   * Ẩn loading
   */
  hideLoading() {
    document.getElementById("news-loading").style.display = "none";
  }

  /**
   * Hiển thị content
   */
  showContent() {
    document.getElementById("news-content").style.display = "block";
    document.getElementById("news-error").style.display = "none";
  }

  /**
   * Hiển thị lỗi
   */
  showError(message) {
    document.getElementById("news-error").style.display = "block";
    document.getElementById("news-content").style.display = "none";
    const errorMsg = document.querySelector("#news-error .error-message");
    if (errorMsg) {
      errorMsg.textContent = message;
    }
  }
}

// Global function để copy link
window.copyToClipboard = function () {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      alert("Đã sao chép liên kết!");
    })
    .catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Đã sao chép liên kết!");
    });
};

// Khởi tạo khi DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  new NewsDetailHandler();
});

export default NewsDetailHandler;

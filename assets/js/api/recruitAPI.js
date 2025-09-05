// Recruit API Handler
class RecruitAPI {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/recruits';
  }

  // Gửi đăng ký tuyển sinh mới
  async createRecruit(recruitData) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recruitData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi gửi đăng ký tuyển sinh');
      }

      return result;
    } catch (error) {
      console.error('Error creating recruit:', error);
      throw error;
    }
  }

  // Lấy danh sách đăng ký tuyển sinh (dành cho admin)
  async getAllRecruits(options = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (options.page) queryParams.append('page', options.page);
      if (options.limit) queryParams.append('limit', options.limit);
      if (options.status) queryParams.append('status', options.status);
      if (options.program) queryParams.append('program', options.program);
      if (options.search) queryParams.append('search', options.search);

      const url = queryParams.toString() ? 
        `${this.baseURL}?${queryParams.toString()}` : 
        this.baseURL;

      const response = await fetch(url);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi lấy danh sách đăng ký');
      }

      return result;
    } catch (error) {
      console.error('Error getting recruits:', error);
      throw error;
    }
  }

  // Lấy đăng ký theo ID
  async getRecruitById(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Không tìm thấy thông tin đăng ký');
      }

      return result;
    } catch (error) {
      console.error('Error getting recruit by id:', error);
      throw error;
    }
  }
}

// Export instance
const recruitAPI = new RecruitAPI();

// Notification helper for recruit
function showRecruitNotification(message, type = 'success') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.recruit-notification');
  existingNotifications.forEach(notification => notification.remove());

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `recruit-notification recruit-notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 9999;
    max-width: 400px;
    animation: slideInRight 0.3s ease;
    font-family: inherit;
  `;

  // Add notification to page
  document.body.appendChild(notification);

  // Auto remove after 6 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, 6000);
}

// Add CSS for recruit notifications
if (!document.getElementById('recruit-notification-styles')) {
  const style = document.createElement('style');
  style.id = 'recruit-notification-styles';
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .recruit-notification .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      line-height: 1.4;
    }
    
    .recruit-notification .notification-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      margin-left: auto;
      padding: 5px;
      border-radius: 3px;
      transition: background-color 0.2s;
    }
    
    .recruit-notification .notification-close:hover {
      background-color: rgba(255,255,255,0.2);
    }
    
    .recruit-notification i {
      font-size: 18px;
    }
  `;
  document.head.appendChild(style);
}

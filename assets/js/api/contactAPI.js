// Contact API Handler
class ContactAPI {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/contacts';
  }

  // Gửi contact mới
  async createContact(contactData) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi gửi liên hệ');
      }

      return result;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  // Lấy danh sách contacts (dành cho admin)
  async getAllContacts(options = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (options.page) queryParams.append('page', options.page);
      if (options.limit) queryParams.append('limit', options.limit);
      if (options.status) queryParams.append('status', options.status);
      if (options.search) queryParams.append('search', options.search);

      const url = queryParams.toString() ? 
        `${this.baseURL}?${queryParams.toString()}` : 
        this.baseURL;

      const response = await fetch(url);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi lấy danh sách liên hệ');
      }

      return result;
    } catch (error) {
      console.error('Error getting contacts:', error);
      throw error;
    }
  }

  // Lấy contact theo ID
  async getContactById(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Không tìm thấy thông tin liên hệ');
      }

      return result;
    } catch (error) {
      console.error('Error getting contact by id:', error);
      throw error;
    }
  }
}

// Export instance
const contactAPI = new ContactAPI();

// Notification helper
function showNotification(message, type = 'success') {
  // Tạo notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
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
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 9999;
    max-width: 350px;
    animation: slideInRight 0.3s ease;
  `;

  // Add notification to page
  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// Add CSS for notifications
if (!document.getElementById('notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
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
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      margin-left: auto;
      padding: 5px;
    }
    
    .notification-close:hover {
      opacity: 0.8;
    }
  `;
  document.head.appendChild(style);
}

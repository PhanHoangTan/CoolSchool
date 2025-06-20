$(document).ready(function () {
  // Initialize Owl Carousel for home slider
  $(".home-slider").owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    nav: true,
    dots: true,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  });

  // Note: We've removed the Owl Carousel for education section
  // as we're now using a flex layout instead

  // Lazy loading for images - Immediate loading for visible images
  var lazyImages = document.querySelectorAll("img.lazyload");
  lazyImages.forEach(function (img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.classList.remove("lazyload");
      img.classList.add("lazyloaded");
    }
  }); // Smooth scroll to registration form when button is clicked
  $(".btn_scroll_register").on("click", function (e) {
    e.preventDefault();
    var targetSection = $("#registration-form");
    if (targetSection.length) {
      $("html, body").animate(
        {
          scrollTop: targetSection.offset().top - 80,
        },
        1000
      );
    }
  });

  // Smooth scroll from hero to registration form
  $(".hero-btn").on("click", function (e) {
    e.preventDefault();
    var targetSection = $($(this).attr("href"));
    if (targetSection.length) {
      $("html, body").animate(
        {
          scrollTop: targetSection.offset().top - 80,
        },
        1000
      );
    }
  });

  // Smooth scroll from tuition buttons to registration form
  $(".tuition-button").on("click", function (e) {
    e.preventDefault();
    var targetSection = $($(this).attr("href"));
    if (targetSection.length) {
      $("html, body").animate(
        {
          scrollTop: targetSection.offset().top - 80,
        },
        1000
      );
    }
  });

  // Mobile menu toggle
  $(".nav-mobile-button").on("click", function () {
    $(".header-nav").slideToggle();
  });

  // Smooth scroll for anchor links
  $('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: target.offset().top - 100,
            },
            1000
          );
        }
      }
    });

  // Initialize datepicker for new form
  if ($.fn.datepicker) {
    $(".datepicker").datepicker({
      dateFormat: "dd/mm/yy",
      changeMonth: true,
      changeYear: true,
      yearRange: "-100:+0",
      showOtherMonths: true,
      selectOtherMonths: true,
      monthNames: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      monthNamesShort: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      dayNames: [
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "Chủ nhật",
      ],
      dayNamesShort: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      dayNamesMin: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      firstDay: 1, // Start with Monday
      showButtonPanel: false,
      constrainInput: true,
      beforeShow: function (input, inst) {
        // Add custom class to the datepicker
        setTimeout(function () {
          inst.dpDiv.addClass("custom-datepicker");

          // Replace default arrows with FontAwesome icons
          $(".ui-datepicker-prev, .ui-datepicker-next").html("");

          // Custom month and year dropdowns
          customizeSelectElements();

          // Position the datepicker under the input field
          var inputField = $(input);
          var inputOffset = inputField.offset();
          var inputHeight = inputField.outerHeight();

          // Kiểm tra xem có đang ở chế độ mobile không
          if (window.innerWidth < 768) {
            // Trên mobile, hiển thị ở giữa màn hình
            positionDatepickerForMobile(inst.dpDiv);
          } else {
            // Trên desktop, hiển thị dưới input
            inst.dpDiv.css({
              top: inputOffset.top + inputHeight + 5,
              left: inputOffset.left,
              position: "absolute",
            });
          }

          // Điều chỉnh thứ tự các ngày trong tuần và thêm className cho table
          reorganizeDaysOfWeek();
        }, 0);
      },
      onChangeMonthYear: function (year, month, inst) {
        // When month or year changes, reapply customizations
        setTimeout(function () {
          customizeSelectElements();

          // Lấy lại input field từ inst
          var inputField = $(inst.input);
          var inputOffset = inputField.offset();
          var inputHeight = inputField.outerHeight();

          // Kiểm tra xem có đang ở chế độ mobile không
          if (window.innerWidth < 768) {
            positionDatepickerForMobile(inst.dpDiv);
          } else {
            // Duy trì vị trí dưới input khi thay đổi tháng/năm
            inst.dpDiv.css({
              top: inputOffset.top + inputHeight + 5,
              left: inputOffset.left,
              position: "absolute",
            });
          }

          // Điều chỉnh thứ tự các ngày trong tuần
          reorganizeDaysOfWeek();
        }, 0);
      },
      onClose: function () {
        // Clean up overlay
        closeDatepicker();
      },
      onSelect: function (dateText, inst) {
        // Add animation when a date is selected
        $(this).addClass("date-selected");
        setTimeout(function () {
          $(inst.input).removeClass("date-selected");
        }, 300);

        // Clean up
        closeDatepicker();
      },
    });

    // Make the date input readonly to prevent keyboard on mobile
    $(".datepicker").attr("readonly", true);

    // Open datepicker when the calendar icon is clicked
    $(".date-icon").on("click", function () {
      $(this).prev(".datepicker").datepicker("show");
    });

    // Open datepicker when the input is clicked
    $(".datepicker").on("click", function () {
      $(this).datepicker("show");
    });
  }

  // Initialize Swiper for testimonials
  initTestimonialSwiper();

  // Handle testimonial avatar clicks
  $(".avatar-item").click(function () {
    // Remove active class from all avatars
    $(".avatar-item").removeClass("active");
    // Add active class to clicked avatar
    $(this).addClass("active");

    // Get the testimonial data
    var name = $(this).data("name") || "Nguyễn Tuấn Minh";
    var title = $(this).data("title") || "Phụ huynh cháu Tuấn";
    var text =
      $(this).data("text") ||
      "Qua những trải nghiệm tuyệt vời của con tại Cool School, tôi cảm thấy nhà trường đã thực sự làm tốt sứ mệnh của mình khi mang tới cho các con một môi trường học tập hiện đại, thân thiện và cởi mở. Các con không chỉ được khuyến khích sáng tạo, thể hiện cá tính riêng mà còn được tạo điều kiện để phát triển tiềm năng của mình.";

    // Update the testimonial content with animation
    $(".testimonial-text").fadeOut(300, function () {
      $(this).text(text).fadeIn(300);
    });

    // Update the author info with animation
    $(".testimonial-author").fadeOut(300, function () {
      $(".author-name").text(name);
      $(".author-title").text(title);
      $(this).fadeIn(300);
    });
  });

  // Chat Button Functionality
  $(".chat-icon").on("click", function () {
    // You can add code here to open a chat modal or redirect to a chat page
    window.open("https://m.me/your-facebook-page", "_blank");
  });

  // Scroll to Top Button - Show/Hide based on scroll position
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".scroll-top-button").addClass("visible");
    } else {
      $(".scroll-top-button").removeClass("visible");
    }
  });

  // Scroll to Top Button - Functionality
  $(".scroll-top-button").on("click", function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      800
    );
    return false;
  });

  // FAQ Accordion
  $(".faq-question").on("click", function () {
    // Toggle the active class on the clicked question
    $(this).toggleClass("active");

    // Toggle the display of the answer
    var answer = $(this).next(".faq-answer");

    // If the answer is visible, slide it up, otherwise slide it down
    if (answer.css("max-height") !== "0px") {
      answer.css("max-height", "0");
    } else {
      answer.css("max-height", answer[0].scrollHeight + "px");
    }

    // Close other open FAQs (uncomment to have only one open at a time)
    // $(".faq-question").not(this).removeClass("active");
    // $(".faq-answer").not(answer).css("max-height", "0");
  });
  // Initialize the FAQ answers to be closed
  $(".faq-answer").css("max-height", "0");

  // Handle search functionality
  $(".search-bar").on("submit", function (e) {
    e.preventDefault();

    var searchQuery = $(this).find("input[name='query']").val().toLowerCase();

    // Don't search if query is empty
    if (searchQuery.trim() === "") {
      return;
    }

    // Define news items with their titles and corresponding URLs
    var newsItems = [
      {
        title: "Hệ quốc tế Anh - Nhật",
        url: "ENJapanProgram.html",
        image:
          "https://bizweb.dktcdn.net/thumb/large/100/347/562/articles/1.jpg?v=1550778252097",
        date: "22/02/2019",
        excerpt:
          "Bên cạnh tiếng Anh, tiếng Nhật cũng là một trong những ngôn ngữ của thời kỳ hội nhập toàn cầu. Tr...",
      },
      {
        title: "Hệ đào tạo song ngữ",
        url: "BilingualProgram.html",
        image:
          "https://bizweb.dktcdn.net/thumb/large/100/347/562/articles/6.jpg?v=1550778312287",
        date: "22/02/2019",
        excerpt:
          "Với mong muốn giúp trẻ đa dạng ngôn ngữ trong thời kỳ hội nhập, Trường Mầm non Quốc tế Cool Schoo...",
      },
      {
        title: "Hệ quốc tế Anh - Anh",
        url: "EnEnProgram.html",
        image:
          "https://bizweb.dktcdn.net/thumb/large/100/347/562/articles/9.jpg?v=1550778282473",
        date: "22/02/2019",
        excerpt:
          "Trong xu thế tiếng Anh đã trở thành ngôn ngữ toàn cầu, ngay từ khi còn nhỏ, các bậc phụ huynh và...",
      },
      {
        title: "Chương trình học chuẩn quốc tế",
        url: "standardProgram.html",
        image:
          "https://bizweb.dktcdn.net/thumb/large/100/347/562/articles/7.jpg?v=1550779824993",
        date: "22/02/2019",
        excerpt:
          "Được thiết kế và triển khai theo triết lý giáo dục của tiến sĩ Maria Montessori (31/8/1870 –...",
      },
      {
        title: "Chương trình Văn - Thể - Mỹ",
        url: "USAProgram.html",
        image:
          "https://bizweb.dktcdn.net/thumb/large/100/347/562/articles/8.jpg?v=1550779730693",
        date: "22/02/2019",
        excerpt:
          "Cùng với sự phát triển của chương trình học thuật, chương trình phát triển Văn – Thể – Mỹ cũng là...",
      },
      {
        title: "Chương trình học văn hóa nhật",
        url: "JapanProgram.html",
        image:
          "https://bizweb.dktcdn.net/thumb/large/100/347/562/articles/3.jpg?v=1550779664717",
        date: "22/02/2019",
        excerpt:
          "Kỹ năng sống là một trong những kiến thức nền tảng quan trọng nhất, quyết định sự tồn tại, phát t...",
      },
    ];

    // Redirect to search results page with the query
    window.location.href =
      "search-results.html?query=" + encodeURIComponent(searchQuery);
  });
  // Check for search parameter on search results page
  if (window.location.pathname.endsWith("search-results.html")) {
    var urlParams = new URLSearchParams(window.location.search);
    var searchQuery = urlParams.get("query");

    if (searchQuery) {
      searchQuery = searchQuery.toLowerCase();
      displaySearchResults(searchQuery);
    }
  }

  // Function to display search results
  function displaySearchResults(searchQuery) {
    // Define news items with their titles and corresponding URLs
    var newsItems = [
      {
        title: "Hệ quốc tế Anh - Nhật",
        url: "ENJapanProgram.html",
        image:
          "https://bizweb.dktcdn.net/thumb/large/100/347/562/articles/1.jpg?v=1550778252097",
        date: "22/02/2019",
        excerpt:
          "Bên cạnh tiếng Anh, tiếng Nhật cũng là một trong những ngôn ngữ của thời kỳ hội nhập toàn cầu.",
      },
      {
        title: "Hệ đào tạo song ngữ",
        url: "BilingualProgram.html",
        image:
          "https://bizweb.dktcdn.net/thumb/large/100/347/562/articles/6.jpg?v=1550778312287",
        date: "22/02/2019",
        excerpt:
          "Với mong muốn giúp trẻ đa dạng ngôn ngữ trong thời kỳ hội nhập, Trường Mầm non Quốc tế Cool School mang đến chương trình đào tạo song ngữ.",
      },
      {
        title: "Hệ quốc tế Anh - Anh",
        url: "EnEnProgram.html",
        image:
          "https://bizweb.dktcdn.net/thumb/large/100/347/562/articles/9.jpg?v=1550778282473",
        date: "22/02/2019",
        excerpt:
          "Trong xu thế tiếng Anh đã trở thành ngôn ngữ toàn cầu, ngay từ khi còn nhỏ, các bậc phụ huynh và nhà trường luôn mong muốn trẻ được làm quen.",
      },
      {
        title: "Chương trình học chuẩn quốc tế",
        url: "standardProgram.html",
        image:
          "https://bizweb.dktcdn.net/thumb/large/100/347/562/articles/7.jpg?v=1550779824993",
        date: "22/02/2019",
        excerpt:
          "Được thiết kế và triển khai theo triết lý giáo dục của tiến sĩ Maria Montessori.",
      },
      {
        title: "Chương trình Văn - Thể - Mỹ",
        url: "USAProgram.html",
        image:
          "https://bizweb.dktcdn.net/thumb/large/100/347/562/articles/8.jpg?v=1550779730693",
        date: "22/02/2019",
        excerpt:
          "Cùng với sự phát triển của chương trình học thuật, chương trình phát triển Văn – Thể – Mỹ.",
      },
      {
        title: "Chương trình học văn hóa nhật",
        url: "JapanProgram.html",
        image:
          "https://bizweb.dktcdn.net/thumb/large/100/347/562/articles/3.jpg?v=1550779664717",
        date: "22/02/2019",
        excerpt:
          "Kỹ năng sống là một trong những kiến thức nền tảng quan trọng nhất.",
      },
    ];

    // Match search results
    var matchedItems = newsItems.filter(function (item) {
      return (
        item.title.toLowerCase().includes(searchQuery) ||
        item.excerpt.toLowerCase().includes(searchQuery)
      );
    });

    // Update search status container
    var statusMessage = "";
    if (matchedItems.length > 0) {
      statusMessage = "Có " + matchedItems.length + " kết quả tìm kiếm phù hợp";
    } else {
      statusMessage =
        "Không tìm thấy kết quả nào với từ khóa '" + searchQuery + "'";
    }
    $(".search-status-container").html("<p>" + statusMessage + "</p>");

    // Update page title to include search query
    $(".page-title").text("Kết quả tìm kiếm cho: '" + searchQuery + "'");

    // Display results or no results message
    if (matchedItems.length > 0) {
      var resultsHTML = "";

      matchedItems.forEach(function (item) {
        // Highlight the search term in title and excerpt
        var highlightedTitle = highlightText(item.title, searchQuery);
        var highlightedExcerpt = highlightText(item.excerpt, searchQuery);

        resultsHTML += `
          <div class="search-result-item">
            <div class="search-result-image">
              <a href="${item.url}">
                <img src="${item.image}" alt="${item.title}">
              </a>
            </div>
            <div class="search-result-content">
              <div class="search-result-date">
                <i class="far fa-calendar-alt"></i> ${item.date}
              </div>
              <h3 class="search-result-title">
                <a href="${item.url}">${highlightedTitle}</a>
              </h3>
              <div class="search-result-excerpt">
                ${highlightedExcerpt}
              </div>
              <a href="${item.url}" class="search-result-link">
                Xem chi tiết <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        `;
      });

      $(".search-results-container").html(resultsHTML);
      $(".no-results-container").hide();
    } else {
      $(".search-results-container").empty();
      $(".no-results-container").show();
    }
  }

  // Helper function to highlight search text
  function highlightText(text, searchTerm) {
    if (!searchTerm) return text;

    var regex = new RegExp("(" + escapeRegExp(searchTerm) + ")", "gi");
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }

  // Helper function to escape regex special characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Check for search parameter on news page
  if (window.location.pathname.endsWith("news.html")) {
    var urlParams = new URLSearchParams(window.location.search);
    var searchParam = urlParams.get("search");

    if (searchParam) {
      // Highlight search results or show message
      highlightSearchResults(searchParam);
    }
  }

  // Function to highlight search results on news page
  function highlightSearchResults(searchQuery) {
    searchQuery = searchQuery.toLowerCase();
    var foundItems = 0;

    // Look through all news items
    $(".news-item").each(function () {
      var newsTitle = $(this).find("h3 a").text().toLowerCase();
      var newsDesc = $(this).find(".news-desc p").text().toLowerCase();

      if (newsTitle.includes(searchQuery) || newsDesc.includes(searchQuery)) {
        // Highlight the matching item
        $(this).addClass("search-highlight");
        foundItems++;
      } else {
        // Optionally hide non-matching items
        // $(this).hide();
      }
    });

    // Show search results message
    if (foundItems > 0) {
      $(".page-title").after(
        "<div class='search-results-info'>Tìm thấy " +
          foundItems +
          " kết quả cho '" +
          searchQuery +
          "'</div>"
      );
    } else {
      $(".page-title").after(
        "<div class='search-results-info'>Không tìm thấy kết quả cho '" +
          searchQuery +
          "'</div>"
      );
    }
  }
});

// Function to initialize Swiper for testimonials
function initTestimonialSwiper() {
  // Check if Swiper is loaded and elements exist
  if (
    typeof Swiper !== "undefined" &&
    $(".testimonial-thumbs").length > 0 &&
    $(".testimonial-content-gallery").length > 0
  ) {
    // Initialize thumbnail swiper
    var galleryThumbs = new Swiper(".testimonial-thumbs", {
      spaceBetween: 10,
      slidesPerView: 4,
      loop: true,
      freeMode: true,
      loopedSlides: 4,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      centerInsufficientSlides: true,
    });

    // Initialize main content swiper
    var galleryTop = new Swiper(".testimonial-content-gallery", {
      spaceBetween: 10,
      loop: true,
      loopedSlides: 4,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: galleryThumbs,
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    });
  }
}

// Function to prevent non-numerical input in phone field
function preventNonNumericalInput(e) {
  // Allow: backspace, delete, tab, escape, enter
  if (
    $.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    (e.keyCode === 65 && e.ctrlKey === true) ||
    (e.keyCode === 67 && e.ctrlKey === true) ||
    (e.keyCode === 86 && e.ctrlKey === true) ||
    (e.keyCode === 88 && e.ctrlKey === true) ||
    // Allow: home, end, left, right
    (e.keyCode >= 35 && e.keyCode <= 39)
  ) {
    // let it happen, don't do anything
    return;
  }
  // Ensure that it is a number and stop the keypress
  if (
    (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
    (e.keyCode < 96 || e.keyCode > 105)
  ) {
    e.preventDefault();
  }
}

// Function to customize the select elements in the datepicker
function customizeSelectElements() {
  // Add dropdown icon to month and year selects
  $(".ui-datepicker-month, .ui-datepicker-year").each(function () {
    var wrapper = $(this).parent();
    if (!wrapper.hasClass("select-styled")) {
      wrapper.addClass("select-styled");

      // Thêm hiệu ứng khi hover
      $(this).hover(
        function () {
          $(this).css("color", "#ff72b4");
        },
        function () {
          $(this).css("color", "#ff72b4");
        }
      );
    }
  });

  // Thêm kiểu dáng riêng cho dropdown của tháng và năm
  $(".ui-datepicker-month").css({
    "border-radius": "20px",
    "padding-right": "15px !important",
  });

  $(".ui-datepicker-year").css({
    "border-radius": "20px",
    "padding-right": "15px !important",
  });

  // Xóa các mũi tên dropdown đã được thêm trước đó
  $(".ui-datepicker-title .select-arrow").remove();
}

// Function to position the datepicker correctly on mobile
function positionDatepickerForMobile(dpDiv) {
  // Check if we're on mobile
  if (window.innerWidth < 768) {
    // Center the datepicker on screen
    dpDiv.css({
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 9999,
      width: "300px",
    });

    // Add overlay if it doesn't exist
    if ($(".datepicker-overlay").length === 0) {
      $("body").append('<div class="datepicker-overlay"></div>');
      $(".datepicker-overlay")
        .css({
          display: "block",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 9998,
        })
        .on("click", function () {
          $(".datepicker").datepicker("hide");
          $(this).remove();
        });
    }
  } else {
    // Reset to default positioning on desktop
    $(".datepicker-overlay").remove();
  }
}

// Add this function after document ready to ensure datepicker position is correct after window resize
$(window).on("resize", function () {
  // Hide any open datepickers when resizing
  $(".datepicker").datepicker("hide");
});

// Add this function to reset position when datepicker is closed
function closeDatepicker() {
  $(".datepicker-overlay").remove();
}

// Function to reorganize days of week
function reorganizeDaysOfWeek() {
  // Điều chỉnh thứ tự các ngày trong tuần
  var headers = $(".ui-datepicker-calendar thead tr th");
  if (headers.length === 7) {
    // Đảm bảo CN nằm ở cuối
    var sunday = headers.eq(0).detach();
    $(".ui-datepicker-calendar thead tr").append(sunday);

    // Đồng thời cập nhật lại các ngày trong từng tuần
    $(".ui-datepicker-calendar tbody tr").each(function () {
      var firstDay = $(this).find("td:first-child").detach();
      $(this).append(firstDay);
    });
  }
}

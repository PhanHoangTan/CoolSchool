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
  });

  // Smooth scroll to registration form when button is clicked
  $(".btn_scroll_register").on("click", function (e) {
    e.preventDefault();
    var targetSection = $("#registration-form");
    if (targetSection.length) {
      $("html, body").animate(
        {
          scrollTop: targetSection.offset().top - 100,
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

      // Thêm mũi tên dropdown
      if ($(this).next(".select-arrow").length === 0) {
        $('<i class="fas fa-angle-down select-arrow"></i>').insertAfter(
          $(this)
        );
      }

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

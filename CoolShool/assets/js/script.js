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
      dateFormat: "dd MM yy",
      changeMonth: true,
      changeYear: true,
      yearRange: "-100:+0",
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

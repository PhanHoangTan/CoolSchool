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
});

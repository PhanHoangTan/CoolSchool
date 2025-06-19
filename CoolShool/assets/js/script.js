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
});

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

  var navMain = document.querySelector(".main-nav");
  var navToggle = document.querySelector(".main-nav__toggle");
  var mapOffice = document.querySelector("iframe.page-footer__map");

  mapOffice.style.display = "block";

  navMain.classList.remove("main-nav--nojs");

  navToggle.addEventListener("click", function() {
    if (navMain.classList.contains("main-nav--closed")) {
      navMain.classList.remove("main-nav--closed");
      navMain.classList.add("main-nav--opened");
    } else {
      navMain.classList.add("main-nav--closed");
      navMain.classList.remove("main-nav--opened");
    }
  });

var slider = document.getElementById("slider"),
  sliderItems = document.getElementById("items"),
  prev = document.getElementById("prev"),
  next = document.getElementById("next");
slide(slider, sliderItems, prev, next);
function slide(wrapper, items, prev, next) {
  var posX1 = 0,
    posX2 = 0,
    posInitial,
    posFinal,
    threshold = items.getElementsByClassName("slide")[0].clientWidth / 20,
    slides = items.getElementsByClassName("slide"),
    slidesLength = slides.length,
    slideSize = items.getElementsByClassName("slide")[0].offsetWidth,
    index = 0,
    allowShift = true;

  // Clone first and last slide
  checkIndex();
  wrapper.classList.add("loaded");

  // Mouse and Touch events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener("touchstart", dragStart);
  items.addEventListener("touchend", dragEnd);
  items.addEventListener("touchmove", dragAction);

  // Click events
  prev.addEventListener("click", function () {
    shiftSlide(-1);
  });
  next.addEventListener("click", function () {
    shiftSlide(1);
  });

  window.addEventListener("resize", () => {
    slideSize = items.getElementsByClassName("slide")[0].clientWidth;
    threshold = slideSize / 20;
    items.style.left = -slideSize * index + "px";
  });

  // Transition events
  items.addEventListener("transitionend", checkIndex);

  function dragStart(e) {
    e = e || window.e;

    posInitial = items.offsetLeft;

    if (e.type == "touchstart") {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }
  function dragAction(e) {
   
    e = e || window.e;

    if (e.type == "touchmove") {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }
    items.style.left = items.offsetLeft - posX2 + "px";
  }

  function dragEnd(e) {

    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) {
      shiftSlide(1, "drag");
    } else if (posFinal - posInitial > threshold) {
      shiftSlide(-1, "drag");
    } else {
      items.style.left = posInitial + "px";
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function shiftSlide(dir, action) {
    items.classList.add("shifting");
    if (allowShift) {
      if (!action) {
        posInitial = items.offsetLeft;
      }
      if (dir == 1) {
        if (index !== slidesLength - 1) {
          items.style.left = posInitial - slideSize + "px";
          index++;
        } else {
          items.style.left = posInitial + "px";
        }
      } else if (dir == -1) {
        if (index !== 0) {
          items.style.left = posInitial + slideSize + "px";
          index--;
        } else {
          items.style.left = posInitial + "px";
        }
      }
    }
    allowShift = false;
  }

  function checkIndex() {
    items.classList.remove("shifting");

    if (index === 0) {
      prev.classList.add("disabled");
      next.classList.remove("disabled");
    }

    if (index === slidesLength - 1) {
      next.classList.add("disabled");
      prev.classList.remove("disabled");
    }

    if (index !== 0 && index !== slidesLength - 1) {
      next.classList.remove("disabled");
      prev.classList.remove("disabled");
    }
    allowShift = true;
  }
}

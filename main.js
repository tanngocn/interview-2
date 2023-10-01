var sliderItems = document.getElementById("items"),
  prev = document.getElementById("prev"),
  next = document.getElementById("next"),
  slideSize = sliderItems.getElementsByClassName("slide")[0].offsetWidth;
// get our elements
const slider = document.querySelector(".items"),
  slides = Array.from(document.querySelectorAll(".slide"));
// set up our state
let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID,
  threshold =  slideSize /10,
  currentIndex = 0;

// add our event listeners
slides.forEach((slide, index) => {
  // pointer events
  slide.addEventListener("pointerdown", pointerDown(index));
  slide.addEventListener("pointerup", pointerUp);
  slide.addEventListener("pointerleave", pointerUp);
  slide.addEventListener("pointermove", pointerMove);
});

// Click events
prev.addEventListener("click", function () {
  shiftSlide(-1);
});
next.addEventListener("click", function () {
  shiftSlide(1);
});

function shiftSlide(dir, action) {
  items.classList.add("shifting");
  if (isDragging) {
    if (!action) {
      posInitial = items.offsetLeft;
    }
    if (dir == 1) {
      if (currentIndex !== slides.length - 1) {
        items.style.left = posInitial - slideSize + "px";
        currentIndex++;
      }
    } else if (dir == -1) {
      if (currentIndex !== 0) {
        items.style.left = posInitial + slideSize + "px";
        currentIndex--;
      }
    }
  }
  startPositionIndex();
  isDragging = false;
}

window.addEventListener("resize", startPositionIndex);

// Transition events
sliderItems.addEventListener("transitionend", checkIndex);

function startPositionIndex() {
  slideSize = sliderItems.getElementsByClassName("slide")[0].clientWidth;
  threshold = slideSize / 20;
  sliderItems.style.left = -slideSize * currentIndex + "px";
}

function checkIndex() {
  items.classList.remove("shifting");

  if (currentIndex === 0) {
    prev.classList.add("disabled");
    next.classList.remove("disabled");
  }

  if (currentIndex === slides.length - 1) {
    next.classList.add("disabled");
    prev.classList.remove("disabled");
  }

  if (currentIndex !== 0 && currentIndex !== slides.length - 1) {
    next.classList.remove("disabled");
    prev.classList.remove("disabled");
  }
  isDragging = true;
}

function pointerDown(index) {
  return function (event) {
    currentIndex = index;
    startPos = event.clientX;
    isDragging = true;
    animationID = requestAnimationFrame(animation);
    slider.classList.add("shifting");
  };
}

function pointerMove(event) {
  if (isDragging) {
    const currentPosition = event.clientX;
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function pointerUp() {
  cancelAnimationFrame(animationID);
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;

  // if moved enough negative then snap to next slide if there is one
  if (movedBy < -threshold && currentIndex < slides.length - 1) currentIndex += 1;

  // if moved enough positive then snap to previous slide if there is one
  if (movedBy > threshold && currentIndex > 0) currentIndex -= 1;

  setPositionByIndex();
  checkIndex();
  slider.classList.remove("shifting");
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -slideSize;
  prevTranslate = currentTranslate;
  setSliderPosition();
}
function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}

function setSliderPosition() {
  slider.style.left = `${currentTranslate}px`;
}

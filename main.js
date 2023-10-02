const slider = document.querySelector(".items"),
  slides = Array.from(document.querySelectorAll(".slide")),
  prev = document.getElementById("prev"),
  next = document.getElementById("next");
let slideSize = slider.offsetWidth;
const wrapper = document.getElementById("items");
// set up our state
let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID,
  threshold = slideSize / 20,
  currentIndex = 0;
checkIndex();

// prevent menu popup on long press
window.oncontextmenu = function (event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}

// add our event listeners
slides.forEach((slide, index) => {
  // pointer events
  slide.addEventListener("pointerdown", pointerDown(index));
  slide.addEventListener("pointerup", pointerUp);
  slide.addEventListener("pointerleave", pointerUp);
  slide.addEventListener("pointermove", pointerMove);
});

window.addEventListener("resize", startPositionIndex);
wrapper.addEventListener("transitionend", checkIndex);

// Click events
prev.addEventListener("click", function () {
  isDragging = true;

  shiftSlide(-1);
});
next.addEventListener("click", function () {
  isDragging = true;
  shiftSlide(1);

});

function shiftSlide(dir, action) {
  wrapper.classList.add("shifting");
  if (isDragging) {
    if (!action) {
      posInitial = slider.offsetLeft;
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
  isDragging=false; 
  setPositionByIndex();
}

function startPositionIndex() {
  slideSize = slider.offsetWidth;
  threshold = slideSize / 20;
  slider.style.left = -slideSize * currentIndex + "px";
}
function pointerDown(index) {
  return function (event) {
    console.log(event.clientX)
    currentIndex = index;
    startPos = event.clientX;
    isDragging = true;
    animationID = requestAnimationFrame(animation);
    wrapper.classList.add("shifting");
  };
}

function pointerMove(event) {
  if (isDragging) {
    const currentPosition = event.clientX;
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function pointerUp() {
  const movedBy = currentTranslate - prevTranslate;

  // if moved enough negative then snap to next slide if there is one
  if (movedBy < -threshold && currentIndex < slides.length - 1) shiftSlide(1);

  // if moved enough positive then snap to previous slide if there is one
  if (movedBy > threshold && currentIndex > 0) shiftSlide(-1);

  isDragging =false;
  setPositionByIndex();
  
}

function checkIndex() {
  cancelAnimationFrame(animationID);

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
  //
  setPositionByIndex();
  wrapper.classList.remove("shifting");
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

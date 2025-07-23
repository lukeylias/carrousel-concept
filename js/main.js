// JavaScript for the responsive product carousel

// Loading sequence management
const initializeLoadingSequence = () => {
  const loadingContainer = document.getElementById("loadingContainer");
  const carouselContainer = document.getElementById("carouselContainer");

  // After 3 seconds, start the transition
  setTimeout(() => {
    // Fade out loading indicator
    loadingContainer.classList.add("fade-out");

    // Wait for fade out to complete, then show carousel
    setTimeout(() => {
      loadingContainer.style.display = "none";
      carouselContainer.style.display = "block";

      // Trigger fade-in animation
      setTimeout(() => {
        carouselContainer.classList.add("fade-in");

        // Initialize carousel functionality after animation
        setTimeout(() => {
          initializeCarousel();
        }, 300);
      }, 50);
    }, 500); // Wait for fade-out transition
  }, 3000); // 3 second loading duration
};

// DOM Element Selection
const track = document.querySelector(".c-carousel__track");
const slides = Array.from(track.children);
const nextButton = document.querySelector(".c-carousel__btn--next");
const prevButton = document.querySelector(".c-carousel__btn--prev");
const carousel = document.querySelector(".c-carousel");
const paginationLabel = document.querySelector(".pagination-info__label");
const paginationRange = document.querySelector(".pagination-info__range");
const paginationTotal = document.querySelector(".pagination-info__total");
const liveRegion = document.getElementById("carouselAnnouncement");

// Initialize carousel state
let currentSlideIndex = 0;
const totalSlides = slides.length;

// Get current slides per view based on screen size
const getSlidesPerView = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth < 800) {
    return 1; // Mobile/sm: 1 card
  } else if (screenWidth < 1200) {
    return 2; // Tablet/lg: 2 cards
  } else {
    return 3; // Desktop/xxl: 3 cards
  }
};

// Get navigation step size (how many cards to move per navigation)
const getNavigationStep = () => {
  return 1; // Always move 1 card at a time for all screen sizes
};

// Update aria-hidden attributes based on slide visibility
const updateSlideAriaAttributes = () => {
  const slidesPerView = getSlidesPerView();
  const firstVisibleIndex = currentSlideIndex;
  const lastVisibleIndex = currentSlideIndex + slidesPerView - 1;

  slides.forEach((slide, index) => {
    const isVisible = index >= firstVisibleIndex && index <= lastVisibleIndex;
    slide.setAttribute("aria-hidden", isVisible ? "false" : "true");

    // Also update tabindex for buttons within hidden slides
    const button = slide.querySelector(".product-btn");
    if (button) {
      button.tabIndex = isVisible ? 0 : -1;
    }
  });
};

// Update live region announcement
const updateLiveRegion = () => {
  const slidesPerView = getSlidesPerView();
  const firstVisible = currentSlideIndex + 1; // Convert to 1-based indexing
  const lastVisible = Math.min(currentSlideIndex + slidesPerView, totalSlides);

  // Create descriptive message for screen readers
  let message = "";
  if (slidesPerView === 1) {
    message = `Showing cover ${firstVisible} of ${totalSlides}`;
  } else {
    message = `Showing covers ${firstVisible} to ${lastVisible} of ${totalSlides}`;
  }

  // Update live region
  if (liveRegion) {
    liveRegion.textContent = message;
  }
};

// Update pagination info display
const updatePaginationInfo = () => {
  const slidesPerView = getSlidesPerView();
  const firstVisible = currentSlideIndex + 1; // Convert to 1-based indexing
  const lastVisible = Math.min(currentSlideIndex + slidesPerView, totalSlides);

  // Handle singular/plural for "cover" vs "covers"
  paginationLabel.textContent = slidesPerView === 1 ? "cover" : "covers";

  // Show single number for one cover, range for multiple covers
  if (slidesPerView === 1) {
    paginationRange.textContent = `${firstVisible}`;
  } else {
    paginationRange.textContent = `${firstVisible}–${lastVisible}`;
  }

  paginationTotal.textContent = totalSlides;
};

// Calculate slide movement
const getSlideWidth = () => {
  const slideElement = slides[0];
  const slideStyle = window.getComputedStyle(slideElement);
  const slideWidth = slideElement.offsetWidth;
  const slideMargin =
    parseFloat(slideStyle.marginLeft) + parseFloat(slideStyle.marginRight);
  return slideWidth + slideMargin;
};

// Check if a card is currently visible in the viewport
const isCardVisible = (cardIndex) => {
  const slidesPerView = getSlidesPerView();
  const firstVisibleCard = currentSlideIndex;
  const lastVisibleCard = currentSlideIndex + slidesPerView - 1;

  return cardIndex >= firstVisibleCard && cardIndex <= lastVisibleCard;
};

// Calculate the slide position needed to show a specific card
const getSlidePositionForCard = (cardIndex) => {
  const slidesPerView = getSlidesPerView();
  const maxSlideIndex = Math.max(0, totalSlides - slidesPerView);

  // Try to center the card in the visible area
  let targetPosition = cardIndex - Math.floor(slidesPerView / 2);

  // Constrain to valid range
  targetPosition = Math.max(0, Math.min(targetPosition, maxSlideIndex));

  return targetPosition;
};

// Move carousel to show a specific card
const moveToShowCard = (cardIndex) => {
  if (!isCardVisible(cardIndex)) {
    const targetPosition = getSlidePositionForCard(cardIndex);
    moveToSlide(targetPosition);
  }
};

// Update gradient indicators based on current position
const updateGradientIndicators = () => {
  const slidesPerView = getSlidesPerView();
  const maxSlideIndex = Math.max(0, totalSlides - slidesPerView);

  // Remove existing classes
  carousel.classList.remove("c-carousel--at-start", "c-carousel--at-end");

  // Add classes based on current position
  if (currentSlideIndex === 0) {
    carousel.classList.add("c-carousel--at-start");
  }

  if (currentSlideIndex >= maxSlideIndex) {
    carousel.classList.add("c-carousel--at-end");
  }
};

// Move carousel to specific position
const moveToSlide = (targetIndex) => {
  const slideWidth = getSlideWidth();
  const moveDistance = targetIndex * slideWidth;
  track.style.transform = `translateX(-${moveDistance}px)`;
  currentSlideIndex = targetIndex;
  updateNavigationState();
  updateGradientIndicators();
  updatePaginationInfo();
  updateSlideAriaAttributes();

  // Delay live region announcement slightly to ensure other updates complete first
  setTimeout(() => {
    updateLiveRegion();
  }, 100);
};

// Update navigation button states
const updateNavigationState = () => {
  const slidesPerView = getSlidesPerView();
  const maxSlideIndex = Math.max(0, totalSlides - slidesPerView);

  // Check if navigation is needed (when not all items are visible)
  const navigationNeeded = slidesPerView < totalSlides;

  if (!navigationNeeded) {
    // Hide navigation buttons completely when all items are visible
    prevButton.style.display = "none";
    nextButton.style.display = "none";
    prevButton.setAttribute("aria-hidden", "true");
    nextButton.setAttribute("aria-hidden", "true");
    prevButton.tabIndex = -1;
    nextButton.tabIndex = -1;
    return;
  }

  // Show navigation buttons when needed
  prevButton.style.display = "flex";
  nextButton.style.display = "flex";
  prevButton.setAttribute("aria-hidden", "false");
  nextButton.setAttribute("aria-hidden", "false");
  prevButton.tabIndex = 0;
  nextButton.tabIndex = 0;

  // Disable/enable prev button based on position
  if (currentSlideIndex === 0) {
    prevButton.style.opacity = "0.5";
    prevButton.disabled = true;
  } else {
    prevButton.style.opacity = "1";
    prevButton.disabled = false;
  }

  // Disable/enable next button based on position
  if (currentSlideIndex >= maxSlideIndex) {
    nextButton.style.opacity = "0.5";
    nextButton.disabled = true;
  } else {
    nextButton.style.opacity = "1";
    nextButton.disabled = false;
  }
};

// Constrain slide index to valid range
const constrainSlideIndex = (index) => {
  const slidesPerView = getSlidesPerView();
  const maxSlideIndex = Math.max(0, totalSlides - slidesPerView);
  return Math.max(0, Math.min(index, maxSlideIndex));
};

// Setup focus management for product buttons only
const setupFocusManagement = () => {
  slides.forEach((slide, index) => {
    // Add focus listeners to buttons within cards
    const button = slide.querySelector(".product-btn");
    if (button) {
      button.addEventListener("focus", () => {
        moveToShowCard(index);
      });
    }
  });
};

// Initialize carousel functionality (called after loading sequence)
const initializeCarousel = () => {
  // Set initial position and update accessibility attributes
  moveToSlide(0);

  // Setup focus management
  setupFocusManagement();

  // Event listeners for navigation buttons
  nextButton.addEventListener("click", () => {
    const navigationStep = getNavigationStep();
    const slidesPerView = getSlidesPerView();
    const maxSlideIndex = Math.max(0, totalSlides - slidesPerView);

    // Calculate next position based on navigation step
    const nextPosition = Math.min(
      currentSlideIndex + navigationStep,
      maxSlideIndex
    );

    if (nextPosition !== currentSlideIndex) {
      moveToSlide(nextPosition);
    }
  });

  prevButton.addEventListener("click", () => {
    const navigationStep = getNavigationStep();

    // Calculate previous position based on navigation step
    const prevPosition = Math.max(currentSlideIndex - navigationStep, 0);

    if (prevPosition !== currentSlideIndex) {
      moveToSlide(prevPosition);
    }
  });

  // Handle window resize to recalculate positions
  let resizeTimeout;
  window.addEventListener("resize", () => {
    // Debounce resize events
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Constrain current index to new valid range
      const constrainedIndex = constrainSlideIndex(currentSlideIndex);

      // Move to constrained position and update pagination info
      moveToSlide(constrainedIndex);
    }, 250);
  });

  // Keyboard navigation support
  document.addEventListener("keydown", (e) => {
    // Only handle arrow keys when not in an input field
    if (
      document.activeElement.tagName !== "INPUT" &&
      document.activeElement.tagName !== "TEXTAREA"
    ) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevButton.click();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextButton.click();
      }
    }
  });

  // Touch/swipe support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carousel.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swipe left - next slide
        nextButton.click();
      } else {
        // Swipe right - previous slide
        prevButton.click();
      }
    }
  };

  // Add smooth transition after carousel is initialized
  setTimeout(() => {
    track.style.transition = "transform 0.3s ease";
  }, 100);
};

// Initialize the loading sequence on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeLoadingSequence();
});

// Testing function for development (can be called from browser console)
window.testCarousel = () => {
  const screenWidth = window.innerWidth;
  const slidesPerView = getSlidesPerView();
  const navigationStep = getNavigationStep();
  const maxSlideIndex = Math.max(0, totalSlides - slidesPerView);
  const firstVisible = currentSlideIndex + 1;
  const lastVisible = Math.min(currentSlideIndex + slidesPerView, totalSlides);

  console.log("=== Carousel Status ===");
  console.log(`Screen width: ${screenWidth}px`);
  console.log(`Slides per view: ${slidesPerView}`);
  console.log(`Navigation step: ${navigationStep}`);
  console.log(`Current slide: ${currentSlideIndex + 1} of ${totalSlides}`);
  console.log(
    `Showing: ${firstVisible}-${lastVisible} of ${totalSlides} covers`
  );
  console.log(`Max slide index: ${maxSlideIndex}`);
  console.log(`Prev button disabled: ${prevButton.disabled}`);
  console.log(`Next button disabled: ${nextButton.disabled}`);
  console.log(
    `At start: ${carousel.classList.contains("c-carousel--at-start")}`
  );
  console.log(`At end: ${carousel.classList.contains("c-carousel--at-end")}`);
  console.log("=== Accessibility Status ===");
  console.log('Visible slides aria-hidden="false":');
  slides.forEach((slide, index) => {
    const ariaHidden = slide.getAttribute("aria-hidden");
    if (ariaHidden === "false") {
      console.log(
        `  - Slide ${index + 1}: ${slide.querySelector("h3").textContent}`
      );
    }
  });
  console.log("======================");
};

// Testing function for focus management (can be called from browser console)
window.testFocus = (cardIndex) => {
  console.log(`=== Focus Test ===`);
  console.log(`Card ${cardIndex + 1} visible: ${isCardVisible(cardIndex)}`);
  console.log(`Target slide position: ${getSlidePositionForCard(cardIndex)}`);
  console.log(`Current slide position: ${currentSlideIndex}`);
  moveToShowCard(cardIndex);
  console.log(`New slide position: ${currentSlideIndex}`);
  console.log("==================");
};

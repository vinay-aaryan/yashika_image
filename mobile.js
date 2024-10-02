let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  moveX = 0;
  moveY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  // Generalized handlers for both mouse and touch events
  init(paper) {
    // Event handler for both touchstart and mousedown
    const startHandler = (e) => {
      e.preventDefault();
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = ++highestZ;

      // For touch events
      if (e.touches) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
      } else {
        // For mouse events
        this.startX = e.clientX;
        this.startY = e.clientY;
      }

      this.prevX = this.startX;
      this.prevY = this.startY;
    };

    // Event handler for both touchmove and mousemove
    const moveHandler = (e) => {
      e.preventDefault();

      if (!this.holdingPaper) return;

      if (!this.rotating) {
        if (e.touches) {
          this.moveX = e.touches[0].clientX;
          this.moveY = e.touches[0].clientY;
        } else {
          this.moveX = e.clientX;
          this.moveY = e.clientY;
        }

        this.velX = this.moveX - this.prevX;
        this.velY = this.moveY - this.prevY;
      }

      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevX = this.moveX;
      this.prevY = this.moveY;

      // Apply both translation and rotation
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    };

    // Event handler for both touchend and mouseup
    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Add event listeners for touch events
    paper.addEventListener('touchstart', startHandler);
    paper.addEventListener('touchmove', moveHandler);
    paper.addEventListener('touchend', endHandler);

    // Add event listeners for mouse events
    paper.addEventListener('mousedown', startHandler);
    window.addEventListener('mousemove', moveHandler); // Bind to the window for smoother dragging
    window.addEventListener('mouseup', endHandler);

    // Two-finger rotation on touch screens (Safari support)
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });

    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }
}

// Select all paper elements and initialize them
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

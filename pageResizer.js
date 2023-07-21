/**
 * A class that resizes the page based on the size of the window and a fixed video aspect ratio.
 */
class PageResizer {
    /**
     * Creates a new instance of the PageResizer class.
     */
    constructor() {
      if (!PageResizer.instance) {
        PageResizer.instance = this;
      }
  
      return PageResizer.instance;
    }
  
    /**
     * Initializes the PageResizer by setting the initial sizes and adding a resize event listener.
     */
    init() {
      this.setSizes();
      window.addEventListener('resize', () => this.setSizes());
    }
  
    /**
     * Sets the sizes of the page based on the size of the window and a fixed video aspect ratio.
     */
    setSizes() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const videoWidth = 1280;
      const videoHeight = 720;
      const videoAspectRatio = videoWidth / videoHeight;
      const windowAspectRatio = windowWidth / windowHeight;
      let scale;
  
      if (windowAspectRatio > videoAspectRatio) {
        scale = windowHeight / videoHeight;
      } else {
        scale = windowWidth / videoWidth;
      }
  
      document.getElementById('site').style.transform = `scale(${scale})`;
    }
  }
/**
 * A class that handles parallax rotation of hologram elements based on mouse movement.
 */
class HologramParallaxer {
    /**
     * The singleton instance of the HologramParallaxer class.
     */
    static instance = null;

    constructor() {
        if (!HologramParallaxer.instance) {
            HologramParallaxer.instance = this;
            this.rotateHologramsTowardMouse = this.rotateHologramsTowardMouse.bind(this);
        }
        return HologramParallaxer.instance;
    }

    /**
     * Initializes the HologramParallaxer by adding a mousemove event listener to the document.
     */
    init() {
        document.addEventListener('mousemove', this.rotateHologramsTowardMouse);
    }

    /**
     * Stops the HologramParallaxer by removing the mousemove event listener from the document.
     */
    stop() {
        document.removeEventListener('mousemove', this.rotateHologramsTowardMouse);
    }

    /**
     * Rotates a hologram element towards the mouse position.
     * @param {MouseEvent} e - The mousemove event.
     * @param {HTMLElement} element - The hologram element to rotate.
     */
    rotateHologramTowardMouse(e, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const xAxis = (centerX - e.pageX) / 25;
        const yAxis = (centerY - e.pageY) / 25;
        const finalXAxis = element.parentElement.baseRotation.x + yAxis;
        const finalYAxis = element.parentElement.baseRotation.y - xAxis;
        element.style.transform = `translate3d(${element.parentElement.basePosition.x}px, ${element.parentElement.basePosition.y}px, ${element.parentElement.basePosition.z}px) rotateY(${finalYAxis}deg) rotateX(${finalXAxis}deg) rotateZ(${element.parentElement.baseRotation.z}deg) scale3d(${element.parentElement.baseScale.x}, ${element.parentElement.baseScale.y}, ${element.parentElement.baseScale.z})`;
    }

    /**
     * Rotates all hologram elements towards the mouse position.
     * @param {MouseEvent} e - The mousemove event.
     */
    rotateHologramsTowardMouse(e) {
        var elements = Array.from(document.getElementsByClassName("hologram"));
        elements.forEach(element => {
            this.rotateHologramTowardMouse(e, element);
        });
    }
}
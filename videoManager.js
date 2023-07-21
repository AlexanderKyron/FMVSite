/**
 * Manages the videos and their elements.
 */
class VideoManager {
    static instance = null;
    /**
     * Either creates or returns VideoManager singleton instance.
     */
    constructor() {
        if (!VideoManager.instance) {
            this.videoMap = new Map();
            this.previousVideoData = null;
            this.startVideo = "";
            this.rawVideoData = null;
            VideoManager.instance = this;
        }
        return VideoManager.instance;

    }

    /**
     * Loads the raw JSON data for videos and transitions.
     * @param {Object} data - The raw JSON data.
     */
    loadRawVideoData(data) {
        this.rawVideoData = data;
        this.rawVideoData.videos.forEach(videoData => {

            this.videoMap.set(videoData.name, videoData);
            //  createVideoElements(videoData);
        });
    }

    /**
     * Creates the video elements.
     * @param {Object} videoData - The video data.
     */
    createVideoElements(videoData) {
        if (!videoData.created) {
            var vidCont = document.createElement('div');
            vidCont.id = "videoContainer" + videoData.name;
            vidCont.classList.add("videoContainer");

            var siteCont = document.createElement('div');
            siteCont.id = "siteContainer" + videoData.name;
            siteCont.classList.add("siteContainer");

            document.getElementById("content").appendChild(siteCont);
            document.getElementById("background").appendChild(vidCont);

            var video = document.createElement('video');
            video.src = videoData.url;
            if (globalSettings.fancyBackground) {
                video.classList.add("feathered");
            }
            video.classList.add("bgvideo");
            video.style.zIndex = 2;
            video.muted = true;
            videoData.element = video;
            video.style.display = "none";
            //video.load();

           //video.play();
           // setTimeout(function () { video.pause(); }, 100);

            vidCont.appendChild(video);


            var blurredVideo = document.createElement('video');
            if (globalSettings.fancyBackground) {

                blurredVideo.src = videoData.url;

                blurredVideo.classList.add("blurred");
                blurredVideo.classList.add("bgvideo");
                blurredVideo.style.zIndex = 1;

                blurredVideo.style.display = "none";

                //blurredVideo.load();
               // blurredVideo.play();
               // setTimeout(function () { blurredVideo.pause(); }, 100);
                // blurredVideo.pause();

                vidCont.appendChild(blurredVideo);

            }
            blurredVideo.muted = true;

            videoData.blurredVideoElement = blurredVideo;


            $("#siteContainer" + videoData.name).load(videoData.overlaidWebPage.url);
            siteCont.style.display = "none";
            siteCont.baseRotation = videoData.overlaidWebPage.rotation;
            siteCont.basePosition = videoData.overlaidWebPage.position;
            siteCont.baseScale = videoData.overlaidWebPage.scale;
            siteCont.style.transform = `translate3d(${videoData.overlaidWebPage.position.x}px, ${videoData.overlaidWebPage.position.y}px, ${videoData.overlaidWebPage.position.z}px) rotateX(${videoData.overlaidWebPage.rotation.x}deg) rotateY(${videoData.overlaidWebPage.rotation.y}deg) rotateZ(${videoData.overlaidWebPage.rotation.z}deg) scale(${videoData.overlaidWebPage.scale})`;


            videoData.overlaidPageElement = siteCont;
            videoData.created = true;
            this.videoMap.set(videoData.name, videoData);
            //video.preload = true;
            // blurredVideo.preload = true;
            // video.play();
            // video.pause();
            // blurredVideo.play();
            // blurredVideo.pause();
            //video.load();
            //blurredVideo.load();

        }
    };

    /**
   * Plays the video. Unloads previous video, pre-loads transitions and freeze frame, controls holograms and events
   * @param {string} currentVideo - The current video.
   */
    playVideo(currentVideo) {

        const videoData = this.videoMap.get(currentVideo);
        this.createVideoElements(videoData);
        const videoElement = videoData.element;
        const blurredVideoElement = videoData.blurredVideoElement;

        const videoContainer = document.getElementById('videoContainer');
        // Pre-load every other video in the possibleTransitions list's file
        videoData.possibleTransitions.forEach((transition) => {
            const transitionData = this.videoMap.get(transition);
            if (transitionData)
                this.createVideoElements(transitionData);
        });

        // Pre-load the freezeFrameUrl image
        // const freezeFrameImg = new Image();
        // freezeFrameImg.src = videoData.freezeFrameUrl;

        // Play the video
        videoElement.currentTime = (videoData.startEndTimestamps.start);
        setTimeout(function () {

            videoElement.play();
            blurredVideoElement.play();
            videoElement.style.display = "block";
            blurredVideoElement.style.display = "block";

            if (this.previousVideoData != null && this.previousVideoData.element != null && videoElement != null) {
                this.previousVideoData.blurredVideoElement.style.zIndex = "1";
                this.previousVideoData.element.style.zIndex = "2";
                videoElement.style.zIndex = "4";
                blurredVideoElement.style.zIndex = "3";

            }
            setTimeout(function () {
                if (this.previousVideoData != null) {
                    this.previousVideoData.element.remove();
                    this.previousVideoData.blurredVideoElement.remove();
                    this.previousVideoData.overlaidPageElement.remove();
                    this.previousVideoData.created = false;
                }
                /*  videoData.possibleTransitions.forEach(transition => {
                      this.createVideoElements(this.videoMap.get(transition));
                  });*/


                this.previousVideoData = videoData;
            }, 120);

        }, 100);

        // Keep track of which events have already been triggered
        let triggeredEvents = new Map();

        // Wait for the "end" timestamp as defined in the data
        const endTimestamp = videoData.startEndTimestamps.end;
        const pageTimestamp = videoData.startEndTimestamps.showPage;
        videoElement.addEventListener('timeupdate', function () {
            if (videoElement.currentTime >= endTimestamp) {
                // Set the video's overlaidWebPage visible when that happens, hides the video and replaces it with the freezeframe
                videoElement.pause();
                blurredVideoElement.pause();

                triggeredEvents = new Map();
                //const freezeFrame = $('<img>').attr('src', freezeFrameImg.src);
                //freezeFrame.appendTo($('#videoContainer'));
            }
            if (videoElement.currentTime < videoData.startEndTimestamps.start) {
                triggeredEvents = new Map();
            }
            if (videoElement.currentTime >= pageTimestamp) {
                var elements = Array.from(document.getElementsByClassName("hologram"));
                elements.forEach(element => {

                    element.style.transform = `translate3d(${element.parentElement.basePosition.x}px,
                ${element.parentElement.basePosition.y}px, ${element.parentElement.basePosition.z}px)
                 rotateY(${element.parentElement.baseRotation.y}deg) rotateX(${element.parentElement.baseRotation.x}deg) rotateZ(${element.parentElement.baseRotation.z}deg)
                  scale3d(${element.parentElement.baseScale.x}, ${element.parentElement.baseScale.y}, ${element.parentElement.baseScale.z})`;

                });
                const overlaidWebPageDiv = videoData.overlaidPageElement;
                overlaidWebPageDiv.style.display = "flex";
                overlaidWebPageDiv.style.zIndex = "9999";

            }
            // Loop through all events
            videoData.videoEvents.forEach(event => {
                const eventTimestamp = event.timestamp;

                // Check if the event should be triggered
                if (videoElement.currentTime >= eventTimestamp && videoElement.currentTime < endTimestamp && !triggeredEvents.get(event.name)) {
                    // Check if the function exists
                    if (typeof window[event.functionName] === 'function') {
                        // Call the function by name and pass the parameters object
                        window[event.functionName](event.parameters);

                        // Mark the event as triggered
                        triggeredEvents.set(event.name, true);
                        
                    } else {
                        // Log an error if the function does not exist
                        console.error(`Function ${event.functionName} does not exist`);
                    }
                }
            });
        });
    }
}

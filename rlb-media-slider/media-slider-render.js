function MediaSlider(blockId, duration, media=[], selectedIndex, size) {
    const urlParams = new URLSearchParams(window.location.search);
    this.autoplay = true; // TODO: Replace with class
    this.autoplayDelay = duration * 1000; // Slide duration in ms
    this.autoplayId;
    this.blockId    = blockId;
    this.editMode   = urlParams.get("action") == "edit";
    this.element    = document.getElementsByClassName(`rlb-media-slider-outer-container ${this.blockId}`)[0];
    this.media      = media;
    this.newIndex   = selectedIndex;
    this.size       = size;
    this.slideCount = this.media.length;
    this.oldIndex   = 0;

    this.init();
}





MediaSlider.prototype.init = function() {

    if (typeof this.element !== "undefined") {

        if (this.slideCount > 1) {

            this.element.addEventListener("click", this.onClick.bind(this));

            if (this.editMode === false) {
                this.setAutoplay();

            } else {
                console.log(`Autoplay disabled: this.editMode == ${this.editMode}`);
            }

        } else {
            console.log(`Autoplay and click listener disabled: this.slideCount == ${this.slideCount}`);
        }

    } else {
        console.log(`this.element is undefined -- No outer container found with blockId ${this.blockId}`);
    }
}





MediaSlider.prototype.refresh = function(media         = this.media,
                                         selectedIndex = this.newIndex,
                                         size          = this.size) {
    // console.log(`Refresh ${this.blockId}`);

    this.media      = media;
    this.newIndex   = selectedIndex;
    this.size       = size;
    this.slideCount = this.media.length;

    this.changeSlide(); // Ensure selected slide is showing
}





MediaSlider.prototype.onClick = function(event) {
    if (event.target.classList.contains("rlb-media-slider-marker") &&
        ! event.target.classList.contains("rlb-media-slider-marker-selected")) {

        if (document.querySelectorAll(".rlb-media-slider-slide-moving").length == 0) {

            // Clear selected marker
            let selectedMarker = this.element.getElementsByClassName("rlb-media-slider-marker-selected");
            if (selectedMarker.length > 0) {
                selectedMarker[0].classList.remove("rlb-media-slider-marker-selected");
            }

            // Update selected marker
            event.target.classList.add("rlb-media-slider-marker-selected");
            // console.log("Selected marker: ", event.target.dataset.number);

            // Trigger slide change
            this.oldIndex = this.newIndex;
            this.newIndex = parseInt(event.target.dataset.number);
            this.changeSlide();

        } else {
            console.log("Slide is moving.");
        }
    }
}





MediaSlider.prototype.changeSlide = function() {
    let newSlide = this.element.querySelector(`[data-number="${this.newIndex}"]`);

    if (newSlide != null && typeof newSlide !== "undefined") {
        let oldSlide = this.element.querySelector(`[data-number="${this.oldIndex}"]`);

        if (oldSlide != null && typeof oldSlide !== "undefined") {
            oldSlide.classList.add("rlb-media-slider-slide-leaving-to-left");

            // Initiate animation
            newSlide.classList.remove("rlb-media-slider-slide-entering-from-left");
            newSlide.classList.add("rlb-media-slider-slide-selected");
            oldSlide.classList.remove("rlb-media-slider-slide-selected");
            oldSlide.classList.add("rlb-media-slider-slide-moving");

            // console.log("Selected slide: ", newSlide.dataset.number);

            setTimeout(function() {
                oldSlide.classList.remove("rlb-media-slider-slide-moving");
                oldSlide.classList.remove("rlb-media-slider-slide-leaving-to-left");
            }, 500);

            // this.oldIndex = this.newIndex;
        }
    }
}





MediaSlider.prototype.getMediaSliderInnerContainerHTML = function() {
    let mediaSliderInnerContainerHTML = "";

    mediaSliderInnerContainerHTML += "<section class='rlb-media-slider-inner-container rlb-media-slider-autoplay " + this.blockId + "' " +
                                     "style='width: " + this.size.width + "; height: " + this.size.height + "'>";

    mediaSliderInnerContainerHTML += this.getMediaSliderSlideHTML() + this.getMediaSliderNavigationHTML();

    mediaSliderInnerContainerHTML += "</section>";  // end rlb-media-slider-inner-container


    return mediaSliderInnerContainerHTML;
}





MediaSlider.prototype.getMediaSliderSlideHTML = function() {
    let mediaSliderSlideHTML = "";

    for (let i = 0; i < this.slideCount; i++) {
        let mediaSliderSlideContentHTML = this.getMediaSliderSlideContentHTML(this.blockId, this.media[i]);
        let selected = (i == this.newIndex ? "rlb-media-slider-slide-selected" : "");

        mediaSliderSlideHTML += "<a class='rlb-media-slider-link " + this.blockId + "'>" +
                                     "<li class='rlb-media-slider-slide " + selected + " " + this.blockId + "' " +
                                     "style='background-image: url(" + this.media[i].src + ");'" +
                                     "data-number='" + i + "'>" +
                                         mediaSliderSlideContentHTML +
                                     "</li>" +
                                 "</a>";
    }

    return mediaSliderSlideHTML;
}





MediaSlider.prototype.getMediaSliderSlideContentHTML = function(blockId, media) { // Use arrow function to preserve "this"
    if (this.editMode === false) {
        return "<div class='rlb-media-slider-content " + blockId + "' style='background-color:" + media.backgroundColor + ";'>" +
                   "<h2 class='rlb-media-slider-heading " + blockId + "'" +
                       "style='color:" + media.headingColor + ";'>" +
                       media.heading +
                   "</h2>" +
                   "<p class='rlb-media-slider-subheading " + blockId + "'" +
                       "style='color:" + media.subheadingColor + ";'>" +
                       media.subheading +
                   "</p>" +
                   this.getMediaSliderButtonHTML(blockId, media) +
               "</div>";

    } else {
        return "";
    }
}




MediaSlider.prototype.getMediaSliderButtonHTML = function(blockId, media) {
    if (typeof media.buttonLink != "undefined" && media.buttonLink != "" &&
        typeof media.buttonText != "undefined" && media.buttonText != "") {
        return "<div class='wp-block-button'>" +
                   "<a class='wp-block-button__link wp-element-button' style='color:"+media.buttonTextColor+"; background-color:"+media.buttonBackgroundColor+"' href='"+media.buttonLink+"'>"+media.buttonText+"</a>" +
               "</div>";

    } else {
        return "";
    }
}




MediaSlider.prototype.getMediaSliderNavigationHTML = function() {
    let mediaSliderNavigationHTML = "<div class='rlb-media-slider-navigation " + this.blockId + "'>";

    for (let i = 0; i < this.slideCount; i++) {
        let selected = (i == this.newIndex ? "rlb-media-slider-marker-selected" : "");
        mediaSliderNavigationHTML += "<div class='rlb-media-slider-marker " + selected + " " + this.blockId + "' " +
                                     "data-number='" + i + "'></div>";
    }
    mediaSliderNavigationHTML += "</div>";

    return mediaSliderNavigationHTML;
}





MediaSlider.prototype.setAutoplay = function() {
    clearInterval(this.autoPlayId);
    this.autoplayId = window.setInterval(function() { this.autoplaySlider() }.bind(this), this.autoplayDelay);
}





MediaSlider.prototype.autoplaySlider = function() {
    if (document.querySelectorAll(".rlb-media-slider-slide-moving").length == 0) {
        // Update old index
        this.oldIndex = this.newIndex;

        // Update new index
        if (this.newIndex < this.slideCount-1) {
            this.newIndex += 1;
        } else {
            this.newIndex = 0;
        }
        // console.log(`Autoplay: slide ${this.newIndex}`);

        // Clear old selected marker
        let oldSelectedMarker = this.element.querySelector(".rlb-media-slider-marker-selected");
        if (oldSelectedMarker != null && typeof oldSelectedMarker != "undefined") {
            oldSelectedMarker.classList.remove("rlb-media-slider-marker-selected");
        }

        // Update new selected marker
        let newSelectedMarker = this.element.querySelector(`.rlb-media-slider-marker[data-number="${this.newIndex}"]`)
        if (newSelectedMarker != null && typeof newSelectedMarker != "undefined") {
            newSelectedMarker.classList.add("rlb-media-slider-marker-selected");
        } else {
            console.log(`newSelectedMarker: ${newSelectedMarker} \nnewIndex: ${this.newIndex}`);
        }

        // Update slide
        this.changeSlide();
    }
}





export { MediaSlider };
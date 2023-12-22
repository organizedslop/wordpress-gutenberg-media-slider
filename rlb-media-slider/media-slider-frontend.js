import { MediaSlider } from "./media-slider-render.js";

window.addEventListener("load", () => {
    if (document.querySelector(".rlb-media-slider-attributes") != null) {

        const mediaSliderElements =  document.querySelectorAll(".rlb-media-slider-attributes");

        console.log(`mediaSliderElements.length: ${mediaSliderElements.length}`);

        for (let i = 0; i < mediaSliderElements.length; i++) {

            const attributes = mediaSliderElements[i].dataset;

            let data = {
                "action":   "get_media_slider_items",
                "blockId":  attributes.blockid,

                "duration": attributes.duration,

                "slides":   JSON.parse(attributes.media),
            }

            console.log(`Slides: ${data["slides"]}`);

            let mediaSlider = new MediaSlider(data["blockId"],
                                              data["duration"],
                                              data["slides"],
                                              0,
                                              { height: attributes.height,
                                                width: attributes.width });
            let innerContainerSelector = '.rlb-media-slider-inner-container.' + attributes.blockid;
            jQuery(innerContainerSelector).replaceWith(mediaSlider.getMediaSliderInnerContainerHTML());
        }
    }
});



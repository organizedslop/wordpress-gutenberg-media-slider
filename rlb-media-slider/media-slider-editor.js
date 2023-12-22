import { MediaSlider } from "./media-slider-render.js";

(function() {
    const defaultImage = jsVars.defaultImage;

    var el = wp.element.createElement;

    const {
        BlockControls,
        InspectorControls,
        MediaUpload,
        RichText,
        useBlockProps
    } = wp.blockEditor;

    const {
        __experimentalNumberControl,
        Button,
        ColorPalette,
        PanelBody,
        TextControl
    } = wp.components;

    function createSlide(backgroundColor      = "#ffffff",
                         buttonBackgroundColor= "#9a9a9a",
                         buttonLink           = "",
                         buttonText           = "",
                         buttonTextColor      = "#ffffff",
                         heading              = "",
                         headingColor         = "#000000",
                         src                         = defaultImage,
                         subheading           = "",
                         subheadingColor      = "#000000") {
        let slide = {
            backgroundColor:       backgroundColor,
            buttonBackgroundColor: buttonBackgroundColor,
            buttonLink:            buttonLink,
            buttonText:            buttonText,
            buttonTextColor:       buttonTextColor,
            heading:               heading,
            headingColor:          headingColor,
            src:                   src,
            subheading:            subheading,
            subheadingColor:       subheadingColor
        }
        return slide;
    }

    let slides = [createSlide(), createSlide(), createSlide()];

    const blockConfig = {
        apiVersion: 2,
        title: 'Media Slider',
        icon: 'cover-image',
        category: 'media',
        attributes: {

            // Block ID -----------------------------------
            blockId: {
                type: "string"
            },

            // Content Attributes -------------------------
            duration: {
                type: "number",
                default: 10
            },
            media: {
                type: "string",
                default: ""
            },

            // Formatting Attributes ----------------------
            height: {
                type: 'string',
                default: '90vh'
            },
            width: {
                type: 'string',
                default: '100vw'
            },
            titleText: {
                type: 'string'
            },

            // Editor Attributes --------------------------
            selectedBackgroundColor: {
                type: "string",
                default: slides[0].backgroundColor
            },
            selectedButtonBackgroundColor: {
                type: "string",
                default: slides[0].buttonBackgroundColor
            },
            selectedButtonLink: {
                type: "string",
                default: slides[0].buttonLink
            },
            selectedButtonText: {
                type: "string",
                default: slides[0].buttonText
            },
            selectedButtonTextColor: {
                type: "string",
                default: slides[0].buttonTextColor
            },
            selectedHeading: {
                type: "string",
                default: slides[0].heading
            },
            selectedHeadingColor: {
                type: "string",
                default: slides[0].headingColor
            },
            selectedSubheading: {
                type: "string",
                default: slides[0].subheading
            },
            selectedSubheadingColor: {
                type: "string",
                default: slides[0].subheadingColor
            },
        }, // end attributes


        // --------------------------------------------------------------------
        // Edit
        // --------------------------------------------------------------------
        edit(props) {
            props.setAttributes({ blockId: props.clientId });

            const colorPalette = [{ name: "white",        color: "#ffffff"},
                                  { name: "grey",         color: "#7e7e7f"},
                                  { name: "black",        color: "#0d0d0e"},
                                  { name: "red",          color: "#e33020"},
                                  { name: "orange",       color: "#D79A29"},
                                  { name: "yellow",       color: "#ffdd00"},
                                  { name: "yellowgreen",  color: "#919A3E"},
                                  { name: "green",        color: "#497637"},
                                  { name: "teal",         color: "#90d3db"},
                                  { name: "blue",         color: "#244C5A"},
                                  { name: "purple",       color: "#6f37ac"},
                                  { name: "magenta",      color: "#f876cb"}];

            const transparentPalette = [{ name: "white",        color: "#ffffff80"},
                                        { name: "grey",         color: "#7e7e7f80"},
                                        { name: "black",        color: "#0d0d0e80"},
                                        { name: "red",          color: "#e3302080"},
                                        { name: "orange",       color: "#D79A2980"},
                                        { name: "yellow",       color: "#ffdd0080"},
                                        { name: "yellowgreen",  color: "#919A3E80"},
                                        { name: "green",        color: "#49763780"},
                                        { name: "teal",         color: "#00ffc480"},
                                        { name: "blue",         color: "#244C5A80"},
                                        { name: "purple",       color: "#6f37ac80"},
                                        { name: "magenta",      color: "#f876cb80"}];

            function updatePreview(index = selectedIndex()) {
                console.log(`updatePreview | mediaSlider.media: ${Object.values(mediaSlider.media)}`);

                if (typeof index !== "undefined") {
                    mediaSlider.refresh(slides, index);
                } else {
                    mediaSlider.refresh(slides);
                }

                let className = '.rlb-media-slider-inner-container.' + props.attributes.blockId;
                jQuery(className).replaceWith(mediaSlider.getMediaSliderInnerContainerHTML());
            }

            // --------------------------------------------
            // Create MediaSlider Object
            // --------------------------------------------
            if (props.attributes.media != "") {
                slides = JSON.parse(props.attributes.media);

                let selectedSlide = slides[selectedIndex(true)];
                if (selectedSlide.heading !== props.attributes.selectedHeading) {
                    console.log("Updating selected values...");
                    props.setAttributes({
                        selectedBackgroundColor:       selectedSlide.backgroundColor,
                        selectedButtonBackgroundColor: selectedSlide.buttonBackgroundColor,
                        selectedButtonLink:            selectedSlide.buttonLink,
                        selectedButtonText:            selectedSlide.buttonText,
                        selectedButtonTextColor:       selectedSlide.buttonTextColor,
                        selectedHeading:               selectedSlide.heading,
                        selectedHeadingColor:          selectedSlide.headingColor,
                        selectedSubheading:            selectedSlide.subheading,
                        selectedSubheadingColor:       selectedSlide.subheadingColor
                    });
                }
            }

            let mediaSlider = new MediaSlider(props.attributes.blockId,
                                              props.attributes.duration,
                                              slides,
                                              selectedIndex(true),
                                              { height: props.attributes.height,
                                                width:  props.attributes.width
                                              });
            let className = '.rlb-media-slider-inner-container.' + props.attributes.blockId;
            jQuery(className).replaceWith(mediaSlider.getMediaSliderInnerContainerHTML());




            // --------------------------------------------
            // Slide Editing
            // --------------------------------------------
            document.addEventListener("click",
                function(event) {
                    if (event.target.classList.contains("rlb-media-slider-marker") &&
                        event.target.classList.contains(props.attributes.blockId)) {

                        let index = selectedIndex();

                        props.setAttributes({
                            selectedBackgroundColor:       slides[index].backgroundColor,
                            selectedButtonBackgroundColor: slides[index].buttonBackgroundColor,
                            selectedButtonLink:            slides[index].buttonLink,
                            selectedButtonText:            slides[index].buttonText,
                            selectedButtonTextColor:       slides[index].buttonTextColor,
                            selectedHeading:               slides[index].heading,
                            selectedHeadingColor:          slides[index].headingColor,
                            selectedSubheading:            slides[index].subheading,
                            selectedSubheadingColor:       slides[index].subheadingColor,
                        });
                    }
                }
            );
            function selectedIndex(useMarker=false) {
                let selectedSlide = 0;

                if (useMarker !== false) {
                    selectedSlide = jQuery(".rlb-media-slider-marker-selected." + props.attributes.blockId);
                } else {
                    selectedSlide = jQuery(".rlb-media-slider-slide-selected." + props.attributes.blockId);
                }

                if (typeof selectedSlide !== "undefined") {
                    if (typeof selectedSlide[0] !== "undefined") {
                        return selectedSlide[0].dataset.number;
                    } else {
                        return 0;
                    }

                } else {
                    console.log("selectedSlide: ", selectedSlide);
                    return 0;
                }
            }
            function updateMediaAttribute() {
                props.setAttributes({
                    media: JSON.stringify(slides)
                });
            }
            function addSlide() {
                slides.push(createSlide());
                updateMediaAttribute();
                updatePreview();
            }
            function deleteSlide() {
                slides.splice(selectedIndex(), 1);
                updateMediaAttribute();
                updatePreview();
            }
            function moveSlideLeft() {
                let oldIndex = selectedIndex();

                if (oldIndex > -1) {
                    let slide = slides[oldIndex];
                    let newIndex = (oldIndex > 0 ? parseInt(oldIndex)-1 : slides.length-1);

                    slides.splice(oldIndex, 1);
                    slides.splice(newIndex, 0, slide);

                    updateMediaAttribute();
                    updatePreview(newIndex);

                } else {
                    console.log("oldIndex: ", oldIndex);
                }
            }

            function moveSlideRight() {
                let oldIndex = selectedIndex();

                if (oldIndex > -1) {
                    let slide = slides[oldIndex];
                    let newIndex = (oldIndex < slides.length-1 ? parseInt(oldIndex)+1 : 0);

                    slides.splice(oldIndex, 1);
                    slides.splice(newIndex, 0, slide);

                    updateMediaAttribute();
                    updatePreview(newIndex);

                } else {
                    console.log("oldIndex: ", oldIndex);
                }
            }

            // --------------------------------------------
            // onChange and Toggling
            // --------------------------------------------
            function onChangeDuration(value) {
                console.log(`duration: ${value}`);

                props.setAttributes({
                    duration: value
                });
            }
            function onChangeButtonBackgroundColor(value) {
                console.log(`buttonBackgroundColor: ${value}`);

                props.setAttributes({
                    selectedButtonBackgroundColor: value
                });

                let index = selectedIndex(true);
                let slide = slides[index];

                slide.buttonBackgroundColor = value;
                slides.splice(index, 1, slide);

                updateMediaAttribute();
            }
            function onChangeButtonLink(value) {
                console.log(`buttonLink: ${value}`);

                props.setAttributes({
                    selectedButtonLink: value
                });

                let index = selectedIndex(true);
                let slide = slides[index];

                slide.buttonLink = value;
                slides.splice(index, 1, slide);

                updateMediaAttribute();
            }
            function onChangeButtonText(value) {
                console.log(`buttonText: ${value}`);

                let index = selectedIndex(true);
                let slide = slides[index];

                slide.buttonText = value;
                slides.splice(index, 1, slide);

                updateMediaAttribute();
                updatePreview();
            }
            function onChangeButtonTextColor(value) {
                console.log(`buttonTextColor: ${value}`);

                props.setAttributes({
                    selectedButtonTextColor: value
                });

                let index = selectedIndex(true);
                let slide = slides[index];

                slide.buttonTextColor = value;
                slides.splice(index, 1, slide);

                updateMediaAttribute();
                updatePreview();
            }
            function onChangeTitleText(value) {
                console.log("titleText:", value);
                props.setAttributes({
                    titleText: value
                });
            }
            function onChangeHeadingText(value) {
                console.log(`heading: ${value}`);

                let index = selectedIndex(true);
                let slide = slides[index];

                slide.heading = value;
                slides.splice(index, 1, slide);

                updateMediaAttribute();
                updatePreview();
            }
            function onChangeHeadingColor(value) {
                console.log(`headingColor: ${value}`);

                props.setAttributes({
                    selectedHeadingColor: value
                });

                let index = selectedIndex(true);
                let slide = slides[index];

                slide.headingColor = value;
                slides.splice(index, 1, slide);

                updateMediaAttribute();
                updatePreview();
            }
            function onChangeSubheadingText(value) {
                console.log(`subheading: ${value}`);

                let index = selectedIndex(true);
                let slide = slides[index];

                slide.subheading = value;
                slides.splice(index, 1, slide);

                updateMediaAttribute();
                updatePreview();
            }
            function onChangeSubheadingColor(value) {
                console.log(`subheadingColor: ${value}`);

                props.setAttributes({
                    selectedSubheadingColor: value
                });

                let index = selectedIndex(true);
                let slide = slides[index];

                slide.subheadingColor = value;
                slides.splice(index, 1, slide);

                updateMediaAttribute();
                updatePreview();
            }
            function onChangeBackgroundColor(value) {
                console.log(`backgroundColor: ${value}`);

                props.setAttributes({
                    selectedBackgroundColor: value
                });

                let index = selectedIndex(true);
                let slide = slides[index];

                slide.backgroundColor = value;
                slides.splice(index, 1, slide);

                updateMediaAttribute();
                updatePreview();
            }
            function selectImage(value) {
                console.log(`selectedImage: ${value.sizes.full.url}`);

                let index = selectedIndex(true);
                let slide = slides[index];

                slide.src = value.sizes.full.url;
                slides.splice(index, 1, slide);

                updateMediaAttribute();
                updatePreview();

            }

            // --------------------------------------------
            // Edit Output
            // --------------------------------------------
            return el('div',
                       useBlockProps(),
                       [
                           // ----------------------------------
                           // Block Controls
                           // ----------------------------------
                           el(BlockControls,
                               { key: 'controls' },
                               [
                                   el(MediaUpload,
                                       { onSelect: selectImage,
                                         render(renderProps) {
                                             return el(Button,
                                                        { onClick: renderProps.open,
                                                          style: { height: "auto" },
                                                          text: "Choose Media",
                                                          variant: "tertiary" },
                                                          null
                                             );
                                         }
                                       },
                                       null
                                   ),
                                   el(Button,
                                       { variant: "tertiary",
                                         text: "Add",
                                         onClick: addSlide,
                                         style: { height: "auto" }
                                       },
                                       null
                                   ),
                                   el(Button,
                                       { variant: "tertiary",
                                         text: "Delete",
                                         onClick: deleteSlide,
                                         style: { height: "auto" }
                                       },
                                       null
                                   ),
                                   el(Button,
                                       { variant: "tertiary",
                                         text: "Move left",
                                         onClick: moveSlideLeft,
                                         style: { height: "auto" }
                                       },
                                       null
                                   ),
                                   el(Button,
                                       { variant: "tertiary",
                                         text: "Move right",
                                         onClick: moveSlideRight,
                                         style: { height: "auto" }
                                       },
                                       null
                                   ),
                               ]
                           ), // end BlockControls
                       ],

                       el('div',
                           { className: 'rlb-media-slider-outer-container ' + props.attributes.blockId },
                           [
                               el(RichText,
                                   { tagName: 'h2',
                                     className: 'rlb-media-slider-title ' + props.attributes.blockId,
                                     value: props.attributes.titleText,
                                     onChange: onChangeTitleText,
                                     placeholder: 'Media Slider Title'
                                   },
                                   null
                               ),
                               el('div',
                                   { className: "rlb-media-slider-editor-container " + props.attributes.blockId,
                                     style: {
                                        height: props.attributes.height,
                                        width: props.attributes.width,
                                     }
                                   },
                                   el('div',
                                       { className: "rlb-media-slider-content " + props.attributes.blockId,
                                         style: { backgroundColor: props.attributes.selectedBackgroundColor }
                                       },
                                       [
                                           el(RichText,
                                               { tagName: 'h2',
                                                 className: 'rlb-media-slider-heading ' + props.attributes.blockId,
                                                 onChange: onChangeHeadingText,
                                                 placeholder: 'Media Slider Heading',
                                                 style: { color: props.attributes.selectedHeadingColor },
                                                 value: props.attributes.selectedHeading
                                               },
                                               null
                                           ),
                                           el(RichText,
                                               { tagName: 'p',
                                                 className: 'rlb-media-slider-subheading ' + props.attributes.blockId,
                                                 onChange: onChangeSubheadingText,
                                                 placeholder: 'Media Slider Subheading',
                                                 style: { color: props.attributes.selectedSubheadingColor },
                                                 value: props.attributes.selectedSubheading
                                               },
                                               null
                                           ),
                                           el(RichText,
                                               { tagName: 'p',
                                                 className: 'rlb-media-slider-button ' + props.attributes.blockId,
                                                 onChange: onChangeButtonText,
                                                 placeholder: 'Media Slider Button',
                                                 style: { color: props.attributes.selectedButtonTextColor,
                                                          backgroundColor: props.attributes.selectedButtonBackgroundColor,
                                                          padding: "1rem",
                                                          borderRadius: "0.4rem" },
                                                 value: props.attributes.selectedButtonText
                                               },
                                               null
                                           ),
                                       ]
                                   ),
                               ),
                               el('div',
                                   { className: 'rlb-media-slider-inner-container ' + props.attributes.blockId },
                                   null
                               ),
                           ],

                           // ----------------------------------
                           // Sidebar Controls
                           // ----------------------------------
                           el(InspectorControls,
                               { key: 'setting' },
                               [
                                   el(PanelBody,
                                       { title: 'Colors',
                                         initialOpen: false
                                       },
                                       [
                                           el("p", null, "Heading Color"),
                                           el(ColorPalette,
                                               { colors: colorPalette,
                                                 onChange: onChangeHeadingColor,
                                                 value: props.attributes.selectedHeadingColor
                                               },
                                               null
                                           ),
                                           el("p", null, "Subheading Color"),
                                           el(ColorPalette,
                                               { colors: colorPalette,
                                                 onChange: onChangeSubheadingColor,
                                                 value: props.attributes.selectedSubheadingColor
                                               },
                                               null
                                           ),
                                           el("p", null, "Button Text Color"),
                                           el(ColorPalette,
                                               { colors: colorPalette,
                                                 enableAlpha: true,
                                                 onChange: onChangeButtonTextColor,
                                                 value: props.attributes.selectedButtonTextColor
                                               },
                                               null
                                           ),
                                           el("p", null, "Button Background Color"),
                                           el(ColorPalette,
                                               { colors: colorPalette,
                                                 enableAlpha: true,
                                                 onChange: onChangeButtonBackgroundColor,
                                                 value: props.attributes.selectedButtonBackgroundColor
                                               },
                                               null
                                           ),
                                           el("p", null, "Background Color"),
                                           el(ColorPalette,
                                               { colors: transparentPalette,
                                                 enableAlpha: true,
                                                 onChange: onChangeBackgroundColor,
                                                 value: props.attributes.selectedBackgroundColor
                                               },
                                               null
                                           ),
                                       ],
                                   ),
                                   el(PanelBody,
                                       { title: 'Content Settings',
                                         initialOpen: true
                                       },
                                       [
                                           el("div",
                                               { style: { display:       "flex",
                                                          flexDirection: "row",
                                                          flexWrap:      "wrap" },
                                               },
                                               [
                                                   el(TextControl,
                                                       { onChange: onChangeButtonLink,
                                                         label: "Slide Button Link",
                                                         value: props.attributes.selectedButtonLink
                                                       },
                                                       null
                                                   ),

                                                   el("label",
                                                       { className: "gutenberg-sidebar-label" },
                                                       "Slide Duration (sec)"
                                                   ),
                                                   el(__experimentalNumberControl,
                                                       { isDragEnabled: true,
                                                         isShiftStepEnabled: false,
                                                         max: 60,
                                                         min: 0.25,
                                                         onChange: onChangeDuration,
                                                         step: 0.25,
                                                         value: props.attributes.duration
                                                       },
                                                       null
                                                   )

                                               ]
                                           ),
                                       ]
                                   ) // end Formatting PanelBody
                               ]
                           ) // end InspectorControls
                       )
            ); // end return
        }, // end edit


        // --------------------------------------------------------------------
        // Save
        // --------------------------------------------------------------------
        save(props) {
            return el("div",
                       { className: `rlb-media-slider-outer-container ${props.attributes.blockId}`,
                         height:    props.attributes.height,
                         width:     props.attributes.width
                       }, //}),
                       [
                           el("h2",
                               { className: `rlb-media-slider-title ${props.attributes.blockId}` },
                               props.attributes.titleText
                           ),
                           el("div",
                               { className: `rlb-media-slider-inner-container ${props.attributes.blockId}` },
                               null
                           ),
                           el("div",
                               { className: `rlb-media-slider-attributes ${props.attributes.blockId}`,
                                 hidden:    true,

                                 // Formatting -------------------------------------
                                 "data-blockId":   props.attributes.blockId,
                                 "data-height":    props.attributes.height,
                                 "data-duration":  props.attributes.duration,
                                 "data-width":     props.attributes.width,

                                 "data-media":     props.attributes.media,
                               },
                           ),

                           el("script",
                               { src:  "/wp-content/plugins/rlb-media-slider/media-slider-render.js",
                                 type: "module",
                               },
                               null
                           )
                       ],
            ); // end return
        } // end save

    }; // end blockConfig





    wp.blocks.registerBlockType('rodney-lee-brands/rlb-media-slider', blockConfig);
})();

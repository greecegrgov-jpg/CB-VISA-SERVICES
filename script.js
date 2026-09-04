/* =========================================================
   CB VISA SERVICES
   STEP 7 — FINAL RING + FILTER + CATEGORY + GRID SYSTEM

   FEATURES

   ✓ 3D elliptical visa ring
   ✓ Hover → center detail image
   ✓ Hover → center title/category/country
   ✓ Click → lock selected service
   ✓ Center image → large lightbox
   ✓ Smooth automatic rotation
   ✓ Auto rotation pauses while hovering
   ✓ Drag / swipe
   ✓ Category filtering
   ✓ Advanced filters
   ✓ Grid view
   ✓ Grid → Ring selection
   ✓ Keyboard navigation
   ✓ Static / Vanilla JS
   ✓ No Backend

========================================================= */

(function () {

    "use strict";


    /* =====================================================
       1. DATA
    ===================================================== */

    const DATA = window.CBVisaData;


    if (!DATA || !Array.isArray(DATA.visas)) {

        console.error(
            "CB Visa Services: visas.js data not found."
        );

        return;

    }


    const ALL_VISAS = DATA.visas.map(function (visa, index) {

        return {

            ...visa,

            id:
                visa.id ||
                `visa-${index + 1}`,

            title:
                visa.title ||
                "Visa Service",

            category:
                String(
                    visa.category || ""
                ).trim(),

            location:
                String(
                    visa.location ||
                    visa.country ||
                    ""
                ).trim(),

            country:
                String(
                    visa.country ||
                    visa.location ||
                    ""
                ).trim(),

            priceRange:
                String(
                    visa.priceRange ||
                    ""
                ).trim(),

            processingTime:
                String(
                    visa.processingTime ||
                    ""
                ).trim(),

            status:
                String(
                    visa.status ||
                    "available"
                )
                .trim()
                .toLowerCase(),

            image:
                visa.image ||
                visa.thumbnail ||
                "",

            thumbnail:
                visa.thumbnail ||
                visa.image ||
                "",

            description:
                visa.description ||
                "Professional visa assistance and application support."

        };

    });



    /* =====================================================
       2. DOM ELEMENTS
    ===================================================== */

    const ring =
        document.getElementById("ring");


    const ringTrack =
        document.getElementById("ring-track");



    /* =====================================================
       CENTER
    ===================================================== */

    const centerTitle =
        document.getElementById("center-title");


    const centerImage =
        document.getElementById("center-image");


    const centerPreview =
        document.getElementById("center-preview");


    const centerCategory =
        document.getElementById("center-category");


    const centerLocation =
        document.getElementById("center-location");


    const centerCTA =
        document.getElementById("center-cta");



    /* =====================================================
       LIGHTBOX
    ===================================================== */

    const lightbox =
        document.getElementById("visa-lightbox");


    const lightboxImage =
        document.getElementById("lightbox-image");


    const lightboxTitle =
        document.getElementById("lightbox-title");


    const lightboxCategory =
        document.getElementById("lightbox-category");


    const lightboxLocation =
        document.getElementById("lightbox-location");


    const lightboxClose =
        document.getElementById("visa-lightbox-close");


    const lightboxBackdrop =
        document.getElementById("visa-lightbox-backdrop");



    /* =====================================================
       FILTER
    ===================================================== */

    const filterButton =
        document.getElementById("filter-button");


    const gridButton =
        document.getElementById("grid-button");


    const filterOverlay =
        document.getElementById("filter-overlay");


    const filterClose =
        document.getElementById("filter-close");


    const resetFiltersButton =
        document.getElementById("reset-filters");



    /* =====================================================
       FILTER FIELDS
    ===================================================== */

    const serviceType =
        document.getElementById("service-type");


    const processingTime =
        document.getElementById("processing-time");


    const budget =
        document.getElementById("budget");


    const status =
        document.getElementById("status");


    const visaCount =
        document.getElementById("visa-count");



    /* =====================================================
       GRID
    ===================================================== */

    const gridView =
        document.getElementById("grid-view");


    const gridContainer =
        document.getElementById("grid-container");


    const ringButton =
        document.getElementById("ring-button");



    /* =====================================================
       3. CONFIGURATION
    ===================================================== */

    const CONFIG = {

        desktop: {

            panels: 150,

            radiusX: 700,

            radiusY: 190

        },


        tablet: {

            panels: 110,

            radiusX: 520,

            radiusY: 150

        },


        mobile: {

            panels: 78,

            radiusX: 350,

            radiusY: 115

        },


        smallMobile: {

            panels: 58,

            radiusX: 280,

            radiusY: 92

        },


        /* -------------------------------------------------
           AUTO ROTATION
        ------------------------------------------------- */

        autoSpeed:
            0.000045,


        /* -------------------------------------------------
           DRAG
        ------------------------------------------------- */

        dragSensitivity:
            0.0025,


        /* -------------------------------------------------
           INERTIA
        ------------------------------------------------- */

        inertia:
            0.90,


        /* -------------------------------------------------
           SMOOTH MOVEMENT
        ------------------------------------------------- */

        ease:
            0.085,


        /* -------------------------------------------------
           DEPTH
        ------------------------------------------------- */

        minScale:
            0.48,


        maxScale:
            1.10,


        /* -------------------------------------------------
           BLUR
        ------------------------------------------------- */

        maxBlur:
            0.8,


        /* -------------------------------------------------
           FRONT OF ELLIPSE
        ------------------------------------------------- */

        frontAngle:
            Math.PI / 2

    };



    /* =====================================================
       4. STATE
    ===================================================== */

    let filteredVisas =
        [...ALL_VISAS];


    let panels =
        [];


    let selectedIndex =
        -1;


    let hoveredIndex =
        -1;


    let lastFocusedIndex =
        -1;


    let rotation =
        0;


    let targetRotation =
        0;


    let isDragging =
        false;


    let dragStartX =
        0;


    let dragStartRotation =
        0;


    let lastPointerX =
        0;


    let dragMoved =
        false;


    let velocity =
        0;


    let currentView =
        "ring";


    let lastTime =
        performance.now();


    let activeVisa =
        null;


    let isRingHovered =
        false;


    let lightboxOpen =
        false;



    /* =====================================================
       5. FALLBACK IMAGE
    ===================================================== */

    function fallbackImage() {

        return (

            "data:image/svg+xml;charset=UTF-8," +

            encodeURIComponent(`

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1200"
                    height="800"
                    viewBox="0 0 1200 800"
                >

                    <rect
                        width="1200"
                        height="800"
                        fill="#e9e7e2"
                    />

                    <text
                        x="600"
                        y="400"
                        text-anchor="middle"
                        dominant-baseline="middle"
                        fill="#8B0000"
                        font-family="Arial, sans-serif"
                        font-size="42"
                        letter-spacing="4"
                    >
                        CB VISA SERVICES
                    </text>

                </svg>

            `)

        );

    }



    /* =====================================================
       6. ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value || "")

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }



    /* =====================================================
       7. DEVICE CONFIG
    ===================================================== */

    function getRingConfig() {

        const width =
            window.innerWidth;


        if (width <= 480) {

            return CONFIG.smallMobile;

        }


        if (width <= 760) {

            return CONFIG.mobile;

        }


        if (width <= 1100) {

            return CONFIG.tablet;

        }


        return CONFIG.desktop;

    }



    /* =====================================================
       8. CATEGORY FORMAT
    ===================================================== */

    function formatCategory(category) {

        if (!category) {

            return "";

        }


        return category

            .replace(
                /[-_]/g,
                " "
            )

            .replace(
                /\b\w/g,
                function (letter) {

                    return letter.toUpperCase();

                }
            );

    }



    /* =====================================================
       9. GET VISA IMAGE
    ===================================================== */

    function getVisaImage(visa) {

        if (!visa) {

            return fallbackImage();

        }


        return (

            visa.image ||

            visa.thumbnail ||

            fallbackImage()

        );

    }



    /* =====================================================
       10. UPDATE CENTER
    ===================================================== */

    function updateCenter(visa) {

        if (!visa) {

            return;

        }


        activeVisa =
            visa;



        /* =================================================
           TITLE
        ================================================= */

        if (centerTitle) {

            centerTitle.textContent =
                visa.title;

        }



        /* =================================================
           IMAGE
        ================================================= */

        if (centerImage) {

            const imageSource =
                getVisaImage(visa);


            centerImage.style.opacity =
                "0.15";


            const newImage =
                new Image();


            newImage.onload =
                function () {

                    centerImage.src =
                        imageSource;


                    centerImage.alt =
                        `${visa.title} — ${visa.country || visa.location}`;


                    requestAnimationFrame(
                        function () {

                            centerImage.style.opacity =
                                "1";

                        }
                    );

                };


            newImage.onerror =
                function () {

                    centerImage.src =
                        fallbackImage();


                    centerImage.alt =
                        "CB Visa Services";


                    centerImage.style.opacity =
                        "1";

                };


            newImage.src =
                imageSource;

        }



        /* =================================================
           ENABLE CENTER PREVIEW
        ================================================= */

        if (centerPreview) {

            centerPreview.removeAttribute(
                "disabled"
            );


            centerPreview.setAttribute(
                "aria-label",
                `Open ${visa.title} image`
            );

        }



        /* =================================================
           CATEGORY
        ================================================= */

        if (centerCategory) {

            centerCategory.textContent =
                formatCategory(
                    visa.category
                );

        }



        /* =================================================
           COUNTRY
        ================================================= */

        if (centerLocation) {

            centerLocation.textContent =
                visa.country ||
                visa.location ||
                "";

        }



        /* =================================================
           CTA
        ================================================= */

        if (centerCTA) {

            centerCTA.dataset.visaId =
                visa.id;


            centerCTA.removeAttribute(
                "hidden"
            );

        }

    }



    /* =====================================================
       11. RESET CENTER
    ===================================================== */

    function resetCenter() {

        activeVisa =
            null;


        if (centerTitle) {

            centerTitle.textContent =
                "Build your own future on your terms.";

        }


        if (centerImage) {

            centerImage.src =
                fallbackImage();


            centerImage.alt =
                "CB Visa Services";


            centerImage.style.opacity =
                "1";

        }


        if (centerPreview) {

            centerPreview.setAttribute(
                "disabled",
                ""
            );


            centerPreview.setAttribute(
                "aria-label",
                "Select a visa service to view image"
            );

        }


        if (centerCategory) {

            centerCategory.textContent =
                "Explore Services";

        }


        if (centerLocation) {

            centerLocation.textContent =
                "300+ Services";

        }


        if (centerCTA) {

            centerCTA.setAttribute(
                "hidden",
                ""
            );


            delete centerCTA.dataset.visaId;

        }

    }



    /* =====================================================
       12. CREATE RING PANEL
    ===================================================== */

    function createPanel(
        visa,
        index
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "ring-panel";


        button.dataset.index =
            index;


        button.setAttribute(
            "aria-label",
            visa.title
        );



        /* =================================================
           IMAGE
        ================================================= */

        const image =
            document.createElement(
                "img"
            );


        image.src =
            getVisaImage(visa);


        image.alt =
            `${visa.title} — ${visa.country || visa.location}`;


        image.loading =
            "lazy";


        image.decoding =
            "async";


        image.draggable =
            false;


        image.onerror =
            function () {

                this.src =
                    fallbackImage();

            };



        /* =================================================
           PANEL TEXT
        ================================================= */

        const panelContent =
            document.createElement(
                "span"
            );


        panelContent.className =
            "ring-panel-content";


        panelContent.innerHTML = `

            <span class="ring-panel-title">
                ${escapeHTML(
                    visa.title
                )}
            </span>

            <span class="ring-panel-location">
                ${escapeHTML(
                    visa.country ||
                    visa.location
                )}
            </span>

        `;



        button.appendChild(
            image
        );


        button.appendChild(
            panelContent
        );



        /* =================================================
           MOUSE ENTER
        ================================================= */

        button.addEventListener(
            "mouseenter",
            function () {

                if (isDragging) {

                    return;

                }


                hoveredIndex =
                    index;


                panels.forEach(
                    function (
                        panel,
                        panelIndex
                    ) {

                        panel.classList.toggle(
                            "is-hovered",
                            panelIndex === index
                        );

                    }
                );


                /*
                  UPDATE CENTER
                */

                updateCenter(
                    visa
                );


                /*
                  MOVE THIS VISA
                  TO FRONT CENTER
                */

                focusVisa(
                    index,
                    false
                );

            }
        );



        /* =================================================
           FOCUS / KEYBOARD
        ================================================= */

        button.addEventListener(
            "focus",
            function () {

                if (isDragging) {

                    return;

                }


                hoveredIndex =
                    index;


                updateCenter(
                    visa
                );


                focusVisa(
                    index,
                    false
                );

            }
        );



        /* =================================================
           MOUSE LEAVE
        ================================================= */

        button.addEventListener(
            "mouseleave",
            function () {

                button.classList.remove(
                    "is-hovered"
                );

            }
        );



        /* =================================================
           CLICK
        ================================================= */

        button.addEventListener(
            "click",
            function (event) {

                if (dragMoved) {

                    event.preventDefault();

                    event.stopPropagation();

                    return;

                }


                selectVisa(
                    index
                );

            }
        );



        /* =================================================
           KEYBOARD
        ================================================= */

        button.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();


                    selectVisa(
                        index
                    );

                }

            }
        );


        return button;

    }



    /* =====================================================
       13. RENDER RING
    ===================================================== */

    function renderRing() {

        if (!ringTrack) {

            return;

        }


        ringTrack.innerHTML =
            "";


        panels =
            [];


        if (!filteredVisas.length) {

            resetCenter();

            return;

        }


        const config =
            getRingConfig();


        const limit =
            Math.min(
                config.panels,
                filteredVisas.length
            );


        for (
            let i = 0;
            i < limit;
            i++
        ) {

            const panel =
                createPanel(
                    filteredVisas[i],
                    i
                );


            panels.push(
                panel
            );


            ringTrack.appendChild(
                panel
            );

        }



        /*
          Keep selected index valid.
        */

        if (
            selectedIndex >=
            filteredVisas.length
        ) {

            selectedIndex =
                -1;

        }



        updateAllPanels(
            true
        );



        /*
          Restore selected service
        */

        if (
            selectedIndex >= 0 &&
            selectedIndex < filteredVisas.length
        ) {

            updateCenter(
                filteredVisas[selectedIndex]
            );


            /*
              Only apply selected class
              if panel exists in current ring.
            */

            if (
                panels[selectedIndex]
            ) {

                panels[selectedIndex]
                    .classList.add(
                        "is-selected"
                    );

            }

        }

    }



    /* =====================================================
       14. CALCULATE RING POSITION
    ===================================================== */

    function calculatePosition(
        index,
        count
    ) {

        const config =
            getRingConfig();


        const angle =
            (
                index /
                count
            ) *
            Math.PI *
            2 +
            rotation;



        /* =================================================
           ELLIPTICAL ORBIT
        ================================================= */

        const x =
            Math.cos(angle) *
            config.radiusX;


        const y =
            Math.sin(angle) *
            config.radiusY;



        /* =================================================
           DEPTH
        ================================================= */

        const depth =
            Math.sin(angle);


        const normalized =
            (depth + 1) / 2;



        /* =================================================
           SCALE
        ================================================= */

        const scale =
            CONFIG.minScale +

            (
                CONFIG.maxScale -
                CONFIG.minScale
            ) *
            normalized;



        /* =================================================
           OPACITY
        ================================================= */

        const opacity =
            0.18 +
            0.82 *
            normalized;



        /* =================================================
           BLUR
        ================================================= */

        const blur =
            CONFIG.maxBlur *
            (1 - normalized);



        /* =================================================
           3D ROTATION
        ================================================= */

        const rotateY =
            Math.cos(angle) *
            -18;


        const rotateZ =
            Math.cos(angle) *
            1.5;



        /* =================================================
           Z DEPTH
        ================================================= */

        const z =
            depth *
            180;



        return {

            x,
            y,
            z,
            scale,
            opacity,
            blur,
            rotateY,
            rotateZ

        };

    }



    /* =====================================================
       15. UPDATE PANEL
    ===================================================== */

    function updatePanel(
        panel,
        index,
        count
    ) {

        const position =
            calculatePosition(
                index,
                count
            );


        panel.style.transform =

            `translate3d(` +

            `${position.x}px,` +

            `${position.y}px,` +

            `${position.z}px` +

            `)` +

            ` rotateY(` +

            `${position.rotateY}deg` +

            `)` +

            ` rotateZ(` +

            `${position.rotateZ}deg` +

            `)` +

            ` scale(` +

            `${position.scale}` +

            `)`;


        panel.style.opacity =
            position.opacity;



        /* =================================================
           BLUR
        ================================================= */

        if (
            position.blur >
            0.05
        ) {

            panel.style.filter =
                `blur(${position.blur}px)`;

        } else {

            panel.style.filter =
                "none";

        }



        /* =================================================
           Z INDEX
        ================================================= */

        panel.style.zIndex =
            Math.round(
                1000 +
                position.z
            );



        /* =================================================
           FRONT CLASS
        ================================================= */

        if (
            position.opacity >
            0.84
        ) {

            panel.classList.add(
                "is-front"
            );

        } else {

            panel.classList.remove(
                "is-front"
            );

        }

    }



    /* =====================================================
       16. UPDATE ALL PANELS
    ===================================================== */

    function updateAllPanels(
        immediate = false
    ) {

        if (!panels.length) {

            return;

        }


        const count =
            panels.length;


        if (immediate) {

            rotation =
                targetRotation;

        } else {

            let difference =
                targetRotation -
                rotation;



            /*
              SHORTEST PATH
            */

            difference =
                Math.atan2(
                    Math.sin(
                        difference
                    ),
                    Math.cos(
                        difference
                    )
                );


            rotation +=
                difference *
                CONFIG.ease;

        }


        panels.forEach(
            function (
                panel,
                index
            ) {

                updatePanel(
                    panel,
                    index,
                    count
                );

            }
        );

    }



    /* =====================================================
       17. FOCUS VISA
    ===================================================== */

    function focusVisa(
        index,
        lockSelection
    ) {

        if (
            !filteredVisas[index]
        ) {

            return;

        }


        /*
          Panel may not exist if
          filtered list is bigger
          than rendered ring limit.
        */

        if (
            !panels[index]
        ) {

            return;

        }


        const count =
            panels.length;


        if (!count) {

            return;

        }


        const baseAngle =
            (
                index /
                count
            ) *
            Math.PI *
            2;


        const currentAngle =
            baseAngle +
            rotation;



        /*
          FRONT CENTER
        */

        const difference =
            CONFIG.frontAngle -
            currentAngle;



        /*
          SHORTEST ROTATION
        */

        const shortest =
            Math.atan2(
                Math.sin(
                    difference
                ),
                Math.cos(
                    difference
                )
            );


        targetRotation =
            rotation +
            shortest;



        /*
          LOCK SELECTION
        */

        if (lockSelection) {

            selectedIndex =
                index;

        }



        /*
          PANEL SELECTED STATE
        */

        panels.forEach(
            function (
                panel,
                panelIndex
            ) {

                panel.classList.toggle(
                    "is-selected",
                    lockSelection &&
                    panelIndex === index
                );

            }
        );


        lastFocusedIndex =
            index;

    }



    /* =====================================================
       18. SELECT VISA
    ===================================================== */

    function selectVisa(index) {

        if (
            !filteredVisas[index]
        ) {

            return;

        }


        selectedIndex =
            index;


        hoveredIndex =
            index;


        const visa =
            filteredVisas[index];


        /*
          CENTER
        */

        updateCenter(
            visa
        );


        /*
          FRONT
        */

        focusVisa(
            index,
            true
        );


        /*
          SELECTED STATE
        */

        panels.forEach(
            function (
                panel,
                panelIndex
            ) {

                panel.classList.toggle(
                    "is-selected",
                    panelIndex === index
                );

            }
        );

    }



    /* =====================================================
       19. OPEN LIGHTBOX
    ===================================================== */

    function openVisaLightbox(visa) {

        if (
            !visa ||
            !lightbox
        ) {

            return;

        }


        const imageSource =
            getVisaImage(visa);



        /* =================================================
           IMAGE
        ================================================= */

        if (lightboxImage) {

            lightboxImage.src =
                imageSource;


            lightboxImage.alt =
                `${visa.title} — ${visa.country || visa.location}`;

        }



        /* =================================================
           CATEGORY
        ================================================= */

        if (lightboxCategory) {

            lightboxCategory.textContent =
                formatCategory(
                    visa.category
                );

        }



        /* =================================================
           TITLE
        ================================================= */

        if (lightboxTitle) {

            lightboxTitle.textContent =
                visa.title;

        }



        /* =================================================
           LOCATION
        ================================================= */

        if (lightboxLocation) {

            lightboxLocation.textContent =
                visa.country ||
                visa.location ||
                "";

        }



        /* =================================================
           OPEN
        ================================================= */

        lightbox.removeAttribute(
            "hidden"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        lightbox.classList.add(
            "is-open"
        );


        document.body.classList.add(
            "lightbox-open"
        );


        lightboxOpen =
            true;



        /*
          Focus close button
        */

        if (lightboxClose) {

            requestAnimationFrame(
                function () {

                    lightboxClose.focus();

                }
            );

        }

    }



    /* =====================================================
       20. CLOSE LIGHTBOX
    ===================================================== */

    function closeVisaLightbox() {

        if (
            !lightbox
        ) {

            return;

        }


        lightbox.classList.remove(
            "is-open"
        );


        lightbox.setAttribute(
            "hidden",
            ""
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "lightbox-open"
        );


        lightboxOpen =
            false;


        /*
          Do not destroy activeVisa.
          The selected service remains
          visible in the center.
        */

    }



    /* =====================================================
       21. LIGHTBOX EVENTS
    ===================================================== */

    function initLightbox() {

        /*
          CENTER IMAGE CLICK
        */

        if (centerPreview) {

            centerPreview.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    if (!activeVisa) {

                        return;

                    }


                    openVisaLightbox(
                        activeVisa
                    );

                }
            );

        }



        /*
          FALLBACK:
          If center-preview wrapper
          somehow isn't available,
          clicking image itself works.
        */

        if (
            centerImage &&
            !centerPreview
        ) {

            centerImage.addEventListener(
                "click",
                function () {

                    if (!activeVisa) {

                        return;

                    }


                    openVisaLightbox(
                        activeVisa
                    );

                }
            );

        }



        /*
          CLOSE BUTTON
        */

        if (lightboxClose) {

            lightboxClose.addEventListener(
                "click",
                function () {

                    closeVisaLightbox();

                }
            );

        }



        /*
          BACKDROP
        */

        if (lightboxBackdrop) {

            lightboxBackdrop.addEventListener(
                "click",
                function () {

                    closeVisaLightbox();

                }
            );

        }



        /*
          GENERAL LIGHTBOX CLICK
        */

        if (lightbox) {

            lightbox.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        lightbox
                    ) {

                        closeVisaLightbox();

                    }

                }
            );

        }

    }



    /* =====================================================
       22. PROCESSING TIME FILTER
    ===================================================== */

    function getProcessingRange(
        processingTime
    ) {

        if (!processingTime) {

            return null;

        }


        const normalized =
            String(
                processingTime
            )
            .toLowerCase()
            .replace(
                /–/g,
                "-"
            )
            .replace(
                /—/g,
                "-"
            );


        const numbers =
            normalized.match(
                /\d+/g
            );


        if (
            !numbers ||
            !numbers.length
        ) {

            return null;

        }


        const values =
            numbers.map(
                Number
            );


        return {

            min:
                values[0],

            max:
                values.length > 1
                    ? values[values.length - 1]
                    : values[0]

        };

    }



    function matchesProcessingTime(
        visa,
        selected
    ) {

        if (
            !selected ||
            selected === "all"
        ) {

            return true;

        }


        const range =
            getProcessingRange(
                visa.processingTime
            );


        if (!range) {

            return false;

        }



        /*
          EXPRESS
          3–7 DAYS
        */

        if (
            selected === "fast"
        ) {

            return (
                range.max <= 7
            );

        }



        /*
          STANDARD
          7–15 DAYS
        */

        if (
            selected === "standard"
        ) {

            return (
                range.min >= 7 &&
                range.min < 15
            );

        }



        /*
          EXTENDED
          15–30+ DAYS
        */

        if (
            selected === "extended"
        ) {

            return (
                range.min >= 15
            );

        }


        return true;

    }



    /* =====================================================
       23. EXTRACT PRICE
    ===================================================== */

    function getMaximumPrice(
        priceRange
    ) {

        if (!priceRange) {

            return 0;

        }


        const text =
            String(
                priceRange
            )
            .replace(
                /\$/g,
                ""
            )
            .replace(
                /,/g,
                ""
            );


        if (
            text.includes("+")
        ) {

            const firstNumber =
                parseFloat(
                    text
                );


            return Number.isNaN(
                firstNumber
            )
                ? 0
                : firstNumber;

        }


        const numbers =
            text.match(
                /\d+(?:\.\d+)?/g
            );


        if (
            !numbers ||
            !numbers.length
        ) {

            return 0;

        }


        return Math.max.apply(
            null,
            numbers.map(
                Number
            )
        );

    }



    /* =====================================================
       24. BUDGET FILTER
    ===================================================== */

    function matchesBudget(
        visa,
        selected
    ) {

        if (
            !selected ||
            selected === "all"
        ) {

            return true;

        }


        const maximum =
            getMaximumPrice(
                visa.priceRange
            );


        if (
            maximum <= 0
        ) {

            return false;

        }



        /*
          LOW
          Up to $500
        */

        if (
            selected === "low"
        ) {

            return (
                maximum <= 500
            );

        }



        /*
          MEDIUM
          $500–$1,000
        */

        if (
            selected === "medium"
        ) {

            return (
                maximum >= 500 &&
                maximum <= 1000
            );

        }



        /*
          PREMIUM
          $1,000+
        */

        if (
            selected === "premium" ||
            selected === "high"
        ) {

            return (
                maximum >= 1000
            );

        }


        return true;

    }



    /* =====================================================
       25. STATUS FILTER
    ===================================================== */

    function matchesStatus(
        visa,
        selected
    ) {

        if (
            !selected ||
            selected === "all"
        ) {

            return true;

        }



        /*
          POPULAR
        */

        if (
            selected === "popular"
        ) {

            return (

                visa.featured === true

                ||

                visa.availability ===
                "high"

            );

        }



        /*
          NEW
        */

        if (
            selected === "new"
        ) {

            return (

                visa.isNew === true

                ||

                visa.new === true

            );

        }


        return (

            String(
                visa.status || ""
            )
            .toLowerCase() ===

            String(
                selected
            )
            .toLowerCase()

        );

    }



    /* =====================================================
       26. SERVICE TYPE FILTER
    ===================================================== */

    function matchesServiceType(
        visa,
        selected
    ) {

        if (
            !selected ||
            selected === "all"
        ) {

            return true;

        }


        const category =
            String(
                visa.category || ""
            )
            .toLowerCase()
            .trim();


        const selectedCategory =
            String(
                selected
            )
            .toLowerCase()
            .trim();



        /*
          EXACT
        */

        if (
            category ===
            selectedCategory
        ) {

            return true;

        }



        /*
          VISIT
        */

        if (
            selectedCategory === "visit"
        ) {

            return (
                category ===
                "visit-visa"
            );

        }



        /*
          BUSINESS
        */

        if (
            selectedCategory === "business"
        ) {

            return (
                category ===
                "business-visa"
            );

        }



        /*
          WORK
        */

        if (
            selectedCategory === "work"
        ) {

            return (
                category ===
                "work-visa"
            );

        }



        /*
          INVITATION
        */

        if (
            selectedCategory ===
            "invitation"
        ) {

            return (
                category.includes(
                    "invitation"
                )
            );

        }



        /*
          WORK PERMIT
        */

        if (
            selectedCategory ===
            "permit"
        ) {

            return (
                category ===
                "work-permit"
            );

        }



        /*
          PASSPORT
        */

        if (
            selectedCategory ===
            "passport"
        ) {

            return (
                category ===
                "passport"
            );

        }



        /*
          RESIDENCY
        */

        if (
            selectedCategory ===
            "residency"
        ) {

            return (
                category ===
                "residency"
            );

        }



        /*
          NATIONALITY
        */

        if (
            selectedCategory ===
            "nationality"
        ) {

            return (
                category ===
                "nationality"
            );

        }


        return false;

    }



    /* =====================================================
       27. APPLY FILTERS
    ===================================================== */

    function applyFilters() {

        const selectedService =
            serviceType
                ? serviceType.value
                : "all";


        const selectedProcessing =
            processingTime
                ? processingTime.value
                : "all";


        const selectedBudget =
            budget
                ? budget.value
                : "all";


        const selectedStatus =
            status
                ? status.value
                : "all";


        filteredVisas =
            ALL_VISAS.filter(
                function (visa) {

                    return (

                        matchesServiceType(
                            visa,
                            selectedService
                        )

                        &&

                        matchesProcessingTime(
                            visa,
                            selectedProcessing
                        )

                        &&

                        matchesBudget(
                            visa,
                            selectedBudget
                        )

                        &&

                        matchesStatus(
                            visa,
                            selectedStatus
                        )

                    );

                }
            );



        /*
          Reset ring state
        */

        selectedIndex =
            -1;


        hoveredIndex =
            -1;


        lastFocusedIndex =
            -1;


        activeVisa =
            null;


        rotation =
            0;


        targetRotation =
            0;


        velocity =
            0;



        renderRing();


        renderGrid();


        updateResultCount();



        if (
            !filteredVisas.length
        ) {

            resetCenter();

        }

    }



    /* =====================================================
       28. CATEGORY FILTER
    ===================================================== */

    function filterByCategory(
        category
    ) {

        if (!category) {

            return;

        }


        const normalizedCategory =
            category
                .toLowerCase()
                .trim();



        /*
          Update service select
        */

        if (serviceType) {

            const optionExists =
                Array.from(
                    serviceType.options
                ).some(
                    function (option) {

                        return (

                            option.value
                                .toLowerCase() ===
                            normalizedCategory

                        );

                    }
                );


            if (optionExists) {

                serviceType.value =
                    normalizedCategory;

            }

        }



        /*
          Reset other filters
        */

        if (processingTime) {

            processingTime.value =
                "all";

        }


        if (budget) {

            budget.value =
                "all";

        }


        if (status) {

            status.value =
                "all";

        }



        /*
          Filter
        */

        filteredVisas =
            ALL_VISAS.filter(
                function (visa) {

                    return (

                        visa.category
                            .toLowerCase()
                            .trim() ===
                        normalizedCategory

                    );

                }
            );



        /*
          Reset state
        */

        selectedIndex =
            -1;


        hoveredIndex =
            -1;


        lastFocusedIndex =
            -1;


        activeVisa =
            null;


        rotation =
            0;


        targetRotation =
            0;


        velocity =
            0;



        /*
          Active category button
        */

        updateCategoryButtonState(
            normalizedCategory
        );



        renderRing();


        renderGrid();


        updateResultCount();



        /*
          Scroll to explorer
        */

        const explorer =
            document.querySelector(
                ".visa-explorer"
            );


        if (explorer) {

            explorer.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });

        }

    }



    /* =====================================================
       29. CATEGORY BUTTON STATE
    ===================================================== */

    function updateCategoryButtonState(
        activeCategory
    ) {

        const buttons =
            document.querySelectorAll(
                ".category-label"
            );


        buttons.forEach(
            function (button) {

                const category =
                    String(
                        button.dataset.category ||
                        ""
                    )
                    .toLowerCase()
                    .trim();


                button.classList.toggle(
                    "is-active",
                    category ===
                    activeCategory
                );

            }
        );

    }



    /* =====================================================
       30. CATEGORY BUTTONS
    ===================================================== */

    function initCategoryButtons() {

        const buttons =
            document.querySelectorAll(
                ".category-label"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const category =
                            button.dataset.category;


                        if (
                            category
                        ) {

                            filterByCategory(
                                category
                            );

                        }

                    }
                );

            }
        );

    }



    /* =====================================================
       31. GRID RENDER
    ===================================================== */

    function renderGrid() {

        if (!gridContainer) {

            return;

        }


        gridContainer.innerHTML =
            "";



        if (!filteredVisas.length) {

            gridContainer.innerHTML = `

                <div class="grid-empty">

                    <h3>
                        No visa services found.
                    </h3>

                    <p>
                        Try changing your filters.
                    </p>

                </div>

            `;

            return;

        }



        let limit =
            filteredVisas.length;



        /*
          SERVICES TO DISPLAY
        */

        if (
            visaCount &&
            visaCount.value &&
            visaCount.value !== "all"
        ) {

            const number =
                parseInt(
                    visaCount.value,
                    10
                );


            if (
                !Number.isNaN(
                    number
                )
            ) {

                limit =
                    Math.min(
                        number,
                        filteredVisas.length
                    );

            }

        }



        const fragment =
            document.createDocumentFragment();



        filteredVisas
            .slice(
                0,
                limit
            )
            .forEach(
                function (visa) {

                    const card =
                        document.createElement(
                            "article"
                        );


                    card.className =
                        "grid-card";


                    card.innerHTML = `

                        <button
                            type="button"
                            class="grid-card-button"
                            aria-label="${escapeHTML(
                                visa.title
                            )}"
                        >

                            <div
                                class="grid-card-image"
                            >

                                <img
                                    src="${escapeHTML(
                                        getVisaImage(
                                            visa
                                        )
                                    )}"
                                    alt="${escapeHTML(
                                        visa.title
                                    )}"
                                    loading="lazy"
                                >

                            </div>


                            <div
                                class="grid-card-content"
                            >

                                <span
                                    class="grid-card-category"
                                >
                                    ${escapeHTML(
                                        formatCategory(
                                            visa.category
                                        )
                                    )}
                                </span>


                                <h3>
                                    ${escapeHTML(
                                        visa.title
                                    )}
                                </h3>


                                <p
                                    class="grid-card-location"
                                >
                                    ${escapeHTML(
                                        visa.country ||
                                        visa.location
                                    )}
                                </p>


                                <div
                                    class="grid-card-meta"
                                >

                                    <span>
                                        ${escapeHTML(
                                            visa.processingTime
                                        )}
                                    </span>

                                    <span>
                                        ${escapeHTML(
                                            visa.priceRange
                                        )}
                                    </span>

                                </div>

                            </div>

                        </button>

                    `;



                    const image =
                        card.querySelector(
                            "img"
                        );


                    if (image) {

                        image.draggable =
                            false;


                        image.onerror =
                            function () {

                                this.src =
                                    fallbackImage();

                            };

                    }



                    const cardButton =
                        card.querySelector(
                            ".grid-card-button"
                        );


                    if (cardButton) {

                        cardButton.addEventListener(
                            "click",
                            function () {

                                const index =
                                    filteredVisas.indexOf(
                                        visa
                                    );


                                selectedIndex =
                                    index;


                                hoveredIndex =
                                    index;


                                updateCenter(
                                    visa
                                );


                                /*
                                  Switch ring
                                */

                                switchToRing();



                                requestAnimationFrame(
                                    function () {

                                        /*
                                          If the selected
                                          service is within
                                          rendered panels.
                                        */

                                        if (
                                            panels[index]
                                        ) {

                                            focusVisa(
                                                index,
                                                true
                                            );


                                            panels.forEach(
                                                function (
                                                    panel,
                                                    panelIndex
                                                ) {

                                                    panel.classList.toggle(
                                                        "is-selected",
                                                        panelIndex === index
                                                    );

                                                }
                                            );

                                        } else {

                                            /*
                                              If service is
                                              beyond ring limit,
                                              show first ring
                                              position while
                                              keeping its center
                                              details active.
                                            */

                                            selectedIndex =
                                                -1;

                                        }

                                    }
                                );

                            }
                        );

                    }


                    fragment.appendChild(
                        card
                    );

                }
            );



        gridContainer.appendChild(
            fragment
        );

    }



    /* =====================================================
       32. RESULT COUNT
    ===================================================== */

    function updateResultCount() {

        const elements =
            document.querySelectorAll(
                "[data-result-count]"
            );


        elements.forEach(
            function (element) {

                element.textContent =
                    `${filteredVisas.length} services`;

            }
        );

    }



    /* =====================================================
       33. OPEN FILTER
    ===================================================== */

    function openFilters() {

        if (!filterOverlay) {

            return;

        }


        filterOverlay.removeAttribute(
            "hidden"
        );


        filterOverlay.classList.add(
            "is-open"
        );


        filterOverlay.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "filter-open"
        );


        if (filterButton) {

            filterButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }


        if (filterClose) {

            filterClose.focus();

        }

    }



    /* =====================================================
       34. CLOSE FILTER
    ===================================================== */

    function closeFilters() {

        if (!filterOverlay) {

            return;

        }


        filterOverlay.classList.remove(
            "is-open"
        );


        filterOverlay.setAttribute(
            "hidden",
            ""
        );


        filterOverlay.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "filter-open"
        );


        if (filterButton) {

            filterButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }



    /* =====================================================
       35. RESET FILTERS
    ===================================================== */

    function resetFilters() {

        if (serviceType) {

            serviceType.value =
                "all";

        }


        if (processingTime) {

            processingTime.value =
                "all";

        }


        if (budget) {

            budget.value =
                "all";

        }


        if (status) {

            status.value =
                "all";

        }


        if (visaCount) {

            visaCount.value =
                "60";

        }



        /*
          Reset category buttons
        */

        updateCategoryButtonState(
            ""
        );



        filteredVisas =
            [...ALL_VISAS];


        selectedIndex =
            -1;


        hoveredIndex =
            -1;


        lastFocusedIndex =
            -1;


        activeVisa =
            null;


        rotation =
            0;


        targetRotation =
            0;


        velocity =
            0;



        renderRing();


        renderGrid();


        updateResultCount();


        resetCenter();

    }



    /* =====================================================
       36. RESET BUTTON
    ===================================================== */

    function initResetButton() {

        if (!resetFiltersButton) {

            return;

        }


        resetFiltersButton.addEventListener(
            "click",
            function () {

                resetFilters();

            }
        );

    }



    /* =====================================================
       37. FILTER EVENTS
    ===================================================== */

    function initFilterEvents() {

        const filters = [

            serviceType,

            processingTime,

            budget,

            status,

            visaCount

        ];


        filters.forEach(
            function (filter) {

                if (!filter) {

                    return;

                }


                filter.addEventListener(
                    "change",
                    function () {

                        /*
                          If service type changes
                          manually, update category
                          button state.
                        */

                        if (
                            filter ===
                            serviceType
                        ) {

                            updateCategoryButtonState(
                                serviceType.value
                            );

                        }


                        applyFilters();

                    }
                );

            }
        );

    }



    /* =====================================================
       38. GRID VIEW
    ===================================================== */

    function switchToGrid() {

        currentView =
            "grid";


        if (ring) {

            ring.setAttribute(
                "hidden",
                ""
            );

        }


        if (gridView) {

            gridView.removeAttribute(
                "hidden"
            );


            gridView.classList.add(
                "is-active"
            );


            gridView.setAttribute(
                "aria-hidden",
                "false"
            );

        }


        if (gridButton) {

            gridButton.classList.add(
                "is-active"
            );

        }


        if (ringButton) {

            ringButton.classList.remove(
                "is-active"
            );

        }


        renderGrid();


        if (gridView) {

            gridView.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });

        }

    }



    /* =====================================================
       39. RING VIEW
    ===================================================== */

    function switchToRing() {

        currentView =
            "ring";


        if (gridView) {

            gridView.classList.remove(
                "is-active"
            );


            gridView.setAttribute(
                "hidden",
                ""
            );


            gridView.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        if (ring) {

            ring.removeAttribute(
                "hidden"
            );

        }


        if (gridButton) {

            gridButton.classList.remove(
                "is-active"
            );

        }


        if (ringButton) {

            ringButton.classList.add(
                "is-active"
            );

        }


        updateAllPanels(
            true
        );


        const explorer =
            document.querySelector(
                ".visa-explorer"
            );


        if (explorer) {

            explorer.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });

        }

    }



    /* =====================================================
       40. VIEW BUTTONS
    ===================================================== */

    function initViewButtons() {

        if (gridButton) {

            gridButton.addEventListener(
                "click",
                function () {

                    switchToGrid();

                }
            );

        }


        if (ringButton) {

            ringButton.addEventListener(
                "click",
                function () {

                    switchToRing();

                }
            );

        }

    }



    /* =====================================================
       41. DRAG / SWIPE SYSTEM
    ===================================================== */

    function initDrag() {

        if (!ring) {

            return;

        }



        /* =================================================
           POINTER DOWN
        ================================================= */

        ring.addEventListener(
            "pointerdown",
            function (event) {

                /*
                  Ignore right mouse button.
                */

                if (
                    event.pointerType === "mouse" &&
                    event.button !== 0
                ) {

                    return;

                }


                /*
                  Don't start drag when
                  lightbox is open.
                */

                if (
                    lightboxOpen
                ) {

                    return;

                }


                isDragging =
                    true;


                dragMoved =
                    false;


                dragStartX =
                    event.clientX;


                lastPointerX =
                    event.clientX;


                dragStartRotation =
                    targetRotation;


                velocity =
                    0;


                ring.classList.add(
                    "is-dragging"
                );


                try {

                    ring.setPointerCapture(
                        event.pointerId
                    );

                } catch (error) {}

            }
        );



        /* =================================================
           POINTER MOVE
        ================================================= */

        ring.addEventListener(
            "pointermove",
            function (event) {

                if (!isDragging) {

                    return;

                }


                const delta =
                    event.clientX -
                    dragStartX;


                const movement =
                    event.clientX -
                    lastPointerX;



                /*
                  Detect actual drag
                */

                if (
                    Math.abs(delta) >
                    5
                ) {

                    dragMoved =
                        true;

                }



                /*
                  Rotation
                */

                targetRotation =
                    dragStartRotation +

                    (
                        delta *
                        CONFIG.dragSensitivity
                    );



                /*
                  Velocity
                */

                velocity =
                    movement *
                    0.0009;


                velocity =
                    Math.max(
                        -0.012,
                        Math.min(
                            0.012,
                            velocity
                        )
                    );


                lastPointerX =
                    event.clientX;

            }
        );



        /* =================================================
           END DRAG
        ================================================= */

        function endDrag(event) {

            if (!isDragging) {

                return;

            }


            isDragging =
                false;


            ring.classList.remove(
                "is-dragging"
            );



            velocity =
                Math.max(
                    -0.012,
                    Math.min(
                        0.012,
                        velocity
                    )
                );



            try {

                ring.releasePointerCapture(
                    event.pointerId
                );

            } catch (error) {}



            /*
              Keep dragMoved true long enough
              to prevent accidental click.
            */

            setTimeout(
                function () {

                    dragMoved =
                        false;

                },
                120
            );

        }



        ring.addEventListener(
            "pointerup",
            endDrag
        );


        ring.addEventListener(
            "pointercancel",
            endDrag
        );

    }



    /* =====================================================
       42. RING HOVER PAUSE
    ===================================================== */

    function initRingHover() {

        if (!ring) {

            return;

        }


        ring.addEventListener(
            "mouseenter",
            function () {

                isRingHovered =
                    true;

            }
        );


        ring.addEventListener(
            "mouseleave",
            function () {

                isRingHovered =
                    false;

            }
        );

    }



    /* =====================================================
       43. FILTER BUTTON
    ===================================================== */

    function initFilterButton() {

        if (filterButton) {

            filterButton.addEventListener(
                "click",
                function () {

                    openFilters();

                }
            );

        }


        if (filterClose) {

            filterClose.addEventListener(
                "click",
                function () {

                    closeFilters();

                }
            );

        }


        if (filterOverlay) {

            filterOverlay.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        filterOverlay
                    ) {

                        closeFilters();

                    }

                }
            );

        }

    }



    /* =====================================================
       44. KEYBOARD
    ===================================================== */

    function initKeyboard() {

        document.addEventListener(
            "keydown",
            function (event) {



                /* =========================================
                   ESC → LIGHTBOX FIRST
                ========================================= */

                if (
                    event.key ===
                    "Escape"
                ) {

                    if (
                        lightboxOpen
                    ) {

                        closeVisaLightbox();

                        return;

                    }


                    if (
                        filterOverlay &&
                        !filterOverlay.hasAttribute(
                            "hidden"
                        )
                    ) {

                        closeFilters();

                        return;

                    }


                    return;

                }



                /*
                  Don't control ring when
                  typing/selecting form.
                */

                const tag =
                    document.activeElement
                        ? document.activeElement.tagName
                        : "";


                if (
                    tag === "INPUT" ||
                    tag === "SELECT" ||
                    tag === "TEXTAREA"
                ) {

                    return;

                }



                /* =========================================
                   ARROW RIGHT
                ========================================= */

                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    if (
                        !filteredVisas.length
                    ) {

                        return;

                    }


                    let next =
                        selectedIndex >= 0
                            ? selectedIndex + 1
                            : 0;


                    if (
                        next >=
                        filteredVisas.length
                    ) {

                        next =
                            0;

                    }


                    selectVisa(
                        next
                    );

                }



                /* =========================================
                   ARROW LEFT
                ========================================= */

                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    if (
                        !filteredVisas.length
                    ) {

                        return;

                    }


                    let previous =
                        selectedIndex >= 0
                            ? selectedIndex - 1
                            : filteredVisas.length - 1;


                    if (
                        previous < 0
                    ) {

                        previous =
                            filteredVisas.length - 1;

                    }


                    selectVisa(
                        previous
                    );

                }

            }
        );

    }



    /* =====================================================
       45. CENTER CTA
    ===================================================== */

    function initCenterCTA() {

        if (!centerCTA) {

            return;

        }


        centerCTA.addEventListener(
            "click",
            function (event) {

                const visaId =
                    centerCTA.dataset.visaId;


                if (!visaId) {

                    event.preventDefault();

                    return;

                }



                /*
                  STEP 8:
                  Individual visa page
                  will be connected here.
                */

                event.preventDefault();


                const visa =
                    ALL_VISAS.find(
                        function (item) {

                            return (
                                item.id ===
                                visaId
                            );

                        }
                    );


                if (visa) {

                    console.log(
                        "Visa selected:",
                        visa
                    );

                }

            }
        );

    }



    /* =====================================================
       46. RESIZE
    ===================================================== */

    let resizeTimer =
        null;


    function initResize() {

        window.addEventListener(
            "resize",
            function () {

                clearTimeout(
                    resizeTimer
                );


                resizeTimer =
                    setTimeout(
                        function () {

                            renderRing();

                        },
                        180
                    );

            }
        );

    }



    /* =====================================================
       47. ANIMATION
    ===================================================== */

    function animate(
        currentTime
    ) {

        const delta =
            Math.min(
                currentTime -
                lastTime,
                32
            );


        lastTime =
            currentTime;



        if (
            currentView ===
            "ring"
        ) {



            /* =============================================
               DRAG INERTIA
            ============================================= */

            if (
                !isDragging &&
                Math.abs(
                    velocity
                ) >
                0.00001
            ) {

                targetRotation +=
                    velocity *
                    delta;


                velocity *=
                    CONFIG.inertia;

            }



            /* =============================================
               AUTO ROTATION
               
               IMPORTANT:
               Stops while cursor is over ring.
            ============================================= */

            else if (
                !isDragging &&
                !isRingHovered &&
                hoveredIndex === -1 &&
                selectedIndex === -1
            ) {

                targetRotation +=
                    CONFIG.autoSpeed *
                    delta;

            }

        }



        /*
          Update ring
        */

        updateAllPanels();


        requestAnimationFrame(
            animate
        );

    }



    /* =====================================================
       48. INITIALIZE
    ===================================================== */

    function init() {

        console.log(
            "===================================="
        );


        console.log(
            "CB Visa Services — STEP 7 FINAL"
        );


        console.log(
            "Total services:",
            ALL_VISAS.length
        );


        console.log(
            "3D Ring:",
            "ACTIVE"
        );


        console.log(
            "Hover Center Preview:",
            "ACTIVE"
        );


        console.log(
            "Center Image Lightbox:",
            "ACTIVE"
        );


        console.log(
            "Category Filter:",
            "ACTIVE"
        );


        console.log(
            "Advanced Filter:",
            "ACTIVE"
        );


        console.log(
            "Grid View:",
            "ACTIVE"
        );


        console.log(
            "Auto Rotation:",
            "ACTIVE"
        );


        console.log(
            "===================================="
        );



        /* =================================================
           INITIAL CENTER
        ================================================= */

        resetCenter();



        /* =================================================
           INITIAL RING
        ================================================= */

        renderRing();



        /* =================================================
           INITIAL GRID
        ================================================= */

        renderGrid();



        /* =================================================
           EVENTS
        ================================================= */

        initCategoryButtons();

        initFilterEvents();

        initResetButton();

        initViewButtons();

        initFilterButton();

        initDrag();

        initRingHover();

        initKeyboard();

        initCenterCTA();

        initLightbox();

        initResize();



        /* =================================================
           RESULT COUNT
        ================================================= */

        updateResultCount();



        /* =================================================
           START ANIMATION
        ================================================= */

        requestAnimationFrame(
            animate
        );

    }



    /* =====================================================
       49. START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }


})();

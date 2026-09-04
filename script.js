/* =========================================================
   CB VISA SERVICES
   FINAL 3D RING SYSTEM
   STEP 1 / 3

   IMPORTANT:
   Paste STEP 1, then STEP 2, then STEP 3
   into the SAME script.js file.
========================================================= */

(function () {

"use strict";


/* =========================================================
   1. DATA
========================================================= */

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
                visa.priceRange || ""
            ).trim(),

        processingTime:
            String(
                visa.processingTime || ""
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


/* =========================================================
   2. DOM
========================================================= */

const ring =
    document.getElementById("ring");

const ringTrack =
    document.getElementById("ring-track");


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


/* =========================================================
   LIGHTBOX
========================================================= */

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


/* =========================================================
   FILTER
========================================================= */

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


/* =========================================================
   GRID
========================================================= */

const gridView =
    document.getElementById("grid-view");

const gridContainer =
    document.getElementById("grid-container");

const ringButton =
    document.getElementById("ring-button");


/* =========================================================
   3. CONFIGURATION
========================================================= */

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


    /*
      AUTO ROTATION
    */

    autoSpeed:
        0.000035,


    /*
      MUCH LOWER DRAG SENSITIVITY
    */

    dragSensitivity:
        0.00075,


    /*
      CONTROLLED INERTIA
    */

    inertia:
        0.94,


    /*
      SMOOTHING
    */

    ease:
        0.075,


    /*
      DEPTH
    */

    minScale:
        0.48,

    maxScale:
        1.10,


    /*
      BLUR
    */

    maxBlur:
        0.8,


    /*
      FRONT
    */

    frontAngle:
        Math.PI / 2

};


/* =========================================================
   4. STATE
========================================================= */

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


/*
  IMPORTANT:

  rotation = actual visual rotation

  targetRotation = destination rotation
*/

let rotation =
    0;

let targetRotation =
    0;


/*
  DRAG
*/

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


/*
  VIEW
*/

let currentView =
    "ring";


let lastTime =
    performance.now();


/*
  ACTIVE CENTER VISA
*/

let activeVisa =
    null;


/*
  HOVER
*/

let isRingHovered =
    false;


/*
  LIGHTBOX
*/

let lightboxOpen =
    false;


/* =========================================================
   5. FALLBACK IMAGE
========================================================= */

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


/* =========================================================
   6. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value || "")

        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   7. DEVICE CONFIG
========================================================= */

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


/* =========================================================
   8. CATEGORY
========================================================= */

function formatCategory(category) {

    if (!category) {
        return "";
    }


    return category

        .replace(/[-_]/g, " ")

        .replace(
            /\b\w/g,
            function (letter) {
                return letter.toUpperCase();
            }
        );

}


/* =========================================================
   9. IMAGE
========================================================= */

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


/* =========================================================
   10. UPDATE CENTER
========================================================= */

function updateCenter(visa) {

    if (!visa) {
        return;
    }


    activeVisa =
        visa;


    /*
      TITLE
    */

    if (centerTitle) {

        centerTitle.textContent =
            visa.title;

    }


    /*
      IMAGE
    */

    if (centerImage) {

        const imageSource =
            getVisaImage(visa);


        centerImage.style.opacity =
            "0.2";


        const preload =
            new Image();


        preload.onload =
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


        preload.onerror =
            function () {

                centerImage.src =
                    fallbackImage();

                centerImage.alt =
                    "CB Visa Services";

                centerImage.style.opacity =
                    "1";

            };


        preload.src =
            imageSource;

    }


    /*
      CENTER PREVIEW ENABLE
    */

    if (centerPreview) {

        centerPreview.removeAttribute(
            "disabled"
        );


        centerPreview.setAttribute(
            "aria-label",
            `Open ${visa.title} image`
        );

    }


    /*
      CATEGORY
    */

    if (centerCategory) {

        centerCategory.textContent =
            formatCategory(
                visa.category
            );

    }


    /*
      COUNTRY
    */

    if (centerLocation) {

        centerLocation.textContent =
            visa.country ||
            visa.location ||
            "";

    }


    /*
      CTA
    */

    if (centerCTA) {

        centerCTA.dataset.visaId =
            visa.id;


        centerCTA.removeAttribute(
            "hidden"
        );

    }

}


/* =========================================================
   11. RESET CENTER
========================================================= */

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


/* =========================================================
   12. CREATE PANEL
========================================================= */

function createPanel(
    visa,
    index
) {

    const button =
        document.createElement("button");


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


    /*
      IMAGE
    */

    const image =
        document.createElement("img");


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


    /*
      TEXT
    */

    const content =
        document.createElement("span");


    content.className =
        "ring-panel-content";


    content.innerHTML = `

        <span class="ring-panel-title">
            ${escapeHTML(visa.title)}
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
        content
    );


    /*
      ======================================================
      HOVER

      IMPORTANT:

      Hover DOES NOT rotate the ring.

      It ONLY changes center information.
      ======================================================
    */

    button.addEventListener(
        "mouseenter",
        function () {

            if (
                isDragging ||
                lightboxOpen
            ) {
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
              CENTER ONLY
            */

            updateCenter(
                visa
            );

        }
    );


    /*
      ======================================================
      FOCUS

      Keyboard focus also does NOT rotate ring.
      ======================================================
    */

    button.addEventListener(
        "focus",
        function () {

            if (
                isDragging ||
                lightboxOpen
            ) {
                return;
            }


            hoveredIndex =
                index;


            updateCenter(
                visa
            );

        }
    );


    /*
      ======================================================
      MOUSE LEAVE
      ======================================================
    */

    button.addEventListener(
        "mouseleave",
        function () {

            button.classList.remove(
                "is-hovered"
            );


            if (!isDragging) {

                hoveredIndex =
                    -1;

            }

        }
    );


    /*
      ======================================================
      CLICK

      ONLY CLICK ROTATES TO FRONT.
      ======================================================
    */

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


    /*
      KEYBOARD
    */

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


/* =========================================================
   13. RENDER RING
========================================================= */

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
        selectedIndex < panels.length
    ) {

        updateCenter(
            filteredVisas[selectedIndex]
        );


        panels[selectedIndex]
            .classList.add(
                "is-selected"
            );

    }

}


/* =========================================================
   14. CALCULATE ELLIPTICAL POSITION
========================================================= */

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


    /*
      ELLIPSE
    */

    const x =
        Math.cos(angle) *
        config.radiusX;


    const y =
        Math.sin(angle) *
        config.radiusY;


    /*
      DEPTH
    */

    const depth =
        Math.sin(angle);


    const normalized =
        (depth + 1) / 2;


    /*
      SCALE
    */

    const scale =
        CONFIG.minScale +

        (
            CONFIG.maxScale -
            CONFIG.minScale
        ) *
        normalized;


    /*
      OPACITY
    */

    const opacity =
        0.18 +
        0.82 *
        normalized;


    /*
      BLUR
    */

    const blur =
        CONFIG.maxBlur *
        (1 - normalized);


    /*
      3D ROTATION
    */

    const rotateY =
        Math.cos(angle) *
        -18;


    const rotateZ =
        Math.cos(angle) *
        1.5;


    /*
      Z DEPTH
    */

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


/* =========================================================
   15. UPDATE PANEL
========================================================= */

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
        `${position.z}px)` +

        ` rotateY(` +
        `${position.rotateY}deg)` +

        ` rotateZ(` +
        `${position.rotateZ}deg)` +

        ` scale(` +
        `${position.scale})`;


    panel.style.opacity =
        position.opacity;


    /*
      BLUR
    */

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


    /*
      Z INDEX
    */

    panel.style.zIndex =
        Math.round(
            1000 +
            position.z
        );


    /*
      FRONT
    */

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


/* =========================================================
   16. UPDATE ALL PANELS
========================================================= */

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
                Math.sin(difference),
                Math.cos(difference)
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


/* =========================================================
   END OF STEP 1
========================================================= */


/* =========================================================
   STEP 2 STARTS BELOW
========================================================= */
 /* =========================================================
   17. FOCUS VISA
========================================================= */

function focusVisa(
    index,
    lockSelection
) {

    if (
        !filteredVisas[index] ||
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


    const shortest =
        Math.atan2(
            Math.sin(difference),
            Math.cos(difference)
        );


    targetRotation =
        rotation +
        shortest;


    /*
      LOCK
    */

    if (lockSelection) {

        selectedIndex =
            index;

    }


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


/* =========================================================
   18. SELECT VISA
========================================================= */

function selectVisa(index) {

    if (
        !filteredVisas[index] ||
        !panels[index]
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
      ROTATE FRONT
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


/* =========================================================
   19. LIGHTBOX OPEN
========================================================= */

function openVisaLightbox(visa) {

    if (
        !visa ||
        !lightbox
    ) {
        return;
    }


    const imageSource =
        getVisaImage(visa);


    if (lightboxImage) {

        lightboxImage.src =
            imageSource;


        lightboxImage.alt =
            `${visa.title} — ${visa.country || visa.location}`;

    }


    if (lightboxCategory) {

        lightboxCategory.textContent =
            formatCategory(
                visa.category
            );

    }


    if (lightboxTitle) {

        lightboxTitle.textContent =
            visa.title;

    }


    if (lightboxLocation) {

        lightboxLocation.textContent =
            visa.country ||
            visa.location ||
            "";

    }


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


    if (lightboxClose) {

        requestAnimationFrame(
            function () {

                lightboxClose.focus();

            }
        );

    }

}


/* =========================================================
   20. LIGHTBOX CLOSE
========================================================= */

function closeVisaLightbox() {

    if (!lightbox) {
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

}


/* =========================================================
   21. LIGHTBOX EVENTS
========================================================= */

function initLightbox() {

    /*
      CENTER IMAGE
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
      CLOSE
    */

    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            closeVisaLightbox
        );

    }


    /*
      BACKDROP
    */

    if (lightboxBackdrop) {

        lightboxBackdrop.addEventListener(
            "click",
            closeVisaLightbox
        );

    }


    /*
      OUTER LIGHTBOX
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


/* =========================================================
   22. PROCESSING TIME
========================================================= */

function getProcessingRange(
    value
) {

    if (!value) {
        return null;
    }


    const normalized =
        String(value)
            .toLowerCase()
            .replace(/–/g, "-")
            .replace(/—/g, "-");


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
        numbers.map(Number);


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


    if (
        selected === "fast"
    ) {

        return (
            range.max <= 7
        );

    }


    if (
        selected === "standard"
    ) {

        return (
            range.min >= 7 &&
            range.min < 15
        );

    }


    if (
        selected === "extended"
    ) {

        return (
            range.min >= 15
        );

    }


    return true;

}


/* =========================================================
   23. PRICE
========================================================= */

function getMaximumPrice(
    priceRange
) {

    if (!priceRange) {
        return 0;
    }


    const text =
        String(priceRange)
            .replace(/\$/g, "")
            .replace(/,/g, "");


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
        numbers.map(Number)
    );

}


/* =========================================================
   24. BUDGET
========================================================= */

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


    if (
        selected === "low"
    ) {

        return maximum <= 500;

    }


    if (
        selected === "medium"
    ) {

        return (
            maximum >= 500 &&
            maximum <= 1000
        );

    }


    if (
        selected === "premium" ||
        selected === "high"
    ) {

        return maximum >= 1000;

    }


    return true;

}


/* =========================================================
   25. STATUS
========================================================= */

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


    if (
        selected === "popular"
    ) {

        return (
            visa.featured === true ||
            visa.availability === "high"
        );

    }


    if (
        selected === "new"
    ) {

        return (
            visa.isNew === true ||
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


/* =========================================================
   26. SERVICE TYPE
========================================================= */

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


    if (
        category ===
        selectedCategory
    ) {
        return true;
    }


    if (
        selectedCategory === "visit"
    ) {

        return (
            category === "visit-visa"
        );

    }


    if (
        selectedCategory === "business"
    ) {

        return (
            category === "business-visa"
        );

    }


    if (
        selectedCategory === "work"
    ) {

        return (
            category === "work-visa"
        );

    }


    if (
        selectedCategory === "invitation"
    ) {

        return category.includes(
            "invitation"
        );

    }


    if (
        selectedCategory === "permit"
    ) {

        return (
            category === "work-permit"
        );

    }


    if (
        selectedCategory === "passport"
    ) {

        return (
            category === "passport"
        );

    }


    if (
        selectedCategory === "residency"
    ) {

        return (
            category === "residency"
        );

    }


    if (
        selectedCategory === "nationality"
    ) {

        return (
            category === "nationality"
        );

    }


    return false;

}


/* =========================================================
   27. APPLY FILTERS
========================================================= */

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


/* =========================================================
   28. CATEGORY FILTER
========================================================= */

function filterByCategory(
    category
) {

    if (!category) {
        return;
    }


    const normalized =
        category
            .toLowerCase()
            .trim();


    if (serviceType) {

        const exists =
            Array.from(
                serviceType.options
            ).some(
                function (option) {

                    return (
                        option.value
                            .toLowerCase() ===
                        normalized
                    );

                }
            );


        if (exists) {

            serviceType.value =
                normalized;

        }

    }


    if (processingTime) {
        processingTime.value = "all";
    }

    if (budget) {
        budget.value = "all";
    }

    if (status) {
        status.value = "all";
    }


    filteredVisas =
        ALL_VISAS.filter(
            function (visa) {

                return (
                    visa.category
                        .toLowerCase()
                        .trim() ===
                    normalized
                );

            }
        );


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


    updateCategoryButtonState(
        normalized
    );


    renderRing();

    renderGrid();

    updateResultCount();


    const explorer =
        document.querySelector(
            ".visa-explorer"
        );


    if (explorer) {

        explorer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   29. CATEGORY BUTTON STATE
========================================================= */

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


/* =========================================================
   30. CATEGORY BUTTONS
========================================================= */

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


                    if (category) {

                        filterByCategory(
                            category
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   END OF STEP 2
========================================================= */


/* =========================================================
   STEP 3 STARTS BELOW
========================================================= */
 /* =========================================================
   31. GRID RENDER
========================================================= */

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
            !Number.isNaN(number)
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
        .slice(0, limit)
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
                                    getVisaImage(visa)
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


                            /*
                              CENTER
                            */

                            updateCenter(
                                visa
                            );


                            /*
                              Switch ring
                            */

                            switchToRing();


                            /*
                              Only rotate if
                              panel exists.
                            */

                            requestAnimationFrame(
                                function () {

                                    if (
                                        panels[index]
                                    ) {

                                        selectVisa(
                                            index
                                        );

                                    } else {

                                        /*
                                          Keep center
                                          information
                                          active.
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


/* =========================================================
   32. RESULT COUNT
========================================================= */

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


/* =========================================================
   33. OPEN FILTER
========================================================= */

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


/* =========================================================
   34. CLOSE FILTER
========================================================= */

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


/* =========================================================
   35. RESET FILTERS
========================================================= */

function resetFilters() {

    if (serviceType) {
        serviceType.value = "all";
    }

    if (processingTime) {
        processingTime.value = "all";
    }

    if (budget) {
        budget.value = "all";
    }

    if (status) {
        status.value = "all";
    }

    if (visaCount) {
        visaCount.value = "60";
    }


    updateCategoryButtonState("");


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


/* =========================================================
   36. RESET BUTTON
========================================================= */

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


/* =========================================================
   37. FILTER EVENTS
========================================================= */

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


/* =========================================================
   38. GRID VIEW
========================================================= */

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


/* =========================================================
   39. RING VIEW
========================================================= */

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


/* =========================================================
   40. VIEW BUTTONS
========================================================= */

function initViewButtons() {

    if (gridButton) {

        gridButton.addEventListener(
            "click",
            switchToGrid
        );

    }


    if (ringButton) {

        ringButton.addEventListener(
            "click",
            switchToRing
        );

    }

}


/* =========================================================
   41. DRAG / SWIPE
   SLOW + CONTROLLED
========================================================= */

function initDrag() {

    if (!ring) {
        return;
    }


    /*
      POINTER DOWN
    */

    ring.addEventListener(
        "pointerdown",
        function (event) {

            if (
                event.pointerType === "mouse" &&
                event.button !== 0
            ) {
                return;
            }


            if (lightboxOpen) {
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


    /*
      POINTER MOVE
    */

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
              DRAG DETECTION
            */

            if (
                Math.abs(delta) >
                5
            ) {

                dragMoved =
                    true;

            }


            /*
              SLOW ROTATION

              IMPORTANT:

              0.00075 is intentionally
              very low.
            */

            targetRotation =

                dragStartRotation +

                (
                    delta *
                    CONFIG.dragSensitivity
                );


            /*
              CONTROLLED VELOCITY
            */

            velocity =
                movement *
                0.00025;


            velocity =
                Math.max(
                    -0.004,
                    Math.min(
                        0.004,
                        velocity
                    )
                );


            lastPointerX =
                event.clientX;

        }
    );


    /*
      END DRAG
    */

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
                -0.004,
                Math.min(
                    0.004,
                    velocity
                )
            );


        try {

            ring.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {}


        /*
          Prevent accidental click
        */

        setTimeout(
            function () {

                dragMoved =
                    false;

            },
            140
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


/* =========================================================
   42. RING HOVER
========================================================= */

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

            hoveredIndex =
                -1;


            panels.forEach(
                function (panel) {

                    panel.classList.remove(
                        "is-hovered"
                    );

                }
            );

        }
    );

}


/* =========================================================
   43. FILTER BUTTON
========================================================= */

function initFilterButton() {

    if (filterButton) {

        filterButton.addEventListener(
            "click",
            openFilters
        );

    }


    if (filterClose) {

        filterClose.addEventListener(
            "click",
            closeFilters
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


/* =========================================================
   44. KEYBOARD
========================================================= */

function initKeyboard() {

    document.addEventListener(
        "keydown",
        function (event) {

            /*
              ESC
            */

            if (
                event.key ===
                "Escape"
            ) {

                if (lightboxOpen) {

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

            }


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


            /*
              RIGHT
            */

            if (
                event.key ===
                "ArrowRight"
            ) {

                if (!filteredVisas.length) {
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


            /*
              LEFT
            */

            if (
                event.key ===
                "ArrowLeft"
            ) {

                if (!filteredVisas.length) {
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


/* =========================================================
   45. CENTER CTA
========================================================= */

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
              can be connected here.
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


/* =========================================================
   46. RESIZE
========================================================= */

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


/* =========================================================
   47. ANIMATION
========================================================= */

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


        /*
          ===============================================
          DRAG INERTIA
          ===============================================
        */

        if (
            !isDragging &&
            Math.abs(velocity) >
            0.00001
        ) {

            targetRotation +=
                velocity *
                delta;


            velocity *=
                CONFIG.inertia;

        }


        /*
          ===============================================
          AUTO ROTATION

          It stops when:
          - dragging
          - hovering
          - selected
        ===============================================
        */

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
      SMOOTH RENDER
    */

    updateAllPanels();


    requestAnimationFrame(
        animate
    );

}


/* =========================================================
   48. INITIALIZE
========================================================= */

function init() {

    console.log(
        "===================================="
    );

    console.log(
        "CB VISA SERVICES — FINAL SYSTEM"
    );

    console.log(
        "Total services:",
        ALL_VISAS.length
    );

    console.log(
        "3D Elliptical Ring: ACTIVE"
    );

    console.log(
        "Smooth Hover Preview: ACTIVE"
    );

    console.log(
        "Controlled Mouse Drag: ACTIVE"
    );

    console.log(
        "Center Lightbox: ACTIVE"
    );

    console.log(
        "Filters: ACTIVE"
    );

    console.log(
        "Grid: ACTIVE"
    );

    console.log(
        "===================================="
    );


    /*
      CENTER
    */

    resetCenter();


    /*
      RING
    */

    renderRing();


    /*
      GRID
    */

    renderGrid();


    /*
      EVENTS
    */

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


    /*
      COUNT
    */

    updateResultCount();


    /*
      START
    */

    requestAnimationFrame(
        animate
    );

}


/* =========================================================
   49. START APPLICATION
========================================================= */

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

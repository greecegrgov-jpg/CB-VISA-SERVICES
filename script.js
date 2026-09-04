/* =========================================================
   CB VISA SERVICES
   STEP 7 — FINAL RING + FILTER + CATEGORY + GRID SYSTEM

   Features:
   - 3D elliptical visa ring
   - Hover → center detail image
   - Hover → center title/category/country
   - Click → lock selected service
   - Smooth automatic rotation
   - Drag / swipe
   - Category filtering
   - Advanced filters
   - Grid view
   - Grid → Ring selection
   - Static / Vanilla JS
   - No Backend
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


    /* -----------------------------------------------------
       CENTER
    ----------------------------------------------------- */

    const centerTitle =
        document.getElementById("center-title");


    const centerImage =
        document.getElementById("center-image");


    const centerCategory =
        document.getElementById("center-category");


    const centerLocation =
        document.getElementById("center-location");


    const centerCTA =
        document.getElementById("center-cta");



    /* -----------------------------------------------------
       FILTER
    ----------------------------------------------------- */

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



    /* -----------------------------------------------------
       FILTER FIELDS
    ----------------------------------------------------- */

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



    /* -----------------------------------------------------
       GRID
    ----------------------------------------------------- */

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


        /* -----------------------------------------------
           Automatic rotation
        ----------------------------------------------- */

        autoSpeed:
            0.000045,


        /* -----------------------------------------------
           Drag sensitivity
        ----------------------------------------------- */

        dragSensitivity:
            0.0025,


        /* -----------------------------------------------
           Inertia
        ----------------------------------------------- */

        inertia:
            0.90,


        /* -----------------------------------------------
           Smooth movement
        ----------------------------------------------- */

        ease:
            0.085,


        /* -----------------------------------------------
           Depth
        ----------------------------------------------- */

        minScale:
            0.48,


        maxScale:
            1.10,


        /* -----------------------------------------------
           Blur
        ----------------------------------------------- */

        maxBlur:
            0.8,


        /* -----------------------------------------------
           Front of ellipse
        ----------------------------------------------- */

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



    /* =====================================================
       5. FALLBACK IMAGE
    ===================================================== */

    function fallbackImage() {

        return (

            "data:image/svg+xml;charset=UTF-8," +

            encodeURIComponent(`

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="800"
                    height="500"
                    viewBox="0 0 800 500"
                >

                    <rect
                        width="800"
                        height="500"
                        fill="#e9e7e2"
                    />

                    <text
                        x="400"
                        y="250"
                        text-anchor="middle"
                        dominant-baseline="middle"
                        fill="#8B0000"
                        font-family="Arial"
                        font-size="34"
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
       9. UPDATE CENTER
    ===================================================== */

    function updateCenter(visa) {

        if (!visa) {

            return;

        }


        activeVisa =
            visa;


        /* -----------------------------------------------
           TITLE
        ----------------------------------------------- */

        if (centerTitle) {

            centerTitle.textContent =
                visa.title;

        }


        /* -----------------------------------------------
           IMAGE
        ----------------------------------------------- */

        if (centerImage) {

            const imageSource =
                visa.image ||
                visa.thumbnail ||
                fallbackImage();


            /*
              Fade image slightly before changing source
              for a smoother visual transition.
            */

            centerImage.style.opacity =
                "0.15";


            const newImage =
                new Image();


            newImage.onload =
                function () {

                    centerImage.src =
                        imageSource;


                    centerImage.alt =
                        `${visa.title} — ${visa.country}`;


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


        /* -----------------------------------------------
           CATEGORY
        ----------------------------------------------- */

        if (centerCategory) {

            centerCategory.textContent =
                formatCategory(
                    visa.category
                );

        }


        /* -----------------------------------------------
           COUNTRY
        ----------------------------------------------- */

        if (centerLocation) {

            centerLocation.textContent =
                visa.country ||
                visa.location ||
                "";

        }


        /* -----------------------------------------------
           CENTER CTA
        ----------------------------------------------- */

        if (centerCTA) {

            centerCTA.dataset.visaId =
                visa.id;


            /*
              STEP 8 will connect this
              to the real service page.
            */

            centerCTA.removeAttribute(
                "hidden"
            );

        }

    }



    /* =====================================================
       10. RESET CENTER
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
       11. CREATE RING PANEL
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


        /* -----------------------------------------------
           IMAGE
        ----------------------------------------------- */

        const image =
            document.createElement(
                "img"
            );


        image.src =
            visa.image ||
            visa.thumbnail ||
            fallbackImage();


        image.alt =
            `${visa.title} — ${visa.country}`;


        image.loading =
            "lazy";


        image.decoding =
            "async";


        image.onerror =
            function () {

                this.src =
                    fallbackImage();

            };


        /* -----------------------------------------------
           ACCESSIBLE TEXT
        ----------------------------------------------- */

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


                /*
                  Remove hover from
                  all other panels.
                */

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
                  CENTER DETAIL
                */

                updateCenter(
                    visa
                );


                /*
                  Move hovered service
                  to front-center.
                */

                focusVisa(
                    index,
                    false
                );

            }
        );



        /* =================================================
           FOCUS
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

                /*
                  IMPORTANT:
                  We DO NOT reset the center here.

                  This allows the selected service
                  to remain visible until another
                  service is hovered or clicked.
                */

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
       12. RENDER RING
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
          If a service was selected,
          show it again after re-render.
        */

        if (
            selectedIndex >= 0 &&
            filteredVisas[selectedIndex]
        ) {

            updateCenter(
                filteredVisas[selectedIndex]
            );

        }

    }



    /* =====================================================
       13. CALCULATE RING POSITION
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


        /*
          Elliptical orbit
        */

        const x =
            Math.cos(angle) *
            config.radiusX;


        const y =
            Math.sin(angle) *
            config.radiusY;


        /*
          Front / back depth
        */

        const depth =
            Math.sin(angle);


        const normalized =
            (depth + 1) / 2;


        /*
          Scale
        */

        const scale =
            CONFIG.minScale +

            (
                CONFIG.maxScale -
                CONFIG.minScale
            ) *
            normalized;


        /*
          Opacity
        */

        const opacity =
            0.18 +
            0.82 *
            normalized;


        /*
          Blur
        */

        const blur =
            CONFIG.maxBlur *
            (1 - normalized);


        /*
          3D rotation
        */

        const rotateY =
            Math.cos(angle) *
            -18;


        const rotateZ =
            Math.cos(angle) *
            1.5;


        /*
          Z-depth
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



    /* =====================================================
       14. UPDATE PANEL
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


        /*
          Light blur only
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
          Z-index
        */

        panel.style.zIndex =
            Math.round(
                1000 +
                position.z
            );


        /*
          Front class
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



    /* =====================================================
       15. UPDATE ALL PANELS
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
              Shortest path
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
       16. FOCUS VISA
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
          Desired position:
          FRONT CENTER
        */

        const difference =
            CONFIG.frontAngle -
            currentAngle;


        /*
          Shortest rotation
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
          Selected state only
          when requested.
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



    /* =====================================================
       17. SELECT VISA
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
          Show service details
        */

        updateCenter(
            visa
        );


        /*
          Move service to front
        */

        focusVisa(
            index,
            true
        );


        /*
          Remove selection from others
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
       18. PROCESSING TIME FILTER
    ===================================================== */

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


        const value =
            visa.processingTime
                .toLowerCase()
                .replace(
                    /–/g,
                    "-"
                );


        /*
          EXPRESS
          3–5
          5–7
        */

        if (
            selected === "fast"
        ) {

            return (

                value.includes(
                    "3-5"
                )

                ||

                value.includes(
                    "5-7"
                )

            );

        }


        /*
          STANDARD
          7–10
          10–15
        */

        if (
            selected === "standard"
        ) {

            return (

                value.includes(
                    "7-10"
                )

                ||

                value.includes(
                    "10-15"
                )

            );

        }


        /*
          EXTENDED
          15–20
          20–30
        */

        if (
            selected === "extended"
        ) {

            return (

                value.includes(
                    "15-20"
                )

                ||

                value.includes(
                    "20-30"
                )

            );

        }


        return true;

    }



    /* =====================================================
       19. EXTRACT PRICE
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
       20. BUDGET FILTER
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


        /*
          LOW
          Up to $500
        */

        if (
            selected === "low"
        ) {

            return (
                maximum > 0 &&
                maximum <= 500
            );

        }


        /*
          MEDIUM
          $500 – $1,000
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
       21. STATUS FILTER
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

            visa.status
                .toLowerCase() ===
            selected
                .toLowerCase()

        );

    }



    /* =====================================================
       22. SERVICE TYPE FILTER
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
            visa.category
                .toLowerCase()
                .trim();


        const selectedCategory =
            selected
                .toLowerCase()
                .trim();


        /*
          Exact match
        */

        if (
            category ===
            selectedCategory
        ) {

            return true;

        }


        /*
          Grouped filters
        */

        if (
            selectedCategory === "visit"
        ) {

            return (
                category ===
                "visit-visa"
            );

        }


        if (
            selectedCategory === "business"
        ) {

            return (
                category ===
                "business-visa"
            );

        }


        if (
            selectedCategory === "work"
        ) {

            return (
                category ===
                "work-visa"
            );

        }


        if (
            selectedCategory === "invitation"
        ) {

            return (
                category.includes(
                    "invitation"
                )
            );

        }


        if (
            selectedCategory === "permit"
        ) {

            return (
                category ===
                "work-permit"
            );

        }


        if (
            selectedCategory === "passport"
        ) {

            return (
                category ===
                "passport"
            );

        }


        if (
            selectedCategory === "residency"
        ) {

            return (
                category ===
                "residency"
            );

        }


        if (
            selectedCategory === "nationality"
        ) {

            return (
                category ===
                "nationality"
            );

        }


        return false;

    }



    /* =====================================================
       23. APPLY FILTERS
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


        selectedIndex =
            -1;


        hoveredIndex =
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


        /*
          If no filter result
        */

        if (
            !filteredVisas.length
        ) {

            resetCenter();

        }

    }



    /* =====================================================
       24. CATEGORY FILTER
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
          Update service type select
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


        selectedIndex =
            -1;


        hoveredIndex =
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


        /*
          Explorer position
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
       25. CATEGORY BUTTONS
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
       26. GRID RENDER
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
          Number of services
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
                                        visa.image ||
                                        visa.thumbnail ||
                                        fallbackImage()
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


                                updateCenter(
                                    visa
                                );


                                switchToRing();


                                requestAnimationFrame(
                                    function () {

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
       27. RESULT COUNT
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
       28. OPEN FILTER
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
       29. CLOSE FILTER
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
       30. RESET FILTERS
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


        filteredVisas =
            [...ALL_VISAS];


        selectedIndex =
            -1;


        hoveredIndex =
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
       31. RESET BUTTON
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
       32. FILTER EVENTS
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

                        applyFilters();

                    }
                );

            }
        );

    }



    /* =====================================================
       33. GRID VIEW
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
       34. RING VIEW
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
       35. VIEW BUTTONS
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
       36. DRAG / SWIPE SYSTEM
    ===================================================== */

    function initDrag() {

        if (!ring) {

            return;

        }


        ring.addEventListener(
            "pointerdown",
            function (event) {

                if (
                    event.pointerType === "mouse" &&
                    event.button !== 0
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


                if (
                    Math.abs(delta) >
                    4
                ) {

                    dragMoved =
                        true;

                }


                targetRotation =
                    dragStartRotation +

                    (
                        delta *
                        CONFIG.dragSensitivity
                    );


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
              Reset drag flag shortly after
              pointer release so click does
              not accidentally select.
            */

            setTimeout(
                function () {

                    dragMoved =
                        false;

                },
                80
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
       37. FILTER BUTTON
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
       38. KEYBOARD
    ===================================================== */

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

                    closeFilters();


                    selectedIndex =
                        -1;


                    hoveredIndex =
                        -1;


                    panels.forEach(
                        function (
                            panel
                        ) {

                            panel.classList.remove(
                                "is-selected"
                            );


                            panel.classList.remove(
                                "is-hovered"
                            );

                        }
                    );


                    resetCenter();


                    return;

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
                  Arrow Right
                */

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
                        selectedIndex +
                        1;


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
                  Arrow Left
                */

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
                        selectedIndex -
                        1;


                    if (
                        previous < 0
                    ) {

                        previous =
                            filteredVisas.length -
                            1;

                    }


                    selectVisa(
                        previous
                    );

                }

            }
        );

    }



    /* =====================================================
       39. CENTER CTA
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
                  This button will later
                  open the individual visa
                  detail page.

                  For now prevent empty #
                  navigation.
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
       40. RESIZE
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
       41. ANIMATION
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
            ============================================= */

            else if (
                !isDragging
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
       42. INITIALIZE
    ===================================================== */

    function init() {

        console.log(
            "===================================="
        );


        console.log(
            "CB Visa Services — STEP 7"
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


        /*
          Initial center
        */

        resetCenter();


        /*
          Initial ring
        */

        renderRing();


        /*
          Initial grid
        */

        renderGrid();


        /*
          Events
        */

        initCategoryButtons();

        initFilterEvents();

        initResetButton();

        initViewButtons();

        initFilterButton();

        initDrag();

        initKeyboard();

        initCenterCTA();

        initResize();


        /*
          Count
        */

        updateResultCount();


        /*
          Start animation
        */

        requestAnimationFrame(
            animate
        );

    }



    /* =====================================================
       43. START
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

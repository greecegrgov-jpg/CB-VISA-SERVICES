/* =========================================================
   CB VISA SERVICES
   STEP 7 — FINAL RING + FILTER + CATEGORY + GRID SYSTEM
   Hover Focus + Header Details + Smooth Interaction
   Static / Vanilla JS / No Backend
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



    /* =========================================================
       2. DOM ELEMENTS
    ========================================================= */

    const ring =
        document.getElementById("ring");

    const ringTrack =
        document.getElementById("ring-track");


    /* Old center elements
       kept for compatibility */

    const centerTitle =
        document.getElementById("center-title");

    const centerDescription =
        document.getElementById("center-description");

    const centerImage =
        document.getElementById("center-image");

    const centerCategory =
        document.getElementById("center-category");

    const centerLocation =
        document.getElementById("center-location");

    const centerCTA =
        document.getElementById("center-cta");


    /* Header service information */

    const headerServiceInfo =
        document.getElementById(
            "header-service-info"
        );

    const headerServiceCategory =
        document.getElementById(
            "header-service-category"
        );

    const headerServiceTitle =
        document.getElementById(
            "header-service-title"
        );

    const headerServiceLocation =
        document.getElementById(
            "header-service-location"
        );


    /* Filter */

    const filterButton =
        document.getElementById(
            "filter-button"
        );

    const gridButton =
        document.getElementById(
            "grid-button"
        );

    const filterOverlay =
        document.getElementById(
            "filter-overlay"
        );

    const filterClose =
        document.getElementById(
            "filter-close"
        );


    /* Filter fields */

    const serviceType =
        document.getElementById(
            "service-type"
        );

    const processingTime =
        document.getElementById(
            "processing-time"
        );

    const budget =
        document.getElementById(
            "budget"
        );

    const status =
        document.getElementById(
            "status"
        );

    const visaCount =
        document.getElementById(
            "visa-count"
        );


    /* Grid */

    const gridView =
        document.getElementById(
            "grid-view"
        );

    const gridContainer =
        document.getElementById(
            "grid-container"
        );

    const ringButton =
        document.getElementById(
            "ring-button"
        );



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


        /* Smooth automatic movement */

        autoSpeed:
            0.000045,


        /* Drag */

        dragSensitivity:
            0.0025,


        /* Inertia */

        inertia:
            0.90,


        /* Smooth positioning */

        ease:
            0.085,


        /* Depth */

        minScale:
            0.48,

        maxScale:
            1.10,


        /* Blur */

        maxBlur:
            0.8,


        /* Front position */

        frontAngle:
            Math.PI / 2

    };



    /* =========================================================
       4. STATE
    ========================================================= */

    let filteredVisas =
        [...ALL_VISAS];


    let panels = [];


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


    let lastDragX =
        0;


    let velocity =
        0;


    let currentView =
        "ring";


    let lastTime =
        performance.now();


    /*
      Prevents hover events from fighting
      with each other while ring is moving.
    */

    let lastFocusedIndex =
        -1;



    /* =========================================================
       5. FALLBACK IMAGE
    ========================================================= */

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



    /* =========================================================
       6. ESCAPE HTML
    ========================================================= */

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
       8. CATEGORY FORMAT
    ========================================================= */

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



    /* =========================================================
       9. UPDATE HEADER SERVICE
    ========================================================= */

    function updateHeaderService(visa) {

        if (!visa) {

            return;

        }


        if (headerServiceInfo) {

            headerServiceInfo.classList.add(
                "has-service"
            );

        }


        if (headerServiceCategory) {

            headerServiceCategory.textContent =
                formatCategory(
                    visa.category
                );

        }


        if (headerServiceTitle) {

            headerServiceTitle.textContent =
                visa.title;

        }


        if (headerServiceLocation) {

            headerServiceLocation.textContent =
                visa.country ||
                visa.location ||
                "";

        }

    }



    /* =========================================================
       10. RESET HEADER SERVICE
    ========================================================= */

    function resetHeaderService() {

        if (headerServiceInfo) {

            headerServiceInfo.classList.remove(
                "has-service"
            );

        }


        if (headerServiceCategory) {

            headerServiceCategory.textContent =
                "VISA SERVICES";

        }


        if (headerServiceTitle) {

            headerServiceTitle.textContent =
                "Explore Visa Services";

        }


        if (headerServiceLocation) {

            headerServiceLocation.textContent =
                `${ALL_VISAS.length} Services`;

        }

    }



    /* =========================================================
       11. CREATE RING PANEL
    ========================================================= */

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


        const image =
            document.createElement(
                "img"
            );


        image.src =
            visa.image ||
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


        /*
          Panel content exists for accessibility,
          but CSS hides it visually.
        */

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



        /* =====================================================
           HOVER
        ====================================================== */

        button.addEventListener(
            "mouseenter",
            function () {

                if (isDragging) {

                    return;

                }


                hoveredIndex =
                    index;


                button.classList.add(
                    "is-hovered"
                );


                /*
                  Show details in HEADER
                */

                updateHeaderService(
                    visa
                );


                /*
                  Move this picture
                  to front center
                */

                focusVisa(
                    index
                );

            }
        );



        /* =====================================================
           MOUSE LEAVE
        ====================================================== */

        button.addEventListener(
            "mouseleave",
            function () {

                button.classList.remove(
                    "is-hovered"
                );


                /*
                  Don't reset header.
                  The currently focused service
                  remains visible.
                */

            }
        );



        /* =====================================================
           CLICK
        ====================================================== */

        button.addEventListener(
            "click",
            function (event) {

                /*
                  If this click came after
                  dragging, don't select.
                */

                if (
                    Math.abs(
                        lastDragX
                    ) > 8
                ) {

                    event.preventDefault();

                    return;

                }


                selectVisa(
                    index
                );

            }
        );



        /* =====================================================
           KEYBOARD
        ====================================================== */

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
       12. RENDER RING
    ========================================================= */

    function renderRing() {

        if (!ringTrack) {

            return;

        }


        ringTrack.innerHTML =
            "";


        panels = [];


        if (!filteredVisas.length) {

            resetHeaderService();

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
            panels.length
        ) {

            selectedIndex =
                -1;

        }


        updateAllPanels(
            true
        );

    }



    /* =========================================================
       13. CALCULATE RING POSITION
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


        const x =
            Math.cos(angle) *
            config.radiusX;


        const y =
            Math.sin(angle) *
            config.radiusY;


        const depth =
            Math.sin(angle);


        const normalized =
            (depth + 1) / 2;


        const scale =
            CONFIG.minScale +

            (
                CONFIG.maxScale -
                CONFIG.minScale
            ) *
            normalized;


        const opacity =
            0.18 +
            0.82 *
            normalized;


        const blur =
            CONFIG.maxBlur *
            (1 - normalized);


        const rotateY =
            Math.cos(angle) *
            -18;


        const rotateZ =
            Math.cos(angle) *
            1.5;


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
       14. UPDATE PANEL
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
          Only small blur.
          This is much lighter than
          heavy continuous blur.
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


        panel.style.zIndex =
            Math.round(
                1000 +
                position.z
            );


        /*
          Front panel
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
       15. UPDATE ALL PANELS
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
              Normalize difference
              so ring takes shortest path.
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



    /* =========================================================
       16. FOCUS VISA
       Hovered item moves to front-center
    ========================================================= */

    function focusVisa(index) {

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


        if (
            lastFocusedIndex ===
            index
        ) {

            return;

        }


        lastFocusedIndex =
            index;


        selectedIndex =
            index;


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


        /*
          Current actual position
        */

        const currentAngle =
            baseAngle +
            rotation;


        /*
          Desired front position
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
          Selected class
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
       17. SELECT VISA
    ========================================================= */

    function selectVisa(index) {

        if (
            !filteredVisas[index]
        ) {

            return;

        }


        lastFocusedIndex =
            -1;


        updateHeaderService(
            filteredVisas[index]
        );


        focusVisa(
            index
        );

    }



    /* =========================================================
       18. PROCESSING TIME FILTER
    ========================================================= */

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
                .toLowerCase();


        if (
            selected === "fast"
        ) {

            return (

                value.includes(
                    "3–5"
                )

                ||

                value.includes(
                    "3-5"
                )

                ||

                value.includes(
                    "5–7"
                )

                ||

                value.includes(
                    "5-7"
                )

            );

        }


        if (
            selected === "standard"
        ) {

            return (

                value.includes(
                    "7–10"
                )

                ||

                value.includes(
                    "7-10"
                )

                ||

                value.includes(
                    "10–15"
                )

                ||

                value.includes(
                    "10-15"
                )

            );

        }


        if (
            selected === "extended"
        ) {

            return (

                value.includes(
                    "15–20"
                )

                ||

                value.includes(
                    "15-20"
                )

                ||

                value.includes(
                    "20–30"
                )

                ||

                value.includes(
                    "20-30"
                )

            );

        }


        return true;

    }



    /* =========================================================
       19. BUDGET FILTER
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


        const price =
            visa.priceRange
                .toLowerCase();


        if (
            selected === "low"
        ) {

            return (

                price.includes(
                    "150"
                )

                ||

                price.includes(
                    "300"
                )

                ||

                price.includes(
                    "500"
                )

            );

        }


        if (
            selected === "medium"
        ) {

            return (

                price.includes(
                    "500"
                )

                ||

                price.includes(
                    "750"
                )

                ||

                price.includes(
                    "1,000"
                )

            );

        }


        /*
          HTML uses "premium"
        */

        if (
            selected === "premium" ||
            selected === "high"
        ) {

            return (

                price.includes(
                    "1,000"
                )

                ||

                price.includes(
                    "1,500"
                )

                ||

                price.includes(
                    "+"
                )

            );

        }


        return true;

    }



    /* =========================================================
       20. STATUS FILTER
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

                visa.featured === true

                ||

                visa.availability ===
                "high"

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

            visa.status
                .toLowerCase() ===
            selected
                .toLowerCase()

        );

    }



    /* =========================================================
       21. SERVICE TYPE FILTER
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


        /*
          Exact category match
        */

        if (
            visa.category
                .toLowerCase() ===
            selected
                .toLowerCase()
        ) {

            return true;

        }


        /*
          Support grouped filters
          just in case older HTML exists.
        */

        const category =
            visa.category
                .toLowerCase();


        if (
            selected === "visit" &&
            category === "visit-visa"
        ) {

            return true;

        }


        if (
            selected === "business" &&
            category === "business-visa"
        ) {

            return true;

        }


        if (
            selected === "work" &&
            category === "work-visa"
        ) {

            return true;

        }


        if (
            selected === "invitation"
        ) {

            return (
                category.includes(
                    "invitation"
                )
            );

        }


        if (
            selected === "permit"
        ) {

            return (
                category ===
                "work-permit"
            );

        }


        if (
            selected === "passport"
        ) {

            return (
                category ===
                "passport"
            );

        }


        if (
            selected === "residency"
        ) {

            return (
                category ===
                "residency"
            );

        }


        return false;

    }



    /* =========================================================
       22. APPLY FILTERS
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


        rotation =
            0;


        targetRotation =
            0;


        velocity =
            0;


        renderRing();

        renderGrid();

        updateResultCount();

    }



    /* =========================================================
       23. CATEGORY FILTER
    ========================================================= */

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
          Set filter select if
          exact option exists.
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

            } else {

                serviceType.value =
                    "all";

            }

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


        lastFocusedIndex =
            -1;


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
          Keep explorer visible
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



    /* =========================================================
       24. CATEGORY BUTTONS
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
                            button.dataset.category ||
                            button.getAttribute(
                                "data-category"
                            );


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



    /* =========================================================
       25. GRID RENDER
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


                                updateHeaderService(
                                    visa
                                );


                                switchToRing();


                                requestAnimationFrame(
                                    function () {

                                        focusVisa(
                                            index
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



    /* =========================================================
       26. RESULT COUNT
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
       27. OPEN FILTER
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
       28. CLOSE FILTER
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
       29. RESET FILTERS
    ========================================================= */

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
                "all";

        }


        filteredVisas =
            [...ALL_VISAS];


        selectedIndex =
            -1;


        hoveredIndex =
            -1;


        lastFocusedIndex =
            -1;


        rotation =
            0;


        targetRotation =
            0;


        velocity =
            0;


        renderRing();

        renderGrid();

        updateResultCount();

        resetHeaderService();

    }



    /* =========================================================
       30. RESET BUTTON
    ========================================================= */

    function initResetButton() {

        const buttons =
            document.querySelectorAll(
                "#reset-filters, .reset-filters, [data-reset-filters]"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        resetFilters();

                    }
                );

            }
        );

    }



    /* =========================================================
       31. FILTER CHANGE
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

                        applyFilters();

                    }
                );

            }
        );

    }



    /* =========================================================
       32. GRID VIEW
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
       33. RING VIEW
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
       34. VIEW BUTTONS
    ========================================================= */

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



    /* =========================================================
       35. DRAG SYSTEM
    ========================================================= */

    function initDrag() {

        if (!ring) {

            return;

        }


        ring.addEventListener(
            "pointerdown",
            function (event) {

                if (
                    event.pointerType ===
                    "mouse" &&
                    event.button !== 0
                ) {

                    return;

                }


                isDragging =
                    true;


                dragStartX =
                    event.clientX;


                lastDragX =
                    event.clientX;


                dragStartRotation =
                    targetRotation;


                velocity =
                    0;


                lastDragX =
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


                const step =
                    event.clientX -
                    (
                        dragStartX +
                        lastDragX
                    );


                targetRotation =
                    dragStartRotation +
                    (
                        delta *
                        CONFIG.dragSensitivity
                    );


                /*
                  Controlled velocity.
                  Never becomes huge.
                */

                velocity =
                    Math.max(
                        -0.015,
                        Math.min(
                            0.015,
                            step *
                            0.0009
                        )
                    );


                lastDragX =
                    delta;

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


            /*
              Small inertia only.
            */

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

        }


        ring.addEventListener(
            "pointerup",
            endDrag
        );


        ring.addEventListener(
            "pointercancel",
            endDrag
        );


        ring.addEventListener(
            "pointerleave",
            function () {

                if (
                    isDragging
                ) {

                    isDragging =
                        false;

                    ring.classList.remove(
                        "is-dragging"
                    );

                }

            }
        );

    }



    /* =========================================================
       36. FILTER BUTTON
    ========================================================= */

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



    /* =========================================================
       37. KEYBOARD
    ========================================================= */

    function initKeyboard() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeFilters();

                    selectedIndex =
                        -1;

                    lastFocusedIndex =
                        -1;

                    panels.forEach(
                        function (
                            panel
                        ) {

                            panel.classList.remove(
                                "is-selected"
                            );

                        }
                    );


                    resetHeaderService();

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



    /* =========================================================
       38. RESIZE
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
       39. ANIMATION
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


            /* =============================================
               DRAG INERTIA
            ============================================== */

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


            /* =============================================
               VERY SLOW AUTO ROTATION
            ============================================== */

            else if (
                !isDragging
            ) {

                targetRotation +=
                    CONFIG.autoSpeed *
                    delta;

            }

        }


        /*
          Update all visual positions
        */

        updateAllPanels();


        requestAnimationFrame(
            animate
        );

    }



    /* =========================================================
       40. OLD CENTER CTA
       Compatibility only
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
                  STEP 8 will connect
                  this to the detail page.
                */

                event.preventDefault();


                console.log(
                    "Visa selected:",
                    visaId
                );

            }
        );

    }



    /* =========================================================
       41. INITIALIZE
    ========================================================= */

    function init() {

        console.log(
            "===================================="
        );


        console.log(
            "CB Visa Services — FINAL STEP 7"
        );


        console.log(
            "Total services:",
            ALL_VISAS.length
        );


        console.log(
            "Ring interaction: ACTIVE"
        );


        console.log(
            "Header service details: ACTIVE"
        );


        console.log(
            "Mouse speed acceleration: DISABLED"
        );


        console.log(
            "===================================="
        );


        /*
          Initial header
        */

        resetHeaderService();


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

        initResize();

        initCenterCTA();


        /*
          Result count
        */

        updateResultCount();


        /*
          Start animation
        */

        requestAnimationFrame(
            animate
        );

    }



    /* =========================================================
       42. START
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

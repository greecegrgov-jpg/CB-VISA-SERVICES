/* =========================================================
   CB VISA SERVICES
   3D VISA RING — MASTER JAVASCRIPT
   CORRECTED MASTER VERSION
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       01. DATA
    ===================================================== */

    const source =
        window.CBVisaData &&
        Array.isArray(window.CBVisaData.visas)
            ? window.CBVisaData.visas
            : [];


    const visas = source.map(function (item, index) {

        item = item || {};

        return {

            id:
                item.id ||
                item.slug ||
                "visa-" + (index + 1),

            title:
                item.title ||
                item.name ||
                item.service ||
                item.country ||
                "Visa Service " + (index + 1),

            category:
                item.category ||
                item.type ||
                item.serviceType ||
                "Visit Visa",

            country:
                item.country ||
                item.location ||
                item.destination ||
                item.countryName ||
                "International",

            image:
                item.image ||
                item.img ||
                item.thumbnail ||
                item.photo ||
                item.imageUrl ||
                "",

            link:
                item.link ||
                item.url ||
                item.href ||
                "#",

            processingTime:
                item.processingTime ||
                item.processing ||
                "Standard",

            budget:
                item.budget ||
                "medium",

            status:
                item.status ||
                "Available",

            featured:
                item.featured === true,

            raw:
                item
        };

    });


    /* =====================================================
       02. DOM
    ===================================================== */

    const ring =
        document.getElementById("ring");

    const ringTrack =
        document.getElementById("ring-track");

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

    const filterButton =
        document.getElementById("filter-button");

    const gridButton =
        document.getElementById("grid-button");

    const filterOverlay =
        document.getElementById("filter-overlay");

    const filterClose =
        document.getElementById("filter-close");

    const gridView =
        document.getElementById("grid-view");

    const gridContainer =
        document.getElementById("grid-container");

    const ringButton =
        document.getElementById("ring-button");

    const categoryButtons =
        document.querySelectorAll(
            ".category-label"
        );


    /* =====================================================
       03. SAFETY CHECK
    ===================================================== */

    if (!ring || !ringTrack) {

        console.error(
            "CB Visa Services: #ring or #ring-track not found."
        );

        return;
    }


    /* =====================================================
       04. CONFIGURATION
    ===================================================== */

    const CONFIG = {

        desktop: {
            panels: 150,
            radiusX: 700,
            radiusY: 205
        },

        tablet: {
            panels: 110,
            radiusX: 520,
            radiusY: 155
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

        perspective: 1400,

        autoSpeed:
            0.00009,

        mouseStrength:
            0.00045,

        mouseTilt:
            3,

        dragSensitivity:
            0.004,

        inertia:
            0.92,

        ease:
            0.10,

        minScale:
            0.45,

        maxScale:
            1.08,

        frontScale:
            1.14,

        hoverScale:
            1.12
    };


    /* =====================================================
       05. STATE
    ===================================================== */

    let rotation = 0;

    let targetRotation = 0;

    let velocity = 0;

    let mouseX = 0;

    let mouseY = 0;

    let targetTiltX = 0;

    let targetTiltY = 0;

    let tiltX = 0;

    let tiltY = 0;

    let dragging = false;

    let dragStartX = 0;

    let dragStartRotation = 0;

    let lastPointerX = 0;

    let hoveredIndex = -1;

    let selectedIndex = -1;

    let panels = [];

    let currentSettings = null;

    let filteredVisas =
        visas.slice();

    let animationFrame = null;

    let resizeTimer = null;

    let previewTimer = null;

    let reducedMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       06. RESPONSIVE SETTINGS
    ===================================================== */

    function getSettings() {

        const width =
            window.innerWidth;

        if (width <= 420) {

            return {
                ...CONFIG.smallMobile,
                mobile: true
            };
        }


        if (width <= 760) {

            return {
                ...CONFIG.mobile,
                mobile: true
            };
        }


        if (width <= 1100) {

            return {
                ...CONFIG.tablet,
                mobile: false
            };
        }


        return {
            ...CONFIG.desktop,
            mobile: false
        };
    }


    /* =====================================================
       07. FALLBACK IMAGE
    ===================================================== */

    function createFallbackImage(title) {

        const safeTitle =
            escapeHTML(title);

        const svg = `
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="500"
                height="700"
                viewBox="0 0 500 700"
            >

                <rect
                    width="500"
                    height="700"
                    fill="#eeeeec"
                />

                <rect
                    x="30"
                    y="30"
                    width="440"
                    height="640"
                    fill="#f7f7f5"
                    stroke="#cfcfcb"
                />

                <text
                    x="250"
                    y="330"
                    text-anchor="middle"
                    font-family="Arial, sans-serif"
                    font-size="24"
                    font-weight="700"
                    fill="#8B0000"
                >
                    CB VISA
                </text>

                <text
                    x="250"
                    y="365"
                    text-anchor="middle"
                    font-family="Arial, sans-serif"
                    font-size="13"
                    fill="#555"
                >
                    ${safeTitle}
                </text>

            </svg>
        `;

        return (
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(svg)
        );
    }


    /* =====================================================
       08. ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       09. CREATE PANEL
    ===================================================== */

    function createPanel(
        visa,
        dataIndex,
        ringIndex
    ) {

        const button =
            document.createElement("button");

        button.type =
            "button";

        button.className =
            "ring-panel";

        button.dataset.index =
            String(dataIndex);

        button.dataset.ringIndex =
            String(ringIndex);

        button.setAttribute(
            "aria-label",
            visa.title +
            " — " +
            visa.country
        );


        const image =
            document.createElement("img");


        image.alt =
            visa.title +
            " visa service";


        image.draggable =
            false;


        image.loading =
            ringIndex < 25
                ? "eager"
                : "lazy";


        image.decoding =
            "async";


        const fallback =
            createFallbackImage(
                visa.title
            );


        image.src =
            visa.image ||
            fallback;


        image.onerror =
            function () {

                if (
                    image.src !==
                    fallback
                ) {

                    image.src =
                        fallback;
                }
            };


        button.appendChild(
            image
        );


        /* ---------------------------------------------
           MOUSE ENTER
        --------------------------------------------- */

        button.addEventListener(
            "mouseenter",
            function () {

                hoveredIndex =
                    dataIndex;

                showCenterPreview(
                    visa,
                    false
                );
            }
        );


        /* ---------------------------------------------
           MOUSE LEAVE
        --------------------------------------------- */

        button.addEventListener(
            "mouseleave",
            function () {

                hoveredIndex =
                    -1;

                if (
                    selectedIndex === -1
                ) {

                    resetCenter();
                }
            }
        );


        /* ---------------------------------------------
           CLICK
        --------------------------------------------- */

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                selectVisa(
                    dataIndex
                );
            }
        );


        /* ---------------------------------------------
           KEYBOARD
        --------------------------------------------- */

        button.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    selectVisa(
                        dataIndex
                    );
                }
            }
        );


        return button;
    }


    /* =====================================================
       10. RENDER RING
    ===================================================== */

    function renderRing() {

        currentSettings =
            getSettings();


        ringTrack.innerHTML =
            "";


        panels =
            [];


        if (!filteredVisas.length) {

            resetCenter();

            return;
        }


        /*
           visaCount controls how many
           records are used by the ring.
        */

        let sourceItems =
            filteredVisas.slice();


        if (
            visaCount &&
            visaCount.value !== "all"
        ) {

            const requested =
                parseInt(
                    visaCount.value,
                    10
                );


            if (
                Number.isFinite(
                    requested
                )
            ) {

                sourceItems =
                    sourceItems.slice(
                        0,
                        requested
                    );
            }
        }


        const count =
            Math.min(
                currentSettings.panels,
                sourceItems.length
            );


        if (!count) {

            resetCenter();

            return;
        }


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const dataIndex =
                filteredVisas.indexOf(
                    sourceItems[i]
                );


            const visa =
                sourceItems[i];


            const panel =
                createPanel(
                    visa,
                    dataIndex,
                    i
                );


            ringTrack.appendChild(
                panel
            );


            panels.push({

                element:
                    panel,

                dataIndex:
                    dataIndex,

                ringIndex:
                    i
            });
        }


        requestAnimationFrame(
            function () {

                renderFrame();

            }
        );
    }


    /* =====================================================
       11. CALCULATE 3D ELLIPSE
    ===================================================== */

    function calculatePosition(
        ringIndex,
        count
    ) {

        const settings =
            currentSettings ||
            getSettings();


        /*
           Start from top/front orientation.
        */

        const angle =
            (
                ringIndex /
                count
            ) *
            Math.PI *
            2
            +
            rotation;


        const x =
            Math.cos(angle) *
            settings.radiusX;


        const y =
            Math.sin(angle) *
            settings.radiusY;


        /*
           Front = positive
           Back = negative
        */

        const depth =
            Math.sin(angle);


        const normalized =
            (
                depth + 1
            ) / 2;


        /*
           Natural depth scaling
        */

        let scale =
            settings.minScale +
            (
                settings.maxScale -
                settings.minScale
            ) *
            normalized;


        /*
           Opacity
        */

        let opacity =
            0.22 +
            (
                0.78 *
                normalized
            );


        /*
           Subtle blur on rear panels
        */

        const blur =
            Math.max(
                0,
                (
                    1 -
                    normalized
                ) *
                1.2
            );


        /*
           Panel rotation follows ellipse
        */

        const rotateY =
            Math.cos(angle) *
            -16;


        const rotateZ =
            Math.cos(angle) *
            1.2;


        /*
           True 3D depth
        */

        const z =
            depth *
            190;


        const panelData =
            panels[ringIndex];


        if (
            panelData &&
            panelData.dataIndex ===
                hoveredIndex
        ) {

            scale *=
                settings.hoverScale ||
                CONFIG.hoverScale;

            opacity =
                Math.min(
                    1,
                    opacity + 0.08
                );
        }


        if (
            panelData &&
            panelData.dataIndex ===
                selectedIndex
        ) {

            scale *=
                settings.frontScale ||
                CONFIG.frontScale;

            opacity =
                1;

        }


        return {

            x,
            y,
            z,

            scale,

            opacity,

            blur,

            rotateY,

            rotateZ,

            depth
        };
    }


    /* =====================================================
       12. UPDATE PANEL
    ===================================================== */

    function updatePanel(
        panelData,
        ringIndex,
        count
    ) {

        const panel =
            panelData.element;


        const position =
            calculatePosition(
                ringIndex,
                count
            );


        panel.style.transform =
            "translate3d(" +
            position.x +
            "px, " +
            position.y +
            "px, " +
            position.z +
            "px)" +
            " rotateY(" +
            position.rotateY +
            "deg)" +
            " rotateZ(" +
            position.rotateZ +
            "deg)" +
            " scale(" +
            position.scale +
            ")";


        panel.style.opacity =
            String(
                position.opacity
            );


        panel.style.filter =
            "blur(" +
            position.blur +
            "px)";


        /*
           Correct 3D stacking.
        */

        panel.style.zIndex =
            String(
                Math.round(
                    1000 +
                    (
                        position.depth +
                        1
                    ) *
                    1000
                )
            );
    }


    /* =====================================================
       13. RENDER FRAME
    ===================================================== */

    function renderFrame() {

        if (!panels.length) {
            return;
        }


        const count =
            panels.length;


        for (
            let i = 0;
            i < panels.length;
            i++
        ) {

            updatePanel(
                panels[i],
                i,
                count
            );
        }
    }


    /* =====================================================
       14. CENTER PREVIEW
    ===================================================== */

    function showCenterPreview(
        visa,
        selected
    ) {

        if (!visa) {
            return;
        }


        clearTimeout(
            previewTimer
        );


        if (centerTitle) {

            centerTitle.textContent =
                visa.title;
        }


        if (centerDescription) {

            centerDescription.textContent =
                visa.country +
                " — " +
                visa.category;
        }


        if (centerCategory) {

            centerCategory.textContent =
                visa.category;
        }


        if (centerLocation) {

            centerLocation.textContent =
                visa.country;
        }


        if (centerCTA) {

            if (selected) {

                centerCTA.hidden =
                    false;

                centerCTA.href =
                    visa.link || "#";

                centerCTA.setAttribute(
                    "aria-label",
                    "View " +
                    visa.title +
                    " visa category"
                );

            } else {

                centerCTA.hidden =
                    true;
            }
        }


        if (centerImage) {

            const fallback =
                createFallbackImage(
                    visa.title
                );


            centerImage.style.opacity =
                "0";


            previewTimer =
                setTimeout(
                    function () {

                        centerImage.onload =
                            function () {

                                centerImage.style.opacity =
                                    "1";
                            };


                        centerImage.onerror =
                            function () {

                                centerImage.src =
                                    fallback;

                                centerImage.style.opacity =
                                    "1";
                            };


                        centerImage.src =
                            visa.image ||
                            fallback;


                        centerImage.alt =
                            visa.title +
                            " visa service";

                    },
                    selected ? 60 : 0
                );
        }
    }


    /* =====================================================
       15. RESET CENTER
    ===================================================== */

    function resetCenter() {

        clearTimeout(
            previewTimer
        );


        if (centerTitle) {

            centerTitle.textContent =
                "Build your own future on your terms.";
        }


        if (centerDescription) {

            centerDescription.textContent =
                "Explore 300+ visa services choose the country you like.";
        }


        if (centerCategory) {

            centerCategory.textContent =
                "Explore Services";
        }


        if (centerLocation) {

            centerLocation.textContent =
                "300+ Services";
        }


        if (centerImage) {

            centerImage.removeAttribute(
                "src"
            );

            centerImage.alt =
                "";

            centerImage.style.opacity =
                "0";
        }


        if (centerCTA) {

            centerCTA.hidden =
                true;
        }
    }


    /* =====================================================
       16. SELECT VISA
    ===================================================== */

    function selectVisa(
        index
    ) {

        if (
            index < 0 ||
            index >= filteredVisas.length
        ) {

            return;
        }


        selectedIndex =
            index;


        hoveredIndex =
            -1;


        const visa =
            filteredVisas[index];


        showCenterPreview(
            visa,
            true
        );


        /*
           Find selected visa inside
           currently visible panels.
        */

        let ringIndex =
            -1;


        for (
            let i = 0;
            i < panels.length;
            i++
        ) {

            if (
                panels[i].dataIndex ===
                index
            ) {

                ringIndex =
                    panels[i].ringIndex;

                break;
            }
        }


        if (
            ringIndex !== -1
        ) {

            const count =
                panels.length;


            const currentAngle =
                (
                    ringIndex /
                    count
                ) *
                Math.PI *
                2;


            /*
               Front-center of our
               ellipse is bottom point
               because sin(+PI/2) = 1.
            */

            const desiredAngle =
                Math.PI / 2;


            let delta =
                desiredAngle -
                currentAngle;


            while (
                delta > Math.PI
            ) {

                delta -=
                    Math.PI * 2;
            }


            while (
                delta < -Math.PI
            ) {

                delta +=
                    Math.PI * 2;
            }


            targetRotation =
                rotation +
                delta;


            velocity =
                0;
        }


        renderFrame();
    }


    /* =====================================================
       17. POINTER MOVE
    ===================================================== */

    function handlePointerMove(
        event
    ) {

        const rect =
            ring.getBoundingClientRect();


        if (
            rect.width <= 0 ||
            rect.height <= 0
        ) {

            return;
        }


        const x =
            (
                event.clientX -
                rect.left
            ) /
            rect.width;


        const y =
            (
                event.clientY -
                rect.top
            ) /
            rect.height;


        mouseX =
            (
                x -
                0.5
            ) * 2;


        mouseY =
            (
                y -
                0.5
            ) * 2;


        targetTiltY =
            mouseX *
            CONFIG.mouseTilt;


        targetTiltX =
            -mouseY *
            CONFIG.mouseTilt;


        /*
           Mouse follow is intentionally
           subtle so it doesn't fight
           the auto rotation.
        */

        if (
            !dragging &&
            selectedIndex === -1
        ) {

            targetRotation +=
                mouseX *
                CONFIG.mouseStrength;
        }
    }


    /* =====================================================
       18. DRAG START
    ===================================================== */

    function handlePointerDown(
        event
    ) {

        if (
            event.pointerType === "mouse" &&
            event.button !== 0
        ) {

            return;
        }


        dragging =
            true;


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

        } catch (error) {

            /* ignore */
        }
    }


    /* =====================================================
       19. DRAG MOVE
    ===================================================== */

    function handleDragMove(
        event
    ) {

        if (!dragging) {
            return;
        }


        const delta =
            event.clientX -
            dragStartX;


        targetRotation =
            dragStartRotation +
            (
                delta *
                CONFIG.dragSensitivity
            );


        velocity =
            (
                event.clientX -
                lastPointerX
            ) *
            CONFIG.dragSensitivity;


        lastPointerX =
            event.clientX;
    }


    /* =====================================================
       20. DRAG END
    ===================================================== */

    function handlePointerUp(
        event
    ) {

        if (!dragging) {
            return;
        }


        dragging =
            false;


        ring.classList.remove(
            "is-dragging"
        );


        try {

            ring.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {

            /* ignore */
        }


        targetRotation +=
            velocity *
            8;
    }


    /* =====================================================
       21. ANIMATION LOOP
    ===================================================== */

    function animate() {

        /*
           Automatic rotation only
           when nothing is selected.
        */

        if (
            !dragging &&
            selectedIndex === -1 &&
            !reducedMotion
        ) {

            targetRotation +=
                CONFIG.autoSpeed *
                16;
        }


        /*
           Inertia after dragging.
        */

        if (!dragging) {

            targetRotation +=
                velocity;


            velocity *=
                CONFIG.inertia;


            if (
                Math.abs(velocity) <
                0.00001
            ) {

                velocity =
                    0;
            }
        }


        /*
           Smooth rotation.
        */

        rotation +=
            (
                targetRotation -
                rotation
            ) *
            CONFIG.ease;


        /*
           Smooth mouse tilt.
        */

        tiltX +=
            (
                targetTiltX -
                tiltX
            ) *
            0.08;


        tiltY +=
            (
                targetTiltY -
                tiltY
            ) *
            0.08;


        /*
           Apply 3D tilt to the
           entire elliptical ring.
        */

        ringTrack.style.transform =
            "rotateX(" +
            tiltX +
            "deg) " +
            "rotateY(" +
            tiltY +
            "deg)";


        renderFrame();


        animationFrame =
            requestAnimationFrame(
                animate
            );
    }


    /* =====================================================
       22. FILTER DOM
    ===================================================== */

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


    /* =====================================================
       23. PROCESSING MATCH
    ===================================================== */

    function matchesProcessingTime(
        visa,
        filterValue
    ) {

        if (
            !filterValue ||
            filterValue === "all"
        ) {

            return true;
        }


        const value =
            String(
                visa.processingTime || ""
            ).toLowerCase();


        if (
            filterValue === "fast"
        ) {

            return (
                value.includes("3–5") ||
                value.includes("3-5") ||
                value.includes("5–7") ||
                value.includes("5-7") ||
                value.includes("express")
            );
        }


        if (
            filterValue === "standard"
        ) {

            return (
                value.includes("7–10") ||
                value.includes("7-10") ||
                value.includes("10–15") ||
                value.includes("10-15") ||
                value.includes("standard")
            );
        }


        if (
            filterValue === "extended"
        ) {

            return (
                value.includes("15–20") ||
                value.includes("15-20") ||
                value.includes("20–30") ||
                value.includes("20-30") ||
                value.includes("extended")
            );
        }


        return true;
    }


    /* =====================================================
       24. BUDGET MATCH
    ===================================================== */

    function matchesBudget(
        visa,
        filterValue
    ) {

        if (
            !filterValue ||
            filterValue === "all"
        ) {

            return true;
        }


        const value =
            String(
                visa.budget || ""
            ).toLowerCase();


        /*
           If the data contains explicit
           budget values, use them.
        */

        if (
            value === filterValue
        ) {

            return true;
        }


        /*
           Also understand price ranges.
        */

        const price =
            String(
                visa.raw &&
                visa.raw.priceRange
                    ? visa.raw.priceRange
                    : ""
            ).toLowerCase();


        if (
            filterValue === "low"
        ) {

            return (
                value.includes("low") ||
                price.includes("150") ||
                price.includes("300")
            );
        }


        if (
            filterValue === "medium"
        ) {

            return (
                value.includes("medium") ||
                price.includes("300") ||
                price.includes("500") ||
                price.includes("750")
            );
        }


        if (
            filterValue === "premium"
        ) {

            return (
                value.includes("premium") ||
                price.includes("750") ||
                price.includes("1,000") ||
                price.includes("1,500")
            );
        }


        return true;
    }


    /* =====================================================
       25. APPLY FILTERS
    ===================================================== */

    function applyFilters() {

        filteredVisas =
            visas.filter(
                function (visa) {

                    let matches =
                        true;


                    /*
                       SERVICE TYPE
                    */

                    if (
                        serviceType &&
                        serviceType.value !==
                            "all"
                    ) {

                        const value =
                            serviceType.value
                                .toLowerCase();


                        const category =
                            visa.category
                                .toLowerCase();


                        if (
                            value === "visit"
                        ) {

                            matches =
                                category.includes(
                                    "visit"
                                );
                        }


                        else if (
                            value === "business"
                        ) {

                            matches =
                                category.includes(
                                    "business"
                                );
                        }


                        else if (
                            value === "work"
                        ) {

                            matches =
                                category.includes(
                                    "work"
                                );
                        }


                        else if (
                            value === "invitation"
                        ) {

                            matches =
                                category.includes(
                                    "invitation"
                                );
                        }


                        else if (
                            value === "permit"
                        ) {

                            matches =
                                category.includes(
                                    "permit"
                                );
                        }


                        else if (
                            value === "passport"
                        ) {

                            matches =
                                category.includes(
                                    "passport"
                                );
                        }


                        else if (
                            value === "residency"
                        ) {

                            matches =
                                category.includes(
                                    "residency"
                                );
                        }
                    }


                    /*
                       PROCESSING TIME
                    */

                    if (
                        matches &&
                        processingTime
                    ) {

                        matches =
                            matchesProcessingTime(
                                visa,
                                processingTime.value
                            );
                    }


                    /*
                       BUDGET
                    */

                    if (
                        matches &&
                        budget
                    ) {

                        matches =
                            matchesBudget(
                                visa,
                                budget.value
                            );
                    }


                    /*
                       STATUS
                    */

                    if (
                        matches &&
                        status &&
                        status.value !== "all"
                    ) {

                        if (
                            status.value ===
                            "popular"
                        ) {

                            matches =
                                visa.featured ===
                                true;
                        }

                        else if (
                            status.value ===
                            "new"
                        ) {

                            /*
                               Treat first records
                               as newest/featured.
                            */

                            matches =
                                visa.featured ===
                                true ||
                                visa.raw &&
                                visa.raw.new ===
                                true;
                        }

                        else {

                            matches =
                                String(
                                    visa.status ||
                                    ""
                                )
                                    .toLowerCase()
                                    .includes(
                                        status.value
                                    );
                        }
                    }


                    return matches;
                }
            );


        selectedIndex =
            -1;


        hoveredIndex =
            -1;


        rotation =
            0;


        targetRotation =
            0;


        velocity =
            0;


        resetCenter();


        renderRing();


        renderGrid();


        closeFilter();
    }


    /* =====================================================
       26. FILTER LISTENERS
    ===================================================== */

    [
        serviceType,
        processingTime,
        budget,
        status
    ].forEach(
        function (element) {

            if (element) {

                element.addEventListener(
                    "change",
                    applyFilters
                );
            }
        }
    );


    if (visaCount) {

        visaCount.addEventListener(
            "change",
            function () {

                renderRing();

                renderGrid();
            }
        );
    }


    /* =====================================================
       27. CATEGORY BUTTONS
    ===================================================== */

    categoryButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const category =
                        (
                            button.dataset.category ||
                            ""
                        )
                            .toLowerCase()
                            .trim();


                    if (!category) {
                        return;
                    }


                    filteredVisas =
                        visas.filter(
                            function (visa) {

                                return visa.category
                                    .toLowerCase()
                                    .includes(
                                        category
                                    );
                            }
                        );


                    /*
                       Fallback search
                    */

                    if (
                        !filteredVisas.length
                    ) {

                        filteredVisas =
                            visas.filter(
                                function (visa) {

                                    return (
                                        visa.title
                                            .toLowerCase()
                                            .includes(
                                                category
                                            ) ||

                                        visa.country
                                            .toLowerCase()
                                            .includes(
                                                category
                                            )
                                    );
                                }
                            );
                    }


                    selectedIndex =
                        -1;


                    hoveredIndex =
                        -1;


                    rotation =
                        0;


                    targetRotation =
                        0;


                    velocity =
                        0;


                    resetCenter();


                    renderRing();


                    renderGrid();


                    /*
                       Scroll back to explorer
                    */

                    const explorer =
                        document.querySelector(
                            ".visa-explorer"
                        );


                    if (explorer) {

                        explorer.scrollIntoView({
                            behavior:
                                reducedMotion
                                    ? "auto"
                                    : "smooth",

                            block:
                                "start"
                        });
                    }
                }
            );
        }
    );


    /* =====================================================
       28. GRID VIEW
    ===================================================== */

    function renderGrid() {

        if (!gridContainer) {
            return;
        }


        gridContainer.innerHTML =
            "";


        let items =
            filteredVisas.slice();


        if (
            visaCount &&
            visaCount.value !== "all"
        ) {

            const amount =
                parseInt(
                    visaCount.value,
                    10
                );


            if (
                Number.isFinite(
                    amount
                )
            ) {

                items =
                    items.slice(
                        0,
                        amount
                    );
            }
        }


        items.forEach(
            function (visa, index) {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "grid-card";


                card.setAttribute(
                    "tabindex",
                    "0"
                );


                const image =
                    document.createElement(
                        "img"
                    );


                image.loading =
                    "lazy";


                image.decoding =
                    "async";


                image.alt =
                    visa.title;


                const fallback =
                    createFallbackImage(
                        visa.title
                    );


                image.src =
                    visa.image ||
                    fallback;


                image.onerror =
                    function () {

                        image.src =
                            fallback;
                    };


                const content =
                    document.createElement(
                        "div"
                    );


                content.className =
                    "grid-card-content";


                content.innerHTML =
                    `
                    <h3>
                        ${escapeHTML(
                            visa.title
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            visa.category
                        )}
                        ·
                        ${escapeHTML(
                            visa.country
                        )}
                    </p>
                    `;


                card.appendChild(
                    image
                );


                card.appendChild(
                    content
                );


                function openVisa() {

                    const actualIndex =
                        filteredVisas.indexOf(
                            visa
                        );


                    selectVisa(
                        actualIndex
                    );


                    if (gridView) {

                        gridView.hidden =
                            true;

                        gridView.setAttribute(
                            "aria-hidden",
                            "true"
                        );
                    }


                    ring.hidden =
                        false;


                    const explorer =
                        document.querySelector(
                            ".visa-explorer"
                        );


                    if (explorer) {

                        explorer.scrollIntoView({
                            behavior:
                                reducedMotion
                                    ? "auto"
                                    : "smooth",

                            block:
                                "start"
                        });
                    }
                }


                card.addEventListener(
                    "click",
                    openVisa
                );


                card.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key ===
                                "Enter" ||
                            event.key ===
                                " "
                        ) {

                            event.preventDefault();

                            openVisa();
                        }
                    }
                );


                gridContainer.appendChild(
                    card
                );
            }
        );
    }


    /* =====================================================
       29. OPEN GRID
    ===================================================== */

    if (gridButton) {

        gridButton.addEventListener(
            "click",
            function () {

                renderGrid();


                if (gridView) {

                    gridView.hidden =
                        false;

                    gridView.setAttribute(
                        "aria-hidden",
                        "false"
                    );
                }


                ring.hidden =
                    true;


                if (gridView) {

                    window.scrollTo({

                        top:
                            gridView.offsetTop -
                            40,

                        behavior:
                            reducedMotion
                                ? "auto"
                                : "smooth"
                    });
                }
            }
        );
    }


    /* =====================================================
       30. RETURN TO RING
    ===================================================== */

    if (ringButton) {

        ringButton.addEventListener(
            "click",
            function () {

                if (gridView) {

                    gridView.hidden =
                        true;

                    gridView.setAttribute(
                        "aria-hidden",
                        "true"
                    );
                }


                ring.hidden =
                    false;


                const explorer =
                    document.querySelector(
                        ".visa-explorer"
                    );


                if (explorer) {

                    explorer.scrollIntoView({

                        behavior:
                            reducedMotion
                                ? "auto"
                                : "smooth",

                        block:
                            "start"
                    });
                }
            }
        );
    }


    /* =====================================================
       31. FILTER OPEN
    ===================================================== */

    function openFilter() {

        if (!filterOverlay) {
            return;
        }


        filterOverlay.classList.add(
            "is-open"
        );


        filterOverlay.setAttribute(
            "aria-hidden",
            "false"
        );


        if (filterButton) {

            filterButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }


        document.body.classList.add(
            "filter-active"
        );
    }


    /* =====================================================
       32. FILTER CLOSE
    ===================================================== */

    function closeFilter() {

        if (!filterOverlay) {
            return;
        }


        filterOverlay.classList.remove(
            "is-open"
        );


        filterOverlay.setAttribute(
            "aria-hidden",
            "true"
        );


        if (filterButton) {

            filterButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }


        document.body.classList.remove(
            "filter-active"
        );
    }


    if (filterButton) {

        filterButton.addEventListener(
            "click",
            openFilter
        );
    }


    if (filterClose) {

        filterClose.addEventListener(
            "click",
            closeFilter
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

                    closeFilter();
                }
            }
        );
    }


    /* =====================================================
       33. ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeFilter();


                if (
                    selectedIndex !==
                    -1
                ) {

                    selectedIndex =
                        -1;

                    hoveredIndex =
                        -1;

                    velocity =
                        0;

                    resetCenter();
                }
            }
        }
    );


    /* =====================================================
       34. POINTER EVENTS
    ===================================================== */

    ring.addEventListener(
        "pointermove",
        handlePointerMove
    );


    ring.addEventListener(
        "pointerdown",
        handlePointerDown
    );


    ring.addEventListener(
        "pointermove",
        handleDragMove
    );


    ring.addEventListener(
        "pointerup",
        handlePointerUp
    );


    ring.addEventListener(
        "pointercancel",
        handlePointerUp
    );


    ring.addEventListener(
        "pointerleave",
        function () {

            targetTiltX =
                0;

            targetTiltY =
                0;


            if (
                selectedIndex ===
                -1
            ) {

                hoveredIndex =
                    -1;

                resetCenter();
            }
        }
    );


    /* =====================================================
       35. RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        currentSettings =
                            getSettings();


                        renderRing();

                    },
                    180
                );
        }
    );


    /* =====================================================
       36. TOUCH SAFETY
    ===================================================== */

    ring.addEventListener(
        "touchstart",
        function () {},
        {
            passive: true
        }
    );


    /* =====================================================
       37. INITIALIZATION
    ===================================================== */

    function init() {

        if (!visas.length) {

            console.warn(
                "CB Visa Services: No visa data found."
            );

            return;
        }


        /*
           Make sure grid starts hidden.
        */

        if (gridView) {

            gridView.hidden =
                true;

            gridView.setAttribute(
                "aria-hidden",
                "true"
            );
        }


        ring.hidden =
            false;


        /*
           Default center
        */

        resetCenter();


        /*
           First render
        */

        renderRing();


        renderGrid();


        /*
           Start animation
        */

        if (!animationFrame) {

            animate();
        }


        console.log(
            "CB Visa Services initialized:",
            filteredVisas.length,
            "visa services"
        );
    }


    /* =====================================================
       38. START
    ===================================================== */

    init();

})();

/* =========================================================
   CB VISA SERVICES
   3D VISA RING — MASTER JAVASCRIPT
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

    /*
       Support multiple possible data formats:
       title / name
       category / type / service
       country / location
       image / img / thumbnail
       link / url / href
    */

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
                "standard",

            budget:
                item.budget ||
                "medium",

            status:
                item.status ||
                "available",

            featured:
                item.featured === true,

            raw: item
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
        document.querySelectorAll(".category-label");


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
       04. CONFIG
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

        perspective: 1200,

        autoSpeed: 0.00010,

        mouseStrength: 0.00065,

        mouseTilt: 3.5,

        dragSensitivity: 0.004,

        inertia: 0.93,

        ease: 0.12,

        minScale: 0.48,

        maxScale: 1.08
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

    let filteredVisas = visas.slice();

    let animationFrame = null;

    let reducedMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       06. RESPONSIVE SETTINGS
    ===================================================== */

    function getSettings() {

        const width = window.innerWidth;

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
       07. IMAGE FALLBACK
    ===================================================== */

    function createFallbackImage(title) {

        const svg = `
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="300"
                height="500"
                viewBox="0 0 300 500"
            >
                <rect
                    width="300"
                    height="500"
                    fill="#e9e9e7"
                />

                <rect
                    x="25"
                    y="25"
                    width="250"
                    height="450"
                    fill="#f4f4f2"
                    stroke="#c4c4c1"
                />

                <text
                    x="150"
                    y="245"
                    text-anchor="middle"
                    font-family="Arial"
                    font-size="16"
                    font-weight="700"
                    fill="#8B0000"
                >
                    CB VISA
                </text>

                <text
                    x="150"
                    y="270"
                    text-anchor="middle"
                    font-family="Arial"
                    font-size="11"
                    fill="#555"
                >
                    ${escapeHTML(title)}
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

    function createPanel(visa, index) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className = "ring-panel";

        button.dataset.index = index;

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

        image.draggable = false;

        image.loading =
            index < 20
                ? "eager"
                : "lazy";


        const fallback =
            createFallbackImage(
                visa.title
            );


        image.src =
            visa.image ||
            fallback;


        image.onerror = function () {

            if (image.src !== fallback) {
                image.src = fallback;
            }
        };


        button.appendChild(image);


        /* -----------------------------------------------
           HOVER
        ------------------------------------------------ */

        button.addEventListener(
            "mouseenter",
            function () {

                hoveredIndex = index;

                showCenterPreview(
                    visa,
                    false
                );
            }
        );


        button.addEventListener(
            "mouseleave",
            function () {

                hoveredIndex = -1;

                if (selectedIndex === -1) {
                    resetCenter();
                }
            }
        );


        /* -----------------------------------------------
           CLICK
        ------------------------------------------------ */

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                selectVisa(index);
            }
        );


        /* -----------------------------------------------
           KEYBOARD
        ------------------------------------------------ */

        button.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    selectVisa(index);
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

        ringTrack.innerHTML = "";

        panels = [];


        if (!filteredVisas.length) {

            resetCenter();

            return;
        }


        const count =
            Math.min(
                currentSettings.panels,
                filteredVisas.length
            );


        /*
           IMPORTANT:
           We spread the COMPLETE dataset around
           the mathematical ellipse.
        */

        for (let i = 0; i < count; i++) {

            const dataIndex =
                i % filteredVisas.length;

            const visa =
                filteredVisas[dataIndex];

            const panel =
                createPanel(
                    visa,
                    dataIndex
                );

            panel.dataset.ringIndex = i;

            ringTrack.appendChild(panel);

            panels.push({
                element: panel,
                dataIndex: dataIndex,
                ringIndex: i
            });
        }


        /*
           Force browser to calculate layout.
           This helps avoid the "nothing visible"
           problem on first render.
        */

        requestAnimationFrame(
            function () {

                panels.forEach(
                    function (panel, i) {

                        updatePanel(
                            panel,
                            i,
                            count
                        );
                    }
                );
            }
        );
    }


    /* =====================================================
       11. CALCULATE PANEL POSITION
    ===================================================== */

    function calculatePosition(
        ringIndex,
        count
    ) {

        const settings =
            currentSettings ||
            getSettings();


        const angle =
            (
                ringIndex / count
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
           Depth:

           front = positive
           back  = negative
        */

        const depth =
            Math.sin(angle);


        /*
           Convert depth into 0 → 1
        */

        const normalized =
            (depth + 1) / 2;


        /*
           Scale

           Back panels become smaller.
           Front panels become larger.
        */

        const scale =
            settings.minScale +
            (
                settings.maxScale -
                settings.minScale
            ) *
            normalized;


        /*
           Opacity
        */

        const opacity =
            0.20 +
            0.80 *
            normalized;


        /*
           Blur

           Keep it subtle.
        */

        const blur =
            Math.max(
                0,
                (1 - normalized) * 1.1
            );


        /*
           Rotation of panel
        */

        const rotateY =
            Math.cos(angle) *
            -18;


        const rotateZ =
            Math.cos(angle) *
            1.5;


        /*
           Z depth
        */

        const z =
            depth * 180;


        /*
           Hover / selected
        */

        let finalScale =
            scale;


        if (
            panels[ringIndex] &&
            panels[ringIndex].dataIndex ===
                hoveredIndex
        ) {

            finalScale *= 1.15;
        }


        if (
            panels[ringIndex] &&
            panels[ringIndex].dataIndex ===
                selectedIndex
        ) {

            finalScale *= 1.12;
        }


        return {
            x,
            y,
            z,
            scale: finalScale,
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
            "px," +
            position.y +
            "px," +
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
            position.opacity;


        panel.style.filter =
            "blur(" +
            position.blur +
            "px)";


        /*
           Front panels MUST sit above
           rear panels.
        */

        panel.style.zIndex =
            String(
                Math.round(
                    100 +
                    (
                        position.depth + 1
                    ) *
                    500
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


        if (centerImage) {

            const fallback =
                createFallbackImage(
                    visa.title
                );


            centerImage.style.opacity = "0";


            setTimeout(
                function () {

                    centerImage.src =
                        visa.image ||
                        fallback;

                    centerImage.alt =
                        visa.title +
                        " visa service";


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

                },
                selected ? 80 : 0
            );
        }


        if (centerCTA) {

            if (selected) {

                centerCTA.hidden = false;

                centerCTA.href =
                    visa.link || "#";

                centerCTA.setAttribute(
                    "aria-label",
                    "View " +
                    visa.title +
                    " visa category"
                );

            } else {

                centerCTA.hidden = true;
            }
        }
    }


    /* =====================================================
       15. DEFAULT CENTER
    ===================================================== */

    function resetCenter() {

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

            centerImage.removeAttribute("src");

            centerImage.style.opacity =
                "0";
        }


        if (centerCTA) {

            centerCTA.hidden = true;
        }
    }


    /* =====================================================
       16. SELECT VISA
    ===================================================== */

    function selectVisa(index) {

        if (
            index < 0 ||
            index >= filteredVisas.length
        ) {
            return;
        }


        selectedIndex = index;


        const visa =
            filteredVisas[index];


        showCenterPreview(
            visa,
            true
        );


        /*
           Find where this visa currently sits
           inside the rendered ring.
        */

        let ringIndex = -1;


        for (
            let i = 0;
            i < panels.length;
            i++
        ) {

            if (
                panels[i].dataIndex === index
            ) {

                ringIndex =
                    panels[i].ringIndex;

                break;
            }
        }


        if (ringIndex !== -1) {

            const count =
                panels.length;


            /*
               Move selected panel toward
               front-center.

               Front center = 3π / 2
               because sin(-π/2) = -1,
               but our orbit orientation is
               handled visually by the rotation.
            */

            const currentAngle =
                (
                    ringIndex / count
                ) *
                Math.PI *
                2;


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
        }


        renderFrame();
    }


    /* =====================================================
       17. MOUSE MOVE
    ===================================================== */

    function handlePointerMove(
        event
    ) {

        const rect =
            ring.getBoundingClientRect();


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
            (x - 0.5) * 2;


        mouseY =
            (y - 0.5) * 2;


        targetTiltY =
            mouseX *
            CONFIG.mouseTilt;


        targetTiltX =
            -mouseY *
            CONFIG.mouseTilt;


        if (
            !dragging
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
            event.pointerType ===
            "mouse" &&
            event.button !== 0
        ) {
            return;
        }


        dragging = true;

        dragStartX =
            event.clientX;

        lastPointerX =
            event.clientX;

        dragStartRotation =
            targetRotation;

        velocity = 0;


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
            delta *
            CONFIG.dragSensitivity;


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


        dragging = false;


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
           Automatic rotation
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
           Inertia
        */

        if (!dragging) {

            targetRotation +=
                velocity;

            velocity *=
                CONFIG.inertia;
        }


        /*
           Smooth rotation
        */

        rotation +=
            (
                targetRotation -
                rotation
            ) *
            CONFIG.ease;


        /*
           Smooth tilt
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
           Apply track tilt.

           The panels themselves remain
           mathematically positioned on
           an ellipse.
        */

        ringTrack.style.transform =
            "rotateX(" +
            tiltX +
            "deg)" +
            " rotateY(" +
            tiltY +
            "deg)";


        renderFrame();


        animationFrame =
            requestAnimationFrame(
                animate
            );
    }


    /* =====================================================
       22. FILTER
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
    }


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
       23. ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeFilter();

                if (
                    selectedIndex !== -1
                ) {

                    selectedIndex =
                        -1;

                    resetCenter();
                }
            }
        }
    );


    /* =====================================================
       24. FILTER LOGIC
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
                            value ===
                            "visit"
                        ) {

                            matches =
                                category.includes(
                                    "visit"
                                );
                        }

                        else if (
                            value ===
                            "business"
                        ) {

                            matches =
                                category.includes(
                                    "business"
                                );
                        }

                        else if (
                            value ===
                            "work"
                        ) {

                            matches =
                                category.includes(
                                    "work"
                                );
                        }

                        else if (
                            value ===
                            "invitation"
                        ) {

                            matches =
                                category.includes(
                                    "invitation"
                                );
                        }

                        else if (
                            value ===
                            "permit"
                        ) {

                            matches =
                                category.includes(
                                    "permit"
                                );
                        }

                        else if (
                            value ===
                            "passport"
                        ) {

                            matches =
                                category.includes(
                                    "passport"
                                );
                        }

                        else if (
                            value ===
                            "residency"
                        ) {

                            matches =
                                category.includes(
                                    "residency"
                                );
                        }
                    }


                    /*
                       PROCESSING
                    */

                    if (
                        matches &&
                        processingTime &&
                        processingTime.value !==
                            "all"
                    ) {

                        matches =
                            visa.processingTime
                                .toLowerCase() ===
                            processingTime.value;
                    }


                    /*
                       BUDGET
                    */

                    if (
                        matches &&
                        budget &&
                        budget.value !==
                            "all"
                    ) {

                        matches =
                            visa.budget
                                .toLowerCase() ===
                            budget.value;
                    }


                    /*
                       STATUS
                    */

                    if (
                        matches &&
                        status &&
                        status.value !==
                            "all"
                    ) {

                        if (
                            status.value ===
                            "popular"
                        ) {

                            matches =
                                visa.featured ===
                                true;
                        }

                        else {

                            matches =
                                visa.status
                                    .toLowerCase() ===
                                status.value;
                        }
                    }


                    return matches;
                }
            );


        selectedIndex = -1;

        targetRotation = 0;

        rotation = 0;

        resetCenter();

        renderRing();

        renderGrid();

        closeFilter();
    }


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
            }
        );
    }


    /* =====================================================
       25. CATEGORY BUTTONS
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
                        ).toLowerCase();


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
                       If exact category
                       doesn't exist,
                       try broader matching.
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


                    selectedIndex = -1;

                    rotation = 0;

                    targetRotation = 0;

                    resetCenter();

                    renderRing();

                    renderGrid();
                }
            );
        }
    );


    /* =====================================================
       26. GRID VIEW
    ===================================================== */

    function renderGrid() {

        if (!gridContainer) {
            return;
        }


        gridContainer.innerHTML = "";


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
                Number.isFinite(amount)
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


                const image =
                    document.createElement(
                        "img"
                    );


                image.loading = "lazy";

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
                        ${escapeHTML(visa.title)}
                    </h3>

                    <p>
                        ${escapeHTML(visa.category)}
                        ·
                        ${escapeHTML(visa.country)}
                    </p>
                    `;


                card.appendChild(image);

                card.appendChild(content);


                card.addEventListener(
                    "click",
                    function () {

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

                        ring.hidden = false;
                    }
                );


                gridContainer.appendChild(
                    card
                );
            }
        );
    }


    /* =====================================================
       27. OPEN GRID
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


                ring.hidden = true;

                window.scrollTo({
                    top:
                        gridView
                            ? gridView.offsetTop - 40
                            : 0,

                    behavior:
                        reducedMotion
                            ? "auto"
                            : "smooth"
                });
            }
        );
    }


    /* =====================================================
       28. RETURN TO RING
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


                ring.hidden = false;


                window.scrollTo({
                    top:
                        document.querySelector(
                            ".visa-explorer"
                        )
                            ? document.querySelector(
                                ".visa-explorer"
                            ).offsetTop
                            : 0,

                    behavior:
                        reducedMotion
                            ? "auto"
                            : "smooth"
                });
            }
        );
    }


    /* =====================================================
       29. POINTER EVENTS
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


    /* =====================================================
       30. MOUSE LEAVE
    ===================================================== */

    ring.addEventListener(
        "mouseleave",
        function () {

            targetTiltX = 0;

            targetTiltY = 0;

            if (
                selectedIndex === -1
            ) {

                hoveredIndex = -1;

                resetCenter();
            }
        }
    );


    /* =====================================================
       31. RESIZE
    ===================================================== */

    let resizeTimer = null;


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
                    150
                );
        }
    );


    /* =====================================================
       32. TOUCH SAFETY
    ===================================================== */

    ring.addEventListener(
        "touchstart",
        function () {},
        {
            passive: true
        }
    );


    /* =====================================================
       33. INITIALIZATION
    ===================================================== */

    function init() {

        /*
           If no data exists,
           create visible demo panels.
           This prevents the ring from appearing
           completely empty.
        */

        if (!visas.length) {

            console.warn(
                "CB Visa Services: visas.js did not provide visa data."
            );

            const demoCountries = [
                "United Kingdom",
                "Canada",
                "Australia",
                "USA",
                "Germany",
                "France",
                "Italy",
                "Spain",
                "Portugal",
                "Turkey",
                "UAE",
                "Saudi Arabia",
                "New Zealand",
                "Finland",
                "Norway",
                "Sweden",
                "Denmark",
                "Netherlands",
                "Belgium",
                "Austria"
            ];


            for (
                let i = 0;
                i < demoCountries.length;
                i++
            ) {

                filteredVisas.push({

                    id:
                        "demo-" +
                        i,

                    title:
                        demoCountries[i] +
                        " Visa",

                    category:
                        "Visit Visa",

                    country:
                        demoCountries[i],

                    image:
                        "",

                    link:
                        "#",

                    processingTime:
                        "standard",

                    budget:
                        "medium",

                    status:
                        "available",

                    featured:
                        false
                });
            }
        }


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


    init();

})();

/* =========================================================
   CB VISA SERVICES
   3D ELLIPTICAL VISA RING ENGINE
   STEP 4
   ========================================================= */

(() => {

    "use strict";


    /* =====================================================
       01. DATA
       ===================================================== */

    const DATA =
        window.CBVisaData ||
        {
            visas: []
        };


    const visas =
        Array.isArray(DATA.visas)
            ? DATA.visas
            : [];


    if (!visas.length) {

        console.warn(
            "CB Visa Services: No visa data found."
        );

        return;

    }


    /* =====================================================
       02. DOM HELPERS
       ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);


    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];


    /*
        We support several possible class names so this
        script can work with the existing index.html
        without forcing a complete rewrite.
    */

    const hero =
        $(".hero") ||
        $(".hero-section") ||
        $(".gallery-hero") ||
        document.querySelector("main");


    const ring =
        $("#ring") ||
        $(".ring") ||
        $(".ring-gallery") ||
        $(".gallery-ring") ||
        $(".orbit");


    const ringTrack =
        $("#ring-track") ||
        $(".ring-track") ||
        $(".orbit-track") ||
        ring;


    const centerTitle =
        $("#center-title") ||
        $(".center-title") ||
        $(".gallery-title");


    const centerDescription =
        $("#center-description") ||
        $(".center-description") ||
        $(".gallery-description");


    const centerImage =
        $("#center-image") ||
        $(".center-image") ||
        $(".gallery-preview img");


    const centerCategory =
        $("#center-category") ||
        $(".center-category") ||
        $(".gallery-category");


    const centerLocation =
        $("#center-location") ||
        $(".center-location") ||
        $(".gallery-location");


    const centerCTA =
        $("#center-cta") ||
        $(".center-cta") ||
        $(".gallery-cta");


    const filterButton =
        $("#filter-button") ||
        $(".filter-button") ||
        $('[data-action="filter"]');


    const gridButton =
        $("#grid-button") ||
        $(".grid-button") ||
        $('[data-action="grid"]');


    const ringButton =
        $("#ring-button") ||
        $(".ring-button") ||
        $('[data-action="ring"]');


    const filterOverlay =
        $("#filter-overlay") ||
        $(".filter-overlay");


    const filterClose =
        $("#filter-close") ||
        $(".filter-close");


    const gridView =
        $("#grid-view") ||
        $(".grid-view");


    /* =====================================================
       03. CONFIGURATION
       ===================================================== */

    const CONFIG = {

        desktopPanels: 150,

        tabletPanels: 110,

        mobilePanels: 82,

        smallMobilePanels: 62,


        desktopRadiusX: 720,

        desktopRadiusY: 185,


        tabletRadiusX: 520,

        tabletRadiusY: 145,


        mobileRadiusX: 360,

        mobileRadiusY: 110,


        smallMobileRadiusX: 285,

        smallMobileRadiusY: 90,


        perspective: 1200,


        autoRotationSpeed: 0.00011,


        mouseRotationStrength: 0.00065,


        mouseTiltStrength: 4,


        dragSensitivity: 0.0042,


        inertiaDamping: 0.94,


        positionEase: 0.12,


        hoverScale: 1.16,


        selectedScale: 1.12,


        panelWidthDesktop: 42,

        panelHeightDesktop: 112,


        panelWidthMobile: 31,

        panelHeightMobile: 84

    };


    /* =====================================================
       04. STATE
       ===================================================== */

    const state = {

        rotation: 0,

        targetRotation: 0,

        velocity: 0,


        mouseX: 0,

        mouseY: 0,


        targetMouseX: 0,

        targetMouseY: 0,


        tiltX: 0,

        tiltY: 0,


        targetTiltX: 0,

        targetTiltY: 0,


        dragging: false,

        dragStartX: 0,

        dragLastX: 0,

        dragVelocity: 0,


        hoveredIndex: -1,

        selectedIndex: -1,


        panels: [],


        lastTime: performance.now(),


        reducedMotion:
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches,


        isMobile: false,


        panelCount: 150,


        radiusX: 720,

        radiusY: 185

    };


    /* =====================================================
       05. RESPONSIVE SETTINGS
       ===================================================== */

    function updateResponsiveSettings() {

        const width =
            window.innerWidth;


        if (width <= 480) {

            state.isMobile = true;

            state.panelCount =
                CONFIG.smallMobilePanels;

            state.radiusX =
                Math.min(
                    CONFIG.smallMobileRadiusX,
                    width * 0.70
                );

            state.radiusY =
                CONFIG.smallMobileRadiusY;

        }

        else if (width <= 768) {

            state.isMobile = true;

            state.panelCount =
                CONFIG.mobilePanels;

            state.radiusX =
                Math.min(
                    CONFIG.mobileRadiusX,
                    width * 0.82
                );

            state.radiusY =
                CONFIG.mobileRadiusY;

        }

        else if (width <= 1024) {

            state.isMobile = false;

            state.panelCount =
                CONFIG.tabletPanels;

            state.radiusX =
                Math.min(
                    CONFIG.tabletRadiusX,
                    width * 0.72
                );

            state.radiusY =
                CONFIG.tabletRadiusY;

        }

        else {

            state.isMobile = false;

            state.panelCount =
                CONFIG.desktopPanels;

            state.radiusX =
                Math.min(
                    CONFIG.desktopRadiusX,
                    width * 0.42
                );

            state.radiusY =
                CONFIG.desktopRadiusY;

        }

    }


    /* =====================================================
       06. CREATE PANEL
       ===================================================== */

    function createPanel(
        visa,
        index
    ) {

        const panel =
            document.createElement("button");


        panel.type = "button";


        panel.className =
            "ring-panel";


        panel.dataset.index =
            index;


        panel.dataset.visaId =
            visa.id;


        panel.setAttribute(
            "aria-label",
            `${visa.title}, ${visa.category}, ${visa.location}`
        );


        const image =
            document.createElement("img");


        image.className =
            "ring-panel-image";


        image.alt =
            `${visa.title} — ${visa.location}`;


        image.loading =
            index < 25
                ? "eager"
                : "lazy";


        image.decoding =
            "async";


        image.src =
            visa.thumbnail ||
            visa.image ||
            "";


        /*
            Graceful image fallback.
        */

        image.addEventListener(
            "error",
            () => {

                image.classList.add(
                    "image-failed"
                );

                image.removeAttribute(
                    "src"
                );

            },
            {
                once: true
            }
        );


        panel.appendChild(
            image
        );


        /*
            Hover
        */

        panel.addEventListener(
            "mouseenter",
            () => {

                state.hoveredIndex =
                    index;


                updateCenterPreview(
                    visa,
                    false
                );

            }
        );


        panel.addEventListener(
            "mouseleave",
            () => {

                if (
                    state.selectedIndex === -1
                ) {

                    state.hoveredIndex =
                        -1;

                    showDefaultCenter();

                }

            }
        );


        /*
            Click
        */

        panel.addEventListener(
            "click",
            () => {

                selectPanel(
                    index
                );

            }
        );


        /*
            Keyboard
        */

        panel.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    selectPanel(
                        index
                    );

                }

            }
        );


        return {

            element: panel,

            image,

            index,

            visa

        };

    }


    /* =====================================================
       07. RENDER RING
       ===================================================== */

    function renderRing() {

        if (!ringTrack)
            return;


        /*
            Clear previous panels.
        */

        ringTrack.innerHTML = "";


        state.panels = [];


        const count =
            state.panelCount;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            /*
                Loop through the full 300+
                dataset instead of creating
                300 DOM elements.
            */

            const visa =
                visas[
                    i % visas.length
                ];


            const panel =
                createPanel(
                    visa,
                    i
                );


            ringTrack.appendChild(
                panel.element
            );


            state.panels.push(
                panel
            );

        }

    }


    /* =====================================================
       08. RING GEOMETRY
       ===================================================== */

    function calculatePanel(
        index,
        count
    ) {

        /*
            Mathematical elliptical orbit.

            angle =
            index / total * 2PI + rotation
        */

        const angle =
            (
                index / count
            ) *
            Math.PI *
            2
            +
            state.rotation;


        /*
            Ellipse coordinates.
        */

        const x =
            Math.cos(angle) *
            state.radiusX;


        const y =
            Math.sin(angle) *
            state.radiusY;


        /*
            Front/back depth.

            sin(angle)

            Positive = front
            Negative = back
        */

        const depth =
            Math.sin(angle);


        /*
            Normalize depth
            from 0 → 1.
        */

        const normalizedDepth =
            (
                depth + 1
            ) / 2;


        /*
            Perspective scale.

            Back:
            approximately 0.48

            Front:
            approximately 1.05
        */

        const scale =
            0.50 +
            normalizedDepth *
            0.55;


        /*
            Back cards become
            more transparent.
        */

        const opacity =
            0.25 +
            normalizedDepth *
            0.75;


        /*
            Very subtle depth blur.
        */

        const blur =
            (
                1 -
                normalizedDepth
            ) *
            1.15;


        /*
            Rotate panel toward
            the center of ellipse.
        */

        let rotateY =
            Math.cos(angle) *
            -22;


        /*
            Small Z rotation creates
            more natural card orientation.
        */

        const rotateZ =
            Math.cos(angle) *
            3;


        /*
            Actual 3D Z position.
        */

        const z =
            depth *
            170;


        /*
            Layer ordering.
        */

        const zIndex =
            Math.round(
                (
                    normalizedDepth *
                    1000
                )
            );


        return {

            angle,

            x,

            y,

            z,

            depth,

            scale,

            opacity,

            blur,

            rotateY,

            rotateZ,

            zIndex

        };

    }


    /* =====================================================
       09. APPLY PANEL TRANSFORM
       ===================================================== */

    function applyPanelTransform(
        panel,
        geometry
    ) {

        const element =
            panel.element;


        /*
            Hover emphasis.
        */

        let scale =
            geometry.scale;


        if (
            panel.index ===
            state.hoveredIndex
        ) {

            scale *=
                CONFIG.hoverScale;

        }


        if (
            panel.index ===
            state.selectedIndex
        ) {

            scale *=
                CONFIG.selectedScale;

        }


        /*
            Keep back panels elegant.
        */

        let opacity =
            geometry.opacity;


        if (
            panel.index ===
            state.hoveredIndex
        ) {

            opacity = 1;

        }


        /*
            Selected panel.
        */

        if (
            panel.index ===
            state.selectedIndex
        ) {

            opacity = 1;

        }


        /*
            3D transform.

            This is the important part.

            It is NOT a flat curved row.
        */

        element.style.transform =

            `translate3d(
                calc(-50% + ${geometry.x}px),
                calc(-50% + ${geometry.y}px),
                ${geometry.z}px
            )
            rotateY(${geometry.rotateY}deg)
            rotateZ(${geometry.rotateZ}deg)
            scale(${scale})`;


        element.style.opacity =
            opacity;


        element.style.filter =
            `blur(${geometry.blur}px)`;


        element.style.zIndex =
            geometry.zIndex;


        /*
            CSS custom properties useful
            for styling/debugging.
        */

        element.style.setProperty(
            "--depth",
            geometry.depth.toFixed(3)
        );

    }


    /* =====================================================
       10. UPDATE ALL PANELS
       ===================================================== */

    function updatePanels() {

        const count =
            state.panels.length;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const panel =
                state.panels[i];


            const geometry =
                calculatePanel(
                    i,
                    count
                );


            applyPanelTransform(
                panel,
                geometry
            );

        }

    }


    /* =====================================================
       11. CENTER PREVIEW
       ===================================================== */

    function updateCenterPreview(
        visa,
        locked
    ) {

        if (!visa)
            return;


        if (centerTitle) {

            centerTitle.classList.add(
                "is-changing"
            );


            window.setTimeout(
                () => {

                    centerTitle.textContent =
                        visa.title;

                    centerTitle.classList.remove(
                        "is-changing"
                    );

                },
                100
            );

        }


        if (centerDescription) {

            centerDescription.textContent =
                visa.description ||
                "Professional visa consultancy and application assistance.";

        }


        if (centerCategory) {

            centerCategory.textContent =
                visa.category ||
                "Visa Services";

        }


        if (centerLocation) {

            centerLocation.textContent =
                visa.location ||
                visa.country ||
                "";

        }


        if (centerImage) {

            /*
                Crossfade image.

                No flicker.
            */

            centerImage.classList.add(
                "is-changing"
            );


            const newImage =
                new Image();


            newImage.onload =
                () => {

                    centerImage.src =
                        newImage.src;


                    centerImage.classList.remove(
                        "is-changing"
                    );

                };


            newImage.onerror =
                () => {

                    centerImage.classList.remove(
                        "is-changing"
                    );

                };


            newImage.src =
                visa.image ||
                visa.thumbnail ||
                "";

        }


        if (centerCTA) {

            centerCTA.hidden =
                !locked;

            centerCTA.textContent =
                locked
                    ? "View Visa Category +"
                    : "";

        }


        if (centerTitle) {

            centerTitle.setAttribute(
                "aria-live",
                "polite"
            );

        }

    }


    /* =====================================================
       12. DEFAULT CENTER
       ===================================================== */

    function showDefaultCenter() {

        if (state.selectedIndex !== -1)
            return;


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
                "";

        }


        if (centerLocation) {

            centerLocation.textContent =
                "";

        }


        if (centerImage) {

            centerImage.removeAttribute(
                "src"
            );

            centerImage.classList.remove(
                "is-visible"
            );

        }


        if (centerCTA) {

            centerCTA.hidden =
                true;

        }

    }


    /* =====================================================
       13. SELECT PANEL
       ===================================================== */

    function selectPanel(
        index
    ) {

        const panel =
            state.panels[index];


        if (!panel)
            return;


        state.selectedIndex =
            index;


        state.hoveredIndex =
            index;


        /*
            Move selected panel
            toward front-center.

            Find its current angle
            and rotate opposite.
        */

        const count =
            state.panels.length;


        const currentAngle =
            (
                index / count
            ) *
            Math.PI *
            2
            +
            state.rotation;


        /*
            We want approximately
            Math.PI / 2 = front.
        */

        const desiredAngle =
            Math.PI / 2;


        let delta =
            desiredAngle -
            currentAngle;


        /*
            Normalize shortest path.
        */

        delta =
            Math.atan2(
                Math.sin(delta),
                Math.cos(delta)
            );


        state.targetRotation +=
            delta;


        updateCenterPreview(
            panel.visa,
            true
        );


        /*
            Tell accessibility users
            which item is selected.
        */

        state.panels.forEach(
            item => {

                item.element
                    .classList
                    .remove(
                        "is-selected"
                    );

            }
        );


        panel.element
            .classList
            .add(
                "is-selected"
            );

    }


    /* =====================================================
       14. MOUSE MOVEMENT
       ===================================================== */

    function handlePointerMove(
        event
    ) {

        if (!hero)
            return;


        const rect =
            hero.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left;


        const y =
            event.clientY -
            rect.top;


        /*
            Normalize:

            -1 = left/top
             0 = center
             1 = right/bottom
        */

        state.targetMouseX =
            (
                x /
                rect.width
            ) *
            2 -
            1;


        state.targetMouseY =
            (
                y /
                rect.height
            ) *
            2 -
            1;

    }


    /* =====================================================
       15. DRAG START
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


        state.dragging =
            true;


        state.dragStartX =
            event.clientX;


        state.dragLastX =
            event.clientX;


        state.dragVelocity =
            0;


        if (ring) {

            ring.classList.add(
                "is-dragging"
            );

        }


        if (
            ring &&
            ring.setPointerCapture
        ) {

            try {

                ring.setPointerCapture(
                    event.pointerId
                );

            }

            catch (error) {}

        }

    }


    /* =====================================================
       16. DRAG MOVE
       ===================================================== */

    function handlePointerDrag(
        event
    ) {

        if (
            !state.dragging
        ) {

            return;

        }


        const currentX =
            event.clientX;


        const delta =
            currentX -
            state.dragLastX;


        state.dragLastX =
            currentX;


        const rotationDelta =
            delta *
            CONFIG.dragSensitivity;


        state.targetRotation +=
            rotationDelta;


        state.dragVelocity =
            rotationDelta;

    }


    /* =====================================================
       17. DRAG END
       ===================================================== */

    function handlePointerUp() {

        if (
            !state.dragging
        ) {

            return;

        }


        state.dragging =
            false;


        if (ring) {

            ring.classList.remove(
                "is-dragging"
            );

        }


        /*
            Momentum continues after release.
        */

        state.velocity =
            state.dragVelocity;

    }


    /* =====================================================
       18. SMOOTH INTERPOLATION
       ===================================================== */

    function lerp(
        current,
        target,
        amount
    ) {

        return (
            current +
            (
                target -
                current
            ) *
            amount
        );

    }


    /* =====================================================
       19. ANIMATION LOOP
       ===================================================== */

    function animate(
        currentTime
    ) {

        const deltaTime =
            Math.min(
                currentTime -
                state.lastTime,
                50
            );


        state.lastTime =
            currentTime;


        /*
            Smooth mouse values.
        */

        state.mouseX =
            lerp(
                state.mouseX,
                state.targetMouseX,
                0.08
            );


        state.mouseY =
            lerp(
                state.mouseY,
                state.targetMouseY,
                0.08
            );


        /*
            Mouse creates subtle
            target tilt.
        */

        state.targetTiltX =
            state.mouseY *
            CONFIG.mouseTiltStrength;


        state.targetTiltY =
            state.mouseX *
            CONFIG.mouseTiltStrength;


        state.tiltX =
            lerp(
                state.tiltX,
                state.targetTiltX,
                0.06
            );


        state.tiltY =
            lerp(
                state.tiltY,
                state.targetTiltY,
                0.06
            );


        /*
            Automatic movement.

            Disabled when reduced motion
            is requested.
        */

        if (
            !state.reducedMotion &&
            !state.dragging
        ) {

            state.targetRotation +=
                CONFIG.autoRotationSpeed *
                deltaTime;

        }


        /*
            Drag momentum.
        */

        if (
            !state.dragging &&
            Math.abs(
                state.velocity
            ) > 0.00001
        ) {

            state.targetRotation +=
                state.velocity;


            state.velocity *=
                CONFIG.inertiaDamping;

        }


        /*
            Smooth rotation.
        */

        state.rotation =
            lerp(
                state.rotation,
                state.targetRotation,
                CONFIG.positionEase
            );


        /*
            Apply subtle perspective
            movement to the complete ring.
        */

        if (ring) {

            ring.style.transform =

                `translate3d(
                    ${state.mouseX * 10}px,
                    ${state.mouseY * 5}px,
                    0
                )
                rotateX(${state.tiltX * -0.18}deg)
                rotateY(${state.tiltY * 0.18}deg)`;

        }


        /*
            Update panel transforms.
        */

        updatePanels();


        requestAnimationFrame(
            animate
        );

    }


    /* =====================================================
       20. FILTER OVERLAY
       ===================================================== */

    function openFilter() {

        if (!filterOverlay)
            return;


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


        const firstInput =
            filterOverlay.querySelector(
                "input, select, button"
            );


        if (firstInput) {

            window.setTimeout(
                () => firstInput.focus(),
                100
            );

        }

    }


    function closeFilter() {

        if (!filterOverlay)
            return;


        filterOverlay.classList.remove(
            "is-open"
        );


        filterOverlay.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "filter-open"
        );


        if (filterButton) {

            filterButton.focus();

        }

    }


    /* =====================================================
       21. FILTER EVENTS
       ===================================================== */

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
            event => {

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
       22. ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeFilter();

            }

        }
    );


    /* =====================================================
       23. GRID VIEW
       ===================================================== */

    function openGridView() {

        if (!gridView)
            return;


        if (hero) {

            hero.classList.add(
                "grid-mode"
            );

        }


        gridView.hidden =
            false;


        renderGrid();

    }


    function closeGridView() {

        if (!gridView)
            return;


        if (hero) {

            hero.classList.remove(
                "grid-mode"
            );

        }


        gridView.hidden =
            true;

    }


    if (gridButton) {

        gridButton.addEventListener(
            "click",
            openGridView
        );

    }


    if (ringButton) {

        ringButton.addEventListener(
            "click",
            closeGridView
        );

    }


    /* =====================================================
       24. GRID RENDERING
       ===================================================== */

    function renderGrid() {

        if (!gridView)
            return;


        const container =
            gridView.querySelector(
                ".grid-container"
            ) ||
            gridView;


        container.innerHTML =
            "";


        /*
            Render all available services
            in grid mode.
        */

        visas.forEach(
            (visa, index) => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "visa-grid-card";


                card.dataset.index =
                    index;


                card.innerHTML = `

                    <div class="visa-grid-image">

                        <img
                            src="${escapeHTML(
                                visa.image ||
                                visa.thumbnail ||
                                ""
                            )}"
                            alt="${escapeHTML(
                                visa.title
                            )}"
                            loading="lazy"
                        >

                    </div>

                    <div class="visa-grid-content">

                        <div class="visa-grid-category">
                            ${escapeHTML(
                                visa.category ||
                                "Visa Services"
                            )}
                        </div>

                        <h3>
                            ${escapeHTML(
                                visa.title
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                visa.location ||
                                visa.country ||
                                ""
                            )}
                        </p>

                        <button
                            type="button"
                            class="visa-grid-link"
                            data-index="${index}"
                        >
                            View Category +
                        </button>

                    </div>

                `;


                const button =
                    card.querySelector(
                        ".visa-grid-link"
                    );


                if (button) {

                    button.addEventListener(
                        "click",
                        () => {

                            closeGridView();


                            /*
                                Find corresponding
                                visible panel.
                            */

                            const visibleIndex =
                                index %
                                state.panels.length;


                            selectPanel(
                                visibleIndex
                            );


                            if (centerTitle) {

                                centerTitle.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center"
                                });

                            }

                        }
                    );

                }


                container.appendChild(
                    card
                );

            }
        );

    }


    /* =====================================================
       25. HTML ESCAPE
       ===================================================== */

    function escapeHTML(
        value
    ) {

        return String(
            value ?? ""
        )
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
       26. RESIZE
       ===================================================== */

    let resizeTimer;


    function handleResize() {

        window.clearTimeout(
            resizeTimer
        );


        resizeTimer =
            window.setTimeout(
                () => {

                    updateResponsiveSettings();

                    renderRing();

                    updatePanels();

                },
                120
            );

    }


    window.addEventListener(
        "resize",
        handleResize,
        {
            passive: true
        }
    );


    /* =====================================================
       27. POINTER EVENTS
       ===================================================== */

    if (hero) {

        hero.addEventListener(
            "pointermove",
            handlePointerMove,
            {
                passive: true
            }
        );

    }


    if (ring) {

        ring.addEventListener(
            "pointerdown",
            handlePointerDown
        );


        ring.addEventListener(
            "pointermove",
            handlePointerDrag
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
            event => {

                if (
                    state.dragging &&
                    event.pointerType ===
                    "mouse"
                ) {

                    handlePointerUp();

                }

            }
        );

    }


    /* =====================================================
       28. TOUCH SUPPORT
       ===================================================== */

    if (ring) {

        ring.style.touchAction =
            "none";

    }


    /* =====================================================
       29. INITIALIZATION
       ===================================================== */

    function init() {

        console.log(
            "CB Visa Services Ring Gallery"
        );


        console.log(
            `Loaded ${visas.length} visa/service records.`
        );


        updateResponsiveSettings();


        renderRing();


        showDefaultCenter();


        /*
            Initial ring position.
        */

        state.rotation =
            0;


        state.targetRotation =
            0;


        /*
            Start animation.
        */

        requestAnimationFrame(
            animate
        );

    }


    /* =====================================================
       30. START
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    }

    else {

        init();

    }


})();

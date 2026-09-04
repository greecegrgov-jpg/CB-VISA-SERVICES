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


    /*
      Calculate where the selected panel
      currently is on the ellipse.
    */

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
      Desired front position
    */

    const difference =
        CONFIG.frontAngle -
        currentAngle;


    /*
      Always use the shortest path.
    */

    const shortest =
        Math.atan2(
            Math.sin(difference),
            Math.cos(difference)
        );


    /*
      Smooth target rotation.

      IMPORTANT:
      We only change targetRotation here
      when the user CLICKS a visa.

      Hover never calls this function.
    */

    targetRotation =
        rotation +
        shortest;


    /*
      Lock selected service.
    */

    if (lockSelection) {

        selectedIndex =
            index;

    }


    /*
      Selected visual state.
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


/* =========================================================
   18. SELECT VISA
========================================================= */

function selectVisa(
    index
) {

    if (
        !filteredVisas[index] ||
        !panels[index]
    ) {
        return;
    }


    /*
      Remember selection.
    */

    selectedIndex =
        index;


    hoveredIndex =
        index;


    const visa =
        filteredVisas[index];


    /*
      Update center.
    */

    updateCenter(
        visa
    );


    /*
      Move selected visa
      smoothly to front-center.
    */

    focusVisa(
        index,
        true
    );


    /*
      Selected panel.
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
   19. OPEN VISA LIGHTBOX
========================================================= */

function openVisaLightbox(
    visa
) {

    if (
        !visa ||
        !lightbox
    ) {
        return;
    }


    const imageSource =
        getVisaImage(
            visa
        );


    /*
      IMAGE
    */

    if (lightboxImage) {

        lightboxImage.src =
            imageSource;


        lightboxImage.alt =
            `${visa.title} — ${visa.country || visa.location}`;

    }


    /*
      CATEGORY
    */

    if (lightboxCategory) {

        lightboxCategory.textContent =
            formatCategory(
                visa.category
            );

    }


    /*
      TITLE
    */

    if (lightboxTitle) {

        lightboxTitle.textContent =
            visa.title;

    }


    /*
      LOCATION
    */

    if (lightboxLocation) {

        lightboxLocation.textContent =
            visa.country ||
            visa.location ||
            "";

    }


    /*
      OPEN LIGHTBOX
    */

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
      for accessibility.
    */

    if (lightboxClose) {

        requestAnimationFrame(
            function () {

                lightboxClose.focus();

            }
        );

    }

}


/* =========================================================
   20. CLOSE VISA LIGHTBOX
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


    /*
      Do NOT reset activeVisa.

      The selected/previewed visa
      remains in the center.
    */

}


/* =========================================================
   21. LIGHTBOX EVENTS
========================================================= */

function initLightbox() {

    /*
      ===============================================
      CENTER PREVIEW CLICK
      ===============================================
    */

    if (centerPreview) {

        centerPreview.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                /*
                  Nothing selected yet.
                */

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
      ===============================================
      CENTER IMAGE FALLBACK
      ===============================================
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
      ===============================================
      CLOSE BUTTON
      ===============================================
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
      ===============================================
      BACKDROP
      ===============================================
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
      ===============================================
      OUTER LIGHTBOX
      ===============================================
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
   22. PROCESSING TIME RANGE
========================================================= */

function getProcessingRange(
    value
) {

    if (!value) {
        return null;
    }


    const normalized =
        String(
            value
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


/* =========================================================
   23. PROCESSING FILTER
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


    const range =
        getProcessingRange(
            visa.processingTime
        );


    if (!range) {

        return false;

    }


    /*
      FAST
      Up to 7 days
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
      7–15 days
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
      15+ days
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


/* =========================================================
   24. GET MAXIMUM PRICE
========================================================= */

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


/* =========================================================
   25. BUDGET FILTER
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


    /*
      LOW
      $0–$500
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


/* =========================================================
   26. STATUS FILTER
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


    /*
      NORMAL STATUS
    */

    return (

        String(
            visa.status || ""
        )
        .toLowerCase()

        ===

        String(
            selected
        )
        .toLowerCase()

    );

}


/* =========================================================
   27. SERVICE TYPE FILTER
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


    /*
      EXACT MATCH
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
        selectedCategory ===
        "visit"
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
        selectedCategory ===
        "business"
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
        selectedCategory ===
        "work"
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


/* =========================================================
   28. APPLY FILTERS
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


    /*
      FILTER ALL DATA
    */

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
      RESET RING
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
      RENDER
    */

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
   29. CATEGORY FILTER
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
      Sync select box
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
      Reset secondary filters
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
      Category filter
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
      RESET STATE
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


    /*
      RENDER
    */

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


/* =========================================================
   30. CATEGORY BUTTON STATE
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
   31. CATEGORY BUTTON EVENTS
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
   END OF PART 2
========================================================= */
/* =========================================================
   CB VISA SERVICES
   FINAL RING SYSTEM
   PART 3 / 3

   GRID
   FILTER
   DRAG / SWIPE
   KEYBOARD
   LIGHTBOX
   ANIMATION
   RESIZE
   INITIALIZATION
========================================================= */


/* =========================================================
   32. GRID RENDER
========================================================= */

function renderGrid() {

    if (!gridContainer) {
        return;
    }


    gridContainer.innerHTML = "";


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


    /*
      Default: show all filtered services.
      If visa-count exists, respect its value.
    */

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


        if (!Number.isNaN(number)) {

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
                                decoding="async"
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


                /*
                  Image fallback
                */

                const image =
                    card.querySelector(
                        "img"
                    );


                if (image) {

                    image.draggable =
                        false;


                    image.onerror =
                        function () {

                            this.onerror =
                                null;

                            this.src =
                                fallbackImage();

                        };

                }


                /*
                  Card click
                */

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


                            if (index < 0) {
                                return;
                            }


                            /*
                              Update center immediately.
                            */

                            updateCenter(
                                visa
                            );


                            /*
                              Return to ring.
                            */

                            switchToRing();


                            /*
                              Rotate selected service
                              only if that service is
                              currently rendered.
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
                                          The ring has a
                                          rendering limit.

                                          Keep center details
                                          but don't pretend
                                          the invisible panel
                                          is selected.
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
   33. RESULT COUNT
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
   34. OPEN FILTER
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

        requestAnimationFrame(
            function () {

                filterClose.focus();

            }
        );

    }

}


/* =========================================================
   35. CLOSE FILTER
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
   36. RESET FILTERS
========================================================= */

function resetFilters() {

    /*
      Reset selects
    */

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


    /*
      Reset category buttons
    */

    updateCategoryButtonState(
        ""
    );


    /*
      Restore complete data
    */

    filteredVisas =
        [...ALL_VISAS];


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
      Render
    */

    renderRing();

    renderGrid();

    updateResultCount();

    resetCenter();

}


/* =========================================================
   37. RESET BUTTON
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
   38. FILTER EVENTS
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

                    /*
                      Service category select
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


/* =========================================================
   39. GRID VIEW
========================================================= */

function switchToGrid() {

    currentView =
        "grid";


    /*
      Hide ring
    */

    if (ring) {

        ring.setAttribute(
            "hidden",
            ""
        );

    }


    /*
      Show grid
    */

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


    /*
      Button states
    */

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


    /*
      Render grid
    */

    renderGrid();


    /*
      Scroll
    */

    if (gridView) {

        requestAnimationFrame(
            function () {

                gridView.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });

            }
        );

    }

}


/* =========================================================
   40. RING VIEW
========================================================= */

function switchToRing() {

    currentView =
        "ring";


    /*
      Hide grid
    */

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


    /*
      Show ring
    */

    if (ring) {

        ring.removeAttribute(
            "hidden"
        );

    }


    /*
      Button states
    */

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


    /*
      Immediately render current position.
    */

    updateAllPanels(
        true
    );


    /*
      Scroll back to explorer.
    */

    const explorer =
        document.querySelector(
            ".visa-explorer"
        );


    if (explorer) {

        requestAnimationFrame(
            function () {

                explorer.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });

            }
        );

    }

}


/* =========================================================
   41. VIEW BUTTONS
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
   42. DRAG / SWIPE SYSTEM

   IMPORTANT FIX:

   - Very low sensitivity
   - Limited velocity
   - No vertical mouse influence
   - Smooth inertia
   - Prevent accidental click
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

            /*
              Ignore right-click.
            */

            if (
                event.pointerType === "mouse" &&
                event.button !== 0
            ) {

                return;

            }


            /*
              Don't drag behind lightbox.
            */

            if (lightboxOpen) {
                return;
            }


            /*
              Start drag.
            */

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


            /*
              Stop hover state while dragging.
            */

            hoveredIndex =
                -1;


            panels.forEach(
                function (panel) {

                    panel.classList.remove(
                        "is-hovered"
                    );

                }
            );


            ring.classList.add(
                "is-dragging"
            );


            /*
              Pointer capture.
            */

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


            /*
              IMPORTANT:

              We use ONLY clientX.

              Up/down movement does NOT
              affect the ring rotation.

              This prevents unwanted
              vertical cursor speed.
            */

            const delta =
                event.clientX -
                dragStartX;


            const movement =
                event.clientX -
                lastPointerX;


            /*
              Actual drag detection.
            */

            if (
                Math.abs(delta) >
                5
            ) {

                dragMoved =
                    true;

            }


            /*
              =========================================
              SLOW DRAG ROTATION
              =========================================

              Sensitivity is intentionally
              extremely low.
            */

            targetRotation =

                dragStartRotation +

                (
                    delta *
                    CONFIG.dragSensitivity
                );


            /*
              =========================================
              CONTROLLED VELOCITY
              =========================================
            */

            velocity =
                movement *
                0.00025;


            /*
              HARD SPEED LIMIT
            */

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
      ===============================================
      END DRAG
      ===============================================
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


        /*
          Final velocity limit.
        */

        velocity =
            Math.max(
                -0.004,
                Math.min(
                    0.004,
                    velocity
                )
            );


        /*
          Release pointer.
        */

        try {

            ring.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {}


        /*
          Keep dragMoved active briefly
          so mouseup doesn't trigger
          accidental panel click.
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


    ring.addEventListener(
        "lostpointercapture",
        function () {

            if (isDragging) {

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
   43. RING HOVER PAUSE
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


            /*
              Clear hover state.
            */

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
   44. FILTER BUTTON
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
   45. KEYBOARD NAVIGATION
========================================================= */

function initKeyboard() {

    document.addEventListener(
        "keydown",
        function (event) {

            /*
              ==========================================
              ESC
              ==========================================
            */

            if (
                event.key ===
                "Escape"
            ) {

                /*
                  Lightbox gets priority.
                */

                if (lightboxOpen) {

                    closeVisaLightbox();

                    return;

                }


                /*
                  Then filter.
                */

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
              Don't control ring while typing.
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


            /*
              ==========================================
              RIGHT
              ==========================================
            */

            if (
                event.key ===
                "ArrowRight"
            ) {

                event.preventDefault();


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


                /*
                  If outside rendered ring,
                  keep selection within visible range.
                */

                if (!panels[next]) {

                    next =
                        next %
                        panels.length;

                }


                if (panels[next]) {

                    selectVisa(
                        next
                    );

                }

            }


            /*
              ==========================================
              LEFT
              ==========================================
            */

            if (
                event.key ===
                "ArrowLeft"
            ) {

                event.preventDefault();


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


                if (!panels[previous]) {

                    previous =
                        panels.length -
                        1;

                }


                if (panels[previous]) {

                    selectVisa(
                        previous
                    );

                }

            }

        }
    );

}


/* =========================================================
   46. CENTER CTA
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
              Individual visa service page
              can be connected here later.
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
   47. RESIZE
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

                        /*
                          Re-render according
                          to new device size.
                        */

                        renderRing();


                        /*
                          Keep selected center.
                        */

                        if (
                            selectedIndex >= 0 &&
                            filteredVisas[selectedIndex]
                        ) {

                            updateCenter(
                                filteredVisas[
                                    selectedIndex
                                ]
                            );

                        }

                    },
                    180
                );

        }
    );

}


/* =========================================================
   48. ANIMATION LOOP

   IMPORTANT:

   Mouse movement itself does NOT
   directly rotate the ring.

   Only:

   1. Drag
   2. Click selection
   3. Slow auto rotation
   4. Inertia

   can change targetRotation.
========================================================= */

function animate(
    currentTime
) {

    /*
      Limit large frame gaps.
    */

    const delta =
        Math.min(
            currentTime -
            lastTime,
            32
        );


    lastTime =
        currentTime;


    /*
      Only animate ring view.
    */

    if (
        currentView ===
        "ring"
    ) {


        /*
          ============================================
          DRAG INERTIA
          ============================================
        */

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


            /*
              Stop tiny residual movement.
            */

            if (
                Math.abs(
                    velocity
                ) <
                0.00001
            ) {

                velocity =
                    0;

            }

        }


        /*
          ============================================
          AUTO ROTATION
          ============================================

          Auto rotation is disabled when:

          - dragging
          - cursor is over ring
          - hovering a panel
          - service selected
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
      Smoothly move actual rotation
      toward target rotation.
    */

    updateAllPanels();


    /*
      Next frame.
    */

    requestAnimationFrame(
        animate
    );

}


/* =========================================================
   49. INITIALIZE APPLICATION
========================================================= */

function init() {

    console.log(
        "===================================="
    );


    console.log(
        "CB VISA SERVICES"
    );


    console.log(
        "FINAL 3D RING SYSTEM"
    );


    console.log(
        "Total services:",
        ALL_VISAS.length
    );


    console.log(
        "3D Elliptical Ring:",
        "ACTIVE"
    );


    console.log(
        "Hover Preview:",
        "ACTIVE"
    );


    console.log(
        "Hover Rotation:",
        "DISABLED"
    );


    console.log(
        "Controlled Mouse Drag:",
        "ACTIVE"
    );


    console.log(
        "Center Lightbox:",
        "ACTIVE"
    );


    console.log(
        "Category Filter:",
        "ACTIVE"
    );


    console.log(
        "Advanced Filters:",
        "ACTIVE"
    );


    console.log(
        "Grid View:",
        "ACTIVE"
    );


    console.log(
        "Keyboard Navigation:",
        "ACTIVE"
    );


    console.log(
        "===================================="
    );


    /*
      ==========================================
      INITIAL CENTER
      ==========================================
    */

    resetCenter();


    /*
      ==========================================
      INITIAL RING
      ==========================================
    */

    renderRing();


    /*
      ==========================================
      INITIAL GRID
      ==========================================
    */

    renderGrid();


    /*
      ==========================================
      EVENTS
      ==========================================
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
      ==========================================
      RESULT COUNT
      ==========================================
    */

    updateResultCount();


    /*
      ==========================================
      START ANIMATION
      ==========================================
    */

    requestAnimationFrame(
        animate
    );

}


/* =========================================================
   50. START
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


/* =========================================================
   END OF CB VISA SERVICES SCRIPT
========================================================= */

})();

})();

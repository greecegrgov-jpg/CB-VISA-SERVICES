/* =========================================================
   CB VISA SERVICES
   STEP 7 — RING + FILTER + CATEGORY + GRID SYSTEM
   Static / Vanilla JS / No Backend
========================================================= */

(function () {
  "use strict";

  /* =========================================================
     1. DATA
  ========================================================= */

  const DATA = window.CBVisaData;

  if (!DATA || !Array.isArray(DATA.visas)) {
    console.error("CB Visa Services: visas.js data not found.");
    return;
  }

  const ALL_VISAS = DATA.visas.map((visa, index) => ({
    ...visa,

    id: visa.id || `visa-${index + 1}`,
    title: visa.title || "Visa Service",

    category: String(visa.category || "").trim(),
    location: String(
      visa.location ||
      visa.country ||
      ""
    ).trim(),

    country: String(
      visa.country ||
      visa.location ||
      ""
    ).trim(),

    priceRange: String(
      visa.priceRange ||
      ""
    ).trim(),

    processingTime: String(
      visa.processingTime ||
      ""
    ).trim(),

    status: String(
      visa.status ||
      "available"
    ).trim().toLowerCase(),

    image: visa.image || visa.thumbnail || "",

    description:
      visa.description ||
      "Professional visa assistance and application support."
  }));


  /* =========================================================
     2. DOM
  ========================================================= */

  const ring = document.getElementById("ring");
  const ringTrack = document.getElementById("ring-track");

  const centerTitle = document.getElementById("center-title");
  const centerDescription = document.getElementById("center-description");
  const centerImage = document.getElementById("center-image");
  const centerCategory = document.getElementById("center-category");
  const centerLocation = document.getElementById("center-location");
  const centerCTA = document.getElementById("center-cta");

  const filterButton = document.getElementById("filter-button");
  const gridButton = document.getElementById("grid-button");

  const filterOverlay = document.getElementById("filter-overlay");
  const filterClose = document.getElementById("filter-close");

  const serviceType = document.getElementById("service-type");
  const processingTime = document.getElementById("processing-time");
  const budget = document.getElementById("budget");
  const status = document.getElementById("status");
  const visaCount = document.getElementById("visa-count");

  const gridView = document.getElementById("grid-view");
  const gridContainer = document.getElementById("grid-container");
  const ringButton = document.getElementById("ring-button");


  /* =========================================================
     3. CONFIG
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


  /* =========================================================
     4. STATE
  ========================================================= */

  let filteredVisas = [...ALL_VISAS];

  let panels = [];

  let selectedIndex = -1;

  let hoveredIndex = -1;

  let rotation = 0;

  let targetRotation = 0;

  let mouseX = 0;

  let mouseY = 0;

  let dragStartX = 0;

  let dragStartRotation = 0;

  let isDragging = false;

  let velocity = 0;

  let lastTime = performance.now();

  let currentView = "ring";


  /* =========================================================
     5. FALLBACK IMAGE
  ========================================================= */

  function fallbackImage() {
    return (
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg"
             width="800"
             height="500"
             viewBox="0 0 800 500">

          <rect width="800"
                height="500"
                fill="#e9e7e2"/>

          <text x="400"
                y="250"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="#8B0000"
                font-family="Arial"
                font-size="34">
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

    const width = window.innerWidth;

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
     8. CREATE RING PANEL
  ========================================================= */

  function createPanel(visa, index) {

    const button = document.createElement("button");

    button.type = "button";

    button.className = "ring-panel";

    button.dataset.index = index;

    button.setAttribute(
      "aria-label",
      visa.title
    );

    const image = document.createElement("img");

    image.src = visa.image || fallbackImage();

    image.alt = visa.title;

    image.loading = "lazy";

    image.onerror = function () {
      this.src = fallbackImage();
    };


    const panelContent = document.createElement("span");

    panelContent.className = "ring-panel-content";

    panelContent.innerHTML = `
      <span class="ring-panel-title">
        ${escapeHTML(visa.title)}
      </span>

      <span class="ring-panel-location">
        ${escapeHTML(visa.country || visa.location)}
      </span>
    `;


    button.appendChild(image);

    button.appendChild(panelContent);


    /* Hover */

    button.addEventListener("mouseenter", function () {

      hoveredIndex = index;

      updateCenter(visa);

      button.classList.add("is-hovered");

    });


    button.addEventListener("mouseleave", function () {

      hoveredIndex = -1;

      button.classList.remove("is-hovered");

      if (selectedIndex >= 0) {

        updateCenter(
          filteredVisas[selectedIndex]
        );

      } else {

        resetCenter();

      }

    });


    /* Click */

    button.addEventListener("click", function () {

      selectVisa(index);

    });


    /* Keyboard */

    button.addEventListener("keydown", function (event) {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        selectVisa(index);

      }

    });


    return button;
  }


  /* =========================================================
     9. RENDER RING
  ========================================================= */

  function renderRing() {

    if (!ringTrack) return;

    ringTrack.innerHTML = "";

    panels = [];

    if (!filteredVisas.length) {

      resetCenter();

      return;

    }


    const config = getRingConfig();

    const limit = Math.min(
      config.panels,
      filteredVisas.length
    );


    for (let i = 0; i < limit; i++) {

      const panel = createPanel(
        filteredVisas[i],
        i
      );

      panels.push(panel);

      ringTrack.appendChild(panel);
    }


    if (
      selectedIndex >= filteredVisas.length
    ) {

      selectedIndex = -1;

    }


    if (selectedIndex >= 0) {

      updateCenter(
        filteredVisas[selectedIndex]
      );

    } else {

      resetCenter();

    }


    updateAllPanels(true);
  }


  /* =========================================================
     10. RING POSITION
  ========================================================= */

  function calculatePosition(
    index,
    count
  ) {

    const config = getRingConfig();

    const angle =
      (index / count) *
      Math.PI *
      2 +
      rotation;


    const x =
      Math.cos(angle) *
      config.radiusX;


    const y =
      Math.sin(angle) *
      config.radiusY;


    /*
      Depth:
      Front = positive
      Back = negative
    */

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
      0.20 +
      0.80 *
      normalized;


    const blur =
      Math.max(
        0,
        1.15 -
        normalized * 1.15
      );


    const rotateY =
      Math.cos(angle) *
      -18;


    const rotateZ =
      Math.cos(angle) *
      1.5;


    const z =
      depth * 180;


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
     11. UPDATE PANEL
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


    panel.style.transform = `
      translate3d(
        ${position.x}px,
        ${position.y}px,
        ${position.z}px
      )
      rotateY(${position.rotateY}deg)
      rotateZ(${position.rotateZ}deg)
      scale(${position.scale})
    `;


    panel.style.opacity =
      position.opacity;


    panel.style.filter =
      `blur(${position.blur}px)`;


    panel.style.zIndex =
      Math.round(
        1000 +
        position.z
      );


    /*
      Front panel
    */

    if (position.opacity > 0.82) {

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
     12. UPDATE ALL PANELS
  ========================================================= */

  function updateAllPanels(
    immediate = false
  ) {

    if (!panels.length) return;

    const count =
      panels.length;


    if (immediate) {

      rotation =
        targetRotation;

    } else {

      rotation +=
        (
          targetRotation -
          rotation
        ) *
        CONFIG.ease;

    }


    panels.forEach(
      function (panel, index) {

        updatePanel(
          panel,
          index,
          count
        );

      }
    );
  }


  /* =========================================================
     13. CENTER PREVIEW
  ========================================================= */

  function updateCenter(visa) {

    if (!visa) return;


    if (centerTitle) {

      centerTitle.textContent =
        visa.title;

    }


    if (centerDescription) {

      centerDescription.textContent =
        visa.description;

    }


    if (centerImage) {

      centerImage.src =
        visa.image ||
        fallbackImage();

      centerImage.alt =
        visa.title;

      centerImage.onerror =
        function () {

          this.src =
            fallbackImage();

        };

    }


    if (centerCategory) {

      centerCategory.textContent =
        formatCategory(
          visa.category
        );

    }


    if (centerLocation) {

      centerLocation.textContent =
        visa.country ||
        visa.location ||
        "";

    }


    if (centerCTA) {

      centerCTA.hidden = false;

      centerCTA.href =
        "#";

      centerCTA.dataset.visaId =
        visa.id;

    }

  }


  /* =========================================================
     14. RESET CENTER
  ========================================================= */

  function resetCenter() {

    if (centerTitle) {

      centerTitle.textContent =
        "Build your own future on your terms.";

    }


    if (centerDescription) {

      centerDescription.textContent =
        "Explore 300+ visa services choose the country you like.";

    }


    if (centerImage) {

      centerImage.src =
        fallbackImage();

      centerImage.alt =
        "CB Visa Services";

    }


    if (centerCategory) {

      centerCategory.textContent =
        "";

    }


    if (centerLocation) {

      centerLocation.textContent =
        "";

    }


    if (centerCTA) {

      centerCTA.hidden = true;

    }

  }


  /* =========================================================
     15. CATEGORY FORMATTER
  ========================================================= */

  function formatCategory(category) {

    if (!category) return "";

    return category
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, function (letter) {
        return letter.toUpperCase();
      });
  }


  /* =========================================================
     16. SELECT VISA
  ========================================================= */

  function selectVisa(index) {

    if (
      !filteredVisas[index]
    ) {
      return;
    }


    selectedIndex =
      index;


    const count =
      Math.min(
        getRingConfig().panels,
        filteredVisas.length
      );


    /*
      Move selected item
      toward front-center.
    */

    const desiredAngle =
      Math.PI / 2;


    const currentAngle =
      (
        index / count
      ) *
      Math.PI *
      2;


    targetRotation =
      desiredAngle -
      currentAngle;


    updateCenter(
      filteredVisas[index]
    );


    panels.forEach(
      function (panel, panelIndex) {

        panel.classList.toggle(
          "is-selected",
          panelIndex === index
        );

      }
    );

  }


  /* =========================================================
     17. PROCESSING TIME FILTER
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


    /*
      Fast
      3–5 and 5–7 working days
    */

    if (
      selected === "fast"
    ) {

      return (
        value.includes("3") ||
        value.includes("5–7")
      );

    }


    /*
      Standard
      7–10 and 10–15
    */

    if (
      selected === "standard"
    ) {

      return (
        value.includes("7–10") ||
        value.includes("10–15")
      );

    }


    /*
      Extended
      15–20 and 20–30
    */

    if (
      selected === "extended"
    ) {

      return (
        value.includes("15–20") ||
        value.includes("20–30")
      );

    }


    /*
      Direct matching
      if future values are added.
    */

    return value.includes(
      selected.toLowerCase()
    );
  }


  /* =========================================================
     18. BUDGET FILTER
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
        price.includes("150") ||
        price.includes("300")
      );

    }


    if (
      selected === "medium"
    ) {

      return (
        price.includes("500") ||
        price.includes("750")
      );

    }


    if (
      selected === "high"
    ) {

      return (
        price.includes("1,000") ||
        price.includes("1,500") ||
        price.includes("+")
      );

    }


    return true;
  }


  /* =========================================================
     19. STATUS FILTER
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


    return (
      visa.status.toLowerCase() ===
      selected.toLowerCase()
    );

  }


  /* =========================================================
     20. SERVICE TYPE FILTER
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


    return (
      visa.category.toLowerCase() ===
      selected.toLowerCase()
    );

  }


  /* =========================================================
     21. APPLY FILTERS
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


    selectedIndex = -1;

    hoveredIndex = -1;

    targetRotation = 0;

    renderRing();

    renderGrid();

    updateResultCount();

  }


  /* =========================================================
     22. CATEGORY FILTER
  ========================================================= */

  function filterByCategory(
    category
  ) {

    if (!category) return;


    if (serviceType) {

      serviceType.value =
        category;

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


    filteredVisas =
      ALL_VISAS.filter(
        function (visa) {

          return (
            visa.category
              .toLowerCase() ===
            category.toLowerCase()
          );

        }
      );


    selectedIndex = -1;

    targetRotation = 0;

    renderRing();

    renderGrid();

    updateResultCount();


    /*
      Scroll explorer into view
    */

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
     23. CATEGORY BUTTONS
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


            if (!category) {

              /*
                Fallback based on text
              */

              const text =
                button.textContent
                  .toLowerCase();


              const found =
                ALL_VISAS.find(
                  function (visa) {

                    return text.includes(
                      formatCategory(
                        visa.category
                      ).toLowerCase()
                    );

                  }
                );


              if (found) {

                filterByCategory(
                  found.category
                );

              }

              return;

            }


            filterByCategory(
              category
            );

          }
        );

      }
    );

  }


  /* =========================================================
     24. GRID RENDER
  ========================================================= */

  function renderGrid() {

    if (!gridContainer) return;


    gridContainer.innerHTML = "";


    if (!filteredVisas.length) {

      gridContainer.innerHTML = `
        <div class="grid-empty">
          <h3>No visa services found.</h3>
          <p>
            Try changing your filters.
          </p>
        </div>
      `;

      return;
    }


    /*
      Visa count setting
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

              <div class="grid-card-image">

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


              <div class="grid-card-content">

                <span class="grid-card-category">
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


                <p class="grid-card-location">
                  ${escapeHTML(
                    visa.country ||
                    visa.location
                  )}
                </p>


                <div class="grid-card-meta">

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


          cardButton.addEventListener(
            "click",
            function () {

              const originalIndex =
                filteredVisas.indexOf(
                  visa
                );


              selectedIndex =
                originalIndex;


              updateCenter(
                visa
              );


              switchToRing();


              requestAnimationFrame(
                function () {

                  selectVisa(
                    originalIndex
                  );

                }
              );

            }
          );


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
     25. RESULT COUNT
  ========================================================= */

  function updateResultCount() {

    /*
      Update any existing count
      elements without requiring
      extra HTML.
    */

    const countElements =
      document.querySelectorAll(
        "[data-result-count]"
      );


    countElements.forEach(
      function (element) {

        element.textContent =
          filteredVisas.length;

      }
    );


    /*
      Update visa count select
      label if available.
    */

    const selectedCount =
      document.querySelector(
        ".filter-result-count"
      );


    if (
      selectedCount
    ) {

      selectedCount.textContent =
        `${filteredVisas.length} services`;

    }

  }


  /* =========================================================
     26. FILTER OVERLAY
  ========================================================= */

  function openFilters() {

    if (!filterOverlay) return;


    filterOverlay.removeAttribute(
      "hidden"
    );


    filterOverlay.classList.add(
      "is-open"
    );


    document.body.classList.add(
      "filter-open"
    );


    if (filterClose) {

      filterClose.focus();

    }

  }


  function closeFilters() {

    if (!filterOverlay) return;


    filterOverlay.classList.remove(
      "is-open"
    );


    filterOverlay.setAttribute(
      "hidden",
      ""
    );


    document.body.classList.remove(
      "filter-open"
    );

  }


  /* =========================================================
     27. RESET FILTERS
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


    selectedIndex = -1;

    hoveredIndex = -1;

    rotation = 0;

    targetRotation = 0;


    renderRing();

    renderGrid();

    updateResultCount();

  }


  /* =========================================================
     28. FIND RESET BUTTON
  ========================================================= */

  function initResetButton() {

    const resetButtons =
      document.querySelectorAll(
        "#reset-filters, .reset-filters, [data-reset-filters]"
      );


    resetButtons.forEach(
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
     29. FILTER CHANGE EVENTS
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

        if (!filter) return;


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
     30. GRID VIEW
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
        behavior: "smooth",
        block: "start"
      });

    }

  }


  /* =========================================================
     31. RING VIEW
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
        behavior: "smooth",
        block: "start"
      });

    }

  }


  /* =========================================================
     32. GRID / RING EVENTS
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
     33. MOUSE FOLLOW
  ========================================================= */

  function initMouseMovement() {

    window.addEventListener(
      "pointermove",
      function (event) {

        const width =
          window.innerWidth;

        const height =
          window.innerHeight;


        mouseX =
          (
            event.clientX -
            width / 2
          ) / width;


        mouseY =
          (
            event.clientY -
            height / 2
          ) / height;

      },
      { passive: true }
    );

  }


  /* =========================================================
     34. DRAG
  ========================================================= */

  function initDrag() {

    if (!ring) return;


    ring.addEventListener(
      "pointerdown",
      function (event) {

        /*
          Only primary button
        */

        if (
          event.pointerType === "mouse" &&
          event.button !== 0
        ) {

          return;

        }


        isDragging = true;

        dragStartX =
          event.clientX;

        dragStartRotation =
          targetRotation;

        velocity = 0;


        ring.setPointerCapture(
          event.pointerId
        );


        ring.classList.add(
          "is-dragging"
        );

      }
    );


    ring.addEventListener(
      "pointermove",
      function (event) {

        if (!isDragging) return;


        const delta =
          event.clientX -
          dragStartX;


        const movement =
          delta *
          CONFIG.dragSensitivity;


        targetRotation =
          dragStartRotation +
          movement;


        velocity =
          movement;

      }
    );


    function endDrag(event) {

      if (!isDragging) return;


      isDragging = false;


      ring.classList.remove(
        "is-dragging"
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

  }


  /* =========================================================
     35. KEYBOARD NAVIGATION
  ========================================================= */

  function initKeyboard() {

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape"
        ) {

          closeFilters();

          selectedIndex = -1;

          panels.forEach(
            function (panel) {

              panel.classList.remove(
                "is-selected"
              );

            }
          );

          resetCenter();

          return;

        }


        /*
          Don't hijack keyboard
          when typing/selecting.
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


        if (
          event.key === "ArrowRight"
        ) {

          if (!filteredVisas.length)
            return;


          let next =
            selectedIndex + 1;


          if (
            next >=
            filteredVisas.length
          ) {

            next = 0;

          }


          selectVisa(next);

        }


        if (
          event.key === "ArrowLeft"
        ) {

          if (!filteredVisas.length)
            return;


          let previous =
            selectedIndex - 1;


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
     37. RESIZE
  ========================================================= */

  let resizeTimer = null;


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
            150
          );

      }
    );

  }


  /* =========================================================
     38. ANIMATION
  ========================================================= */

  function animate(
    currentTime
  ) {

    const delta =
      currentTime -
      lastTime;


    lastTime =
      currentTime;


    /*
      Auto rotation only
      when user isn't dragging.
    */

    if (
      !isDragging &&
      currentView === "ring"
    ) {

      /*
        Inertia
      */

      if (
        Math.abs(velocity) >
        0.00001
      ) {

        targetRotation +=
          velocity;

        velocity *=
          CONFIG.inertia;

      } else {

        /*
          Very subtle auto movement
        */

        targetRotation +=
          CONFIG.autoSpeed *
          delta;

      }

    }


    /*
      Mouse influence
    */

    if (
      !isDragging &&
      currentView === "ring"
    ) {

      targetRotation +=
        mouseX *
        CONFIG.mouseStrength *
        delta;

    }


    updateAllPanels();


    requestAnimationFrame(
      animate
    );

  }


  /* =========================================================
     39. CENTER CTA
  ========================================================= */

  function initCenterCTA() {

    if (!centerCTA) return;


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
          STEP 8 will replace
          this # link with the
          actual visa detail route.
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
     40. INITIALIZATION
  ========================================================= */

  function init() {

    console.log(
      "CB Visa Services — STEP 7 loaded."
    );

    console.log(
      "Total services:",
      ALL_VISAS.length
    );


    renderRing();

    renderGrid();

    initCategoryButtons();

    initFilterEvents();

    initResetButton();

    initViewButtons();

    initFilterButton();

    initMouseMovement();

    initDrag();

    initKeyboard();

    initResize();

    initCenterCTA();

    updateResultCount();


    requestAnimationFrame(
      animate
    );

  }


  /* =========================================================
     START
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

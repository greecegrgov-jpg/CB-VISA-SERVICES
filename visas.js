/* =========================================================
   CB VISA SERVICES
   MASTER VISA / INVITATION / IMMIGRATION DATA
   STEP 3
   ========================================================= */

/*
    IMPORTANT
    ----------
    This file contains the master service data.

    The gallery can display 300+ services while keeping
    the data easy to edit later.

    Replace image URLs with your own local images when
    the real website assets are ready.
*/


/* =========================================================
   01. IMAGE LIBRARY
   ========================================================= */

const visaImages = [

    "https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=500&q=70",

    "https://images.unsplash.com/photo-1526129318478-62ed807ebdf1?auto=format&fit=crop&w=500&q=70"

];


/* =========================================================
   02. COUNTRIES
   ========================================================= */

const visaCountries = [

    "Albania",
    "Australia",
    "Austria",
    "Belgium",
    "Bulgaria",
    "Canada",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Iceland",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "New Zealand",
    "Norway",
    "Poland",
    "Portugal",
    "Romania",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "Switzerland",
    "United Kingdom",
    "United States",
    "United Arab Emirates",
    "Turkey",
    "Georgia",
    "Azerbaijan",
    "Armenia",
    "Kazakhstan",
    "Kyrgyzstan",
    "Uzbekistan",
    "Qatar",
    "Saudi Arabia",
    "Oman",
    "Bahrain",
    "Malaysia",
    "Singapore",
    "Thailand",
    "Indonesia",
    "Japan",
    "South Korea",
    "China",
    "Vietnam",
    "Philippines",
    "India",
    "Nepal",
    "Bangladesh",
    "Sri Lanka",
    "South Africa",
    "Egypt",
    "Morocco",
    "Mauritius",
    "Seychelles",
    "Kenya",
    "Tanzania",
    "Uganda",
    "Rwanda",
    "Brazil",
    "Argentina",
    "Mexico",
    "Colombia",
    "Chile",
    "Peru"
];


/* =========================================================
   03. SERVICE CATEGORIES
   ========================================================= */

const visaCategories = [

    {
        id: "visit-visa",
        name: "Visit Visa Services",
        shortName: "Visit Visa",
        count: 72
    },

    {
        id: "business-visa",
        name: "Business Visa Services",
        shortName: "Business Visa",
        count: 72
    },

    {
        id: "work-visa",
        name: "Work Visa Services",
        shortName: "Work Visa",
        count: 48
    },

    {
        id: "study-visa",
        name: "Study Visa Services",
        shortName: "Study Visa",
        count: 48
    },

    {
        id: "visit-invitation",
        name: "Visit Visa Invitation",
        shortName: "Visit Invitation",
        count: 72
    },

    {
        id: "business-invitation",
        name: "Business Visa Invitation",
        shortName: "Business Invitation",
        count: 72
    },

    {
        id: "family-invitation",
        name: "Family Visa Invitation",
        shortName: "Family Invitation",
        count: 48
    },

    {
        id: "work-permit",
        name: "Work Permit Services",
        shortName: "Work Permit",
        count: 72
    },

    {
        id: "passport",
        name: "Passport Services",
        shortName: "Passport",
        count: 32
    },

    {
        id: "residency",
        name: "Residency Services",
        shortName: "Residency",
        count: 36
    },

    {
        id: "nationality",
        name: "Nationality Services",
        shortName: "Nationality",
        count: 24
    }

];


/* =========================================================
   04. PROCESSING STATUS
   ========================================================= */

const visaStatuses = [

    {
        id: "available",
        label: "Available",
        availability: 8
    },

    {
        id: "limited",
        label: "Limited Availability",
        availability: 4
    },

    {
        id: "prepayment",
        label: "Prepayment Required",
        availability: 6
    },

    {
        id: "consultation",
        label: "Consultation Required",
        availability: 2
    }

];


/* =========================================================
   05. PROCESSING TIMES
   ========================================================= */

const processingTimes = [

    "3–5 Working Days",
    "5–7 Working Days",
    "7–10 Working Days",
    "10–15 Working Days",
    "15–20 Working Days",
    "20–30 Working Days"

];


/* =========================================================
   06. PRICE RANGES
   ========================================================= */

const priceRanges = [

    "$150 – $300",
    "$300 – $500",
    "$500 – $750",
    "$750 – $1,000",
    "$1,000 – $1,500",
    "$1,500+"

];


/* =========================================================
   07. CITY / SERVICE LOCATIONS
   ========================================================= */

const serviceLocations = [

    "Dubai",
    "Abu Dhabi",
    "Kuala Lumpur",
    "Baku",
    "Istanbul",
    "Doha",
    "Riyadh",
    "London",
    "Toronto",
    "Montreal",
    "Sydney",
    "Melbourne",
    "Auckland",
    "Singapore",
    "Bangkok",
    "Berlin",
    "Paris",
    "Madrid",
    "Rome",
    "Amsterdam",
    "Brussels",
    "Vienna",
    "Helsinki",
    "Stockholm",
    "Oslo",
    "Copenhagen",
    "Warsaw",
    "Lisbon",
    "Athens",
    "Prague",
    "Zagreb",
    "Belgrade",
    "Tirana",
    "Valletta",
    "Vilnius",
    "Riga",
    "Tallinn"

];


/* =========================================================
   08. SERVICE TEMPLATES
   ========================================================= */

const serviceTemplates = [

    {
        category: "Visit Visa",
        title: "{country} Visit Visa",
        description: "Professional visitor visa assistance for eligible travellers."
    },

    {
        category: "Business Visa",
        title: "{country} Business Visa",
        description: "Business travel visa assistance for meetings, events and commercial visits."
    },

    {
        category: "Work Visa",
        title: "{country} Work Visa",
        description: "Work visa application support for eligible employment opportunities."
    },

    {
        category: "Study Visa",
        title: "{country} Study Visa",
        description: "Student visa assistance for universities, colleges and educational institutions."
    },

    {
        category: "Visit Invitation",
        title: "{country} Visit Invitation Letter",
        description: "Visit invitation documentation support for eligible applicants."
    },

    {
        category: "Business Invitation",
        title: "{country} Business Invitation Letter",
        description: "Commercial invitation documentation for business travel."
    },

    {
        category: "Family Invitation",
        title: "{country} Family Invitation Letter",
        description: "Family visit invitation documentation assistance."
    },

    {
        category: "Work Permit",
        title: "{country} Work Permit",
        description: "Work permit documentation and application assistance."
    },

    {
        category: "Passport",
        title: "{country} Passport Services",
        description: "Passport-related documentation and application assistance."
    },

    {
        category: "Residency",
        title: "{country} Residency Services",
        description: "Residency pathway consultation and application support."
    },

    {
        category: "Nationality",
        title: "{country} Nationality Services",
        description: "Nationality and citizenship pathway consultation."
    }

];


/* =========================================================
   09. SPECIAL SERVICES
   ========================================================= */

const specialServices = [

    {
        title: "Canada Visit Visa",
        category: "Visit Visa",
        country: "Canada"
    },

    {
        title: "Canada Work Visa",
        category: "Work Visa",
        country: "Canada"
    },

    {
        title: "Australia Business Visa",
        category: "Business Visa",
        country: "Australia"
    },

    {
        title: "Lithuania Business Invitation Letter",
        category: "Business Invitation",
        country: "Lithuania"
    },

    {
        title: "Spain Visit Invitation Letter",
        category: "Visit Invitation",
        country: "Spain"
    },

    {
        title: "Germany Work Permit",
        category: "Work Permit",
        country: "Germany"
    },

    {
        title: "Poland Work Visa",
        category: "Work Visa",
        country: "Poland"
    },

    {
        title: "Italy Visit Visa",
        category: "Visit Visa",
        country: "Italy"
    },

    {
        title: "Latvia Passport Services",
        category: "Passport",
        country: "Latvia"
    },

    {
        title: "Kyrgyzstan Nationality Services",
        category: "Nationality",
        country: "Kyrgyzstan"
    },

    {
        title: "Malta Residency",
        category: "Residency",
        country: "Malta"
    },

    {
        title: "United States Work Visa",
        category: "Work Visa",
        country: "United States"
    },

    {
        title: "New Zealand Visit Visa",
        category: "Visit Visa",
        country: "New Zealand"
    },

    {
        title: "Finland Business Visa",
        category: "Business Visa",
        country: "Finland"
    },

    {
        title: "Norway Visit Visa",
        category: "Visit Visa",
        country: "Norway"
    },

    {
        title: "Sweden Business Visa",
        category: "Business Visa",
        country: "Sweden"
    },

    {
        title: "Netherlands Business Invitation",
        category: "Business Invitation",
        country: "Netherlands"
    },

    {
        title: "Belgium Visit Invitation",
        category: "Visit Invitation",
        country: "Belgium"
    },

    {
        title: "Austria Work Permit",
        category: "Work Permit",
        country: "Austria"
    },

    {
        title: "Portugal Residency",
        category: "Residency",
        country: "Portugal"
    }

];


/* =========================================================
   10. HELPER FUNCTIONS
   ========================================================= */

function visaImage(index) {

    return visaImages[
        index % visaImages.length
    ];

}


function randomFrom(array, index) {

    return array[
        index % array.length
    ];

}


function createVisaId(title, index) {

    return (

        title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")

        + "-" +
        String(index + 1).padStart(3, "0")

    );

}


/* =========================================================
   11. MASTER VISA ARRAY
   ========================================================= */

const visas = [];


/* =========================================================
   12. ADD SPECIAL SERVICES FIRST
   ========================================================= */

specialServices.forEach(
    (service, index) => {

        const status =
            visaStatuses[index % visaStatuses.length];

        visas.push({

            id:
                createVisaId(
                    service.title,
                    index
                ),

            title:
                service.title,

            category:
                service.category,

            location:
                service.country,

            country:
                service.country,

            priceRange:
                priceRanges[
                    index % priceRanges.length
                ],

            processingTime:
                processingTimes[
                    index % processingTimes.length
                ],

            status:
                status.label,

            availability:
                status.availability,

            prepayment:
                `${20 + (index % 5) * 10}%`,

            totalAmount:
                priceRanges[
                    index % priceRanges.length
                ],

            image:
                visaImage(index),

            thumbnail:
                visaImage(index),

            description:
                `CB Visa Services assistance for ${service.title}.`

        });

    }
);


/* =========================================================
   13. GENERATE LARGE MASTER DATASET
   ========================================================= */

let generatedIndex =
    specialServices.length;


visaCountries.forEach(
    (country, countryIndex) => {

        serviceTemplates.forEach(
            (template, templateIndex) => {

                const title =
                    template.title.replace(
                        "{country}",
                        country
                    );


                const status =
                    visaStatuses[
                        (countryIndex + templateIndex)
                        %
                        visaStatuses.length
                    ];


                const imageIndex =
                    countryIndex *
                    serviceTemplates.length
                    +
                    templateIndex;


                visas.push({

                    id:
                        createVisaId(
                            title,
                            generatedIndex
                        ),

                    title:
                        title,

                    category:
                        template.category,

                    location:
                        country,

                    country:
                        country,

                    priceRange:
                        priceRanges[
                            imageIndex %
                            priceRanges.length
                        ],

                    processingTime:
                        processingTimes[
                            imageIndex %
                            processingTimes.length
                        ],

                    status:
                        status.label,

                    availability:
                        status.availability,

                    prepayment:
                        `${20 + (imageIndex % 5) * 10}%`,

                    totalAmount:
                        priceRanges[
                            imageIndex %
                            priceRanges.length
                        ],

                    image:
                        visaImage(imageIndex),

                    thumbnail:
                        visaImage(imageIndex),

                    description:
                        template.description

                });


                generatedIndex++;

            }
        );

    }
);


/* =========================================================
   14. ENSURE 300+ ITEMS
   ========================================================= */

const minimumVisaItems = 320;


if (visas.length < minimumVisaItems) {

    const originalItems =
        [...visas];


    while (
        visas.length <
        minimumVisaItems
    ) {

        const source =
            originalItems[
                visas.length %
                originalItems.length
            ];


        const duplicateNumber =
            Math.floor(
                visas.length /
                originalItems.length
            ) + 1;


        visas.push({

            ...source,

            id:
                `${source.id}-variant-${duplicateNumber}`,

            title:
                `${source.title} — Premium Assistance`,

            image:
                visaImage(
                    visas.length
                ),

            thumbnail:
                visaImage(
                    visas.length
                )

        });

    }

}


/* =========================================================
   15. DATA STATISTICS
   ========================================================= */

const visaServiceStats = {

    total:
        visas.length,

    countries:
        visaCountries.length,

    categories:
        visaCategories.length,

    images:
        visaImages.length

};


/* =========================================================
   16. CATEGORY COUNTS
   ========================================================= */

function getVisaCategoryCount(
    categoryName
) {

    return visas.filter(
        visa =>
            visa.category === categoryName
    ).length;

}


/* =========================================================
   17. COUNTRY COUNTS
   ========================================================= */

function getVisaCountryCount(
    countryName
) {

    return visas.filter(
        visa =>
            visa.country === countryName
    ).length;

}


/* =========================================================
   18. GLOBAL DATA ACCESS
   ========================================================= */

window.CBVisaData = {

    visas,

    countries:
        visaCountries,

    categories:
        visaCategories,

    statuses:
        visaStatuses,

    processingTimes,

    priceRanges,

    locations:
        serviceLocations,

    images:
        visaImages,

    stats:
        visaServiceStats,

    getCategoryCount:
        getVisaCategoryCount,

    getCountryCount:
        getVisaCountryCount

};


/* =========================================================
   19. DEVELOPMENT CHECK
   ========================================================= */

console.log(
    "CB Visa Services:",
    visaServiceStats
);

console.log(
    "Total visa/service records:",
    visas.length
);

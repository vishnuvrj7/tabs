const urlInput = document.getElementById("url");
const idsInput = document.getElementById("ids");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");

const copyBtn = document.getElementById("copyBtn");
const openAllBtn = document.getElementById("openAllBtn");

const resultsSection = document.getElementById("resultsSection");
const results = document.getElementById("results");
const count = document.getElementById("count");
const message = document.getElementById("message");

let generatedUrls = [];


/* =========================
   MESSAGE
========================= */

function showMessage(text, type = "") {
    message.textContent = text;
    message.className = `message ${type}`;
}


/* =========================
   PARSE IDS
========================= */

function parseIds(text) {
    return [
        ...new Set(
            text
                .split(/[\s,]+/)
                .map(id => id.trim())
                .filter(Boolean)
        )
    ];
}


/* =========================
   GENERATE URLS
========================= */

function buildUrls() {

    const template = urlInput.value.trim();
    const ids = parseIds(idsInput.value);


    // Check URL
    if (!template) {

        showMessage(
            "Enter a URL first.",
            "error"
        );

        return;
    }


    // Check {ID}
    if (!template.includes("{ID}")) {

        showMessage(
            "Your URL must contain the {ID} placeholder.",
            "error"
        );

        return;
    }


    // Check IDs
    if (ids.length === 0) {

        showMessage(
            "Add at least one ID.",
            "error"
        );

        return;
    }


    // Generate URLs
    generatedUrls = ids.map(id => {

        return template
            .split("{ID}")
            .join(encodeURIComponent(id));

    });


    // Clear previous results
    results.innerHTML = "";


    // Create result rows
    generatedUrls.forEach((url, index) => {

        const row = document.createElement("div");

        row.className = "result";


        /* Number */

        const number = document.createElement("div");

        number.className = "result-number";

        number.textContent = index + 1;


        /* URL */

        const urlText = document.createElement("div");

        urlText.className = "result-url";

        urlText.textContent = url;

        urlText.title = url;


        /*
         * IMPORTANT:
         *
         * Use an actual <a> element instead of
         * window.open().
         *
         * This lets the browser handle the
         * new-tab behavior naturally.
         */

        const openLink = document.createElement("a");

        openLink.className = "secondary small open-one";

        openLink.textContent = "Open";

        openLink.href = url;

        openLink.target = "_blank";

        openLink.rel = "noopener noreferrer";


        // Make the link look like a button
        openLink.style.textDecoration = "none";
        openLink.style.display = "inline-block";


        // Add everything to the row
        row.append(
            number,
            urlText,
            openLink
        );


        results.appendChild(row);

    });


    // Update counter
    count.textContent = generatedUrls.length;


    // Show results
    resultsSection.classList.remove("hidden");


    showMessage(
        `${generatedUrls.length} URL${
            generatedUrls.length === 1 ? "" : "s"
        } generated.`,
        "success"
    );
}


/* =========================
   COPY ALL
========================= */

async function copyAll() {

    if (!generatedUrls.length) {
        return;
    }


    try {

        await navigator.clipboard.writeText(
            generatedUrls.join("\n")
        );


        showMessage(
            "All generated URLs copied to clipboard.",
            "success"
        );

    } catch (error) {

        showMessage(
            "Clipboard access was blocked by the browser.",
            "error"
        );

    }
}


/* =========================
   OPEN ALL
========================= */

function openAll() {

    if (!generatedUrls.length) {
        return;
    }


    generatedUrls.forEach(url => {

        const link = document.createElement("a");

        link.href = url;

        link.target = "_blank";

        link.rel = "noopener noreferrer";

        link.style.display = "none";

        document.body.appendChild(link);

        link.click();

        link.remove();

    });


    showMessage(
        `${generatedUrls.length} tabs requested. Your browser may block multiple tabs.`,
        "success"
    );
}


/* =========================
   CLEAR
========================= */

function clearAll() {

    urlInput.value = "";

    idsInput.value = "";

    generatedUrls = [];

    results.innerHTML = "";

    count.textContent = "0";

    resultsSection.classList.add("hidden");

    showMessage("");

    urlInput.focus();
}


/* =========================
   EVENTS
========================= */

generateBtn.addEventListener(
    "click",
    buildUrls
);


copyBtn.addEventListener(
    "click",
    copyAll
);


openAllBtn.addEventListener(
    "click",
    openAll
);


clearBtn.addEventListener(
    "click",
    clearAll
);


/* =========================
   ENTER TO GENERATE
========================= */

urlInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            buildUrls();

        }

    }
);


/* =========================
   CTRL + ENTER
========================= */

idsInput.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            buildUrls();

        }

    }
);

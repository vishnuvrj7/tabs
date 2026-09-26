```javascript
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


/* Show a message */

function showMessage(text, type = "") {
    message.textContent = text;
    message.className = "message " + type;
}


/* Convert the ID input into an array */

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


/* Generate URLs */

function buildUrls() {

    const template = urlInput.value.trim();
    const ids = parseIds(idsInput.value);

    if (!template) {
        showMessage("Enter a URL first.", "error");
        return;
    }

    if (!template.includes("{ID}")) {
        showMessage(
            "Your URL must contain {ID}.",
            "error"
        );
        return;
    }

    if (ids.length === 0) {
        showMessage(
            "Add at least one ID.",
            "error"
        );
        return;
    }

    generatedUrls = ids.map(id => {
        return template.replaceAll(
            "{ID}",
            encodeURIComponent(id)
        );
    });

    results.innerHTML = "";

    generatedUrls.forEach((url, index) => {

        const row = document.createElement("div");
        row.className = "result";

        const number = document.createElement("div");
        number.className = "result-number";
        number.textContent = index + 1;

        const urlText = document.createElement("div");
        urlText.className = "result-url";
        urlText.textContent = url;
        urlText.title = url;

        const openButton = document.createElement("button");

        openButton.type = "button";
        openButton.className = "secondary small open-one";
        openButton.textContent = "Open";

        openButton.addEventListener("click", function () {

            const newTab = window.open(
                url,
                "_blank"
            );

            if (!newTab) {
                showMessage(
                    "The browser blocked the new tab. Allow pop-ups for this page.",
                    "error"
                );
            }

        });

        row.appendChild(number);
        row.appendChild(urlText);
        row.appendChild(openButton);

        results.appendChild(row);
    });

    count.textContent = generatedUrls.length;

    resultsSection.classList.remove("hidden");

    showMessage(
        generatedUrls.length +
        " URL" +
        (generatedUrls.length === 1 ? "" : "s") +
        " generated.",
        "success"
    );
}


/* Copy all URLs */

async function copyAll() {

    if (generatedUrls.length === 0) {
        return;
    }

    try {

        await navigator.clipboard.writeText(
            generatedUrls.join("\n")
        );

        showMessage(
            "All URLs copied to clipboard.",
            "success"
        );

    } catch (error) {

        showMessage(
            "Unable to copy URLs.",
            "error"
        );
    }
}


/* Open all URLs */

function openAll() {

    if (generatedUrls.length === 0) {

        showMessage(
            "Generate URLs first.",
            "error"
        );

        return;
    }

    generatedUrls.forEach(url => {

        const newTab = window.open(
            url,
            "_blank"
        );

        if (!newTab) {
            return;
        }

    });

    showMessage(
        "Open requests sent. Your browser may block multiple tabs.",
        "success"
    );
}


/* Clear everything */

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


/* Button events */

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


/* Press Enter in URL input */

urlInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {
            buildUrls();
        }

    }
);


/* Ctrl + Enter in ID textarea */

idsInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {
            buildUrls();
        }

    }
);
```

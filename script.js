const urlTemplate = document.getElementById("urlTemplate");
const pointerName = document.getElementById("pointerName");
const insertPointerBtn = document.getElementById("insertPointerBtn");

const pointersContainer = document.getElementById("pointersContainer");
const pointerCount = document.getElementById("pointerCount");

const templatePreview = document.getElementById("templatePreview");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");

const resultsSection = document.getElementById("resultsSection");
const resultsContainer = document.getElementById("results");
const resultCount = document.getElementById("resultCount");

const copyBtn = document.getElementById("copyBtn");
const openAllBtn = document.getElementById("openAllBtn");

const message = document.getElementById("message");

let pointers = [];
let generatedUrls = [];


// --------------------------------------------------
// MESSAGE
// --------------------------------------------------

function showMessage(text, type = "success") {
    message.textContent = text;
    message.className = `message ${type}`;

    setTimeout(() => {
        message.textContent = "";
        message.className = "message";
    }, 3000);
}


// --------------------------------------------------
// UPDATE TEMPLATE PREVIEW
// --------------------------------------------------

function updateTemplatePreview() {
    const value = urlTemplate.value.trim();

    if (!value) {
        templatePreview.textContent =
            "Your URL template will appear here.";
        return;
    }

    templatePreview.textContent = value;
}


// --------------------------------------------------
// INSERT POINTER INTO SELECTED URL TEXT
// --------------------------------------------------

insertPointerBtn.addEventListener("click", () => {

    const name = pointerName.value.trim();

    if (!name) {
        showMessage("Enter a pointer name first.", "error");
        pointerName.focus();
        return;
    }

    const start = urlTemplate.selectionStart;
    const end = urlTemplate.selectionEnd;

    if (start === end) {
        showMessage(
            "Highlight the part of the URL you want to replace.",
            "error"
        );
        return;
    }

    const selectedText = urlTemplate.value.substring(start, end);

    // Clean pointer name
    const cleanName = name
        .replace(/[{}]/g, "")
        .replace(/\s+/g, "_")
        .toUpperCase();

    // Prevent duplicate pointer names
    if (pointers.some(pointer => pointer.name === cleanName)) {
        showMessage(
            `Pointer ${cleanName} already exists.`,
            "error"
        );
        return;
    }

    const placeholder = `{${cleanName}}`;

    // Replace selected text
    const before = urlTemplate.value.substring(0, start);
    const after = urlTemplate.value.substring(end);

    urlTemplate.value =
        before +
        placeholder +
        after;

    // Store pointer
    pointers.push({
        name: cleanName,
        placeholder: placeholder,
        original: selectedText,
        values: []
    });

    pointerName.value = "";

    updateTemplatePreview();
    renderPointers();

    showMessage(
        `${cleanName} pointer added.`,
        "success"
    );
});


// --------------------------------------------------
// RENDER POINTERS
// --------------------------------------------------

function renderPointers() {

    pointerCount.textContent = pointers.length;

    if (pointers.length === 0) {

        pointersContainer.innerHTML = `
            <div class="empty-state">
                No pointers yet.<br>
                Select part of your URL and insert a pointer.
            </div>
        `;

        return;
    }

    pointersContainer.innerHTML = "";

    pointers.forEach((pointer, index) => {

        const card = document.createElement("div");
        card.className = "pointer-card";

        const header = document.createElement("div");
        header.className = "pointer-header";

        const titleContainer = document.createElement("div");

        const title = document.createElement("div");
        title.className = "pointer-title";
        title.textContent = pointer.name;

        const placeholder = document.createElement("div");
        placeholder.className = "pointer-placeholder";
        placeholder.textContent =
            `Placeholder: ${pointer.placeholder}`;

        titleContainer.appendChild(title);
        titleContainer.appendChild(placeholder);

        const removeButton = document.createElement("button");
        removeButton.className = "remove-pointer";
        removeButton.textContent = "Remove";
        removeButton.type = "button";

        removeButton.addEventListener("click", () => {
            removePointer(index);
        });

        header.appendChild(titleContainer);
        header.appendChild(removeButton);

        const valuesLabel = document.createElement("label");
        valuesLabel.textContent = "Values";

        const valuesInput = document.createElement("textarea");
        valuesInput.className = "pointer-values";
        valuesInput.rows = 4;
        valuesInput.placeholder =
            "Enter one value per line\n12345\n67890\nABCDE";

        valuesInput.value = pointer.values.join("\n");

        valuesInput.addEventListener("input", () => {

            pointer.values = valuesInput.value
                .split(/\r?\n/)
                .map(value => value.trim())
                .filter(value => value.length > 0);

        });

        const info = document.createElement("div");
        info.className = "pointer-info";
        info.textContent =
            "One value per line. These values will be combined with the other pointers.";

        card.appendChild(header);
        card.appendChild(valuesLabel);
        card.appendChild(valuesInput);
        card.appendChild(info);

        pointersContainer.appendChild(card);
    });
}


// --------------------------------------------------
// REMOVE POINTER
// --------------------------------------------------

function removePointer(index) {

    const pointer = pointers[index];

    if (!pointer) {
        return;
    }

    // Remove pointer placeholder from URL
    urlTemplate.value =
        urlTemplate.value.replaceAll(
            pointer.placeholder,
            pointer.original
        );

    pointers.splice(index, 1);

    updateTemplatePreview();
    renderPointers();

    showMessage(
        `${pointer.name} removed.`,
        "success"
    );
}


// --------------------------------------------------
// CREATE ALL COMBINATIONS
// --------------------------------------------------

function createCombinations(pointerList) {

    let combinations = [{}];

    pointerList.forEach(pointer => {

        const newCombinations = [];

        combinations.forEach(combination => {

            pointer.values.forEach(value => {

                newCombinations.push({
                    ...combination,
                    [pointer.placeholder]: value
                });

            });

        });

        combinations = newCombinations;
    });

    return combinations;
}


// --------------------------------------------------
// GENERATE URLS
// --------------------------------------------------

function generateUrls() {

    const template = urlTemplate.value.trim();

    if (!template) {
        showMessage("Please enter a URL.", "error");
        return;
    }

    if (pointers.length === 0) {
        showMessage(
            "Create at least one pointer first.",
            "error"
        );
        return;
    }

    // Check every pointer has values
    for (const pointer of pointers) {

        if (pointer.values.length === 0) {

            showMessage(
                `${pointer.name} has no values.`,
                "error"
            );

            return;
        }
    }

    const combinations = createCombinations(pointers);

    generatedUrls = combinations.map(combination => {

        let url = template;

        Object.entries(combination).forEach(
            ([placeholder, value]) => {

                url = url.replaceAll(
                    placeholder,
                    encodeURIComponent(value)
                );

            }
        );

        return url;
    });

    displayResults();

    showMessage(
        `${generatedUrls.length} URLs generated.`,
        "success"
    );
}


// --------------------------------------------------
// DISPLAY RESULTS
// --------------------------------------------------

function displayResults() {

    resultsContainer.innerHTML = "";

    resultCount.textContent = generatedUrls.length;

    generatedUrls.forEach((url, index) => {

        const item = document.createElement("div");
        item.className = "result-item";

        const number = document.createElement("span");
        number.className = "result-number";
        number.textContent = `${index + 1}.`;

        const link = document.createElement("a");
        link.className = "result-url";
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = url;

        const openButton = document.createElement("a");
        openButton.className = "secondary small";
        openButton.href = url;
        openButton.target = "_blank";
        openButton.rel = "noopener noreferrer";
        openButton.textContent = "Open";

        item.appendChild(number);
        item.appendChild(link);
        item.appendChild(openButton);

        resultsContainer.appendChild(item);
    });

    resultsSection.style.display = "block";
}


// --------------------------------------------------
// COPY ALL
// --------------------------------------------------

async function copyAll() {

    if (generatedUrls.length === 0) {
        showMessage(
            "Generate URLs first.",
            "error"
        );
        return;
    }

    try {

        await navigator.clipboard.writeText(
            generatedUrls.join("\n")
        );

        showMessage(
            "All URLs copied.",
            "success"
        );

    } catch (error) {

        showMessage(
            "Could not copy URLs.",
            "error"
        );
    }
}


// --------------------------------------------------
// OPEN ALL
// --------------------------------------------------

function openAll() {

    if (generatedUrls.length === 0) {
        showMessage(
            "Generate URLs first.",
            "error"
        );
        return;
    }

    generatedUrls.forEach(url => {
        window.open(url, "_blank");
    });

    showMessage(
        "Opening generated URLs...",
        "success"
    );
}


// --------------------------------------------------
// CLEAR EVERYTHING
// --------------------------------------------------

function clearEverything() {

    urlTemplate.value = "";
    pointerName.value = "";

    pointers = [];
    generatedUrls = [];

    resultsContainer.innerHTML = "";

    resultsSection.style.display = "none";

    updateTemplatePreview();
    renderPointers();

    showMessage(
        "Everything cleared.",
        "success"
    );
}


// --------------------------------------------------
// EVENTS
// --------------------------------------------------

urlTemplate.addEventListener(
    "input",
    updateTemplatePreview
);

generateBtn.addEventListener(
    "click",
    generateUrls
);

clearBtn.addEventListener(
    "click",
    clearEverything
);

copyBtn.addEventListener(
    "click",
    copyAll
);

openAllBtn.addEventListener(
    "click",
    openAll
);


// Initial state
updateTemplatePreview();
renderPointers();

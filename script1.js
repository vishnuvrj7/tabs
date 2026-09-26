const urlInput = document.getElementById("url");
const idsInput = document.getElementById("ids");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const openAllBtn = document.getElementById("openAllBtn");

const resultsSection = document.getElementById("resultsSection");
const resultsContainer = document.getElementById("results");
const count = document.getElementById("count");
const message = document.getElementById("message");

let generatedUrls = [];

// Show message
function showMessage(text, type = "success") {
    message.textContent = text;
    message.className = `message ${type}`;

    setTimeout(() => {
        message.textContent = "";
        message.className = "message";
    }, 3000);
}

// Get IDs from textarea
function parseIds(text) {
    return text
        .split(/\r?\n/)
        .map(id => id.trim())
        .filter(id => id.length > 0);
}

// Generate URLs
function buildUrls() {
    const template = urlInput.value.trim();
    const ids = parseIds(idsInput.value);

    if (!template) {
        showMessage("Please enter a URL.", "error");
        return;
    }

    if (!template.includes("{ID}")) {
        showMessage("Your URL must contain {ID}.", "error");
        return;
    }

    if (ids.length === 0) {
        showMessage("Please enter at least one ID.", "error");
        return;
    }

    generatedUrls = ids.map(id => {
        return template.replaceAll(
            "{ID}",
            encodeURIComponent(id)
        );
    });

    displayUrls();
    showMessage(`${generatedUrls.length} URLs generated.`, "success");
}

// Display generated URLs
function displayUrls() {
    resultsContainer.innerHTML = "";

    count.textContent = generatedUrls.length;

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

// Copy all URLs
async function copyAll() {
    if (generatedUrls.length === 0) {
        showMessage("Generate some URLs first.", "error");
        return;
    }

    try {
        await navigator.clipboard.writeText(
            generatedUrls.join("\n")
        );

        showMessage("All URLs copied to clipboard.", "success");
    } catch (error) {
        showMessage("Could not copy URLs.", "error");
    }
}

// Open all URLs
function openAll() {
    if (generatedUrls.length === 0) {
        showMessage("Generate some URLs first.", "error");
        return;
    }

    generatedUrls.forEach(url => {
        window.open(url, "_blank");
    });

    showMessage("Opening generated URLs...", "success");
}

// Clear everything
function clearAll() {
    urlInput.value = "";
    idsInput.value = "";

    generatedUrls = [];

    resultsContainer.innerHTML = "";
    count.textContent = "0";

    resultsSection.style.display = "none";

    showMessage("Cleared.", "success");
}

// Button events
generateBtn.addEventListener("click", buildUrls);
clearBtn.addEventListener("click", clearAll);
copyBtn.addEventListener("click", copyAll);
openAllBtn.addEventListener("click", openAll);

// Keyboard shortcut
idsInput.addEventListener("keydown", event => {
    if (event.ctrlKey && event.key === "Enter") {
        buildUrls();
    }
});

const cabinetProducts = [
    {
        id: "snow-white",
        name: "Snow White Shaker",
        series: "Milano Series",
        finish: "Bright white shaker",
        image: "assets/cabinetry/snow-white.png",
        door: "assets/cabinetry/snow-white-door.png",
        sourceUrl: "https://www.atlcabinetry.com/snow-white/",
        features: ["Clean shaker profile", "Good for apartments and resale kitchens", "Pairs well with gray, stone, and wood-look floors"]
    },
    {
        id: "seagull-gray",
        name: "Seagull Gray Shaker",
        series: "Milano Series",
        finish: "Soft gray shaker",
        image: "assets/cabinetry/seagull-gray.png",
        door: "assets/cabinetry/seagull-gray-door.png",
        sourceUrl: "https://www.atlcabinetry.com/seagull-gray-shaker/",
        features: ["Neutral gray cabinet finish", "Works for kitchens and vanities", "Good choice for rental-property refreshes"]
    },
    {
        id: "navy-blue",
        name: "Navy Blue",
        series: "Milano Series",
        finish: "Deep blue shaker",
        image: "assets/cabinetry/navy-blue.png",
        door: "assets/cabinetry/navy-blue-door.png",
        sourceUrl: "https://www.atlcabinetry.com/navy-blue/",
        features: ["Accent island or full kitchen option", "Strong contrast with white counters", "Useful for premium unit upgrades"]
    },
    {
        id: "dove-white",
        name: "Dove White",
        series: "Milano Series",
        finish: "Warm white shaker",
        image: "assets/cabinetry/dove-white.png",
        door: "assets/cabinetry/dove-white-door.png",
        sourceUrl: "https://www.atlcabinetry.com/dove-white/",
        features: ["Warm white cabinet tone", "Classic rental and home remodel finish", "Flexible for kitchens, baths, and laundry rooms"]
    },
    {
        id: "sandy-brown",
        name: "Sandy Brown",
        series: "3E Series",
        finish: "Natural warm brown",
        image: "assets/cabinetry/sandy-brown.jpg",
        door: "assets/cabinetry/sandy-brown-door.png",
        sourceUrl: "https://www.atlcabinetry.com/sandy-brown/",
        features: ["Wood-look cabinet finish", "Warmer apartment upgrade style", "Pairs well with neutral counters and LVP"]
    },
    {
        id: "dark-charcoal",
        name: "Dark Charcoal",
        series: "3E Series",
        finish: "Modern charcoal slab",
        image: "assets/cabinetry/dark-charcoal.png",
        door: "assets/cabinetry/dark-charcoal-door.png",
        sourceUrl: "https://www.atlcabinetry.com/dark-charcoal/",
        features: ["Contemporary dark finish", "Good for modern kitchens", "Strong contrast for light flooring and walls"]
    }
];

const packageLabels = {
    sample: "Door sample / finish review",
    vanity: "Bathroom vanity package",
    kitchen: "Kitchen cabinet package",
    unit: "Apartment unit-turn package"
};

let cabinetCart = [];
let activeCabinetFilter = "all";

function escapeText(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
    }[char]));
}

function renderCabinetGrid() {
    const grid = document.querySelector("#cabinetGrid");
    if (!grid) return;

    const products = activeCabinetFilter === "all"
        ? cabinetProducts
        : cabinetProducts.filter((item) => item.series === activeCabinetFilter);

    grid.innerHTML = products.map((item) => `
        <article class="cabinet-card" data-product="${item.id}">
            <div class="cabinet-image">
                <img src="${item.image}" alt="${escapeText(item.name)} kitchen cabinet preview">
                <img class="cabinet-door" src="${item.door}" alt="${escapeText(item.name)} door sample">
            </div>
            <div class="cabinet-card-body">
                <span class="series">${escapeText(item.series)}</span>
                <h3>${escapeText(item.name)}</h3>
                <p>${escapeText(item.finish)}</p>
                <ul class="cabinet-features">
                    ${item.features.map((feature) => `<li>${escapeText(feature)}</li>`).join("")}
                </ul>
                <label>
                    <span class="package-label">Package type</span>
                    <select data-package="${item.id}">
                        ${Object.entries(packageLabels).map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
                    </select>
                </label>
                <div class="cabinet-card-actions">
                    <button type="button" data-add-cabinet="${item.id}">Add to Quote</button>
                    <input type="number" min="1" step="1" value="1" data-qty="${item.id}" aria-label="${escapeText(item.name)} quantity">
                </div>
            </div>
        </article>
    `).join("");
}

function renderCabinetCart() {
    const itemsEl = document.querySelector("#cabinetCartItems");
    const countEl = document.querySelector("#cabinetCartCount");
    if (!itemsEl || !countEl) return;

    const totalQty = cabinetCart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = `${totalQty} item${totalQty === 1 ? "" : "s"}`;

    if (!cabinetCart.length) {
        itemsEl.innerHTML = '<p class="cart-empty">No cabinet styles selected yet.</p>';
        return;
    }

    itemsEl.innerHTML = cabinetCart.map((item, index) => `
        <div class="cart-row">
            <div>
                <strong>${escapeText(item.name)}</strong>
                <span>${escapeText(item.series)} - ${escapeText(packageLabels[item.packageType])} - Qty ${item.quantity}</span>
            </div>
            <button type="button" data-remove-cabinet="${index}">Remove</button>
        </div>
    `).join("");
}

function addCabinetToCart(productId) {
    const product = cabinetProducts.find((item) => item.id === productId);
    if (!product) return;

    const packageInput = document.querySelector(`[data-package="${productId}"]`);
    const qtyInput = document.querySelector(`[data-qty="${productId}"]`);
    const packageType = packageInput?.value || "kitchen";
    const quantity = Math.max(1, Number.parseInt(qtyInput?.value || "1", 10));
    const existing = cabinetCart.find((item) => item.id === product.id && item.packageType === packageType);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cabinetCart.push({
            id: product.id,
            name: product.name,
            series: product.series,
            sourceUrl: product.sourceUrl,
            packageType,
            quantity
        });
    }

    renderCabinetCart();
}

function cabinetEmailBody(formData) {
    const lines = [
        "Moon Lighting cabinet quote request",
        "",
        "Customer / property: " + (formData.get("customer") || ""),
        "Phone: " + (formData.get("phone") || ""),
        "Project address: " + (formData.get("address") || ""),
        "",
        "Selected cabinet items:"
    ];

    if (!cabinetCart.length) {
        lines.push("No cabinet items selected yet.");
    } else {
        cabinetCart.forEach((item, index) => {
            lines.push(`${index + 1}. ${item.name} | ${item.series} | ${packageLabels[item.packageType]} | Qty ${item.quantity}`);
            lines.push(`   Source reference: ${item.sourceUrl}`);
        });
    }

    lines.push("");
    lines.push("Supplier reference:");
    lines.push("ATL Cabinetry Depot");
    lines.push("3033 Adriatic Ct., Suite B, Peachtree Corners, GA 30071");
    lines.push("Phone: 770-685-1471 / 888-470-3351");
    lines.push("Website: www.ATLCabinetry.com");
    lines.push("");
    lines.push("Notes:");
    lines.push(formData.get("notes") || "");

    return lines.join("\n");
}

function initCabinetStore() {
    const grid = document.querySelector("#cabinetGrid");
    const form = document.querySelector("#cabinetOrderForm");
    const clearBtn = document.querySelector("#clearCabinetCart");
    if (!grid) return;

    renderCabinetGrid();
    renderCabinetCart();

    document.querySelectorAll("[data-filter]").forEach((button) => {
        button.addEventListener("click", () => {
            activeCabinetFilter = button.dataset.filter || "all";
            document.querySelectorAll("[data-filter]").forEach((item) => {
                item.classList.toggle("is-active", item === button);
            });
            renderCabinetGrid();
        });
    });

    grid.addEventListener("click", (event) => {
        const addButton = event.target.closest("[data-add-cabinet]");
        if (!addButton) return;
        addCabinetToCart(addButton.dataset.addCabinet);
    });

    document.querySelector("#cabinetCartItems")?.addEventListener("click", (event) => {
        const removeButton = event.target.closest("[data-remove-cabinet]");
        if (!removeButton) return;
        cabinetCart.splice(Number(removeButton.dataset.removeCabinet), 1);
        renderCabinetCart();
    });

    clearBtn?.addEventListener("click", () => {
        cabinetCart = [];
        renderCabinetCart();
    });

    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const subject = encodeURIComponent("Cabinet quote request");
        const body = encodeURIComponent(cabinetEmailBody(formData));
        window.location.href = `mailto:accentgv@gmail.com?subject=${subject}&body=${body}`;
    });
}

const leadForm = document.querySelector(".lead-form");

if (leadForm) {
    leadForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = new FormData(leadForm);
        const subject = encodeURIComponent("Apartment upgrade estimate request");
        const body = encodeURIComponent([
            "Moon Lighting, Inc. estimate request",
            "",
            `Property or company: ${data.get("property") || ""}`,
            `Contact name: ${data.get("name") || ""}`,
            `Phone: ${data.get("phone") || ""}`,
            `Project need: ${data.get("service") || ""}`,
            "",
            "Notes:",
            data.get("notes") || ""
        ].join("\n"));

        window.location.href = `mailto:accentgv@gmail.com?subject=${subject}&body=${body}`;
    });
}

initCabinetStore();

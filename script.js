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

        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });
}

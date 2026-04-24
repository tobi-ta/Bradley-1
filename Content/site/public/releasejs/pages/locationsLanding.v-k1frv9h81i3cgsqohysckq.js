const locationsClass = ".locations";
const locationsHeroClass = `${locationsClass}__hero`;

function createLocationsLanding() {
    let heroImages;
    let heroLinks;

    function init() {
        window.addEventListener("DOMContentLoaded", () => {
            heroImages = Array.from(
                document.querySelectorAll(`${locationsHeroClass}--image`)
            );
            heroLinks = Array.from(
                document.querySelectorAll(`${locationsHeroClass}--link`)
            );

            heroLinks.forEach((link) => {
                const city = link.dataset.city;
                const matchingImage = heroImages.find(
                    (image) => image.dataset.city === city
                );
                link.addEventListener("mouseenter", () => {
                    if (!city || !matchingImage) return;
                    matchingImage.classList.add("hovering");
                });
                link.addEventListener("mouseleave", () => {
                    if (!city || !matchingImage) return;
                    matchingImage.classList.remove("hovering");
                });
            });
        });
    }

    return {
        init
    };
}

const locationsLanding = createLocationsLanding();
locationsLanding.init();
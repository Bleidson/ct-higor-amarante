const carousel = document.getElementById("carrousel");
const card = carousel.querySelector(".prof-card");
const gap = parseInt(getComputedStyle(carousel).gap);
const cardWidth = card.offsetWidth + gap;

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

function scrollNext() {
    if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - cardWidth) {
        // Se está no final, volta pro início
        carousel.scrollTo({ left: 0, behavior: "smooth" });
    } else {
        // Caso contrário, vai pro próximo card
        carousel.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
}

function scrollPrev() {
    if (carousel.scrollLeft === 0) {
        // Se está no início, vai pro final
        carousel.scrollTo({ left: carousel.scrollWidth, behavior: "smooth" });
    } else {
        // Caso contrário, volta um card
        carousel.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
}

// Eventos dos botões
nextBtn.addEventListener("click", scrollNext);
prevBtn.addEventListener("click", scrollPrev);

// Auto-play a cada 10 segundos
setInterval(scrollNext, 3000);

// --- ЛОГИКА BOTTOM SHEET ---
const bottomSheet = document.querySelector(".bottom-sheet");
const sheetContent = bottomSheet.querySelector(".content");
const sheetBody = bottomSheet.querySelector(".body");
const dragIcon = bottomSheet.querySelector(".drag-icon");

let isDragging = false, startY, startHeight;

const showBottomSheet = () => {
    // Очищаем и вставляем свежий контент
    sheetBody.innerHTML = '';
    const content = getProductContent();
    sheetBody.appendChild(content);
    
    bottomSheet.classList.add("show");
    document.body.style.overflow = "hidden";
    updateSheetHeight(90); // Открываем на половину

    // Инициализируем свайпер внутри
    initProductSwiper(sheetBody);
}

const hideBottomSheet = () => {
    bottomSheet.classList.remove("show");
    document.body.style.overflow = "";
}

const updateSheetHeight = (height) => {
    sheetContent.style.height = `${height}vh`;
    bottomSheet.classList.toggle("fullscreen", height > 90);
}

// Исправление: Тянем ТОЛЬКО за dragIcon, чтобы не конфликтовать со свайпером
const dragStart = (e) => {
    isDragging = true;
    startY = e.pageY || e.touches?.[0].pageY;
    startHeight = parseInt(sheetContent.style.height);
    bottomSheet.classList.add("dragging");
}

const dragging = (e) => {
    if (!isDragging) return;
    const currentY = e.pageY || e.touches?.[0].pageY;
    const delta = startY - currentY;
    const newHeight = startHeight + (delta / window.innerHeight) * 100;
    if (newHeight > 20 && newHeight < 96) {
        updateSheetHeight(newHeight);
    }
}

const dragStop = () => {
    if (!isDragging) return;
    isDragging = false;
    bottomSheet.classList.remove("dragging");
    const sheetHeight = parseInt(sheetContent.style.height);
    
    if (sheetHeight < 35) {
        hideBottomSheet();
    } else if (sheetHeight > 75) {
        updateSheetHeight(90);
    } else {
        updateSheetHeight(50);
    }
}

// Слушатели для Bottom Sheet (только за иконку)
dragIcon.addEventListener("mousedown", dragStart);
dragIcon.addEventListener("touchstart", dragStart);
document.addEventListener("mousemove", dragging);
document.addEventListener("touchmove", dragging);
document.addEventListener("mouseup", dragStop);
document.addEventListener("touchend", dragStop);
bottomSheet.querySelector(".sheet-overlay").addEventListener("click", hideBottomSheet);
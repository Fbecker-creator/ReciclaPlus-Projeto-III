const modal = document.querySelector("#modal");
const openButton = document.querySelector("#open-search");
const closeButton = document.querySelector("#close-search");
const searchInput = document.querySelector("#search");

function openSearch() {
  modal.classList.remove("hide");
  modal.setAttribute("aria-hidden", "false");
  setTimeout(() => searchInput?.focus(), 100);
}

function closeSearch() {
  modal.classList.add("hide");
  modal.setAttribute("aria-hidden", "true");
}

openButton?.addEventListener("click", openSearch);
closeButton?.addEventListener("click", closeSearch);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeSearch();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSearch();
});

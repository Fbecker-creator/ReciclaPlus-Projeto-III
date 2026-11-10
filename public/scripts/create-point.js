const ufSelect = document.querySelector("#uf");
const citySelect = document.querySelector("#city");
const stateInput = document.querySelector("[name=state]");
const imageInput = document.querySelector("#image");
const imagePreview = document.querySelector("#image-preview");
const locationStatus = document.querySelector("#location-status");
const latitudeInput = document.querySelector("#latitude");
const longitudeInput = document.querySelector("#longitude");
const form = document.querySelector("#point-form");

function populateUFs() {
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
    .then((res) => res.json())
    .then((states) => {
      states.forEach((state) => {
        ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`;
      });
    })
    .catch(() => {
      ufSelect.innerHTML = '<option value="">Não foi possível carregar os estados</option>';
    });
}

populateUFs();

ufSelect.addEventListener("change", (event) => {
  const ufValue = event.target.value;
  const selectedOption = event.target.options[event.target.selectedIndex];

  stateInput.value = selectedOption?.text || "";
  citySelect.innerHTML = '<option value="">Carregando cidades...</option>';
  citySelect.disabled = true;

  if (!ufValue) {
    citySelect.innerHTML = '<option value="">Selecione primeiro o estado</option>';
    return;
  }

  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios?orderBy=nome`;

  fetch(url)
    .then((res) => res.json())
    .then((cities) => {
      citySelect.innerHTML = '<option value="">Selecione a cidade</option>';

      cities.forEach((city) => {
        citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`;
      });

      citySelect.disabled = false;
    })
    .catch(() => {
      citySelect.innerHTML = '<option value="">Erro ao carregar cidades</option>';
    });
});

// Pré-visualização da imagem.
imageInput.addEventListener("input", () => {
  const url = imageInput.value.trim();

  if (!url) {
    imagePreview.innerHTML = "<span>Pré-visualização da foto</span>";
    imagePreview.classList.remove("has-image");
    return;
  }

  imagePreview.innerHTML = `<img src="${url}" alt="Pré-visualização"/>`;
  imagePreview.classList.add("has-image");

  const img = imagePreview.querySelector("img");
  img.onerror = () => {
    imagePreview.innerHTML = "<span>Não foi possível carregar esta imagem. Confira o link.</span>";
    imagePreview.classList.remove("has-image");
  };
});

// Materiais.
const selectedItems = new Set();
const itemOptions = document.querySelectorAll(".item-option");
const itemsInput = document.querySelector("#items");
const itemsStatus = document.querySelector("#items-status");

itemOptions.forEach((item) => {
  item.addEventListener("click", () => {
    const id = item.dataset.id;

    if (selectedItems.has(id)) {
      selectedItems.delete(id);
      item.classList.remove("selected");
    } else {
      selectedItems.add(id);
      item.classList.add("selected");
    }

    itemsInput.value = [...selectedItems].join(",");

    const count = selectedItems.size;
    itemsStatus.textContent = count
      ? `${count} material${count > 1 ? "is" : ""} selecionado${count > 1 ? "s" : ""}.`
      : "Nenhum material selecionado.";
  });
});

// Localização atual opcional.
document.querySelector("#use-location")?.addEventListener("click", () => {
  if (!navigator.geolocation) {
    locationStatus.textContent = "Seu navegador não oferece geolocalização.";
    return;
  }

  locationStatus.textContent = "Obtendo sua localização...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitudeInput.value = position.coords.latitude;
      longitudeInput.value = position.coords.longitude;

      locationStatus.textContent =
        "✓ Localização salva. O ponto será colocado exatamente nessa posição.";
    },
    () => {
      locationStatus.textContent =
        "Não foi possível obter sua localização. Você ainda pode cadastrar pelo endereço.";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

form.addEventListener("submit", (event) => {
  if (!itemsInput.value) {
    event.preventDefault();
    itemsStatus.textContent = "Selecione pelo menos um material.";
    itemsStatus.classList.add("error");
    document.querySelector(".items-grid")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

const path = require("path");
const express = require("express");
const server = express();
const db = require("./database/db");
const nunjucks = require("nunjucks");

const PORT = process.env.PORT || 3333;
const PUBLIC_PATH = path.join(__dirname, "..", "public");
const VIEWS_PATH = path.join(__dirname, "views");

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static(PUBLIC_PATH));

nunjucks.configure(VIEWS_PATH, {
  express: server,
  noCache: true,
});

const ITEM_NAMES = {
  1: "Lâmpadas",
  2: "Pilhas e Baterias",
  3: "Papéis e Papelão",
  4: "Resíduos Eletrônicos",
  5: "Resíduos Orgânicos",
  6: "Óleo de Cozinha",
  7: "Plásticos",
  8: "Vidros",
  9: "Metais",
  10: "Pneus",
  11: "Roupas e Tecidos",
  12: "Móveis e Madeira",
  13: "Resíduos de Construção",
};

function parseItems(value) {
  if (!value) return [];

  return String(value)
    .split(",")
    .map((id) => ITEM_NAMES[String(id).trim()] || String(id).trim())
    .filter(Boolean);
}

function normalizePlace(place) {
  return {
    ...place,
    itemsList: parseItems(place.items),
  };
}

async function geocodeAddress({ address, address2, city, state }) {
  const query = [address, address2, city, state, "Brasil"]
    .filter(Boolean)
    .join(", ");

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "ReciclaPlus-ADS/1.0 (projeto academico)",
        "Accept-Language": "pt-BR",
      },
    });

    if (!response.ok) return null;

    const results = await response.json();

    if (!results.length) return null;

    return {
      latitude: Number(results[0].lat),
      longitude: Number(results[0].lon),
    };
  } catch (error) {
    console.warn("Não foi possível localizar o endereço automaticamente:", error.message);
    return null;
  }
}

server.get("/", (req, res) => {
  res.render("index.html", {
    title: "Recicla+",
  });
});

server.get("/create-point", (req, res) => {
  res.render("create-point.html");
});

server.get("/search", (req, res) => {
  const search = (req.query.search || "").trim();

  if (!search) {
    return res.render("search-results.html", {
      total: 0,
      places: [],
      search,
    });
  }

  const term = `%${search}%`;

  db.all(
    `
      SELECT *
      FROM places
      WHERE city LIKE ?
         OR state LIKE ?
         OR name LIKE ?
         OR address LIKE ?
         OR items LIKE ?
      ORDER BY name ASC
    `,
    [term, term, term, term, term],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erro ao consultar os pontos.");
      }

      const places = rows.map(normalizePlace);

      return res.render("search-results.html", {
        places,
        total: places.length,
        search,
        saved: req.query.saved === "1",
      });
    }
  );
});

server.get("/map", (req, res) => {
  db.all(`SELECT * FROM places ORDER BY name ASC`, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro ao carregar o mapa.");
    }

    res.render("map.html", {
      places: rows.map(normalizePlace),
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
    });
  });
});

server.get("/api/places", (req, res) => {
  db.all(`SELECT * FROM places ORDER BY name ASC`, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao carregar os pontos." });
    }

    res.json(rows.map(normalizePlace));
  });
});

server.post("/savepoint", async (req, res) => {
  const {
    name,
    image,
    address,
    address2,
    state,
    city,
    items,
    latitude,
    longitude,
  } = req.body;

  if (!name || !image || !address || !state || !city || !items) {
    return res.status(400).send("Preencha todos os campos obrigatórios.");
  }

  let coordinates = null;

  if (latitude && longitude) {
    coordinates = {
      latitude: Number(latitude),
      longitude: Number(longitude),
    };
  } else {
    coordinates = await geocodeAddress({
      address,
      address2,
      city,
      state,
    });
  }

  const query = `
    INSERT INTO places (
      image,
      name,
      address,
      address2,
      state,
      city,
      items,
      latitude,
      longitude
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    image,
    name.trim(),
    address.trim(),
    (address2 || "").trim(),
    state.trim(),
    city.trim(),
    items,
    coordinates ? coordinates.latitude : null,
    coordinates ? coordinates.longitude : null,
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.error("Erro ao salvar ponto:", err);
      return res.status(500).send("Não foi possível salvar o ponto de coleta.");
    }

    res.redirect(`/search?search=${encodeURIComponent(city.trim())}&saved=1`);
  });
});

server.listen(PORT, () => {
  console.log(`Recicla+ rodando em http://localhost:${PORT}`);
});

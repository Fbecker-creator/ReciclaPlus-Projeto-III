# Recicla+

Sistema web para localizar, cadastrar e visualizar pontos de coleta e descarte.

## Tecnologias
- Node.js + Express
- Nunjucks
- SQLite
- Google Maps JavaScript API
- API de localidades do IBGE
- Geocodificação de endereço pelo OpenStreetMap/Nominatim

## Como executar no computador

1. Instale o Node.js (preferencialmente versão LTS).
2. Abra o terminal dentro da pasta do projeto.
3. Execute:

```bash
npm install
npm start
```

4. Abra no navegador:

`http://localhost:3333`

> O projeto não deve ser executado usando um `node_modules` copiado de outro computador. Se trocar de computador, apague a pasta `node_modules` e execute `npm install`.

## Google Maps

O mapa interativo usa a Google Maps JavaScript API.

### 1. Criar uma chave
No Google Cloud, crie um projeto, habilite a **Maps JavaScript API** e crie uma chave de API.

### 2. Configurar no Windows — PowerShell

Antes de iniciar o projeto:

```powershell
$env:GOOGLE_MAPS_API_KEY="SUA_CHAVE_AQUI"
npm start
```

No CMD:

```cmd
set GOOGLE_MAPS_API_KEY=SUA_CHAVE_AQUI
npm start
```

Depois acesse:

`http://localhost:3333/map`

Para publicar o projeto, restrinja a chave por domínio/referrer e habilite somente as APIs necessárias.

## Funcionalidades implementadas

- Interface inicial moderna e responsiva.
- Pesquisa por cidade, estado, nome do estabelecimento, endereço ou material.
- Cadastro de ponto de coleta.
- Pré-visualização da foto antes do cadastro.
- Seleção de 13 tipos de materiais.
- Uso opcional da localização atual do dispositivo.
- Geocodificação automática do endereço quando a localização não for informada.
- Salvamento real no SQLite.
- Mapa com marcador para cada ponto cadastrado.
- Lista lateral dos pontos no mapa.
- Link de rota pelo Google Maps.
- Fallback para links do Google Maps quando a chave da API ainda não estiver configurada.

## Materiais disponíveis

Lâmpadas, Pilhas e Baterias, Papéis e Papelão, Resíduos Eletrônicos, Resíduos Orgânicos, Óleo de Cozinha, Plásticos, Vidros, Metais, Pneus, Roupas e Tecidos, Móveis e Madeira e Resíduos de Construção.

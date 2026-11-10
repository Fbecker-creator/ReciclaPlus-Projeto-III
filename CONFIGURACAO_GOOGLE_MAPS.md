# Configuração do Google Maps no Recicla+

O Recicla+ já está preparado para mostrar os pontos cadastrados no Google Maps.

## 1. Criar a chave

No Google Cloud Console:

1. Crie/seleciona um projeto.
2. Ative **Maps JavaScript API**.
3. Crie uma **API Key**.
4. Recomenda-se restringir a chave por HTTP referrers quando o projeto estiver publicado.

## 2. Rodar localmente

PowerShell:

```powershell
$env:GOOGLE_MAPS_API_KEY="SUA_CHAVE"
npm start
```

CMD:

```cmd
set GOOGLE_MAPS_API_KEY=SUA_CHAVE && npm start
```

A página do mapa é:

`http://localhost:3333/map`

## 3. Sem chave

O sistema não quebra. A página mostra a lista dos pontos e cada ponto possui um botão para abrir a localização/rota no Google Maps.

## 4. Como os pontos recebem a localização

Ao cadastrar um ponto, o sistema primeiro verifica se o usuário clicou em **Usar minha localização**.

Se não houver latitude/longitude informadas, o servidor tenta localizar o endereço automaticamente e salva as coordenadas no SQLite.

Assim, os próximos acessos ao mapa podem usar os pontos já salvos sem repetir a busca do endereço.

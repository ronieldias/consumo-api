# Consumo de APIs públicas

Este documento detalha as seis APIs utilizadas no projeto.

## 1. API de Gatos Aleatórios (The Cat API)

### 1.1. O que faz
Fornece imagens aleatórias de gatos.

### 1.2. Endpoint utilizado
```
https://api.thecatapi.com/v1/images/search/
```

### 1.3. Como funciona
- Faz uma requisição GET para a API
- Recebe um array JSON com informações da imagem
- Extrai a URL da imagem do primeiro resultado (`json[0].url`)
- Exibe a imagem no elemento HTML com id "gato"

### 1.4. Demonstração via CURL
```bash
https://api.thecatapi.com/v1/images/search/
```

#### Exemplo de resposta
```json
[
  {
    "id": "abc123",
    "url": "https://cdn2.thecatapi.com/images/abc123.jpg",
    "width": 1200,
    "height": 800
  }
]
```

## 2. API de Geocodificação (Nominatim)

### 2.1. O que faz
Converte nomes de cidades em coordenadas geográficas (latitude e longitude).

### 2.2. Endpoint utilizado
```
https://nominatim.openstreetmap.org/search
```

### 2.3. Como funciona
- Recebe o nome da cidade digitado pelo usuário
- Faz uma requisição GET com parâmetros específicos
- Retorna as coordenadas da cidade encontrada
- Passa essas coordenadas para a API de clima

### 2.4. Parâmetros utilizados
- `q`: nome da cidade
- `format=json`: formato da resposta
- `limit=1`: apenas um resultado

### 2.5. Demonstração via CURL
```bash
curl -X GET "https://nominatim.openstreetmap.org/search?q=Teresina&format=json&limit=1"
```

#### Exemplo de resposta
```json
[
  {
    "lat": "-23.5505",
    "lon": "-46.6333",
    "display_name": "São Paulo, Brasil"
  }
]
```

## 3. API de Previsão do Tempo (Open-Meteo)

### 3.1. O que faz
Fornece dados meteorológicos atuais baseados em coordenadas geográficas.

### 3.2. Endpoint utilizado
```
https://api.open-meteo.com/v1/forecast
```

### 3.3. Como funciona
- Recebe latitude e longitude da API Nominatim
- Faz uma requisição GET com as coordenadas
- Retorna dados meteorológicos atuais
- Exibe temperatura, vento e turno (dia/noite)

### 3.4. Parâmetros utilizados
- `latitude`: coordenada de latitude
- `longitude`: coordenada de longitude
- `current_weather=true`: dados do clima atual

### 3.5. Dados exibidos
- **Temperatura**: em graus Celsius
- **Velocidade do vento**: em Km/h
- **Direção do vento**: em graus (0-360°)
- **Turno**: dia ou noite

### 3.6. Demonstração via CURL
```bash
curl -X GET "https://api.open-meteo.com/v1/forecast?latitude=-5.09&longitude=-42.80&current_weather=true"
```

#### Exemplo de resposta
```json
{
	"latitude": -5.125,
	"longitude": -42.75,
	"generationtime_ms": 0.04279613494873047,
	"utc_offset_seconds": 0,
	"timezone": "GMT",
	"timezone_abbreviation": "GMT",
	"elevation": 85.0,
	"current_weather_units": {
		"time": "iso8601",
		"interval": "seconds",
		"temperature": "°C",
		"windspeed": "km/h",
		"winddirection": "°",
		"is_day": "",
		"weathercode": "wmo code"
	},
	"current_weather": {
		"time": "2025-07-06T23:15",
		"interval": 900,
		"temperature": 24.9,
		"windspeed": 4.1,
		"winddirection": 285,
		"is_day": 0,
		"weathercode": 1
	}
}
```

## 4. API de Clima (OpenWeather)

### 4.1. O que faz
Fornece dados meteorológicos detalhados de uma cidade específica, utilizando uma chave de API (API Key) para autenticação.

### 4.2. Endpoint utilizado
```
https://api.openweathermap.org/data/2.5/weather
```

### 4.3. Como funciona
- Recebe o nome da cidade e o código do país digitados pelo usuário
- Utiliza uma API Key, armazenada no arquivo config.js, para autenticar a requisição
- Faz uma requisição GET para a API, enviando a cidade, o código do país e a chave como parâmetros
- Exibe uma grande variedade de dados meteorológicos

### 4.4. Parâmetros utilizados
- `q`: nome da cidade e código do país
- `appid`: chave da API (API Key)

### 4.5. Dados exibidos
- **Nome da cidade e código do País**: ex: Teresina, BR
- **Latitude e Longitude**: ex: Latitude: -5.0892, Longitude: -42.8019
- **Descricao do tempo**: ex: céu limpo
- **Temperaturas**: Convertidas de Kelvin para Celsius (atual, mínima, máxima)
- **Sensação térmica**: Temperatura percebida
- **Umidade**: Percentual de umidade do ar
- **Velocidade do vento**: Convertida de m/s para km/h
- **Visibilidade**: Convertida de metros para quilômetros

### 4.6. Autenticação
- **API Key**: A chave é enviada como parâmetro na URL da requisição (`APPID=sua_chave_aqui`)

### 4.7. Demonstração via CURL
```bash
curl -X GET "https://api.openweathermap.org/data/2.5/weather?q=Teresina,BR&appid=SUA_API_KEY&lang=pt_br"
```

#### Exemplo de resposta
```json
{
    "coord": {
        "lon": -42.8019,
        "lat": -5.0892
    },
    "weather": [
        {
            "id": 800,
            "main": "Clear",
            "description": "céu limpo",
            "icon": "01n"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 304.99,
        "feels_like": 305.2,
        "temp_min": 304.99,
        "temp_max": 304.99,
        "pressure": 1012,
        "humidity": 40,
        "sea_level": 1012,
        "grnd_level": 1000
    },
    "visibility": 10000,
    "wind": {
        "speed": 1.54,
        "deg": 320
    },
    "clouds": {
        "all": 0
    },
    "dt": 1751839121,
    "sys": {
        "type": 1,
        "id": 8447,
        "country": "BR",
        "sunrise": 1751792442,
        "sunset": 1751835054
    },
    "timezone": -10800,
    "id": 3386496,
    "name": "Teresina",
    "cod": 200
}
```

## 5. API de Artistas (Spotify)

### O que faz
Busca informações de artistas no Spotify: nome, popularidade, seguidores e imagem.

### Endpoints
```
https://accounts.spotify.com/api/token (autenticação)
https://api.spotify.com/v1/search (busca)
```

### Como funciona
1. **Obter token**: Autenticação com Client ID e Client Secret
2. **Buscar artista**: Requisição GET com o token no header Authorization

### Parâmetros
- `q`: nome do artista
- `type`: artist
- `limit`: número de resultados

### Autenticação
OAuth 2.0 (Client Credentials Flow) - Token válido por 1 hora

### Demonstração via CURL

**Passo1 (no PowerShell): Obter credenciais do Spotify codificadas em Base64**
```bash
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("SEU_CLIENT_ID:SEU_CLIENT_SECRET"))
```

**Passo 2: Obter Token**
```bash
curl -X POST "https://accounts.spotify.com/api/token" -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic SUA_CREDENCIAL_BASE_64" -d "grant_type=client_credentials"
```

**Passo 2: Buscar Artista**
```bash
curl -X GET "https://api.spotify.com/v1/search?q=Coldplay&type=artist&limit=1" -H "Authorization: Bearer SEU_ACESS_TOKEN"
```

#### Exemplo de resposta
```json
{
	"artists": {
		"href": "https://api.spotify.com/v1/search?offset=0&limit=1&query=Tim%20Maia&type=artist",
		"limit": 1,
		"next": "https://api.spotify.com/v1/search?offset=1&limit=1&query=Tim%20Maia&type=artist",
		"offset": 0,
		"previous": null,
		"total": 845,
		"items": [
			{
				"external_urls": {
					"spotify": "https://open.spotify.com/artist/0jOs0wnXCu1bGGP7kh5uIu"
				},
				"followers": {
					"href": null,
					"total": 2221050
				},
				"genres": [
					"mpb"
				],
				"href": "https://api.spotify.com/v1/artists/0jOs0wnXCu1bGGP7kh5uIu",
				"id": "0jOs0wnXCu1bGGP7kh5uIu",
				"images": [
					{
						"url": "https://i.scdn.co/image/ab6761610000e5ebaa594f902dd3a6704715933f",
						"height": 640,
						"width": 640
					},
					{
						"url": "https://i.scdn.co/image/ab67616100005174aa594f902dd3a6704715933f",
						"height": 320,
						"width": 320
					},
					{
						"url": "https://i.scdn.co/image/ab6761610000f178aa594f902dd3a6704715933f",
						"height": 160,
						"width": 160
					}
				],
				"name": "Tim Maia",
				"popularity": 68,
				"type": "artist",
				"uri": "spotify:artist:0jOs0wnXCu1bGGP7kh5uIu"
			}
		]
	}
}
```

## 6. API de Criação de Posts (JSONPlaceholder)

### 6.1. O que faz
Permite criar posts simulados através de requisições HTTP POST.

### 6.2. Endpoint utilizado
```
https://jsonplaceholder.typicode.com/posts
```

### 6.3. Como funciona
- Recebe título e conteúdo do usuário
- Valida campos obrigatórios
- Faz requisição POST
- Retorna post criado com ID

###6.4. Demonstração via CURL
```bash
curl -X POST "https://jsonplaceholder.typicode.com/posts" -H "Content-type: application/json; charset=UTF-8" -d "{\"title\": \"foo\",\"body\": \"bar\",\"userId\": 1}"
```

#### Dados enviados
```json
{
  "title": "Título do post",
  "body": "Conteúdo do post",
  "userId": 2
}
```

#### Exemplo de resposta
```json
{
  "id": 101,
  "title": "Título do post",
  "body": "Conteúdo do post",
  "userId": 2
}
```
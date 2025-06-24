# APIs Utilizadas no Projeto

Este documento explica as três APIs utilizadas no projeto.

## 1. API de Gatos Aleatórios (The Cat API)

### O que faz
Fornece imagens aleatórias de gatos.

### Endpoint utilizado
```
https://api.thecatapi.com/v1/images/search/
```

### Como funciona
- Faz uma requisição GET para a API
- Recebe um array JSON com informações da imagem
- Extrai a URL da imagem do primeiro resultado (`json[0].url`)
- Exibe a imagem no elemento HTML com id "gato"

### Exemplo de resposta
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

### O que faz
Converte nomes de cidades em coordenadas geográficas (latitude e longitude).

### Endpoint utilizado
```
https://nominatim.openstreetmap.org/search
```

### Como funciona
- Recebe o nome da cidade digitado pelo usuário
- Faz uma requisição GET com parâmetros específicos
- Retorna as coordenadas da cidade encontrada
- Passa essas coordenadas para a API de clima

### Parâmetros utilizados
- `q`: nome da cidade
- `format=json`: formato da resposta
- `limit=1`: apenas um resultado

### Exemplo de resposta
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

### O que faz
Fornece dados meteorológicos atuais baseados em coordenadas geográficas.

### Endpoint utilizado
```
https://api.open-meteo.com/v1/forecast
```

### Como funciona
- Recebe latitude e longitude da API Nominatim
- Faz uma requisição GET com as coordenadas
- Retorna dados meteorológicos atuais
- Exibe temperatura, vento e turno (dia/noite)

### Parâmetros utilizados
- `latitude`: coordenada de latitude
- `longitude`: coordenada de longitude
- `current_weather=true`: dados do clima atual

### Dados exibidos
- **Temperatura**: em graus Celsius
- **Velocidade do vento**: em Km/h
- **Direção do vento**: em graus (0-360°)
- **Turno**: dia ou noite

### Exemplo de resposta
```json
{
  "current_weather": {
    "temperature": 25.5,
    "windspeed": 12.3,
    "winddirection": 180,
    "is_day": 1
  }
}
```
## 4. API de Criação de Posts (JSONPlaceholder)

### O que faz
Permite criar posts simulados através de requisições HTTP POST.

### Endpoint utilizado
```
https://jsonplaceholder.typicode.com/posts
```

### Como funciona
- Recebe título e conteúdo do usuário
- Valida campos obrigatórios
- Faz requisição POST
- Retorna post criado com ID

### Dados enviados
```json
{
  "title": "Título do post",
  "body": "Conteúdo do post",
  "userId": 2
}
```

### Exemplo de resposta
```json
{
  "id": 101,
  "title": "Título do post",
  "body": "Conteúdo do post",
  "userId": 2
}
```

### Tratamento de Erros
- **Campos vazios**: "Preencha título e corpo"
- **Erro na requisição**: Exibe status HTTP
- **Outros erros**: Mensagem genérica

### Método HTTP
**POST** - para criar novo recurso

### Requisitos Técnicos
- API gratuita, sem autenticação
- Dados em JSON
- Fetch com async/await
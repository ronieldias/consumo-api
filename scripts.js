import { config, obterTokenSpotify } from './config.js';

function getById(id) {
    return document.getElementById(id);
}

//GATO RANDOMICO (THE CAT API) #########################################################################################################
let botaoGatoRandomico = getById('botaoGatoRandomico');
botaoGatoRandomico.addEventListener('click', consultarGato);
async function consultarGato() {
    let url = "https://api.thecatapi.com/v1/images/search/";
    
    try {
        let response = await fetch(url);
        let json = await response.json();

        if (!response.ok) {
            throw new Error("Erro ao consultar gato");
        }

        let gato = getById("gato"); 
        gato.src = json[0].url;

    } catch (e) {
        getById('erroGato').innerText = "Erro ao consultar gato";
    }
}

//PREVISÃO DO TEMPO 01 (NOMINATIM + OPEN-METEO) ########################################################################################
let botaoConsultarClima = getById('botaoConsultarClima');
botaoConsultarClima.addEventListener('click', () => {
    let cidade = getById('cidade').value;
    buscarCoordenadas(cidade);
});
// Nominatim API : recebe nome de uma cidade e retorna as coordenadas
async function buscarCoordenadas(cidade) {
    let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cidade)}&format=json&limit=1`;

    try {
        let response = await fetch(url, {
            headers: {
                'User-Agent': 'SeuAppClima - contato@exemplo.com' // Nominatim exige um User-Agent
            }
        });
        let json = await response.json();

        if (json.length === 0) {
            throw new Error("Cidade não encontrada");
        }

        let latitude = json[0].lat;
        let longitude = json[0].lon;

        consultarClima(latitude, longitude); //chamada para a função que vai retornar, de fato, as informações do clima
    } catch (e) {
        getById('erroClima').innerText = "Erro ao buscar coordenadas: " + e.message;
    }
}

// Open-Meteo : recebe coordenadas e retorna as informações do clima do local
async function consultarClima(latitude, longitude) {
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    //limpar erro clima
    getById('erroClima').innerText = '';
    getById('resultadoClima').innerText = '';
    try {
        let response = await fetch(url);
        let json = await response.json();

        if (!response.ok) {
            throw new Error("Erro ao consultar clima");
        }

        let turno = json.current_weather.is_day === 1 ? 'dia' : 'noite';
        
        getById("resultadoClima").innerHTML = `
            <p>Temperatura: ${json.current_weather.temperature}°C</p>
            <p>Velocidade do vento: ${json.current_weather.windspeed} Km/h</p
            <p>Direção do vento: ${json.current_weather.winddirection}°</p>
            <p>Turno: ${turno}</>
        `;
    } catch (e) {
        getById('erroClima').innerText = "Erro ao consultar clima: " + e.message;
    }
}

//PREVISÃO DO TEMPO 02 (OPENWEATHER) ###################################################################################################
const botaoConsultarClima2 = getById('consultarClima2');
botaoConsultarClima2.addEventListener('click', consultarClima2);
async function consultarClima2() {
    const apiKey = config.openWeatherApiKey;
    const cidade2 = getById("cidade2").value;
    const codigoPais = getById('codigoPais').value;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade2},${codigoPais}&APPID=${apiKey}&lang=pt_br`;

    //limpar erro clima
    getById('erroClima2').innerText = '';
    getById('resultadoClima2').innerText = '';

    try {
        let response = await fetch(url);
        let json = await response.json();

        if (!response.ok) {
            throw new Error("Erro ao consultar clima");
        }
        //manipula a div resultadoArtista para a exibição
        getById("resultadoClima2").innerHTML = `
            <p>Cidade: ${json.name}, ${json.sys.country}</p>
            <p>Latitude: ${json.coord.lat}, Longitude: ${json.coord.lon}</p
            <p>Descrição do tempo: ${json.weather[0].description}</p>
            <p>Temperatura atual: ${(json.main.temp - 273.15).toFixed(1)}°C</p>
            <p>Temperatura mínima: ${(json.main.temp_min - 273.15).toFixed(1)}°C</p>
            <p>Temperatura máxima: ${(json.main.temp_max - 273.15).toFixed(1)}°C</p>
            <p>Sensação térmica: ${(json.main.feels_like - 273.15).toFixed(1)}°C</p>
            <p>Umidade do ar: ${json.main.humidity}%</p>
            <p>Velocidade do vento: ${(json.wind.speed * 3.6).toFixed(1)}km/h</p>
            <p>Visibilidade: ${json.visibility / 1000}km</p>
        `;
    } catch (e) {
        getById('erroClima2').innerText = "Erro ao consultar clima: " + e.message;
    }
}

//BUSCAR ARTISTA (SPOTIFY) #############################################################################################################
const botaoBuscar = getById('buscarArtista');
botaoBuscar.addEventListener('click', buscarArtista);
async function buscarArtista() {
    const nome = getById('nomeArtista').value;
    const token = await obterTokenSpotify();

    const url = `https://api.spotify.com/v1/search?q=${nome}&type=artist&limit=1`;

    getById("erroSpotify").innerText = "";
    getById("resultadoArtista").innerHTML = "";

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.error.message || 'Erro ao consultar artista');
        }

        //verifica se ao menos um artista foi retornado
        if (json.artists.items.length === 0) {
            getById("resultadoArtista").innerHTML = "Artista não encontrado.";
            return;
        }

        //manipula a div resultadoArtista para a exibição
        getById("resultadoArtista").innerHTML = `
            <h4>${json.artists.items[0].name}</h4>
            <p>Popularidade: ${json.artists.items[0].popularity}</p>
            <p>Seguidores: ${json.artists.items[0].followers.total.toLocaleString()}</p>
            <p>Genero: ${json.artists.items[0].genres[0]}</p>
            ${json.artists.items[0].images.length > 0 ? `<img src="${json.artists.items[0].images[0].url}" width="300">` : ""}
        `;  
    } catch (e) {
        getById("erroSpotify").innerText = "Erro ao consultar artista: " + e.message;
    }
}

//CRIAR POST (JSONPLACEHOLDER) #########################################################################################################
const botaoCriarPost = getById('botaoCriarPost');
botaoCriarPost.addEventListener('click', criarPost);
async function criarPost() {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const titulo = getById('tituloPost').value;
    const corpo = getById('corpoPost').value;
    const resDiv = getById('resPost');
    const erroDiv = getById('erroPost');

    // Limpa resultados anteriores
    resDiv.innerText = '';
    erroDiv.innerText = '';

    // Corpo (body) da nossa requisição POST
    const postData = {
        title: titulo,
        body: corpo,
        userId: 2, // Apenas um ID de usuário para exemplo
    };

    try {
        if(!titulo || !corpo){
            throw new Error('Preencha título e corpo');
        }

        const response = await fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(postData), // CConverte objeto para uma string JSON
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const json = await response.json();
        
        // API retorna o objeto criado com um novo ID
        resDiv.innerText = `Post criado com sucesso! ID: ${json.id}`;

    } catch (e) {
        erroDiv.innerText = "Erro ao criar o post: " + e.message;
    }
}

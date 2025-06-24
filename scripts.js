function getById(id) {
    return document.getElementById(id);
}

//API DE GATO RANDOMICO
botaoGatoRandomico = getById('botaoGatoRandomico');
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

// API DE PREVISÃO DO TEMPO
let botaoConsultarClima = getById('botaoConsultarClima');
botaoConsultarClima.addEventListener('click', () => {
    let cidade = getById('cidade').value;
    buscarCoordenadas(cidade);
});

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

        consultarClima(latitude, longitude);
    } catch (e) {
        getById('erroClima').innerText = "Erro ao buscar coordenadas: " + e.message;
    }
}

async function consultarClima(latitude, longitude) {
    let temperaturaDiv = getById("temperatura");
    let velocidadeVentoDiv = getById('velocidadeVento');
    let direcaoVentoDiv = getById('direcaoVento');
    let turnoDiv = getById('turno');
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    try {
        let response = await fetch(url);
        let json = await response.json();

        if (!response.ok) {
            throw new Error("Erro ao consultar clima");
        }

        temperaturaDiv.innerHTML = `<p>Temperatura: ${json.current_weather.temperature}°C</p>`;
        velocidadeVentoDiv.innerHTML = `<p>Velocidade do vento: ${json.current_weather.windspeed} Km/h</p>`;
        direcaoVentoDiv.innerHTML = `<p>Direcao do vento: ${json.current_weather.winddirection}°</p>`;
        let turno = json.current_weather.is_day === 1 ? 'dia' : 'noite';
        turnoDiv.innerHTML = `<p>Turno: ${turno}</p>`;
    } catch (e) {
        getById('erro').innerText = "Erro ao consultar clima: " + e.message;
    }
}


// API DE CRIAR POST
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
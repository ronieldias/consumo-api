export const config = {
    openWeatherApiKey: "SUA-API-KEY-AQUI",
    spotifyClientId: "SEU-SPOTIFY-CLIENT-ID-AQUI",
    spotifyClientSecret: "SEU-SPOTIFY-CLIENT-SECRET-AQUI",
    spotifyToken: null,
    spotifyTokenExpiresAt: 0
};

export async function obterTokenSpotify() {
    const agora = Date.now();

    if (config.spotifyToken && agora < config.spotifyTokenExpiresAt) {
        return config.spotifyToken;
    }

    const url = 'https://accounts.spotify.com/api/token';
    const basicAuth = btoa(`${config.spotifyClientId}:${config.spotifyClientSecret}`);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basicAuth}`,  
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials' 
    });

    if (!response.ok){
        throw new Error('Erro ao obter token do Spotify');
    } 

    const data = await response.json();
    config.spotifyToken = data.access_token;
    config.spotifyTokenExpiresAt = agora + data.expires_in * 1000 - 60000;

    return config.spotifyToken;
}

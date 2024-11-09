const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

console.log('Starting bot...');

const client = new Client({
    authStrategy: new LocalAuth()
});

const lastfmApiKey = 'a44c55784e33e08e755e035bd85446fe';
const lastfmUsername = 'oiemaahh';

client.on('qr', (qr) => {
    console.log('QR code received, please scan');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async message => {
    console.log('Received message:', message.body, 'from', message.from);

    if (message.body.toLowerCase() === '!musica') {
        console.log('Fetching music info...');

        try {
            const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastfmUsername}&api_key=${lastfmApiKey}&format=json`);
            const track = response.data.recenttracks.track[0];

            console.log('Received track info:', track);

            if (track && track['@attr'] && track['@attr'].nowplaying) {
                message.reply(`Estou ouvindo: ${track.artist['#text']} - ${track.name}`);
            } else {
                message.reply(`A última música que ouvi foi: ${track.artist['#text']} - ${track.name}`);
            }
        } catch (error) {
            console.error('Error fetching music info:', error);
            message.reply('Desculpe, não consegui obter informações sobre a música no momento.');
        }

    }
}
);

client.initialize();

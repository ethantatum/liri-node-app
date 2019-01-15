require('dotenv').config();

const keys = require('./keys.js');

const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

const axios = require('axios');

let nodeArgs = process.argv;

let artist = '';

if(process.argv[2] === `concert-this`) {
    for(let i = 3; i < nodeArgs.length; i++) {
        if(i > 3 && i < nodeArgs.length) {
            artist = `${artist}+${nodeArgs[i]}`;
        }
        else {
            artist += nodeArgs[i];
        }
    }

    let concertUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
    
    console.log(concertUrl);
    
    axios.get(concertUrl).then(
        function(response, body) {
            console.log(response);
            let userArtist = JSON.parse(body);
          console.log(`Venue: ${userArtist.venue.name}`);
          console.log(`Location: ${userArtist.venue.city}, ${userArtist.venue.region}`);
          console.log(`Date: ${userArtist.datetime}`);
        }
      );
}

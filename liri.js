require('dotenv').config();

const keys = require('./keys.js');

//const spotify = new Spotify(keys.spotify);

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
        function(response) {
          console.log(`Venue: ${response.definitions.VenueData.properties.name}`);
          console.log(`Location: ${response.definitions.VenueData.properties.city}, ${response.venue.region}`);
          console.log(`Date: ${response.definitions.EventData.properties.datetime}`);
        }
      );
}

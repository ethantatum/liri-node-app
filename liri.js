require('dotenv').config();

const keys = require('./keys.js');

const axios = require('axios');

const moment = require('moment');


// const Spotify = require('node-spotify-api');
// const spotify = new Spotify(keys.spotify);
// console.log(spotify);


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
            if(response.data[0] === undefined) {
                console.log(`Oh no! No upcoming events for that artist...try another one!`);
            }
            else {
            console.log(`Venue: ${response.data[0].venue.name}`);
            console.log(`Location: ${response.data[0].venue.city} ${response.data[0].venue.region} ${response.data[0].venue.country}`);
            console.log(`Date: ${response.data[0].datetime}`);
            }
        }
      ).catch(function (error) {
        console.log(`This is axios${error}`);
      });
}

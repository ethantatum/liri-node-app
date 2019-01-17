require('dotenv').config();

const keys = require('./keys.js');

const axios = require('axios');

const moment = require('moment');

const Spotify = require('node-spotify-api');

const spotify = new Spotify(keys.spotify);

let nodeArgs = process.argv;

if(process.argv[2] === `concert-this`) {
    let artist = '';
    for(let i = 3; i < nodeArgs.length; i++) {
        if(i > 3 && i < nodeArgs.length) {
            artist = `${artist}+${nodeArgs[i]}`;
        }
        else {
            artist += nodeArgs[i];
        }
    }

    let concertUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
    
    axios.get(concertUrl).then(
        function(response) {
            if(response.data[0] === undefined) {
                console.log(`Oh no! No upcoming events for that artist...try another one!`);
            }
            else {
            console.log(`Venue: ${response.data[0].venue.name}`);
            console.log(`Location: ${response.data[0].venue.city} ${response.data[0].venue.region} ${response.data[0].venue.country}`);
            let momentDate = moment(response.data[0].datetime).format(`MM DD YYYY`);
            console.log(`Date: ${momentDate}`);
            }
        }
      ).catch(function (error) {
        console.log(error);
      });
}

if(process.argv[2] === `movie-this`) {
    let movie = '';
    if(!process.argv[3]) {
        movie = `Mr.+Nobody`;
        console.log(`Can't think of a movie to search for, huh? Here's one you might like!`);
    }
    else {
        for(let i = 3; i < nodeArgs.length; i++) {
            if(i > 3 && i < nodeArgs.length) {
                movie = `${movie}+${nodeArgs[i]}`;
            }
            else {
                movie += nodeArgs[i];
            }
        }
    }

    let movieUrl = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`;

    axios.get(movieUrl).then(
        function(response) {
            console.log(`Title: ${response.data.Title}`);
            console.log(`Year: ${response.data.Year}`);
            console.log(`IMDB Rating: ${response.data.imdbRating}`);
            console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
            console.log(`Country: ${response.data.Country}`);
            console.log(`Language: ${response.data.Language}`);
            console.log(`Plot: ${response.data.Plot}`);
            console.log(`Actors: ${response.data.Actors}`);
            //}
        }
      ).catch(function (error) {
        console.log(error);
      });
}
// Requiring npm packages and files
require('dotenv').config();

const keys = require('./keys.js');

const axios = require('axios');

const moment = require('moment');

const Spotify = require('node-spotify-api');

const spotify = new Spotify(keys.spotify);

const fs = require(`fs`);

// Caputuring user command and saving total user input by looping over process.argvs
let nodeArgs = process.argv;

let command = process.argv[2];

let userInput = '';
    for(let i = 3; i < nodeArgs.length; i++) {
        if(i > 3 && i < nodeArgs.length) {
            userInput = `${userInput}+${nodeArgs[i]}`;
        }
        else {
            userInput += nodeArgs[i];
        }
    }

// Switch statement that runs different functions based on user commands, or displays a default message if no command is entered
switch (command) {
    case 'concert-this':
    concertSearch(userInput);
    break;

    case 'spotify-this-song':
    spotifySearch(userInput);
    break;

    case 'movie-this':
    movieSearch(userInput);
    break;

    case 'do-what-it-says':
    randomTxt();
    break;

    default:
    console.log(`
    Oops! Please enter a valid command:
    For concert info, enter 'concert-this' and an artist
    For movie info, enter 'movie-this' and a movie name
    For song info, enter 'spotify-this-song' and a song name
    Or surprise yourself with a random response by entering 'do-what-it-says'!
    `)
}

// Function for concert-this command
function concertSearch(userInput) {
    if(!userInput) {
        userInput = `The Fab Four`;
        console.log(`Can't think of a band you want to see? Why not go see THE BEATLES!!...cover band?
        `);
    }

    let concertUrl = `https://rest.bandsintown.com/artists/${userInput}/events?app_id=codingbootcamp`;
   
    axios.get(concertUrl).then(
        function(response) {
            if(response.data[0] === undefined) {
                console.log(`Oh no! No upcoming events for that artist...try another one!`);
            }
            else {
            console.log(`Artist: ${response.data[0].lineup[0]}`);
            console.log(`Venue: ${response.data[0].venue.name}`);
            console.log(`Location: ${response.data[0].venue.city} ${response.data[0].venue.region} ${response.data[0].venue.country}`);
            let momentDate = moment(response.data[0].datetime).format(`MM DD YYYY`);
            console.log(`Date: ${momentDate}`);
            let exportConcert = (`concert-this / Artist: ${response.data[0].lineup[0]} / Venue: ${response.data[0].venue.name} / Location: ${response.data[0].venue.city} ${response.data[0].venue.region} ${response.data[0].venue.country} / Date: ${momentDate},
            `);
            // Exports command and response to log.txt
            fs.appendFile('log.txt', exportConcert, function(err) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log(`
                    Concert information added to search log!`);
                    }
                })
            }
            
        }
      ).catch(function (error) {
        console.log(error);
      });
} // ends concertSearch function


// Function for movie-this command
function movieSearch(userInput) {
    if(!userInput) {
         userInput = `Mr.+Nobody`;
         console.log(`Can't think of a movie to search for, huh? Here's one you might like!
         `);
    }

    let movieUrl = `http://www.omdbapi.com/?t=${userInput}&y=&plot=short&apikey=trilogy`;

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
            let exportMovie = (`movie-this / Title: ${response.data.Title} / Year: ${response.data.Year} / Plot: ${response.data.Plot},
            `)
            // Exports command and response to log.txt
            fs.appendFile('log.txt', exportMovie, function(err) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log(`
                    Movie information added to search log!`);
                    }
                })
        }
      ).catch(function (error) {
        console.log(error);
      });
} // ends movieSearch function


// Function for spotify-this-song command
function spotifySearch(userInput) {
    if(!userInput) {
        userInput = `The Sign Ace of Base`;
        console.log(`Uh-oh, you didn't input a song name! That's OK though, because I saw it - and it opened up my eyes...
        `);
    }

    spotify.search({type: `track`, query: userInput, limit: 1 })
           .then(function(response) {
               //console.log(JSON.stringify(response, null, 2));
               console.log(`Artist: ${response.tracks.items[0].artists[0].name}`);
               console.log(`Song Title: ${response.tracks.items[0].name}`);
               console.log(`Album: ${response.tracks.items[0].album.name}`);
               let preview;
               if(response.tracks.items[0].preview_url === undefined || response.tracks.items[0].preview_url === null) {
                   preview = `Sorry...no preview available for this song - blame the record label!`;
               } else {
                   preview = response.tracks.items[0].preview_url;
               }
               console.log(`Preview URL: ${preview}`);
               let exportTrack = (`spotify-this-song / Artist: ${response.tracks.items[0].artists[0].name} / Song Title: ${response.tracks.items[0].name} / Album: ${response.tracks.items[0].album.name},
               `);
               // Exports command and response to log.txt
               fs.appendFile('log.txt', exportTrack, function(err) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log(`
                    Track information added to search log!`);
                    }
                })
           })
           .catch(function(err) {
               console.log(err);
           });
} // ends spotifySearch function

// Function for do-what-it-says command
function randomTxt() {
    fs.readFile('./random.txt', 'utf8', function(error, data) {
        if(error) {
            return console.log(error);
        }

        let dataArr = data.split(',');

        if(dataArr[0] === 'spotify-this-song') {
            let textSong = dataArr[1];
            spotifySearch(textSong);
        }
        else if(dataArr[0] === 'concert-this') {
            let textArtist = dataArr[1];
            concertSearch(textArtist);
        }
        else if(dataArr[0] === 'movie-this') {
            let textMovie = dataArr[1];
            movieSearch(textMovie);
        }
    });
} // ends randomTxt function
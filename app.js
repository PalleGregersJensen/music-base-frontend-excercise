"use strict";

window.addEventListener("load", initApp);

let albums = [];
let artists = [];
let tracks = [];

async function initApp() {
    console.log("app running!");
    document.querySelector("#searchfield").addEventListener("keyup", searchArtist);
    albums = await getJasonData();
    console.log(albums);
    showAlbumsOnWebsite(albums);
    artists = albums;
    console.log(artists);
    showArtistsOnWebsite(artists);
    tracks = [].concat(
        albums[0].tracks,
        albums[1].tracks,
        albums[2].tracks,
        albums[3].tracks,
        albums[4].tracks,
        albums[5].tracks,
        albums[6].tracks,
        albums[7].tracks,
        albums[8].tracks,
        albums[9].tracks
    );
    console.log(albums[0].tracks);
    console.log(tracks);
    showTracksOnWebsite(tracks);
}

// get Json-data
async function getJasonData() {
    const response = await fetch("albums.json");
    console.log(response);
    const data = await response.json();
    console.log(data);
    return data;
}

// show albums on website
function showAlbumsOnWebsite(albumList) {
    document.querySelector("#albums").innerHTML = "Albums:";
    for (const album of albumList) {
        const albumHtml = /*html*/ `<br>${album.title}`;
        document.querySelector("#albums").insertAdjacentHTML("beforeend", albumHtml);
    }
}

// show artists on website
function showArtistsOnWebsite(albumList) {
    document.querySelector("#artists").innerHTML = "Artists:";
    for (const album of albumList) {
        const artistHtml = /*html*/ `<br>${album.artist}`;
        document.querySelector("#artists").insertAdjacentHTML("beforeend", artistHtml);
    }
}

// show artists on website
function showTracksOnWebsite(trackList) {
    document.querySelector("#tracks").innerHTML = "Tracks:";
    for (const track of trackList) {
        const tracksHtml = /*html*/ `<br>${track}`;
        document.querySelector("#tracks").insertAdjacentHTML("beforeend", tracksHtml);
    }
}

// Search artists
function searchArtist() {
    const inputInSearchfield = document.querySelector("#searchfield").value;
    console.log(inputInSearchfield);
    const resultOfSearch = checkResultOfSearch(inputInSearchfield);
    const resultOfSearchAlbums = checkResultOfSearchAlbums(inputInSearchfield);
    const resultOfSearchTracks = checkResultOfSearchTracks(inputInSearchfield);
    console.log(resultOfSearch);
    showArtistsOnWebsite(resultOfSearch);
    showAlbumsOnWebsite(resultOfSearchAlbums);
    showTracksOnWebsite(resultOfSearchTracks);
}

// Check tracks
function checkResultOfSearchTracks(inputInSearchfield) {
    const result = tracks.filter(filterByName);
    console.log(result);
    return result;

    function filterByName(input) {
        const inputLowerCase = inputInSearchfield.toLowerCase();
        return input.toLowerCase().includes(inputLowerCase);
    }
}

// check artists
function checkResultOfSearch(inputInSearchfield) {
    const result = artists.filter(filterByName);
    console.log(result);
    return result;

    function filterByName(input) {
        const inputLowerCase = inputInSearchfield.toLowerCase();
        return input.artist.toLowerCase().includes(inputLowerCase);
    }
}

// check albums
function checkResultOfSearchAlbums(inputInSearchfield) {
    const result = artists.filter(filterByName);
    console.log(result);
    return result;

    function filterByName(input) {
        const inputLowerCase = inputInSearchfield.toLowerCase();
        return input.title.toLowerCase().includes(inputLowerCase);
    }
}

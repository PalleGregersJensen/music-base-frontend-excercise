"use strict";

import { getAlbumData, getArtistData, getTrackData } from "./rest-service.js";

window.addEventListener("load", initApp);

let albums = [];
let artists = [];
let tracks = [];

let filteredAlbums = [];
let filteredArtists = [];
let filteredTracks = [];

async function initApp() {
  console.log("app running!");
  document.querySelector("#input-search").addEventListener("keyup", searchDatabase);
  albums = await getAlbumData();
  artists = await getArtistData();
  tracks = await getTrackData();

  showAlbums(albums);
  showArtists(artists);
  showTracks(tracks);
}

function showAlbums(filteredAlbums) {
  document.querySelector("#albums").insertAdjacentHTML(
    "beforeend",
    `
            <h1>Albums</h1>
  <table id="albums-table">
    <thead>
      <tr>
        <th>Cover</th>
        <th>Title</th>
        <th>Releasedate</th>
        <th>Tracks</th>
      </tr>
    </thead>
    <tbody id="albums-table-body"></tbody>
  </table>
  `
  );

  const albumsTable = document.querySelector("#albums-table-body");

  for (const album of filteredAlbums) {
    const row = albumsTable.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);

    cell1.innerHTML = `<img src="${album.albumCover}" />`;
    cell2.textContent = album.albumTitle;
    cell3.textContent = album.releaseDate;
    cell4.textContent = album.numberOfTracks;
  }
}

// show artists on website
function showArtists(filteredArtists) {
  document.querySelector("#artists").insertAdjacentHTML(
    "beforeend",
    `
            <h1>Artists</h1>
  <table id="artists-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Birthdate</th>
        <th>Genres</th>
        <th>Website</th>
        <th>Image</th>
        <th>Number of Albums</th>
      </tr>
    </thead>
    <tbody id="artists-table-body"></tbody>
  </table>
  `
  );

  const artistsTable = document.querySelector("#artists-table-body");

  for (const artist of filteredArtists) {
    const row = artistsTable.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);
    const cell6 = row.insertCell(5);

    cell1.textContent = artist.name;
    cell2.textContent = artist.birthdate;
    cell3.textContent = artist.genres;
    cell4.textContent = artist.website;
    cell5.innerHTML = `<img src="${artist.image}" />`;
    cell6.textContent = artist.numberOfAlbums;
  }
}

// show tracks on website
function showTracks(filteredTracks) {
  document.querySelector("#tracks").insertAdjacentHTML(
    "beforeend",
    `
            <h1>Tracks</h1>
  <table id="tracks-table">
    <thead>
      <tr>
        <th>Title</th>
        <th>Duration</th>
      </tr>
    </thead>
    <tbody id="tracks-table-body"></tbody>
  </table>
  `
  );

  const tracksTable = document.querySelector("#tracks-table-body");

  for (const track of filteredTracks) {
    const row = tracksTable.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);

    cell1.textContent = track.trackName;
    cell2.textContent = track.duration;
  }
}

// Search artists+tracks+albums
function searchDatabase(event) {
  const value = event.target.value;

  filteredArtists = searchArtists(value);
  filteredAlbums = searchAlbums(value);
  filteredTracks = searchTracks(value);

  // Clear the existing content of the tables
  clearTableContent();

  // Update the tables with the filtered results
  showArtists(filteredArtists);
  showAlbums(filteredAlbums);
  showTracks(filteredTracks);
}

function clearTableContent() {
  // Clear the content of the artists, albums, and tracks tables
  document.querySelector("#artists").innerHTML = "";
  document.querySelector("#albums").innerHTML = "";
  document.querySelector("#tracks").innerHTML = "";
}
function searchArtists(searchValue) {
  searchValue = searchValue.toLowerCase();
  const results = artists.filter((artist) => artist.name.toLowerCase().includes(searchValue));
  console.log("Artists results:", results); // Log the search results
  return results;
}

function searchAlbums(searchValue) {
  searchValue = searchValue.toLowerCase();
  const results = albums.filter((album) => album.albumTitle.toLowerCase().includes(searchValue));
  console.log("Albums results:", results); // Log the search results
  return results;
}

function searchTracks(searchValue) {
  searchValue = searchValue.toLowerCase();
  const results = tracks.filter((track) => track.trackName.toLowerCase().includes(searchValue));
  console.log("Tracks results:", results); // Log the search results
  return results;
}

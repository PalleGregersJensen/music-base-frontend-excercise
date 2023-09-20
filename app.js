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
    cell4.innerHTML = `<a href="${artist.website}"/> ${artist.website}`;
    cell5.innerHTML = `<img src="${artist.image}" />`;
    cell6.textContent = artist.numberOfAlbums;
  }
}

async function showTracks(filteredTracks) {
  document.querySelector("#tracks").insertAdjacentHTML(
    "beforeend",
    `
    <h1>Tracks</h1>
    <table id="tracks-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Duration</th>
          <th>Artists</th>
          <th>Albums</th>
        </tr>
      </thead>
      <tbody id="tracks-table-body"></tbody>
    </table>
  `
  );

  const tracksTable = document.querySelector("#tracks-table-body");

  // Create an object to store unique tracks with their album IDs
  const uniqueTracks = {};

  for (const track of filteredTracks) {
    // Use the trackID as the key to store unique tracks
    if (!uniqueTracks.hasOwnProperty(track.trackID)) {
      uniqueTracks[track.trackID] = {
        trackName: track.trackName,
        duration: track.duration,
        artistNames: track.artistNames,
        albumIDs: [track.albumID], // Start with an array containing the first album ID
      };
    } else {
      // If the track already exists, add the album ID to its array
      uniqueTracks[track.trackID].albumIDs.push(track.albumID);
    }
  }

  // Loop through the unique tracks and display them in the table
  for (const trackID in uniqueTracks) {
    if (uniqueTracks.hasOwnProperty(trackID)) {
      const track = uniqueTracks[trackID];
      const row = tracksTable.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);

      cell1.textContent = track.trackName;
      cell2.textContent = track.duration;
      cell3.textContent = track.artistNames.join(", "); // Display artist names
      cell4.textContent = track.albumIDs.join(", "); // Display album IDs as comma-separated
    }
  }
}

function searchDatabase(event) {
  const value = event.target.value;

  // Initialize filtered arrays
  filteredArtists = searchArtists(value);
  filteredAlbums = searchAlbums(value, filteredArtists);

  // Collect all album IDs from the filteredAlbums
  const albumIDs = filteredAlbums.map((album) => album.albumID);

  // Filter track IDs based on the collected album IDs
  const filteredTrackIDs = tracks.filter((track) => albumIDs.includes(track.albumID)).map((track) => track.trackID);

  // Filter artists based on the filtered album IDs
  const filteredArtistIDs = albums
    .filter((album) => albumIDs.includes(album.albumID))
    .map((album) => album.artistIDs)
    .flat();

  // Filter artists based on the collected artist IDs and unique them
  const uniqueFilteredArtistIDs = [...new Set(filteredArtistIDs)];

  filteredArtists = artists.filter((artist) => uniqueFilteredArtistIDs.includes(artist.artistID));

  // Filter tracks based on the filtered track IDs
  filteredTracks = tracks.filter((track) => filteredTrackIDs.includes(track.trackID));

  // Clear the existing content of the tables
  clearTableContent();

  // Update the tables with the filtered results
  showArtists(filteredArtists);
  showAlbums(filteredAlbums);
  showTracks(filteredTracks);
}

// ... (other functions remain the same)

// ... (other functions remain the same)

function searchAlbums(searchValue, filteredArtists) {
  searchValue = searchValue.toLowerCase();
  const results = albums.filter((album) => {
    const artistNames = album.artistNames.map((name) => name.toLowerCase());
    const albumMatch = album.albumTitle.toLowerCase().includes(searchValue);
    const artistMatch = filteredArtists.some((artist) => artistNames.includes(artist.name.toLowerCase()));

    return albumMatch || artistMatch;
  });

  console.log("Albums results:", results); // Log the search results
  return results;
}

// ... (other functions remain the same)

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

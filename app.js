"use strict";

import { getAlbumData, getArtistData, getTrackData } from "./rest-service.js";

window.addEventListener("load", initApp);

let albums = [];
let artists = [];
let tracks = [];

let filteredAlbums = [];
let filteredArtists = [];
let filteredTracks = [];
let albumsTableBody; // Define albumsTableBody as a global variable
let artistsTableBody;

async function initApp() {
  console.log("app running!");
  document.querySelector("#input-search").addEventListener("keyup", searchDatabase);
  albums = await getAlbumData();
  artists = await getArtistData();
  tracks = await getTrackData();

  showAlbums(albums);
  showArtists(artists);
  showTracks(tracks);

  albumsTableBody = document.querySelector("#albums-table-body");
  artistsTableBody = document.querySelector("#artists-table-body");

  albumsTableBody.addEventListener("mouseover", (event) => {
    const targetRow = event.target.closest(".album-row");
    if (targetRow) {
      const albumID = targetRow.dataset.albumId;
      console.log(albumID);
      const albumTracks = tracks.filter((track) => track.albumID === parseInt(albumID));
      console.log(albumTracks);
      const trackInfoTable = createTrackInfoTable(albumTracks);
      if (trackInfoTable) {
        targetRow.appendChild(trackInfoTable);
      }
    }
  });

  albumsTableBody.addEventListener("mouseout", (event) => {
    const targetRow = event.target.closest(".album-row");
    if (targetRow) {
      const trackInfoTable = targetRow.querySelector(".track-info-table");
      if (trackInfoTable) {
        trackInfoTable.remove();
      }
    }
  });

  artistsTableBody.addEventListener("mouseover", (event) => {
    const targetRow = event.target.closest(".artist-row");
    if (targetRow) {
      const artistID = targetRow.dataset.artistId;
      const artistAlbums = albums.filter((album) => album.artistIDs.includes(parseInt(artistID)));
      const albumInfoTable = createAlbumInfoTable(artistAlbums);
      if (albumInfoTable) {
        targetRow.appendChild(albumInfoTable);
      }
    }
  });

  artistsTableBody.addEventListener("mouseout", (event) => {
    const targetRow = event.target.closest(".artist-row");
    if (targetRow) {
      const albumInfoTable = targetRow.querySelector(".album-info-table");
      if (albumInfoTable) {
        albumInfoTable.remove();
      }
    }
  });
}

// Create a function to generate album info table
function createAlbumInfoTable(artistAlbums) {
  const albumInfoTable = document.createElement("table");
  albumInfoTable.classList.add("album-info-table");
  const albumInfoTableBody = document.createElement("tbody");

  // Create the table header
  const headerRow = albumInfoTableBody.insertRow();
  const headerCell1 = headerRow.insertCell(0);
  const headerCell2 = headerRow.insertCell(1);
  const headerCell3 = headerRow.insertCell(2);
  const headerCell4 = headerRow.insertCell(3);
  headerCell1.textContent = "Albumcover";
  headerCell2.textContent = "Albumtitle";
  headerCell3.textContent = "Release Date";
  headerCell4.textContent = "Number of Tracks";

  for (const artistAlbum of artistAlbums) {
    const row = albumInfoTableBody.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);

    cell1.innerHTML = `<img src="${artistAlbum.albumCover}" />`;
    cell2.textContent = artistAlbum.albumTitle;
    cell3.textContent = artistAlbum.releaseDate;
    cell4.textContent = artistAlbum.numberofTracks;
  }

  albumInfoTable.appendChild(albumInfoTableBody);
  return albumInfoTable;
}

function createTrackInfoTable(albumTracks) {
  const trackInfoTable = document.createElement("table");
  trackInfoTable.classList.add("track-info-table");
  const trackInfoTableBody = document.createElement("tbody");

  // Create the table header
  const headerRow = trackInfoTableBody.insertRow();
  const headerCell1 = headerRow.insertCell(0);
  const headerCell2 = headerRow.insertCell(1);
  headerCell1.textContent = "Trackname";
  headerCell2.textContent = "Duration";

  for (const albumTrack of albumTracks) {
    const row = trackInfoTableBody.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    cell1.textContent = albumTrack.trackName;
    cell2.textContent = albumTrack.duration;
  }

  trackInfoTable.appendChild(trackInfoTableBody);
  return trackInfoTable;
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
    row.classList.add("album-row"); // Add the "album-row" class to the row
    row.dataset.albumId = album.albumID; // Set the dataset-album-id attribute
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);

    cell1.innerHTML = `<img src="${album.albumCover}" />`;
    cell2.textContent = album.albumTitle;
    cell3.textContent = album.releaseDate;
    cell4.textContent = album.numberofTracks;
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
    row.classList.add("artist-row"); // Add the "artist-row" class to the row
    row.dataset.artistId = artist.artistID; // Set the dataset-artist-id attribute
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
      row.classList.add("tracks-row");
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
  filteredTracks = searchTracks(value, filteredAlbums);

  // Clear the existing content of the tables
  clearTableContent();

  // Update the tables with the filtered results
  showArtists(filteredArtists);
  showAlbums(filteredAlbums);
  showTracks(filteredTracks);
}

function searchAlbums(searchValue, filteredArtists) {
  searchValue = searchValue.toLowerCase();
  const results = albums.filter((album) => {
    const albumMatch = album.albumTitle.toLowerCase().includes(searchValue);
    return albumMatch;
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

function searchTracks(searchValue, filteredAlbums) {
  searchValue = searchValue.toLowerCase();
  const results = tracks.filter((track) => {
    const trackMatch = track.trackName.toLowerCase().includes(searchValue);
    return trackMatch;
  });

  console.log("Tracks results:", results); // Log the search results
  return results;
}

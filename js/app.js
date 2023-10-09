"use strict";

import { getAlbumData, getArtistData, getTrackData } from "./rest-service.js";
import { ListRenderer } from "./listrenderer.js";
import { Albumrenderer } from "./albumrenderer.js";
import { Trackrenderer } from "./trackrenderer.js";
import { Artistrenderer } from "./artistrenderer.js";

window.addEventListener("load", initApp);

let albums = [];
let artists = [];
let tracks = [];

let albumsTableBody; // Define albumsTableBody as a global variable
let artistsTableBody;

async function initApp() {
  console.log("app running!");
  albums = await getAlbumData();
  artists = await getArtistData();
  tracks = await getTrackData();
  // Group tracks by trackName
  const groupedTracks = groupTracksByTrackName(tracks);

  // Create an instance of Renderers
  const albumRenderer = new Albumrenderer();
  const trackRenderer = new Trackrenderer(albums);
  const artistRenderer = new Artistrenderer();

  //display lists
  const albumList = new ListRenderer(albums, "#albums-table-body", albumRenderer);
  albumList.render();
  const trackList = new ListRenderer(groupedTracks, "#tracks-table-body", trackRenderer);
  trackList.render();
  const artistList = new ListRenderer(artists, "#artists-table-body", artistRenderer);
  artistList.render();

  function groupTracksByTrackName(tracks) {
    const groupedTracks = {};

    for (const track of tracks) {
      if (groupedTracks.hasOwnProperty(track.trackName)) {
        // If the trackName is already in the groupedTracks object, add the albumID to the existing entry
        groupedTracks[track.trackName].albumIDs.push(track.albumID);
      } else {
        // If the trackName is not in the groupedTracks object, create a new entry
        groupedTracks[track.trackName] = {
          ...track, // Copy all properties from the first occurrence of the trackName
          albumIDs: [track.albumID], // Create an array for albumIDs
        };
      }
    }

    // Convert the groupedTracks object back to an array
    return Object.values(groupedTracks);
  }

  document.querySelector("#input-search").addEventListener("keyup", () => {
    const searchInput = document.querySelector("#input-search").value;

    // Filter the original arrays based on the search input
    const filteredArtists = filterArtistsBySearch(searchInput);
    const filteredAlbums = filterAlbumsBySearch(searchInput);
    let filteredTracks = filterTracksBySearch(searchInput);

    filteredTracks = groupTracksByTrackName(filteredTracks);

    // Render the filtered results
    const searchedAlbumList = new ListRenderer(filteredAlbums, "#albums-table-body", albumRenderer);
    searchedAlbumList.render();
    const searchedTrackList = new ListRenderer(filteredTracks, "#tracks-table-body", trackRenderer);
    searchedTrackList.render();
    const searchedArtistList = new ListRenderer(filteredArtists, "#artists-table-body", artistRenderer);
    searchedArtistList.render();
  });

  albumsTableBody = document.querySelector("#albums-table-body");
  artistsTableBody = document.querySelector("#artists-table-body");

  albumsTableBody.addEventListener("mouseover", (event) => {
    if (filteredAlbums.length > 0) {
      console.log(filteredAlbums);
      const targetRow = event.target.closest(".album-row");
      if (targetRow) {
        const albumID = targetRow.dataset.albumId;
        console.log(albumID);
        const filteredAlbumTracks = filteredTracks.filter((track) => track.albumID === parseInt(albumID));
        console.log(filteredAlbumTracks);
        const trackInfoTable = createTrackInfoTable(filteredAlbumTracks);
        if (trackInfoTable) {
          targetRow.appendChild(trackInfoTable);
        }
      }
    } else {
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

  // Apply bold style to the header cells
  headerCell1.style.fontWeight = "bold";
  headerCell2.style.fontWeight = "bold";
  headerCell3.style.fontWeight = "bold";
  headerCell4.style.fontWeight = "bold";

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

  // Apply bold style to the header cells
  headerCell1.style.fontWeight = "bold";
  headerCell2.style.fontWeight = "bold";

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

function filterArtistsBySearch(input) {
  const searchTerm = input.trim().toLowerCase();
  const artistResults = artists.filter((artist) => artist.name.toLowerCase().includes(searchTerm));

  return artistResults;
}

function filterAlbumsBySearch(input) {
  const searchTerm = input.trim().toLowerCase();
  const albumResults = albums.filter((album) => album.albumTitle.toLowerCase().includes(searchTerm));

  return albumResults;
}

function filterTracksBySearch(input) {
  const searchTerm = input.trim().toLowerCase();
  const trackResults = tracks.filter((track) => track.trackName.toLowerCase().includes(searchTerm));

  return trackResults;
}

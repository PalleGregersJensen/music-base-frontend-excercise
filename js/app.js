"use strict";

import { getAlbumData, getArtistData, getTrackData } from "./rest-service.js";
import { ListRenderer } from "./listrenderer.js";
import { Albumrenderer } from "./albumrenderer.js";
import { Trackrenderer } from "./trackrenderer.js";
import { Artistrenderer } from "./artistrenderer.js";
import { getSomeArtists } from "./rest-service.js";

window.addEventListener("load", initApp);

//Definer globale variabler
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
  // populate variabler med data
  albums = await getAlbumData();
  // artists = await getArtistData();
  artists = await getSomeArtists(2, 8);
  tracks = await getTrackData();

  // Group tracks by trackID
  const groupedTracks = groupTracksByTrackID(tracks);

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

  // add sort eventlisteners album
  document.querySelector("#sort-album-title").addEventListener("click", () => albumList.sort("albumTitle"));
  document.querySelector("#sort-album-releasedate").addEventListener("click", () => albumList.sort("releaseDate"));
  document.querySelector("#sort-album-tracks").addEventListener("click", () => albumList.sort("numberofTracks"));
  // add sort eventlisteners artist
  document.querySelector("#sort-artist-name").addEventListener("click", () => artistList.sort("name"));
  document.querySelector("#sort-artist-birthdate").addEventListener("click", () => artistList.sort("birthdate"));
  document.querySelector("#sort-artist-genres").addEventListener("click", () => artistList.sort("genres"));
  document.querySelector("#sort-artist-website").addEventListener("click", () => artistList.sort("website"));
  document
    .querySelector("#sort-artist-numberOfAlbums")
    .addEventListener("click", () => artistList.sort("numberOfAlbums"));
  // add sort eventlisteners tracks
  document.querySelector("#sort-tracks-trackName").addEventListener("click", () => trackList.sort("trackName"));
  document.querySelector("#sort-tracks-duration").addEventListener("click", () => trackList.sort("duration"));
  document.querySelector("#sort-tracks-artistNames").addEventListener("click", () => trackList.sort("artistNames"));

  // Add pagination
  createPaginationButtons();
  // document.querySelector("#page2").addEventListener("click", showPage2);
  // document.querySelector("#page3").addEventListener("click", showPage3);

  // add search eventlistener
  document.querySelector("#input-search").addEventListener("keyup", () => {
    const searchInput = document.querySelector("#input-search").value;

    // Filter the original arrays based on the search input
    filteredArtists = filterArtistsBySearch(searchInput);
    filteredAlbums = filterAlbumsBySearch(searchInput);
    filteredTracks = filterTracksBySearch(searchInput);
    filteredTracks = groupTracksByTrackID(filteredTracks);

    // Render the filtered results
    const searchedAlbumList = new ListRenderer(filteredAlbums, "#albums-table-body", albumRenderer);
    searchedAlbumList.render();
    const searchedTrackList = new ListRenderer(filteredTracks, "#tracks-table-body", trackRenderer);
    searchedTrackList.render();
    const searchedArtistList = new ListRenderer(filteredArtists, "#artists-table-body", artistRenderer);
    searchedArtistList.render();
  });

  // Definer global variabels as tabels by their ID
  albumsTableBody = document.querySelector("#albums-table-body");
  artistsTableBody = document.querySelector("#artists-table-body");

  // Add eventlisteners for creating and removing hover tabels
  albumsTableBody.addEventListener("mouseover", (event) => {
    const targetRow = event.target.closest(".album-row");
    if (targetRow) {
      const albumID = targetRow.dataset.albumId;
      const albumTracks = tracks.filter((track) => track.albumID === parseInt(albumID));
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

// //
// async function showPage1() {
//   console.log("show page 1");
//   const artists = await getSomeArtists(1,5);
//   console.log(artists);
// }

// async function showPage2() {
//   console.log("show page 2");
//   const artists = await getSomeArtists(2,5);
//   console.log(artists);
// }

// async function showPage3() {
//   console.log("show page 3");
//   const artists = await getSomeArtists(3,5);
//   console.log(artists);
// }

// Create pagination buttons
function createPaginationButtons() {
  const pageSize = 5;
  const totalPages = 100 / pageSize;
  for (let p = 0; p < totalPages; p++) {
    const button = document.createElement("button");
    button.id = `page${p + 1}`;
    button.textContent = `Page ${p * pageSize + 1} - ${p * pageSize + 5}`;
    document.querySelector("#pagination").appendChild(button);
  }
}



// function createPaginationButtons() {
//   const pageSize = 5;
//   const totalPages = 100 / pageSize;
//   for (let p = 0; p < totalPages; p++) {
//     const html = (
//       <button id= 'page`${p+1}`'>
//         page${p * pageSize + 1} - ${p * pageSize + 5}
//       </button>
//     );
//     document.querySelector("#pagination").insertAdjacentHTML("beforeend", html);
//   }
// }

// function to group tracks by their ID
function groupTracksByTrackID(tracks) {
  const groupedTracks = {};

  for (const track of tracks) {
    if (groupedTracks.hasOwnProperty(track.trackID)) {
      // If the trackID is already in the groupedTracks object, add the albumID to the existing entry
      groupedTracks[track.trackID].albumIDs.push(track.albumID);
    } else {
      // If the trackID is not in the groupedTracks object, create a new entry
      groupedTracks[track.trackID] = {
        ...track,
        albumIDs: [track.albumID],
      };
    }
  }

  // Convert the groupedTracks object back to an array
  return Object.values(groupedTracks);
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
// Create a function to generate track info table
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

// function to filter artists by searchinput
function filterArtistsBySearch(input) {
  const searchTerm = input.trim().toLowerCase();
  const artistResults = artists.filter((artist) => artist.name.toLowerCase().includes(searchTerm));

  return artistResults;
}

// function to filter albums by searchinput
function filterAlbumsBySearch(input) {
  const searchTerm = input.trim().toLowerCase();
  const albumResults = albums.filter((album) => album.albumTitle.toLowerCase().includes(searchTerm));

  return albumResults;
}

// function to filter tracks by searchinput
function filterTracksBySearch(input) {
  const searchTerm = input.trim().toLowerCase();
  const trackResults = tracks.filter((track) => track.trackName.toLowerCase().includes(searchTerm));

  return trackResults;
}

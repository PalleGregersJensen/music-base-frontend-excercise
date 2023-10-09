export class Trackrenderer {
  constructor(albums) {
    this.albums = albums;
  }

  render(track) {
    if (!track) {
      console.error("Track is undefined or null");
      return "";
    }
    // Find the album associated with the track's albumID
    const album = this.albums.find((album) => album.albumID === track.albumID);

    // Get the album title or "Unknown Album"
    const albumTitle = album ? album.albumTitle : "Unknown Album";

    let html = `
        <tr class="track-row" data-track-id="${track.trackID}">
          <td>${track.trackName}</td>
          <td>${track.duration}</td>
          <td>${track.artistNames.join(", ")}</td>
          <td>${albumTitle}</td> <!-- Display the album title -->
        </tr>
    `;

    return html;
  }
}

export class Trackrenderer {
  constructor(albums) {
    this.albums = albums;
  }

  render(track) {
    if (!track) {
      console.error("Track is undefined or null");
      return "";
    }
    // Find all albums associated with the track's albumIDs
    const albumTitles = track.albumIDs.map((albumID) => {
      const album = this.albums.find((album) => album.albumID === albumID);
      return album ? album.albumTitle : "Unknown Album";
    });

    // Combine album titles with commas
    const albumTitlesString = albumTitles.join(", ");

    let html = `
        <tr class="track-row" data-track-id="${track.trackID}">
          <td>${track.trackName}</td>
          <td>${track.duration}</td>
          <td>${track.artistNames.join(", ")}</td>
          <td>${albumTitlesString}</td> <!-- Display the album titles -->
        </tr>
    `;

    return html;
  }
}

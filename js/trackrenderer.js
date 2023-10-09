export class Trackrenderer {
  constructor(albums) {
    this.albums = albums;
  }

  render(track) {
    // Map albumIDs to albumTitles
    const albumTitles = track.albumIDs.map((albumID) => {
      const album = this.albums.find((album) => album.albumID === albumID);
      return album ? album.albumTitle : "Unknown Album";
    });

    // Join albumTitles into a comma-separated string
    const albumTitlesString = albumTitles.join(", ");

    let html = `
        <tr class="track-row" data-track-id="${track.trackID}">
          <td>${track.trackName}</td>
          <td>${track.duration}</td>
          <td>${track.artistNames.join(", ")}</td>
          <td>${albumTitlesString}</td> <!-- Display the comma-separated albumTitles -->
        </tr>
    `;

    return html;
  }
}

export class Trackrenderer {
  render(track) {
    let html = `
        <tr class="track-row" data-track-id="${track.trackID}">
          <td>${track.trackName}</td>
          <td>${track.duration}</td>
          <td>${track.artistNames.join(", ")}</td>
          <td>${track.albumID}</td>
        </tr>
        `;
    return html;
  }
}

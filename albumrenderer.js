export class Albumrenderer {
  render(album) {
    let html = `
        <tr class="album-row" data-album-id="${album.albumID}">
          <td><img src="${album.albumCover}" /></td>
          <td>${album.albumTitle}</td>
          <td>${album.releaseDate}</td>
          <td>${album.numberofTracks}</td>
        </tr>
      `;
    return html;
  }
}

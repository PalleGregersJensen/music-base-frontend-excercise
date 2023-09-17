// get Json-data
async function getAlbumData() {
    const response = await fetch("../data/albums.json");
    console.log(response);
    const data = await response.json();
    console.log(data);
    return data;
}

// get Json-data
async function getTrackData() {
    const response = await fetch("../data/tracks.json");
    console.log(response);
    const data = await response.json();
    console.log(data);
    return data;
}

// get Json-data
async function getArtistData() {
    const response = await fetch("../data/artists.json");
    console.log(response);
    const data = await response.json();
    console.log(data);
    return data;
}

export { getAlbumData, getArtistData, getTrackData };

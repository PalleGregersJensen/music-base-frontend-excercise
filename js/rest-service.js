// const endpoint = "https://musicbase-backend-jmmp.azurewebsites.net/";
const endpoint = "http://localhost:3333"


// get Json-data
async function getAlbumData() {
  const response = await fetch(`${endpoint}/albums`);
  console.log(response);
  const data = await response.json();
  console.log(data);
  return data;
}

// get Json-data
async function getTrackData() {
  const response = await fetch(`${endpoint}/tracks`);
  console.log(response);
  const data = await response.json();
  console.log(data);
  return data;
}

// get Json-data
async function getArtistData() {
  const response = await fetch(`${endpoint}/artists`);
  console.log(response);
  const data = await response.json();
  console.log(data);
  return data;
}

async function getSomeArtists(page, pageSize) {
  const response = await fetch(`${endpoint}/artists?page=${page}&pageSize=${pageSize}`)
  const originalJson = await response.json();
  return originalJson;
}


export { getAlbumData, getArtistData, getTrackData, getSomeArtists };

let loginStatus = await api('/login/status');
if (!loginStatus.data.profile) {
    console.debug('not logged in');
    window.location = 'login.html';
}

async function getFavoritePlaylistId() {
    let playlists = await api('/user/playlist', { uid: loginStatus.data.profile.userId });
    let favorite = playlists.playlist.find(playlist => {
        return playlist.specialType == 5;
    });
    return favorite.id;
}
async function getTracks(playlistId) {
    let playlist = await api('/playlist/detail', { id: playlistId });
    return playlist.playlist.tracks;
}

let favoritePlaylistId = await getFavoritePlaylistId();
console.debug('favoritePlaylistId', favoritePlaylistId);

let tracks = await getTracks(favoritePlaylistId);
console.debug('tracks', tracks);

let table = document.createElement('table');

(() => {
    let thead = document.createElement('thead');
    let header = document.createElement('tr');
    let id = document.createElement('th');
    let name = document.createElement('th');
    let artist = document.createElement('th');
    let album = document.createElement('th');
    let duration = document.createElement('th');
    id.innerText = '编号';
    name.innerText = '歌曲名称';
    artist.innerText = '歌手';
    album.innerText = '专辑';
    duration.innerText = '时长';
    header.appendChild(id);
    header.appendChild(name);
    header.appendChild(artist);
    header.appendChild(album);
    header.appendChild(duration);
    thead.appendChild(header);
    table.appendChild(thead);
})();

let tbody = document.createElement('tbody');

for (let track of tracks) {
    let row = document.createElement('tr');
    let id = document.createElement('td');
    let name = document.createElement('td');
    let artist = document.createElement('td');
    let album = document.createElement('td');
    let duration = document.createElement('td');
    let link = document.createElement('a');
    id.innerText = track.id;
    link.innerText = track.name;
    link.href = `song.html?id=${track.id}`;
    artist.innerText = track.ar[0].name;
    album.innerText = track.al.name;
    duration.innerText = formatDuration(track.dt);
    name.appendChild(link);
    row.appendChild(id);
    row.appendChild(name);
    row.appendChild(artist);
    row.appendChild(album);
    row.appendChild(duration);
    tbody.appendChild(row);
}

table.appendChild(tbody);

document.getElementById('list').appendChild(table);
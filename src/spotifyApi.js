import SpotifyWebApi from 'spotify-web-api-node';

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
} = process.env;

const spotifyApi = new SpotifyWebApi();

spotifyApi.setClientId(SPOTIFY_CLIENT_ID);
spotifyApi.setClientSecret(SPOTIFY_CLIENT_SECRET);
spotifyApi.setRefreshToken(SPOTIFY_REFRESH_TOKEN);

spotifyApi.refreshAccessToken = (refreshAccessToken => {
  if (spotifyApi.getAccessToken()) return Promise.resolve();

  return () => refreshAccessToken().then(data => {
    spotifyApi.setAccessToken(data.body.access_token);
    setTimeout(
      () => spotifyApi.resetAccessToken(),
      data.body.expires_in * 1000
    );
  });
})(spotifyApi.refreshAccessToken.bind(spotifyApi));

export default spotifyApi;

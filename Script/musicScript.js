// Function to play a random track
async function playRandomTrack() {
    
    try {
        // Fetch data from the API
        const response = await fetch('https://retoolapi.dev/zy8UUW/ausmsc100');
        const data = await response.json();

        // Check if data is an array and not empty
        if (Array.isArray(data) && data.length > 0) {
            // Select a random track
            const randomIndex = Math.floor(Math.random() * data.length);
            const randomTrack = data[randomIndex];

            // Update the Spotify player source to play the selected track
            const spotifyPlayer = document.getElementById('spotifyPlayer');
            spotifyPlayer.src = `https://open.spotify.com/embed/track/${randomTrack.spotify_track_id}`;

            // Simulate a click on the Spotify player to start playing
            spotifyPlayer.contentWindow.postMessage('{"method":"play"}', 'https://open.spotify.com');

            // Scroll to the Spotify player to show it (optional)
            spotifyPlayer.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('No tracks found in the API response.');
        }
    } catch (error) {
        console.error('Error fetching data from the API:', error);
    }
}

// Add an event listener to playRandomTrack when the page loads
window.addEventListener('load', playRandomTrack);

// Function to skip to the next random track
document.getElementById('nextSongButton').addEventListener('click', playRandomTrack);
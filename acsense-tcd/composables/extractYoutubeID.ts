/**
 * Extracts the YouTube video ID from a given YouTube embed link.
 * 
 * This function supports various formats of YouTube URLs, including standard watch URLs,
 * shortened youtu.be URLs, and embed URLs. It uses a regular expression to match the URL
 * and extract the 11-character video ID.
 * 
 * @param {String} youtube_embed_link - The YouTube URL from which the video ID is to be extracted.
 * @returns {String | null} The extracted YouTube video ID if the URL is valid, otherwise null.
 */
export default function extractYoutubeID(youtube_embed_link: String) : String | null {
    // Regular expression to match both types of YouTube URLs and capture the video ID
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = youtube_embed_link.match(regex);
    return match ? match[1] : null;
}
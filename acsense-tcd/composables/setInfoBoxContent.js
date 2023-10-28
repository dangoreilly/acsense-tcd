/**
 * Takes in a space or building object and returns an array of objects
 * To pass to the info box component
 * Automatically computes the existence of the video_embed property
 * And sets sensible defaults for content and display
 * @param {*} space - Sense space or building object
 * @returns [] - An array of objects with the following structure:
 * {
 *     title: String,
 *    content: String,
 *   display: Boolean,
 *    video: String,
 *   video_embed: Boolean,
 * }
 */
export default function(space){
    return [
        {
            title: "Sensory Experience",
            content: space.sense_exp || "No information available",
            display: space.sense_exp_display,
            video: space.sense_exp_video,
            video_embed: (space.sense_exp_video != null && space.sense_exp_video.length > 0),
        },
        {
            title: "Wayfinding",
            content: space.wayfinding || "No information available",
            display: space.wayfinding_display,
            video: space.wayfinding_video,
            video_embed: (space.wayfinding_video != null && space.wayfinding_video.length > 0),
        },
        {
            title: "Physical Access",
            content: space.phys_access || "No information available",
            display: space.phys_access_display,
            video: space.phys_access_video,
            video_embed: (space.phys_access_video != null && space.phys_access_video.length > 0),
        },
    ];
}
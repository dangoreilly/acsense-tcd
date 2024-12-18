import { createClient } from '@supabase/supabase-js'
const fs = require('fs');

require('dotenv').config();

// Load SUPABASE_SERVICE_KEY from .env file
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY as string;

// Create Supabase client instance
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

// Floorplan file names
let floorplans = [
    "Arts01.svg",
    "Arts02.svg",
    "Arts03.svg",
    "Arts04.svg",
    "Arts05.svg",
    "Arts06.svg"
]

// Space Icons
let icons = [
    "csc.png",
    "default.png",
    "outdoor.png",
    "quiet.png",
    "respite.png",
    "social.png",
    "study.png",
    "custom/example-space-9.png"
]

// Overlays
let overlays = [
    "alignment/alignment_marks.svg",
    "Overworld_1_dark.svg",
    "Overworld_1.svg",
    "trinity_halls.svg"
]

// Gallery images
let gallery = [
    "ex-landscape-1.PNG",
    "ex-landscape-2.PNG",
    "ex-landscape-3.PNG",
    "ex-portrait-1.PNG",
    "ex-portrait-2.PNG",
    "ex-portrait-3.PNG",
]

// Primary images
let primary_images = [
    "ex-primary-landscape.jpg",
    "ex-primary-portrait.jpg",
]

async function uploadFiles(files, bucket){

    console.log("Uploading files to bucket: ", bucket);
    let n = files.length;
    let err_count = 0;

    for (let i = 0; i < n; i++) {

        // Get the file type by checking the file extension
        let ext = files[i].split('.').pop();
        let file_type: string;

        switch (ext.toLowerCase()) {
            case "svg":
                file_type = "image/svg+xml";
                break;
            case "png":
                file_type = "image/png";
                break;
            case "jpg":
            case "jpeg":
                file_type = "image/jpeg";
                break;
            default:
                // file_type = "";
                console.error("["+(i+1)+"/"+n+"] Error uploading file: ", bucket+"/"+files[i]);
                continue;
        }

        // Encoding needs to be specified for SVG files. Unsure why this is necessary.
        let blob;
        if (file_type === "image/svg+xml") {
            blob = fs.readFileSync("supabase/seed_files/" + bucket + "/" + files[i], { encoding: 'utf-8' });
        } else {
            blob = fs.readFileSync("supabase/seed_files/" + bucket + "/" + files[i]);
        }
        const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(files[i], blob, {
            cacheControl: '3600',
            upsert: true,
            contentType: file_type
        });

        if (error) {
            console.error("["+(i+1)+"/"+n+"] Error uploading file: ", bucket+"/"+files[i]);
            console.error(error);
            console.error("Retrying...")
            err_count++;
            // Retry upload, maximum of 3 times
            if (err_count < 3) {
                i = i - 1;
            }
            else {
                console.error("Maximum retries attempted. Skipping file")
            }
            // Timeout for half a second to avoid rate limiting
            await new Promise(r => setTimeout(r, 500));
        } else {
            // If there has been an error, report that the retry was successful
            if (err_count > 0){
                console.log("Retry successful")
            }
            // Reset the error count
            err_count = 0
        }
    }

}

async function clearBucket(bucket: string) {
    const { data, error } = await supabase
    .storage
    .emptyBucket(bucket);
    if (error) {
        console.error("Error clearing bucket: ", bucket);
        console.error(error);
    } else {
        console.log("Bucket cleared: ", bucket);
    }
}

async function seed_files() {

    // Give the server a few ticks to get the buckets set up that were just created in the SQL seed step
    await new Promise(r => setTimeout(r, 500));
    // Then actually fill them
  
    // First clear the contents of the buckets
    // await clearBucket("floorplans");
    // await clearBucket("icons");
    // await clearBucket("overlays");
  
    // Then fill them back up
    await uploadFiles(floorplans, "floorplans");
    await uploadFiles(icons, "icons");
    await uploadFiles(overlays, "overlays");
    await uploadFiles(gallery, "gallery-images");
    await uploadFiles(primary_images, "primary-images");
    
}

seed_files();
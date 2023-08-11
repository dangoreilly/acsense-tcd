// A simple route for getting the public key for Supabase
// to save copying and pasting it into the client-side code
// over and over again.

export default defineEventHandler(async (event) => {

    return {
        "key": process.env.SUPABASE_KEY,
        "url": process.env.SUPABASE_URL
    };

})
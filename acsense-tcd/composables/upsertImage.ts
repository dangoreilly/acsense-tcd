export default async function(supabase: any, bucket: string, url: string, file: any) : Promise<{data: any, error: any}> {
    // Upload the file to the storage bucket
    const { data:upload_data, error:upload_error } = await supabase.storage
    .from(bucket)
    .upload(url, file)

    if (upload_error) {
        // if the file already exists, it's not an error
        // We just need to update the existing file
        if (upload_error.statusCode == "409"){
            console.warn(upload_error)
            // Update the file
            const { data: update_data, error:update_error } = await supabase.storage
            .from(bucket)
            .update(url, file, {
                upsert: true
            })

            if (update_error) {
                return {data:update_data, error:update_error}
            }

            return {data:update_data, error:update_error}
        }
        else
        {
            return {data:upload_data, error:upload_error}
        }
    }

    return {data:upload_data, error:upload_error};
}
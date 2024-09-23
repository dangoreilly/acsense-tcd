/**
 * Updates a table with the provided payload based on the target condition.
 * @param access_token - The access token for authentication.
 * @param table - The name of the table to update.
 * @param payload - The data to update the table with.
 * @param target - The target condition for the update operation.
 * @returns A promise that resolves to an object containing the updated data and any error that occurred during the update.
 */
export default async function(access_token: string, table: string, payload: any): Promise<{data: any, error: any}> {
    
    let _data: any = null;
    let _error: any = null;
    
    // console.log({
    //     access_token,
    //     table,
    //     target,
    //     payload
    // })

    try {
        const data = await $fetch(`/api/insert/${table}`, {
            method: 'POST',
            body: JSON.stringify({ 
                jwt: access_token,
                target: null,
                data: payload,
            })

        })

        _data = data
    }
    catch (error) {
        console.error("Error inserting to table: ", error)
        _error = error
    }

    return { data: _data, error: _error }
  
}
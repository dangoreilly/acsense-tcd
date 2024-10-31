/**
 * Updates a table with the provided payload based on the target condition.
 * @param access_token - The access token for authentication.
 * @param table - The name of the table to update.
 * @param payload - The data to update the table with.
 * @param target - The target condition for the update operation.
 * @returns A promise that resolves to an object containing the updated data and any error that occurred during the update.
 */
export default async function(access_token: string, table: string, target: {col: string, eq: any}): Promise<{data: any, error: any}> {
    
    let _data: any = null;
    let _error: any = null;
    
    // console.log({
    //     access_token,
    //     table,
    //     target,
    //     payload
    // })

    try {
        const data = await $fetch(`/api/delete/${table}`, {
            method: 'POST',
            // headers: {
            //     'Authorization': `Bearer ${access_token}`,
            //     'Content-Type': 'application/json'
            // },
            body: JSON.stringify({ 
                jwt: access_token,
                target: target,
                data: null,
                select: ""
            })

        })

        _data = data
        // alert("Update successful")
    }
    catch (error) {
        console.error("Error removing from table: ", error)
        _error = error
    }

    return { data: _data, error: _error }
  
}
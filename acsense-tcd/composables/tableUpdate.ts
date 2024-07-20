/**
 * Sends a POST, PUT or DELETE request to a specified table in the database and returns the success or failure of the operation.
 * 
 * @param {string} access_token - The subabase access token for authentication.
 * @param {string} table - The name of the table to update data from.
 * @param {Object} [target={col: "", eq: ""}] - The target column and value to match in the table. Defaults to no target.
 * @param {string} target.col - The target column to match.
 * @param {string} target.eq - The value to match in the target column.
 * @param {Object} [payload={}] - The data to overwrite the current entry with.
 * @param {string} [operation="update"] - The data to overwrite the current entry with.
 * 
 * @returns {Promise<object>} The data fetched from the table.
 */
export default async function (access_token:string, table:string, target:{col:string, eq:string} = {col: "", eq: ""}, payload:Object = {}, operation:string = "update"): Promise<{data: any, error: any}> {

    // console.log("Fetching data from table: ", table)
    // console.log("Selecting columns: ", select)
    // console.log("Target column: ", target.col)
    // console.log("Target value: ", target.eq)

    // Send a GET request to the api/contributors route
    // const { data, pending, error, status } = await useFetch(`/api/select/${table}`, 

    let _data: any = null;
    let _error: any = null;

    try {
        const data = await $fetch(`/api/${operation}/${table}`, {
            method: 'POST',
            body: JSON.stringify({ 
                jwt: access_token,
                target: target,
                data: payload,
                select: ""
            })
        })

        _data = data
    }
    catch (error) {
        console.error("Error fetching data: ", error)
        _error = error
    }

    // Wait for the data to be fetched
    // while (pending.value) {
    //     await new Promise(resolve => setTimeout(resolve, 100));
    // }

    // console.log("Fetch status: ", status.value)
    // console.log("Data fetched from table: ", table)
    // console.log("Error: ", error)
    // console.log("Data: ", _data)
    
    // console.log(JSON.parse(JSON.stringify(data)));

    return { data: _data, error: _error }
    // return data
  
}
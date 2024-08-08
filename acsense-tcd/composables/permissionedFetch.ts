// Description: This file contains the function that queries the backend for data
// For an authenticated user, the backend will return the data

/**
 * Sends a GET request to a specified table in the database and returns the data, if the user has permission
 * 
 * @param {string} access_token - The subabase access token for authentication.
 * @param {string} table - The name of the table to fetch data from.
 * @param {string[]} [select=["*"]] - The columns to select from the table. Defaults to all columns.
 * @param {Object} [target={col: "", eq: ""}] - The target column and value to match in the table. Defaults to no target.
 * @param {string} target.col - The target column to match.
 * @param {string} target.eq - The value to match in the target column.
 * 
 * @returns {Promise<object>} The data fetched from the table.
 */
export default async function (access_token:string, table:string, select:string[] = ["*"], target:{col:string, eq:string} = {col: "", eq: ""}): Promise<{data: any, error: any}> {

    // console.log("Fetching data from table: ", table)
    // console.log("Selecting columns: ", select)
    // console.log("Target column: ", target.col)
    // console.log("Target value: ", target.eq)

    // Send a GET request to the api/contributors route
    // const { data, pending, error, status } = await useFetch(`/api/select/${table}`, 

    let _data: any = null;
    let _error: any = null;

    try {
        const data = await $fetch(`/api/select/${table}`, {
            method: 'POST',
            body: JSON.stringify({ 
                jwt: access_token,
                target: target,
                data: {},
                select: select
                // "jwt": "eyJhbGciOiJIUzI1NiIsImtpZCI6InJzWiszVVc2V2tNbjRjN2YiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE3MzAzMDg4LCJpYXQiOjE3MTcyOTk0ODgsImlzcyI6Imh0dHBzOi8vaGFkeGVreXVoZGhmbmZoc2ZyY3guc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjE4MjU4YzZiLTU2ODctNDMyOC1iYWE1LTEyYjhmMThjOGVmNCIsImVtYWlsIjoiZGFuZ29yZWlsbHlAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3MTE1OTkyMzN9XSwic2Vzc2lvbl9pZCI6IjMxNjAwNzRmLTk4NDgtNGNmOS04YzBiLTI2YjhjN2M5NzMyZCIsImlzX2Fub255bW91cyI6ZmFsc2V9.eLVaItT8GNSqwsiesdD3fCXrsn66Ei1Cx-UK4Cg9vWE",
                //     "target": "profiles",
                //     "data": {},
                //     "select": ["*"]
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
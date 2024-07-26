import type { UserProfile } from 'assets/types/permissions';
import getPermissionsKey from '~/assets/permissionsKey';
import type { PermissionsKey } from '~/assets/permissionsKey';
// import type { PermissionsKey } from '~/assets/permissionsKey';
import _ from 'lodash';

export type ChangesObject = {
    old: any,
    new: any,
    list: string[],
    error: string | null
}

// export function getChangesUserProfile(objectType: string, objectA: any, objectB: any): { old: any, new: any, list: string[] } {
//     let changes: { old: any, new: any, list: string[] } = { old: {}, new: {}, list: [] };

//     // Fields to compare
//     let fields = getFields(objectType);

//     // Compare the fields using lodash
//     for (let field of fields) {
//         let oldValue = _.get(objectA, field);
//         let newValue = _.get(objectB, field);

//         if (oldValue != newValue) {
//             _.set(changes.old, field, oldValue);
//             _.set(changes.new, field, newValue);
//             // Add the field to the list of changes to make it easier to confirm permissions
//             changes.list.push(field);
//         }
//     }

//     return changes;
// }

/**
 * Compares two objects and returns the changes between them.
 * @param objectA - The first object to compare.
 * @param objectB - The second object to compare.
 * @returns An object containing the old and new values for the changed fields, a list of changed fields, and an error message if the objects have different keys.
 */
export function getChanges(objectA: any, objectB: any): ChangesObject {
    let changes: { old: any, new: any, list: string[], error: string | null} = { old: {}, new: {}, list: [], error: null };

    // Check the keys of the objects
    let keysA = Object.keys(objectA);
    let keysB = Object.keys(objectB);

    // We only want to compare the top level of the object,
    // As those map to database columns
    // If we want more granularity, we need to split the data into more columns
    // Otherwise things just get messy

    // If the keys aren't the same, these objects can't be compared
    if (keysA.length != keysB.length) {
        changes.error = "Objects have different keys";
        return changes;
    }

    // Compare the fields using lodash
    for (let key of keysA) {
        // let oldValue = _.get(objectA, field);
        // let newValue = _.get(objectB, field);
        // Stringify the values to compare them, as they might be objects
        let oldValue = JSON.stringify(objectA[key]);
        let newValue = JSON.stringify(objectB[key]);

        if (oldValue != newValue) {
            // _.set(changes.old, key, oldValue);
            // _.set(changes.new, field, newValue);
            changes.old[key] = objectA[key];
            changes.new[key] = objectB[key];
            // Add the field to the list of changes to make it easier to confirm permissions
            changes.list.push(key);
        }
    }

    return changes;
}

/**
 * Checks if a user has permission to make changes to specific fields in a table.
 * 
 * @param user - The user profile object.
 * @param table - The name of the table.
 * @param changes - An object containing the old and new values of the fields to be changed, along with a list of field names.
 * @returns A boolean indicating whether the user has permission to make the changes.
 */
export function checkUserHasPermission(user: UserProfile, table: string, changes: ChangesObject): boolean {
    // Take in a user object and a list of changes
    // For each change, check if the user has permission to change that field
    // If they don't have permission to change any field, return false
    // Otherwise return true

    // Get the permissionsKey for the table
    let permissionsKey_table : PermissionsKey | null = getPermissionsKey(table); 

    // If the table wasn't found, something has gone wrong
    if (permissionsKey_table == null) {
        console.error("Table not found");
        // throw new Error("Table not found");
        return false;
    }

    for (let field of changes.list) {
        if (!userHasPermission(user, permissionsKey_table, field)) {
            return false;
        }
    }

    return true;
}

/**
 * Checks if the user has the required permission for a specific field, based on the permissionsKey passed.
 * @param user - The user profile object.
 * @param permissionsKey_table - The permissions key for the table being investigated.
 * @param field - The field for which the permission is being checked.
 * @returns A boolean indicating whether the user has the required permission.
 */
function userHasPermission(user: UserProfile, permissionsKey_table: PermissionsKey, field: string): boolean {

    // Check the permissionKey to see what permission is needed for this field
    let requiredPermission = permissionsKey_table[field];

    // Check the user has the required permission
    let userHasPermission = _.get(user, requiredPermission);

    // Return the boolean
    return userHasPermission;
}

/**
 * Compares the payload to the data in the database and returns the changes.
 * @param supabase - The Supabase client instance.
 * @param table - The name of the table in the database.
 * @param pkey - The primary key of the record to compare.
 * @param payload - The payload to compare with the current data.
 * @returns An object containing the old data, new data, list of changes, and any error that occurred.
 */
export async function comparePayloadToDatabase(supabase: any, table: string, pkey: { col: string, eq: any }, payload: any): Promise<ChangesObject> {
    // Get the current data from the database
    let { data: currentData, error: currentDataError } = await supabase
        .from(table)
        .select("*")
        .eq(pkey.col, pkey.eq)
        .single();

    if (currentDataError) {
        console.error("Error fetching current data from database: ", currentDataError);
        return { old: {}, new: {}, list: [], error: currentDataError.message };
    }

    // Compare the current data to the payload
    let changes = getChanges(currentData, payload);

    return changes;
}
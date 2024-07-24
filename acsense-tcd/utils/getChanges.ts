import type { UserProfile } from 'assets/types/permissions';
import getPermissionsKey from '~/assets/permissionsKey';
import type { PermissionsKey } from '~/assets/permissionsKey';
// import type { PermissionsKey } from '~/assets/permissionsKey';
import * as _ from 'lodash';

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

export function getChanges(objectA: any, objectB: any): { old: {}, new: {}, list: string[] , error: string | null} {
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

export function checkUserHasPermission(user: UserProfile, table: string, changes: { old: any, new: any, list: string[] }): boolean {
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

function userHasPermission(user: UserProfile, permissionsKey_table: PermissionsKey, field: string): boolean {

    // Check the permissionKey to see what permission is needed for this field
    let requiredPermission = permissionsKey_table[field];

    // Check the user has the required permission
    let userHasPermission = _.get(user, requiredPermission);

    // Return the boolean
    return userHasPermission;
}

// function getFields(objectType: string): string[] {
//     let fields: string[] = [];

//     if (objectType == "UserProfile") {
//         fields = [
//             "is_admin",
//             "buildings.general.name",
//             "buildings.general.aka",
//             "buildings.general.desc",
//             "buildings.primary_image.image",
//             "buildings.primary_image.alt",
//             "buildings.tabs.physical",
//             "buildings.tabs.wayfinding",
//             "buildings.tabs.sensory",
//             "buildings.gallery.images",
//             "buildings.gallery.captions",
//             "buildings.gallery.alt",
//             "buildings.times",
//             "buildings.tips",
//             "buildings.further",
//             "buildings.map.labels",
//             "buildings.map.location",
//             "spaces.general.name",
//             "spaces.general.aka",
//             "spaces.general.desc",
//             "spaces.primary_image.image",
//             "spaces.primary_image.alt",
//             "spaces.tabs.physical",
//             "spaces.tabs.wayfinding",
//             "spaces.tabs.sensory",
//             "spaces.gallery.images",
//             "spaces.gallery.captions",
//             "spaces.gallery.alt",
//             "spaces.times",
//             "spaces.tips",
//             "spaces.further",
//             "spaces.map.labels",
//             "spaces.map.location",
//         ]
//     }

//     return fields;
// }
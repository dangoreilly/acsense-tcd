import getPermissionsKey from './permissionsKey';
import { describe, it, expect } from 'vitest'
import * as _ from 'lodash';

import { building } from './testObjects';
import { user_all } from './testObjects';
import type { Building } from '~/assets/types/supabase_types';

// const specialPermissions = ['is_super_admin', 'service'];

describe('Buildings permissions properly provisioned', () => {

    it('All building keys have a corresponding permission', () => {
        const permissionedKeys = Object.keys(getPermissionsKey('buildings') as Object);
        // console.log(permissionedKeys);
        const buildingKeys = Object.keys(building as Object);
        // console.log(buildingKeys);
        expect(permissionedKeys).toEqual(buildingKeys);
    });

    it('All permissions are real fields', () => {
        // For each permission required on the permissions key
        // Make sure it is a real field on the userProfile
        // Or is a service field
        const permissionsKey = getPermissionsKey('buildings');
        const permissions = Object.values(permissionsKey as Object);
        
        // Loop through the listed permissions
        for (let permission of permissions) {
            // First, check if the permission is a special one
            // That doesn't exist on the userProfile but can be injected by the service
            if (permission == 'service' || permission == 'is_super_admin') {
                continue;
            }

            // If not, check that when querying a userProfile, we do
            // not get an undefined value
            let userProfile = user_all;
            let userProfileHasPermission = _.get(userProfile, permission);
            if (userProfileHasPermission === undefined) {
                console.log(`${permission} does not exist on userProfile`);
            }
            // console.log(`user has permission: ${permission}`);
            // console.log(userProfileHasPermission);
            expect(userProfileHasPermission).toBeDefined();
        }
        
    });
});

// describe('All fields are permissioned', () => {
// });

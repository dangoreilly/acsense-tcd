import getPermissionsKey from './permissionsKey';
import { describe, it, expect } from 'vitest'
import * as _ from 'lodash';

import { building, overlay, space_inside, user_all } from './testObjects';
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
            if (permission == 'service') {
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


describe('Spaces permissions properly provisioned', () => {

    it('All space keys have a corresponding permission', () => {
        // Sort the permissions keys to make sure they are in the same order
        const permissionedKeys = Object.keys(getPermissionsKey('spaces') as Object).sort();
        // Sort the spaceKeys to make sure they are in the same order
        const spaceKeys = Object.keys(space_inside as Object).sort();
        
        expect(permissionedKeys).toEqual(spaceKeys);
    });

    it('All permissions are real fields', () => {
        // For each permission required on the permissions key
        // Make sure it is a real field on the userProfile
        // Or is a service field
        const permissionsKey = getPermissionsKey('spaces');
        const permissions = Object.values(permissionsKey as Object);
        
        // Loop through the listed permissions
        for (let permission of permissions) {
            // First, check if the permission is a special one
            // That doesn't exist on the userProfile but can be injected by the service
            if (permission == 'service') {
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

describe('User Profiles management is properly provisioned', () => {

    it('All User Profile keys have a corresponding permission', () => {
        const permissionedKeys = Object.keys(getPermissionsKey('profiles') as Object);
        // console.log(permissionedKeys);
        const tableKeys = Object.keys(user_all as Object);
        // console.log(buildingKeys);
        expect(permissionedKeys).toEqual(tableKeys);
    });

    it('All permissions are real fields', () => {
        // For each permission required on the permissions key
        // Make sure it is a real field on the userProfile
        // Or is a service field
        const permissionsKey = getPermissionsKey('profiles');
        const permissions = Object.values(permissionsKey as Object);
        
        // Loop through the listed permissions
        for (let permission of permissions) {
            // First, check if the permission is a special one
            // That doesn't exist on the userProfile but can be injected by the service
            if (permission == 'service') {
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



describe('Overlay management is properly provisioned', () => {

    it('Overlay keys have a corresponding permission', () => {
        const permissionedKeys = Object.keys(getPermissionsKey('overlays') as Object);
        // console.log(permissionedKeys);
        const tableKeys = Object.keys(overlay as Object);
        // console.log(buildingKeys);
        expect(permissionedKeys).toEqual(tableKeys);
    });

    it('All permissions are real fields', () => {
        // For each permission required on the permissions key
        // Make sure it is a real field on the userProfile
        // Or is a service field
        const permissionsKey = getPermissionsKey('overlays');
        const permissions = Object.values(permissionsKey as Object);
        
        // Loop through the listed permissions
        for (let permission of permissions) {
            // First, check if the permission is a special one
            // That doesn't exist on the userProfile but can be injected by the service
            if (permission == 'service') {
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

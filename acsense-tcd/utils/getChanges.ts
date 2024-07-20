import type { UserProfile } from 'assets/types/permissions';
import * as _ from 'lodash';

export function getChangesUserProfile(objectType: string, objectA: any, objectB: any): { old: any, new: any, list: string[] } {
    let changes: { old: any, new: any, list: string[] } = { old: {}, new: {}, list: [] };

    // Fields to compare
    let fields = getFields(objectType);

    // Compare the fields using lodash
    for (let field of fields) {
        let oldValue = _.get(objectA, field);
        let newValue = _.get(objectB, field);

        if (oldValue != newValue) {
            _.set(changes.old, field, oldValue);
            _.set(changes.new, field, newValue);
            // Add the field to the list of changes to make it easier to confirm permissions
            changes.list.push(field);
        }
    }

    return changes;
}

function getFields(objectType: string): string[] {
    let fields: string[] = [];

    if (objectType == "UserProfile") {
        fields = [
            "is_admin",
            "buildings.general.name",
            "buildings.general.aka",
            "buildings.general.desc",
            "buildings.primary_image.image",
            "buildings.primary_image.alt",
            "buildings.tabs.physical",
            "buildings.tabs.wayfinding",
            "buildings.tabs.sensory",
            "buildings.gallery.images",
            "buildings.gallery.captions",
            "buildings.gallery.alt",
            "buildings.times",
            "buildings.tips",
            "buildings.further",
            "buildings.map.labels",
            "buildings.map.location",
            "spaces.general.name",
            "spaces.general.aka",
            "spaces.general.desc",
            "spaces.primary_image.image",
            "spaces.primary_image.alt",
            "spaces.tabs.physical",
            "spaces.tabs.wayfinding",
            "spaces.tabs.sensory",
            "spaces.gallery.images",
            "spaces.gallery.captions",
            "spaces.gallery.alt",
            "spaces.times",
            "spaces.tips",
            "spaces.further",
            "spaces.map.labels",
            "spaces.map.location",
        ]
    }

    return fields;
}
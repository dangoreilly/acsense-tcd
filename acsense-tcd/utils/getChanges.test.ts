import type { UserProfile } from '~/assets/types/permissions';
import { building, user_all, user_none } from '~/assets/testObjects';
import { describe, it, expect } from 'vitest'

describe('getChanges', () => {
  it('should return empty changes when objects are identical', () => {
    let objectA = JSON.parse(JSON.stringify(building));
    let objectB = JSON.parse(JSON.stringify(building));

    const changes = getChanges(objectA, objectB);

    expect(changes.old).toEqual({});
    expect(changes.new).toEqual({});
    expect(changes.list).toEqual([]);
    expect(changes.error).toBeNull();
  });

  it('should return changes when objects have different values', () => {
    let objectA = JSON.parse(JSON.stringify(building));
    let objectB = JSON.parse(JSON.stringify(building));

    objectB.description = "Description of Example Building A, but different";

    const changes = getChanges(objectA, objectB);

    expect(changes.old).toEqual({ description: "Description of Example Building A" });
    expect(changes.new).toEqual({ description: "Description of Example Building A, but different" });
    expect(changes.list).toEqual(['description']);
    expect(changes.error).toBeNull();
  });

  it('should return error when objects have different keys', () => {
    let objectA = JSON.parse(JSON.stringify(building));
    let objectB = JSON.parse(JSON.stringify(building));

    objectB.extra = "Content of extra field";

    const changes = getChanges(objectA, objectB);

    expect(changes.old).toEqual({});
    expect(changes.new).toEqual({});
    expect(changes.list).toEqual([]);
    expect(changes.error).toBe('Objects have different keys');
  });

  it('Returns first level field and all sub-fields when one sub-field is different', () => {
    let objectA = JSON.parse(JSON.stringify(building));
    let objectB = JSON.parse(JSON.stringify(building));

    objectB.description = "Description of Example Building A, but different";
    objectB.opening_times = {"weekday":{"open":true,"times":["08:00","17:00"]},"sat":{"open":true,"times":["08:00","17:00"]},"holidays":{"open":true,"times":["08:00","17:00"]},"note":"Tcdard access only on weekends"};
  

    const changes = getChanges(objectA, objectB);

    expect(changes.old).toEqual({ 
      description: "Description of Example Building A",
      opening_times: {"weekday":{"open":true,"times":["08:00","17:00"]},"sat":{"open":true,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"Tcdard access only on weekends"}
    });
    expect(changes.new).toEqual({
      description: "Description of Example Building A, but different",
      opening_times: {"weekday":{"open":true,"times":["08:00","17:00"]},"sat":{"open":true,"times":["08:00","17:00"]},"holidays":{"open":true,"times":["08:00","17:00"]},"note":"Tcdard access only on weekends"}
    });
    expect(changes.list).toEqual(['description', 'opening_times']);
    expect(changes.error).toBeNull();
  });
});

describe('checkUserHasPermission', () => {
  it('user with relevant permissions can edit', () => {
    // const user = { isAdmin: true, canEditName: true, canEditAge: true };
    const changes = { 
		old: { 
			description: "Description of Example Building A" 
		}, 
		new: { 
			description: "Description of Example Building A, but different" 
		}, 
		list: [
			'description'
		],
        error: null
	};

    const hasPermission = checkUserHasPermission(user_all, 'buildings', changes);

    expect(hasPermission).toBe(true);
  });

  it('user without relevant permissions can\'t edit', () => {

    const changes = { 
		old: { 
			description: "Description of Example Building A" 
		}, 
		new: { 
			description: "Description of Example Building A, but different" 
		}, 
		list: [
			'description'
		],
        error: null
	};

    const hasPermission = checkUserHasPermission(user_none, 'buildings', changes);

    expect(hasPermission).toBe(false);
  });

  it('any missing permissions voids the whole transaction', () => {

    const changes = { 
		old: { 
			published: false,
			description: "Description of Example Building A" 
		}, 
		new: { 
			published: true,
			description: "Description of Example Building A, but different" 
		}, 
		list: [
			'description',
			'published'
		],
        error: null 
	};

    const hasPermission = checkUserHasPermission(user_all, 'buildings', changes);

    expect(hasPermission).toBe(false);
  });
});

import type { UserProfile } from '~/assets/types/permissions';
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
		] 
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
		] 
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
		] 
	};

    const hasPermission = checkUserHasPermission(user_all, 'buildings', changes);

    expect(hasPermission).toBe(false);
  });
});

// Data for testing
// Users
const user_all: UserProfile = { 
  email: "user.all@acsense.ie",
  is_admin: false,
  user_id: "0",
  buildings: {
      general: {
          name: true,
          aka: true,
          desc: true,
      },
      primary_image: {
          image: true,
          alt: true
      },
      tabs: {
          physical: true,
          wayfinding: true,
          sensory: true
      },
      gallery: {
          images: true,
          captions: true,
          alt: true
      },
      times: true,
      tips: true,
      further: true,
      map: {
          labels: true,
          location: true
      }
  },
  spaces: {
      general: {
          name: true,
          aka: true,
          desc: true,
      },
      primary_image: {
          image: true,
          alt: true
      },
      tabs: {
          physical: true,
          wayfinding: true,
          sensory: true
      },
      gallery: {
          images: true,
          captions: true,
          alt: true
      },
      times: true,
      tips: true,
      further: true,
      map: {
          labels: true,
          location: true
      }
  },
}

const user_buildingsOnly: UserProfile = { 
	email: "user.buildingsOnly@acsense.ie",
	is_admin: false,
	user_id: "0",
	buildings: {
		general: {
			name: true,
			aka: true,
			desc: true,
		},
		primary_image: {
			image: true,
			alt: true
		},
		tabs: {
			physical: true,
			wayfinding: true,
			sensory: true
		},
		gallery: {
			images: true,
			captions: true,
			alt: true
		},
		times: true,
		tips: true,
		further: true,
		map: {
			labels: true,
			location: true
		}
	},
	spaces: {
		general: {
			name: false,
			aka: false,
			desc: false,
		},
		primary_image: {
			image: false,
			alt: false
		},
		tabs: {
			physical: false,
			wayfinding: false,
			sensory: false
      	},
		gallery: {
			images: false,
			captions: false,
			alt: false
      	},
		times: false,
		tips: false,
		further: false,
		map: {
			labels: false,
			location: false
		}
  	},
}
  
const user_admin: UserProfile = { 
  email: "admin@acsense.ie",
  user_id: "0",
  is_admin: true,
  buildings: {
      general: {
          name: true,
          aka: true,
          desc: true,
      },
      primary_image: {
          image: true,
          alt: true
      },
      tabs: {
          physical: true,
          wayfinding: true,
          sensory: true
      },
      gallery: {
          images: true,
          captions: true,
          alt: true
      },
      times: true,
      tips: true,
      further: true,
      map: {
          labels: true,
          location: true
      }
  },
  spaces: {
      general: {
          name: true,
          aka: true,
          desc: true,
      },
      primary_image: {
          image: true,
          alt: true
      },
      tabs: {
          physical: true,
          wayfinding: true,
          sensory: true
      },
      gallery: {
          images: true,
          captions: true,
          alt: true
      },
      times: true,
      tips: true,
      further: true,
      map: {
          labels: true,
          location: true
      }
  },
}

const user_none: UserProfile = { 
  email: "observer@acsense.ie",
  user_id: "0",
  is_admin: false,
  buildings: {
      general: {
          name: false,
          aka: false,
          desc: false,
      },
      primary_image: {
          image: false,
          alt: false
      },
      tabs: {
          physical: false,
          wayfinding: false,
          sensory: false
      },
      gallery: {
          images: false,
          captions: false,
          alt: false
      },
      times: false,
      tips: false,
      further: false,
      map: {
          labels: false,
          location: false
      }
  },
  spaces: {
      general: {
          name: false,
          aka: false,
          desc: false,
      },
      primary_image: {
          image: false,
          alt: false
      },
      tabs: {
          physical: false,
          wayfinding: false,
          sensory: false
      },
      gallery: {
          images: false,
          captions: false,
          alt: false
      },
      times: false,
      tips: false,
      further: false,
      map: {
          labels: false,
          location: false
      }
  },
}

const user_superadmin: UserProfile = { 
  email: "superadmin@acsense.ie",
  user_id: "0",
  is_admin: false,
  buildings: {
  general: {
    name: false,
    aka: false,
    desc: false,
  },
  primary_image: {
    image: false,
    alt: false
  },
  tabs: {
    physical: false,
    wayfinding: false,
    sensory: false
  },
  gallery: {
    images: false,
    captions: false,
    alt: false
  },
  times: false,
  tips: false,
  further: false,
  map: {
    labels: false,
    location: false
  }
  },
  spaces: {
    general: {
      name: false,
      aka: false,
      desc: false,
    },
    primary_image: {
      image: false,
      alt: false
    },
    tabs: {
    physical: false,
    wayfinding: false,
    sensory: false
    },
    gallery: {
      images: false,
      captions: false,
      alt: false
    },
    times: false,
    tips: false,
    further: false,
    map: {
      labels: false,
      location: false
    }
  },
}

const building = {
  canonical: "example-building-A",
  display_name: "Example Building A",
  aka: "Ex Building A",
  description: "Description of Example Building A",
  map_label_1: "Example Building A",
  map_label_2: "Ex Building A",
  map_label_3: "A",
  geometry: {"coordinates":[[[-6.2,53.3],[-6.2,54.3],[-7.2,54.3],[-7.2,53.3]]]},
  always_display: true,
  sense_exp: "Sensory Experience for Example Building A",
  sense_exp_display: true,
  sense_exp_video: "https://youtu.be/Q3YC90i2HbM",
  wayfinding: "Wayfinding information for Example Building A",
  wayfinding_display: true,
  wayfinding_video: "https://youtu.be/hnpsEwAAs3M",
  phys_access: "Physical Access Information for Example Building A",
  phys_access_display: true,
  phys_access_video: "https://youtu.be/WyYjD8VGGWM",
  tips: ["Tip 1", "Tip 2", "Tip 3"],
  further_info: "Further Information",
  furtherinfo_display: true,
  opening_times: {"weekday":{"open":true,"times":["08:00","17:00"]},"sat":{"open":true,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"Tcdard access only on weekends"},
  primary_image_url: "/images/ex-primary-portrait.jpg",
  primary_image_alt: "Primary Image Alt Text",
  entry_floor: 1,
  internal_map_size: [100,100],
  published: true,
  floorplans_published: false,
  rooms_published: false,
}
// const building_A_desc_change = {
//   canonical: "example-building-A",
//   display_name: "Example Building A",
//   aka: "Ex Building A",
//   description: "Dsecrption of Example Building A, but different",
//   map_label_1: "Example Building A",
//   map_label_2: "Ex Building A",
//   map_label_3: "A",
//   geometry: {"coordinates":[[[-6.2,53.3],[-6.2,54.3],[-7.2,54.3],[-7.2,53.3]]]},
//   always_display: true,
//   sense_exp: "Sensory Experience for Example Building A",
//   sense_exp_display: true,
//   sense_exp_video: "https://youtu.be/Q3YC90i2HbM",
//   wayfinding: "Wayfinding information for Example Building A",
//   wayfinding_display: true,
//   wayfinding_video: "https://youtu.be/hnpsEwAAs3M",
//   phys_access: "Physical Access Information for Example Building A",
//   phys_access_display: true,
//   phys_access_video: "https://youtu.be/WyYjD8VGGWM",
//   tips: ["Tip 1", "Tip 2", "Tip 3"],
//   further_info: "Further Information",
//   furtherinfo_display: true,
//   opening_times: {"weekday":{"open":true,"times":["08:00","17:00"]},"sat":{"open":true,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"Tcdard access only on weekends"},
//   primary_image_url: "/images/ex-primary-portrait.jpg",
//   primary_image_alt: "Primary Image Alt Text",
//   entry_floor: 1,
//   internal_map_size: [100,100],
//   published: true,
//   floorplans_published: false,
//   rooms_published: false,
// }
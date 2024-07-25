// Data for testing
import type { UserProfile } from '~/assets/types/permissions';
export const user_all: UserProfile = { 
    email: "user.all@acsense.ie",
    user_id: "0",
    is_admin: false,
    is_super_admin: false,
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
  
export const user_buildingsOnly: UserProfile = { 
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
    
export const user_admin: UserProfile = { 
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
  
export const user_none: UserProfile = { 
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
  
export const user_superadmin: UserProfile = { 
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
  
import type { Building } from '~/assets/types/supabase_types';

// Buildings
export const building: Building = {
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

    created_at: "2021-09-01T12:00:00.000Z",
    updated_at: "2021-09-01T12:00:00.000Z",
    UUID: "00000000-0000-0000-0000-000000000000",
  }
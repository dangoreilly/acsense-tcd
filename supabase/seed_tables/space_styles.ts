import type { Space_Type_Template } from "../../acsense-tcd/assets/types/supabase_types";
require('dotenv').config();

let baseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';

export default [
    {
      "category": "CSC Space",
      "icon": baseUrl+"/storage/v1/object/public/icons/csc.png",
      "colour": "#a5faad",
      "descriptor": "This is a space controlled by the CSC or by a member Society"
    },
    {
      "category": "Outdoor Space",
      "icon": baseUrl+"/storage/v1/object/public/icons/outdoor.png",
      "colour": "#e97dff",
      "descriptor": null
    },
    {
      "category": "Quiet Space",
      "icon": baseUrl+"/storage/v1/object/public/icons/quiet.png",
      "colour": "#9000ad",
      "descriptor": null
    },
    {
      "category": "Respite Room",
      "icon": baseUrl+"/storage/v1/object/public/icons/respite.png",
      "colour": "#ff9100",
      "descriptor": null
    },
    {
      "category": "Social Space",
      "icon": baseUrl+"/storage/v1/object/public/icons/social.png",
      "colour": "#faff00",
      "descriptor": null
    },
    {
      "category": "Study Space",
      "icon": baseUrl+"/storage/v1/object/public/icons/study.png",
      "colour": "#00e6ff",
      "descriptor": null
    }
  ] as Space_Type_Template[];
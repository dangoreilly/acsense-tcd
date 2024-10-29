import type { Overlay_Template } from "../../acsense-tcd/assets/types/supabase_types";
require('dotenv').config();

let baseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';

export default [
    {
      "url": baseUrl+"/storage/v1/object/public/overlays/trinity_halls.svg",
      "bounds": [
        [
          53.3136106176529,
          -6.26387813086904
        ],
        [
          53.3104789361038,
          -6.25674185560123
        ]
      ],
      "high_detail": false,
      "url_dark": null
    },
    {
      "url": baseUrl+"/storage/v1/object/public/overlays/Overworld_1.svg",
      "bounds": [
        [
          53.3458915634745,
          -6.24714287637749
        ],
        [
          53.3416423399052,
          -6.26168888731324
        ]
      ],
      "high_detail": false,
      "url_dark": baseUrl+"/storage/v1/object/public/overlays/Overworld_1_dark.svg"
    }
  ] as Overlay_Template[];
import type { Floorplan } from "../../acsense-tcd/assets/types/supabase_types";
require('dotenv').config();

let baseUrl = process.env.BASE_URL || 'http://127.0.0.1:54321';

export default [
    {
        "id": 1,
        "created_at": "2024-09-21 09:15:43.671368+00",
        "building": "e5172612-24ac-43ad-a01c-503bbc7edaf0",
        "level": 3,
        "label": "Fourth Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts04.svg"
    },
    {
        "id": 2,
        "created_at": "2024-09-21 09:15:43.671368+00",
        "building": "e5172612-24ac-43ad-a01c-503bbc7edaf0",
        "level": 4,
        "label": "Fifth Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts05.svg"
    },
    {
        "id": 3,
        "created_at": "2024-09-21 09:15:43.671368+00",
        "building": "e5172612-24ac-43ad-a01c-503bbc7edaf0",
        "level": 5,
        "label": "Sixth Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts06.svg"
    },
    {
        "id": 4,
        "created_at": "2024-09-21 09:15:43.671368+00",
        "building": "e5172612-24ac-43ad-a01c-503bbc7edaf0",
        "level": 0,
        "label": "Lower Concourse",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts01.svg"
    },
    {
        "id": 5,
        "created_at": "2024-09-21 09:15:43.671368+00",
        "building": "e5172612-24ac-43ad-a01c-503bbc7edaf0",
        "level": 1,
        "label": "Main Concourse",
        "url": baseUrl+"/storage/v1/object/public/floorplans/b5694bc5-90c0-440f-b95c-7c0672992211_MainConcourse.svg"
    },
    {
        "id": 6,
        "created_at": "2024-09-21 09:15:43.671368+00",
        "building": "e5172612-24ac-43ad-a01c-503bbc7edaf0",
        "level": 2,
        "label": "Third Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts03.svg"
    },
    {
        "id": 7,
        "created_at": "2024-09-21 09:15:43.671368+00",
        "building": "028a15f7-af94-4c50-90b1-ebcf456e3eb4",
        "level": 3,
        "label": "Fourth Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts04.svg"
    },
    {
        "id": 8,
        "created_at": "2024-09-21 09:15:43.671368+00",
        "building": "028a15f7-af94-4c50-90b1-ebcf456e3eb4",
        "level": 4,
        "label": "Fifth Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts05.svg"
    },
    {
        "id": 9,
        "created_at": "2024-09-21 09:15:43.671368+00",
        "building": "028a15f7-af94-4c50-90b1-ebcf456e3eb4",
        "level": 5,
        "label": "Sixth Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts06.svg"
    },
    {
        "id": 10,
        "created_at": "2024-09-21 09:15:43.671368+00",
        "building": "028a15f7-af94-4c50-90b1-ebcf456e3eb4",
        "level": 0,
        "label": "Lower Concourse",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts01.svg"
    },
    {
        "id": 11,
        "created_at": "2024-09-21 09:15:43.671368+00",
        "building": "028a15f7-af94-4c50-90b1-ebcf456e3eb4",
        "level": 1,
        "label": "Main Concourse",
        "url": baseUrl+"/storage/v1/object/public/floorplans/b5694bc5-90c0-440f-b95c-7c0672992211_MainConcourse.svg"
    },
    {
        "id": 12,
        "created_at": "2024-09-21 09:15:43.671368+00",
        "building": "028a15f7-af94-4c50-90b1-ebcf456e3eb4",
        "level": 2,
        "label": "Third Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts03.svg"
    }
] as Floorplan[];
import type { Floorplan_Template } from "../../acsense-tcd/assets/types/supabase_types";
require('dotenv').config();

let baseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';

export default [
    {
        "building": "example-building-1",
        "level": 3,
        "label": "Fourth Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts04.svg"
    },
    {
        "building": "example-building-1",
        "level": 4,
        "label": "Fifth Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts05.svg"
    },
    {
        "building": "example-building-1",
        "level": 5,
        "label": "Sixth Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts06.svg"
    },
    {
        "building": "example-building-1",
        "level": 0,
        "label": "Lower Concourse",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts01.svg"
    },
    {
        "building": "example-building-1",
        "level": 1,
        "label": "Main Concourse",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts02.svg"
    },
    {
        "building": "example-building-1",
        "level": 2,
        "label": "Third Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts03.svg"
    },
    {
        "building": "example-building-2",
        "level": 3,
        "label": "Fourth Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts04.svg"
    },
    {
        "building": "example-building-2",
        "level": 4,
        "label": "Fifth Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts05.svg"
    },
    {
        "building": "example-building-2",
        "level": 5,
        "label": "Sixth Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts06.svg"
    },
    {
        "building": "example-building-2",
        "level": 0,
        "label": "Lower Concourse",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts01.svg"
    },
    {
        "building": "example-building-2",
        "level": 1,
        "label": "Main Concourse",
        "url": baseUrl+"/storage/v1/object/public/floorplans/b5694bc5-90c0-440f-b95c-7c0672992211_MainConcourse.svg"
    },
    {
        "building": "example-building-2",
        "level": 2,
        "label": "Third Floor",
        "url": baseUrl+"/storage/v1/object/public/floorplans/Arts03.svg"
    }
] as Floorplan_Template[];
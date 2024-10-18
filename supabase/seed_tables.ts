import { createClient } from '@supabase/supabase-js'

require('dotenv').config();

import floorplans from './seed_tables/floorplans';
import buildings from './seed_tables/buildings';
import rooms from './seed_tables/rooms';
import overlays from './seed_tables/overlays';
import building_gallery_images from './seed_tables/building_gallery_images';
import space_styles from './seed_tables/space_styles';
import nav_nodes from './seed_tables/nav_nodes';
import spaces from './seed_tables/spaces';
import flyovers from './seed_tables/flyovers';


// Load SUPABASE_SERVICE_KEY from .env file
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY as string;

// Create Supabase client instance
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
});


async function seedTable(tableName: string, rows: any[]) {

    // Insert data into table
    let { data, error } = await supabase.from(tableName).insert(rows);

    if (error) {
        console.error(`Error seeding table ${tableName}: ${error.message}`);
    } else {
        console.log(`Seeded table ${tableName} with ${rows?.length} rows`);
    }
}


async function seedTables() {
    // Seed tables without foreign key constraints first
    seedTable('overlays', overlays);
    seedTable("flyovers", flyovers);
    await seedTable("space_styles", space_styles);

    // Seed buildings table
    await seedTable('buildings', buildings);
    // Seed everything dependent on buildings
    seedTable('floorplans', floorplans);
    seedTable('building_gallery_images', building_gallery_images);
    seedTable('rooms', rooms);
    seedTable('nav_nodes', nav_nodes);
    seedTable('spaces', spaces);

};

seedTables();
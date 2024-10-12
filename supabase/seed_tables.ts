import { createClient } from '@supabase/supabase-js'

require('dotenv').config();

import floorplans from './seed_tables/floorplans';
import buildings from './seed_tables/buildings';

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

    // Seed floorplans table
    await seedTable('floorplans', floorplans);

    // Seed buildings table
    await seedTable('buildings', buildings);


};

seedTables();
import type { ChangesObject } from "~/utils/getChanges";
import type { Building, Space, Building_Gallery_Image, Space_Type } from "~/assets/types/supabase_types";
import type { UserProfile } from "~/assets/types/permissions";

/**
 * Creates a log entry and inserts it into the 'logs' table in Supabase.
 * 
 * @param supabase - The Supabase client instance.
 * @param user - The user associated with the log entry.
 * @param action - The action performed in the log entry.
 * @param subject - The subject of the log entry.
 * @param data - Additional data for the log entry.
 */
export async function createLogEntry(supabase: any, user: UserProfile, action: string, subject: string, data: ChangesObject | null | Building | Space | Building_Gallery_Image | Space_Type) {

    const logEntry: LogEntry = { user: user.email, action, subject, data };

    const { error } = await supabase
        .from('logs')
        .insert(logEntry);

    if (error) {
        console.error('Error inserting log entry:', error);
    }
}

interface LogEntry {
  user: string;
  action: string;
  subject: string;
  data: any;
}
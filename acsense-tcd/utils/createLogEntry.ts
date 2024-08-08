/**
 * Creates a log entry and inserts it into the 'logs' table in Supabase.
 * 
 * @param supabase - The Supabase client instance.
 * @param user - The user associated with the log entry.
 * @param action - The action performed in the log entry.
 * @param subject - The subject of the log entry.
 * @param data - Additional data for the log entry.
 */
export async function createLogEntry(supabase: any, user: string, action: string, subject: string, data: any){
  const logEntry: LogEntry = { user, action, subject, data };

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
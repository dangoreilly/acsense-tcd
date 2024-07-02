export interface LogEntry {
    time: string;
    user: string;
    action: string;
    target: string;
    field: string;
    oldValue: string;
    newValue: string;
    selected?: boolean;
} 

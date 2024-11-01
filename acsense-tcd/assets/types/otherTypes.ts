import type { Nav_Node } from './supabase_types'

// This type is used to define the valid floors for each lift
export type Lift = {
    label: string,
    validFloors: {
        label: string,
        gotoFloor: Function,
        isCurrentFloor: boolean
    }[]
}
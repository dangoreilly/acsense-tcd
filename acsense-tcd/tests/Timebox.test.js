import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import Timebox from '@/components/info/Timebox.vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'

let openingHours_regular = {
    weekday: {
        open: true,
        times: ["08:00","18:00"],
    },
    sat: {
        open: true,
        times: ["10:00","14:00"],
    },
    holidays: {
        open: false,
        times: ["08:00","18:00"],
    },
    note: "24 hour tap access for PG students only.",
}

let openingHours_noNote = {
    weekday: {
        open: true,
        times: ["08:00","20:00"],
    },
    sat: {
        open: true,
        times: ["08:00","18:00"],
    },
    holidays: {
        open: true,
        times: ["10:00","14:00"],
    },
}

let openingHours_24hour = {
    weekday: {
        open: true,
        times: ["00:00","23:59"],
    },
    sat: {
        open: true,
        times: ["00:00","23:59"],
    },
    holidays: {
        open: true,
        times: ["00:00","23:59"],
    },
    note: "Reduced hours during summer: 9am-6pm Mon-Sat, closed Sun.",
}

describe('Timebox', () => {
    test('Renders with normal hours & note', async () => {

        // console.log('openingHours_regular:', openingHours_regular)
        const _Timebox = await renderSuspended(Timebox, {
            props: {
              times: openingHours_regular
            }
        })

        let WeekdayTimes = screen.getByText('Mon-Fri').parentElement.children[1].children[0].textContent
        let SaturdayTimes = screen.getByText('Saturday').parentElement.children[1].children[0].textContent
        let HolidaysTimes = screen.getByText('Sunday & Public Holidays').parentElement.children[1].children[0].textContent
    
        expect(WeekdayTimes).toBe('08:00 - 18:00')
        expect(SaturdayTimes).toBe('10:00 - 14:00')
        expect(HolidaysTimes).toBe('Closed')
    })
})
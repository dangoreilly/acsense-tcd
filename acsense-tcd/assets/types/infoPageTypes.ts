export interface Photo {
    url: string;
    alt: string;
    caption?: string;
}

export interface OpeningTimes {
    weekday: {
        open: boolean,
        times: string[],
    },
    sat: {
        open: boolean,
        times: string[],
    },
    holidays: {
        open: boolean,
        times: string[],
    },
    note: string,
}

export interface InfoBoxContentTab {
    title: string,
    content: string,
    parsedContent?: string,
}
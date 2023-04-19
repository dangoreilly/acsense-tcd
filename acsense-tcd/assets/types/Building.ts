type Building = {
    name: string;
    aka: string;
    buildingId: string;
    description: string;
    sensoryOverview: string;
    sounds: string;
    lights: string;
    experience: string;
    respite: string;
    physicalAccess: string;
    evacuationInfo: string;
    facilities: string[];
    tips: string[];
    openingTimes: {
        weekDay: {
            open: boolean;
            times: number[];
        },
        sat: {
            open: boolean;
            times: number[];
        },
        holidays: {
            open: boolean;
            times: number[];
        },
        note: string;
    },
    additionalInformation: {
        display: boolean;
        content: string;
    },
    images: {
        main: {
            url: string;
            alt: string;
        }
        gallery: {
            url: string;
            alt: string;
            caption: string;
        }[];
    },
    lastUpdated: string;
};

export { Building }
import type { Photo, OpeningTimes } from 'assets/types/infoPageTypes'

type Building = {
    name: string;
    aka: string;
    buildingId: string;
    description: string;
    sensoryAreas?: Object[];
    sounds: string;
    lights: string;
    experience: string;
    respite: string;
    physicalAccess: string;
    facilities: string[];
    tips: string[];
    openingTimes: OpeningTimes,
    additionalInformation: {
        display: boolean;
        content: string;
    },
    images: {
        main: Photo,
        gallery: Photo[];
    },
    lastUpdated: string;
};

export type { Building }
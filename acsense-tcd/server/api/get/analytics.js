// import fetch from 'node-fetch';

export default defineEventHandler(async (event) => {

    const plausibleAPIKey = useRuntimeConfig().plausibleAPIKey;

    try {
        // Fetch time series data for visitors in the last 30 days from Plausible
        const timeSeriesDataResponse = await fetch('https://plausible.io/api/v1/stats/timeseries?site_id=tcdsensemap.ie', {
            headers: {
                Authorization: `Bearer ${plausibleAPIKey}`
            }
        });
        const timeSeriesData = await timeSeriesDataResponse.json();

        // Fetch aggregate data for top pages in those 30 days from Plausible
        const topPagesDataResponse = await fetch('https://plausible.io/api/v1/stats/breakdown?site_id=tcdsensemap.ie&property=event:page&limit=10', {
            headers: {
                Authorization: `Bearer ${plausibleAPIKey}`
            }
        });
        const topPagesData = await topPagesDataResponse.json();

        // Create a composite object with all data
        const analyticsData = {
            timeSeriesData,
            topPagesData
        };

        return analyticsData;
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        throw error;
    }
});

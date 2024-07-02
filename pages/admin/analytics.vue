<!-- Admin page for displaying analytics from Plausible -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'analytics'" :supabase_client="supabase">
        <main style="height:100vh; overflow-y: auto">
            <div class="container">
                <h1>Analytics</h1>
                <p>Analytics for the site are provided by <a href="https://plausible.io">Plausible</a>. The data is collected anonymously and is not shared with any third parties.</p>
                <p>Plausible is a privacy-friendly alternative to Google Analytics. It is open source and does not use cookies or collect any personal data.</p>
                <p>For more information, see the <a href="https://plausible.io/data-policy">Plausible Data Policy</a>.</p>
                <p><a href="https://docs.plausible.io/tcdsensemap.ie">Full Analytics Dashboard</a></p>
            </div>
            <div class="container">
                <h3>Unique Visitors, last 30 days</h3>
                <span>Hover over a data point to see the details</span>
                <canvas class="border-bottom border-secondary p-1" id="analyticsChart"></canvas>

                <h3 class="mt-2">Top 10 Pages, last 30 days</h3>
                <a href="https://plausible.io/tcdsensemap.ie/pages">See all</a>
                <canvas id="topPagesChart"></canvas>
            </div>
        </main>
                
            <!-- <iframe 
                id="plausible-embed"
                plausible-embed 
                src="https://plausible.io/share/tcdsensemap.ie?auth=ygLkYbc_xksHgzQ6oa0je" 
                scrolling="yes"
                frameborder="0" 
                loading="lazy" 
                style="width: 1px; min-width: 100%; height: 100vh; overflow-y: auto;">
                </iframe> -->
            <!-- <script async src="https://plausible.io/js/embed.host.js"></script> -->
    </NuxtLayout>
</template>

<script setup>
import {createClient} from '@supabase/supabase-js';
import Chart from 'chart.js/auto';

const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
const supabaseKey = useRuntimeConfig().public.supabaseKey;
const supabase = createClient(supabaseUrl, supabaseKey)

async function getAnalytics() {
    // Pull the timeseries data from the get/analytics endpoint
    const response = await fetch("/api/get/analytics");
    const data = await response.json();
    console.log(data);
    return data;
}

function drawVisitorChart(data) {
    // Split the dates timesseries data into a list of dates and a list of results
        let dates = [];
        let visitors = [];
        data.timeSeriesData.results.forEach(result => {
            dates.push(result.date);
            visitors.push(result.visitors);
        });

        const ctx = document.getElementById('analyticsChart');

        const analyticsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Visitors',
                        data: visitors,
                        borderColor: 'rgb(75, 192, 192)',
                        fill: {
                            above: 'rgba(75, 192, 192, 0.4)',
                            target: 'origin',
                        },
                        tension: 0.2,
                        pointBorderColor: 'rgb(10, 50, 50)',
                        pointRadius: 5,
                        pointHitRadius: 10,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 5,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                }
            }
        });
}

function drawTopPagesChart(data) {
    // Split the top pages data into a list of pages and a list of results
    let pages = [];
    let visitors = [];

    data.topPagesData.results.forEach(result => {
        pages.push(result.page);
        visitors.push(result.visitors);
    });

    // Generate the chart colours; grey for '/', blue for /info/* and green for everything else
    // Rename the pages to make it clearer what they are
    let border_colours = [];
    pages.forEach(page => {
        if (page == '/') {
            pages[pages.indexOf(page)] = '(Main Map)';
            border_colours.push('rgb(128, 128, 128)');
        } else if (page == '/info') {
            pages[pages.indexOf(page)] = '(Search)';
            border_colours.push('rgb(128, 128, 128)');
        } else if (page.startsWith('/info/')) {
            border_colours.push('rgb(123, 123, 255)');
        } else {
            border_colours.push('rgb(75, 192, 192)');
        }
    });
    // Duplicate the colours list so that the fill colours are the same as the border colours, but with 0.4 alpha
    let fill_colours = border_colours.map(colour => {
        return colour.replace(')', ', 0.2)');
    });

    const ctx = document.getElementById('topPagesChart');

    const topPagesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pages,
            datasets: [
                {
                    label: 'Visitors',
                    data: visitors,
                    backgroundColor: fill_colours,
                    borderColor: border_colours,
                    fill: false,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                },
            }
        },
    });
}

onMounted(() => {
    // Get the analytics data and display it in a chart
    getAnalytics().then((data) => {

        // Wait for the canvases to exist before trying to draw the chart
        while (!document.getElementById('analyticsChart') || !document.getElementById('topPagesChart')) {
            setTimeout(() => {}, 100);
        }

        // Draw the charts
        drawVisitorChart(data);
        drawTopPagesChart(data);
        
    });
})

// useHead({
//     script: [
//         {
//             src: 'https://plausible.io/js/embed.host.js',
//             async: true,
//         },
//     ],
// })


definePageMeta({
  layout: false,
  middleware: ['auth'],
});
</script>

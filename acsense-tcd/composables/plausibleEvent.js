export default function (eventName, ) {
    // Function to send a API call to plausible
    // First, get the user-agent of the client
    const userAgent = window.navigator.userAgent;
    // Then, send a POST request to the plausible API
    fetch(`https://plausible.io/api/event`, {
        method: 'POST',
        mode: "no-cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "name": eventName,
            "url": window.location.href,
            "domain": "tcdsensemap.ie",
            "User-Agent": userAgent,
            "referrer": document.referrer
        })
    })
}
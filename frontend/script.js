let allDestinations = [];
async function loadDestinations() {
    try{
        const response = await fetch("http://127.0.0.1:3000/destinations");
        const data = await response.json();
        allDestinations = data;
        renderCards(data);
    }catch(error) {
        console.log("Error Fetching the Content");
    }
    
}

console.log("Travel Sphere Loaded");
const container = document.getElementById("destinationContainer");

// 🔥 FUNCTION to render cards
function renderCards(data) {
    container.innerHTML = "";

    data.forEach(function(place) {
        const card = `
            <div class="destination-card">
                <div class="card-img">
                    <img src="${place.image}">
                </div>
                <div class="card-body">
                    <h3>${place.name}</h3>
                    <p>${place.location}</p>
                    <div class="card-meta">
                        <span>${place.entry_fees}</span>
                        <span>${place.rating}</span>
                    </div>
                    <button class="btn add-btn">Add to Itinerary</button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// ✅ Initial render
loadDestinations();

// 🔍 SEARCH FUNCTIONALITY
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function() {
    const value = searchInput.value.toLowerCase();

    const filtered = allDestinations.filter(function(place) {
        return place.name.toLowerCase().includes(value);
    });

    renderCards(filtered);
});



// ✅ Initial render

loadItinerary();
// ✅ Add to itinerary
container.addEventListener("click", async function(event) {
    if (event.target.classList.contains("add-btn")) {
           console.log("BUTTON CLICKED");
        const card = event.target.closest(".destination-card");

const spans = card.querySelectorAll(".card-meta span");

const place = {
    name: card.querySelector("h3").textContent,
    location: card.querySelector("p").textContent,
    entry_fees: spans[0]?.textContent || "N/A",
    rating: spans[1]?.textContent || "N/A",
    image: card.querySelector("img").src
};
     

 const res = await fetch("http://127.0.0.1:3000/itinerary", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(place)
});
console.log("Response status:", res.status);
loadItinerary();
    }
});



// Load Ititnerary
async function loadItinerary() {
    const response = await fetch("http://127.0.0.1:3000/itinerary");
    const data = await response.json();

    renderItinerary(data);
}
// ✅ Render itinerary
function renderItinerary(data) {
    const list = document.getElementById("itineraryList");
    list.innerHTML = "";

    if (!data) return; // 👈 prevents crash

    data.forEach(function(place) {
       const li = `
    <li>
        <strong>${place.name}</strong> - ${place.location}
        <button class="remove-btn">Remove</button>
    </li>
`;
  list.innerHTML += li;
    });
}
// ✅ Remove item
document.getElementById("itineraryList").addEventListener("click", async function(event) {
    if (event.target.classList.contains("remove-btn")) {

        const item = event.target.parentElement;
        const name = item.firstChild.textContent.trim(); // ✅ FIXED

        await fetch("http://127.0.0.1:3000/itinerary", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: name })
        });

        loadItinerary();
    }
});
document.getElementById("Clear-btn").addEventListener("click", async function() {

    await fetch("http://127.0.0.1:3000/itinerary", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: "ALL" }) // we'll handle this
    });

    loadItinerary();
});
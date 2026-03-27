console.log("Travel Sphere Loaded");




const destinations = [
    {
        name: "Shanivar Wada",
        location: "Central Pune",
        entry_fees: "25 Rupees",
        rating: "4.5",
        image: "https://www.adotrip.com/public/images/areas/master_images/5c6a5fb858f94-Shaniwar_Wada_Attractions.jpg"
    },
    {
        name: "Sinhagad Fort",
        location: "30km SW",
        entry_fees: "Free",
        rating: "4.8",
        image: "https://punetourism.co.in/images/places-to-visit/headers/sinhagad-fort-pune-tourism-entry-fee-timings-holidays-reviews-header.jpg"
    }
];




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
renderCards(destinations);

// 🔍 SEARCH FUNCTIONALITY
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function() {
    const value = searchInput.value.toLowerCase();

    const filtered = destinations.filter(function(place) {
        return place.name.toLowerCase().includes(value);
    });

    renderCards(filtered);
});

let itinerary = JSON.parse(localStorage.getItem("itinerary")) || [];

// ✅ Initial render
renderCards(destinations);
renderItinerary();

// ✅ Add to itinerary
container.addEventListener("click", function(event) {
    if (event.target.classList.contains("add-btn")) {

        const card = event.target.closest(".destination-card");
        const name = card.querySelector("h3").textContent;

        if (!itinerary.includes(name)) {
            itinerary.push(name);

            localStorage.setItem("itinerary", JSON.stringify(itinerary));

            renderItinerary();
        } else {
            alert(name + " already added");
        }
    }
});

// ✅ Render itinerary
function renderItinerary() {
    const list = document.getElementById("itineraryList");
    const count = document.getElementById("count");
    const emptyMsg = document.getElementById("emptyMsg");
    list.innerHTML = "";
    count.textContent = itinerary.length;
    if(itinerary.length === 0) {
        emptyMsg.style.display = "block";
    }
    else {
        emptyMsg.style.display = "none";
    }
    itinerary.forEach(function(place) {
        const li = `
            <li>
                ${place}
                <button class="remove-btn">Remove</button>
            </li>
        `;
        list.innerHTML += li;
    });
}

// ✅ Remove item
document.getElementById("itineraryList").addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-btn")) {

        const item = event.target.parentElement;
        const name = item.firstChild.textContent.trim();

        itinerary = itinerary.filter(function(place) {
            return place !== name;
        });

        localStorage.setItem("itinerary", JSON.stringify(itinerary));

        renderItinerary();
    }
});

document.getElementById("Clear-btn").addEventListener("click",function(){
    itinerary = [];
    localStorage.setItem("itinerary" ,JSON.stringify(itinerary));
    renderItinerary();
});
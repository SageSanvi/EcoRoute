document.addEventListener("DOMContentLoaded", function () {

    // 1. keeping track of what the user chooses
    const get = id => document.getElementById(id);

    let item = "";
    let material = "";
    let pathway = "";
    let user = null;
    let creatingAccount = true;

    // 2. our reuse ideas and places for recycling or donating
    const database = {
        plastic: {
            reuse: ["Turn a clean plastic bottle into a planter or pencil holder."],
            recycle: [
                "Accepted plastic bottles can usually go in curbside recycling.",
                "Raybob Packaging - PP-6 River Road, Tullytown, PA",
                "Northeast Foam Recycling - 90 Hamilton St, Chalfont, PA",
                "Otter Recycling Center - 200 Bordentown Rd, Tullytown, PA"
            ],
            donate: [
                "Rigid plastic bottles usually belong in curbside recycling.",
                "Plastic bag collection bins usually do not accept bottles."
            ]
        },
        electronics: {
            reuse: ["Remove personal data and reuse working electronics for decoration (like a personalized, digital photo album!)."],
            recycle: [
                "E-Waste Experts - 416 Green Ln, Bristol, PA",
                "HSI Recycling - 2320 Big Oak Rd, Langhorne, PA",
                "611 Metals - 6776 Easton Rd, Pipersville, PA",
                "Sims Metal - 300 Steel Rd S, Morrisville, PA"
            ],
            donate: [
                "Goodwill - 2365 E Lincoln Hwy, Langhorne, PA",
                "Habitat ReStore - 1337 E Lincoln Hwy, Levittown, PA",
                "Best Buy - 310 Commerce Blvd, Fairless Hills, PA",
                "Staples - 436 N Main St, Doylestown, PA"
            ]
        },
        fabric: {
            reuse: ["Turn old clothing into rags, bags, or craft projects."],
            recycle: [
                "H&M Garment Collection - Neshaminy Mall, Bensalem, PA",
                "Madewell Denim Recycling - 2300 E Lincoln Hwy, Langhorne, PA",
                "Helpsy - Textile pickup where available"
            ],
            donate: [
                "GreenDrop - 1921 Street Rd, Bensalem, PA",
                "Goodwill - 2365 Lincoln Hwy, Langhorne, PA",
                "2nd Ave - 330 Commerce Blvd, Fairless Hills, PA",
                "Salvation Army - 191 Lincoln Hwy, Fairless Hills, PA",
                "Good Stuff Thrift - 5010 York Rd, Buckingham, PA"
            ]
        },
        paint: {
            reuse: ["Offer usable paint to an approved reuse program."],
            recycle: [
                "Check Bucks County household hazardous waste events.",
                "Arcwood Environmental - 297 Zimmerman Ln, Langhorne, PA",
                "Safety-Kleen - 77 Towpath Rd, Fairless Hills, PA",
                "Clean Earth - 7 Steel Road East, Morrisville, PA"
            ],
            donate: [
                "Only donate usable paint to programs that accept it.",
                "Contact Bucks County household hazardous waste services."
            ]
        },
        batteries: {
            reuse: ["Used batteries should be recycled, not repurposed."],
            recycle: [
                "E-Waste Experts - 416 Green Ln, Bristol, PA",
                "HSI Recycling - 2320 Big Oak Rd, Langhorne, PA",
                "611 Metals - 6776 Easton Rd, Pipersville, PA",
                "Tri-State Metals - 297 Cedar Ln, Fairless Hills, PA"
            ],
            donate: [
                "Home Depot - 400 Commerce Blvd, Fairless Hills, PA",
                "Lowe's - 3421 Horizon Blvd, Feasterville-Trevose, PA",
                "Staples - 10 W Rd, Newtown, PA",
                "Batteries Plus - 509 York Rd, Warminster, PA"
            ]
        },
        metal: {
            reuse: ["Turn clean metal cans into pencil holders and candle holders."],
            recycle: [
                "Sims Metal - 300 Steel Rd S, Morrisville, PA",
                "Tri-State Metals - 297 Cedar Ln, Fairless Hills, PA",
                "611 Metals - 6776 Easton Rd, Pipersville, PA"
            ],
            donate: [
                "Habitat ReStore - 1337 E Lincoln Hwy, Levittown, PA",
                "Ask local reuse programs about usable metal items."
            ]
        },
        glass: {
            reuse: ["Reuse clean glass jars for storage or decorations."],
            recycle: [
                "Accepted bottles and jars may go in curbside recycling.",
                "Falls Material Recovery Facility - Falls Township, PA",
                "Otter Recycling Center - 200 Bordentown Rd, Tullytown, PA"
            ],
            donate: [
                "Ask community groups about clean glass jar donations."
            ]
        },
        rubber: {
            reuse: ["Some clean rubber items can be reused for crafts or practical items (like a cord organizer)."],
            recycle: [
                "Contact authorized tire recycling services.",
                "Ask your municipality about tire collection events."
            ],
            donate: [
                "Ask a tire retailer about suitable reuse options."
            ]
        },
        chemicals: {
            reuse: ["Do not reuse unknown or hazardous chemicals."],
            recycle: [
                "Use Bucks County household hazardous waste programs.",
                "Safety-Kleen - 77 Towpath Rd, Fairless Hills, PA",
                "Clean Earth - 7 Steel Road East, Morrisville, PA",
                "Arcwood Environmental - 297 Zimmerman Ln, Langhorne, PA"
            ],
            donate: [
                "Do not donate unknown or hazardous chemicals.",
                "Contact an approved collection program."
            ]
        }
    };

    const unknownPlaces = [
        "WM - Fairless Landfill, 1400 Bordentown Rd, Morrisville, PA",
        "WIN Waste Falls, 1201 New Ford Mill Road, Morrisville, PA",
        "WM GROWS Landfill, 1000 New Ford Mill Road, Morrisville, PA"
    ];

    // 3. switching between pages in our app
    function showPage(page) {
        if (!user && page !== "account-view") {
            page = "account-view";
        }

        document.querySelectorAll(".view").forEach(view => {
            view.classList.add("hidden");
        });

        get(page).classList.remove("hidden");
        get("bottom-nav").classList.toggle("hidden", !user);
        document.querySelector(".app-container").scrollTop = 0;

        document.querySelectorAll(".nav-item").forEach(button => {
            let activePage = page;

            if (page !== "home-view" && page !== "profile-view") {
                activePage = "actions-view";
            }

            button.classList.toggle(
                "active",
                button.dataset.target === activePage
            );
        });

        if (page === "home-view") updateImpact();
    }

    document.querySelectorAll(".nav-item").forEach(button => {
        button.onclick = () => showPage(button.dataset.target);
    });

    // 4. getting the accounts saved in this browser
    function getAccounts() {
        try {
            return JSON.parse(localStorage.getItem("ecoroute_accounts")) || {};
        } catch {
            return {};
        }
    }

    function showAccountForm() {
        get("account-title").textContent = creatingAccount ?
            "Create Your Account 🌿" : "Welcome Back 🌿";

        get("account-description").textContent = creatingAccount ?
            "Enter your name and create a password." :
            "Sign in to see your activity history.";

        get("account-submit").textContent = creatingAccount ?
            "Create Account" : "Sign In";

        get("switch-account").textContent = creatingAccount ?
            "Already have an account? Sign In" :
            "New to EcoRoute? Create an Account";

        get("account-message").textContent = "";
    }

    // 5. turning passwords into hashes before saving them
    async function hashPassword(password, salt) {
        const data = new TextEncoder().encode(salt + password);
        const result = await crypto.subtle.digest("SHA-256", data);

        return Array.from(new Uint8Array(result))
            .map(number => number.toString(16).padStart(2, "0"))
            .join("");
    }

    get("switch-account").onclick = function () {
        creatingAccount = !creatingAccount;
        get("account-password").value = "";
        showAccountForm();
    };

    // 6. letting users make an account or sign in
    get("account-submit").onclick = async function () {
        const name = get("account-name").value.trim();
        const password = get("account-password").value;
        const key = name.toLowerCase();
        const accounts = getAccounts();

        if (!name || !password) {
            get("account-message").textContent = "Enter your name and password.";
            return;
        }

        if (creatingAccount && password.length < 8) {
            get("account-message").textContent = "Use at least 8 characters.";
            return;
        }

        if (!crypto.subtle) {
            get("account-message").textContent =
                "Please open the app using Live Server or HTTPS.";
            return;
        }

        if (creatingAccount) {
            if (accounts[key]) {
                get("account-message").textContent = "This account already exists.";
                return;
            }

            const salt = Array.from(
                crypto.getRandomValues(new Uint8Array(16))
            ).join("-");

            accounts[key] = {
                name: name,
                salt: salt,
                passwordHash: await hashPassword(password, salt)
            };

            try {
                localStorage.setItem(
                    "ecoroute_accounts",
                    JSON.stringify(accounts)
                );
            } catch {
                get("account-message").textContent = "Could not save your account.";
                return;
            }

        } else {
            if (!accounts[key] ||
                await hashPassword(password, accounts[key].salt) !== accounts[key].passwordHash) {
                get("account-message").textContent = "Incorrect name or password.";
                return;
            }
        }

        user = { key: key, name: accounts[key].name };
        sessionStorage.setItem("ecoroute_current_user", key);

        get("profile-name").textContent = user.name;
        get("welcome-message").textContent = "Welcome Back, " + user.name + "!";
        get("account-password").value = "";

        showPage("home-view");
    };

    // 7. signing out of an account
    get("signout-btn").onclick = function () {
        user = null;
        sessionStorage.removeItem("ecoroute_current_user");

        creatingAccount = false;
        get("account-password").value = "";

        showAccountForm();
        showPage("account-view");
    };

    // 8. getting the item the user wants to search
    function searchItem() {
        item = get("item-search").value.trim();

        if (!item) {
            alert("Please enter an item.");
            return;
        }

        get("material-item-text").textContent = "Item: " + item;
        showPage("material-view");
    }

    get("search-btn").onclick = searchItem;

    get("item-search").onkeydown = event => {
        if (event.key === "Enter") searchItem();
    };

    // 9. letting users choose their item material
    document.querySelectorAll(".mat-choice-btn").forEach(button => {
        button.onclick = function () {
            material = this.dataset.material;

            get("selected-item-text").textContent =
                "Item: " + item + " | Material: " + this.textContent.trim();

            showPage("pathway-view");
        };
    });

    // 10. making cards for our results
    function addResult(text, className = "result-card", action = null) {
        const element = document.createElement(action ? "button" : "div");

        element.textContent = text;
        element.className = className;

        if (action) element.onclick = action;

        get("details-content").appendChild(element);
    }

    // 11. showing ideas or locations based on their choice
    function showResults(choice) {
        pathway = choice;

        const titles = {
            reuse: "🎨 DIY / Reuse Ideas",
            recycle: "♻️ Recycling Locations",
            donate: "🤝 Donation / Drop-Off Locations"
        };

        get("details-title").textContent = titles[choice];
        get("details-content").innerHTML = "";

        if (material === "unknown") {
            if (choice === "reuse") {
                addResult("Identify the material before reusing it.");
            } else {
                unknownPlaces.forEach(place => {
                    addResult(place);

                    addResult("📍 Get Directions", "location-btn", function () {
                        window.open(
                            "https://www.google.com/maps/search/?api=1&query=" +
                            encodeURIComponent(place),
                            "_blank",
                            "noopener,noreferrer"
                        );
                    });
                });
            }
        } else {
            database[material][choice].forEach(text => addResult(text));
        }

        if (choice !== "reuse") {
            addResult(
                "Contact each facility before visiting to confirm it accepts your item.",
                "facility-warning"
            );

            addResult("📍 Use My Location", "location-btn", function () {
                if (!navigator.geolocation) {
                    alert("Location is not available.");
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    () => alert("Location access allowed."),
                    () => alert("Please allow location access.")
                );
            });

            const activityName = choice === "recycle" ? "Recycling" : "Donation";

            addResult(
                "Continue to Finish " + activityName + " →",
                "finish-donation-btn",
                finishActivity
            );
        }

        showPage("details-view");
    }

    ["reuse", "recycle", "donate"].forEach(choice => {
        get("choose-" + choice).onclick = () => showResults(choice);
    });

    // 12. opening the page to record an activity
    function finishActivity() {
        const activityName = pathway === "recycle" ? "Recycling" : "Donation";

        get("finish-title").textContent = "Finish Your " + activityName + " 🌱";
        get("activity-item-name").textContent = item;
        get("activity-quantity").value = 1;
        get("activity-weight").value = "";
        get("confirm-activity-btn").textContent = "✓ Finish " + activityName;

        showPage("finish-activity-view");
    }

    // 13. loading the user's past activities
    function getActivities() {
        if (!user) return [];

        try {
            return JSON.parse(
                localStorage.getItem("ecoroute_activity_" + user.key)
            ) || [];
        } catch {
            return [];
        }
    }

    // 14. saving what the user recycled or donated
    get("confirm-activity-btn").onclick = function () {
        const quantity = Number(get("activity-quantity").value);
        const weightText = get("activity-weight").value.trim();
        const weight = weightText === "" ? null : Number(weightText);

        if (!Number.isSafeInteger(quantity) || quantity < 1) {
            alert("Enter a valid number of items.");
            return;
        }

        if (weight !== null && (!Number.isFinite(weight) || weight <= 0)) {
            alert("Enter a valid weight or leave it blank.");
            return;
        }

        const activities = getActivities();

        activities.unshift({
            type: pathway,
            item: item,
            quantity: quantity,
            weight: weight,
            date: new Date().toLocaleDateString()
        });

        try {
            localStorage.setItem(
                "ecoroute_activity_" + user.key,
                JSON.stringify(activities)
            );
        } catch {
            alert("Could not save your activity.");
            return;
        }

        alert("Your " + (pathway === "recycle" ? "recycling" : "donation") +
              " has been recorded!");

        showPage("home-view");
    };

    // 15. updating the totals and history on the home page
    function updateImpact() {
        const activities = getActivities();
        let donated = 0;
        let recycled = 0;
        let donatedWeight = 0;
        let recycledWeight = 0;

        activities.forEach(activity => {
            if (activity.type === "donate") {
                donated += activity.quantity;
                donatedWeight += activity.weight || 0;
            } else {
                recycled += activity.quantity;
                recycledWeight += activity.weight || 0;
            }
        });

        get("total-donated").textContent = donated;
        get("total-recycled").textContent = recycled;
        get("donated-weight").textContent = donatedWeight.toFixed(2) + " lbs";
        get("recycled-weight").textContent = recycledWeight.toFixed(2) + " lbs";

        const history = get("impact-activity");
        history.innerHTML = "";

        if (activities.length === 0) {
            history.textContent = "No activities recorded yet.";
            return;
        }

        activities.forEach(activity => {
            const card = document.createElement("div");
            const action = activity.type === "recycle" ? "recycled" : "donated";

            card.className = "impact-notification";
            card.textContent = "🌱 " + activity.quantity + " " + activity.item +
                " recorded as " + action +
                (activity.weight === null ? "" : " (" + activity.weight + " lbs)") +
                " - " + activity.date;

            history.appendChild(card);
        });
    }

    // 16. making the back buttons work
    const backButtons = {
        "back-to-search": "actions-view",
        "back-to-materials": "material-view",
        "back-to-pathways": "pathway-view",
        "back-to-locations": "details-view"
    };

    for (let button in backButtons) {
        get(button).onclick = () => showPage(backButtons[button]);
    }

    // 17. checking if someone is already signed in
    const savedUser = sessionStorage.getItem("ecoroute_current_user");
    const accounts = getAccounts();

    if (savedUser && accounts[savedUser]) {
        user = { key: savedUser, name: accounts[savedUser].name };

        get("profile-name").textContent = user.name;
        get("welcome-message").textContent = "Welcome Back, " + user.name + "!";

        showPage("home-view");
    } else {
        creatingAccount = Object.keys(accounts).length === 0;
        showAccountForm();
        showPage("account-view");
    }

});

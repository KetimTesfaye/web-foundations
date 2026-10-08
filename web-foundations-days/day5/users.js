document.addEventListener("DOMContentLoaded", () => {
    const loadBtn = document.getElementById("load-users");
    const filterInput = document.getElementById("filter-input");
    const statusP = document.getElementById("status");
    const usersList = document.getElementById("users-list");

    let allUsers = [];

    function renderUsers(usersToRender) {
        usersList.innerHTML = "";

        if (usersToRender.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No users match your filter.";
            li.style.padding = "1rem";
            li.style.textAlign = "center";
            li.style.color = "#666";
            usersList.appendChild(li);
            return;
        }

        usersToRender.forEach(user => {
            const li = document.createElement("li");
            li.style.background = "#fff";
            li.style.border = "1px solid #ddd";
            li.style.borderRadius = "6px";
            li.style.padding = "1rem";
            li.style.marginBottom = "0.75rem";
            li.style.boxShadow = "0 1px 3px rgba(0,0,0,0.02)";

            const nameH3 = document.createElement("h3");
            nameH3.style.margin = "0 0 0.5rem 0";
            nameH3.textContent = user.name;

            const emailP = document.createElement("p");
            emailP.style.margin = "0 0 0.25rem 0";
            emailP.textContent = `Email: ${user.email}`;

            const cityP = document.createElement("p");
            cityP.style.margin = "0 0 0.25rem 0";
            cityP.textContent = `City: ${user.address ? user.address.city : "N/A"}`;

            const companyP = document.createElement("p");
            companyP.style.margin = "0";
            companyP.textContent = `Company: ${user.company ? user.company.name : "N/A"}`;

            li.appendChild(nameH3);
            li.appendChild(emailP);
            li.appendChild(cityP);
            li.appendChild(companyP);

            usersList.appendChild(li);
        });
    }

    async function loadUsers() {
        loadBtn.disabled = true;
        statusP.textContent = "Loading users...";
        usersList.innerHTML = "";
        filterInput.value = "";

        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            
            if (!response.ok) {
                throw new Error(`Failed to fetch users (Status: ${response.status})`);
            }

            allUsers = await response.json();
            statusP.textContent = `Successfully loaded ${allUsers.length} users.`;
            renderUsers(allUsers);
        } catch (error) {
            statusP.textContent = `Error: ${error.message}`;
            statusP.style.color = "#e74c3c";
        } finally {
            loadBtn.disabled = false;
        }
    }

    function handleFilter() {
        const query = filterInput.value.toLowerCase().trim();
        const filtered = allUsers.filter(user => user.name.toLowerCase().includes(query));
        renderUsers(filtered);
    }

    loadBtn.addEventListener("click", loadUsers);
    filterInput.addEventListener("input", handleFilter);
});
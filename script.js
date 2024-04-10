const searchInput = document.getElementById("searchInput");
const autocompleteList = document.getElementById("autocompleteList");
const repositoriesList = document.getElementById("repositoriesList");
let debounceTimer;

function debounce(func, delay) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(func, delay);
}

function fetchRepositories(query) {
  fetch(`https://api.github.com/search/repositories?q=${query}`)
    .then((response) => response.json())
    .then((data) => {
      autocompleteList.innerHTML = "";
      data.items.slice(0, 5).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.full_name;
        li.addEventListener("click", () => {
          addRepository(
            item.full_name,
            item.owner.login,
            item.stargazers_count
          );
          searchInput.value = "";
          autocompleteList.innerHTML = "";
        });
        autocompleteList.appendChild(li);
      });
    })
    .catch((error) => console.error("Error fetching repositories:", error));
}

function addRepository(fullName, owner, stars) {
  const li = document.createElement("li");
  const liName = document.createElement("li");
  const liOwner = document.createElement("li");
  const liStars = document.createElement("li");
  liName.textContent = `Name: ${fullName}`;
  liOwner.textContent = `Owner: ${owner}`;
  liStars.textContent = `Stars: ${stars}`;
  const button = document.createElement("button");
  button.textContent = "Remove";
  button.addEventListener("click", () => {
    repositoriesList.removeChild(li);
  });
  li.appendChild(liName);
  li.appendChild(liOwner);
  li.appendChild(liStars);
  li.appendChild(button);
  repositoriesList.appendChild(li);
}
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (!query) {
    autocompleteList.innerHTML = "";
    return;
  }
  debounce(() => {
    fetchRepositories(query);
  }, 300);
});

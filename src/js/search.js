const baseURL = import.meta.env.VITE_SERVER_URL;
const categories = ["tents", "backpacks", "sleeping-bags"];

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const productList = document.querySelector(".product-list");
const message = document.querySelector("#search-message");

const isResultsPage = window.location.pathname.includes("/search/");

async function getProducts(category) {
  const response = await fetch(`${baseURL}products/search/${category}`);

  if (!response.ok) {
    throw new Error("Could not load products");
  }

  const data = await response.json();
  return data.Result || [];
}

async function searchProducts(searchTerm) {
  const results = await Promise.all(categories.map(getProducts));

  return results.flat().filter((product) => {
    const searchableText = [
      product.Name,
      product.NameWithoutBrand,
      product.Brand,
      product.Category,
      product.Id,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm.toLowerCase());
  });
}

function displayResults(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    message.textContent = "No matching products found.";
    return;
  }

  message.textContent = `${products.length} product(s) found.`;

  products.forEach((product) => {
    const item = document.createElement("li");
    item.classList.add("product-card");

    const link = document.createElement("a");
    link.href = product.Url;

    const name = document.createElement("h2");
    name.textContent =
      product.Name || product.NameWithoutBrand || product.Id;

    link.appendChild(name);
    item.appendChild(link);
    productList.appendChild(item);
  });
}

async function runSearch(searchTerm) {
  if (!searchTerm || !productList || !message) return;

  message.textContent = "Searching...";

  try {
    const products = await searchProducts(searchTerm);
    displayResults(products);
  } catch (error) {
    message.textContent = "Search failed. Please try again.";
    message.textContent =
      "Sorry, something went wrong. Please try again.";
  }
}

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (!searchTerm) return;

    if (!isResultsPage) {
      window.location.href =
        `/search/index.html?query=${encodeURIComponent(searchTerm)}`;
    } else {
      runSearch(searchTerm);
    }
  });
}

if (isResultsPage) {
  const searchTerm = new URLSearchParams(window.location.search).get("query");

  if (searchTerm && searchInput) {
    searchInput.value = searchTerm;
    runSearch(searchTerm);
  }
}

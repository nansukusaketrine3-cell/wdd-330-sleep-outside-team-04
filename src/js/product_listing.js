
import ProductData from "./productData.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

await loadHeaderFooter();

const category = getParam("category");
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

const titleElement = document.querySelector(".products h2");

const categoryName = category
  ? category.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
  : "Products";

titleElement.textContent = `Top Products: ${categoryName}`;

async function showProducts() {
  try {
    const products = await dataSource.getData(category);

    listElement.innerHTML = products
      .map(
        (product) => `
          <li class="product-card">
            <a href="../product_pages/?product=${product.Id}">
              <img
                src="${product.Images?.PrimaryMedium || ""}"
                alt="${product.Name}"
              />
              <h3>${product.Brand?.Name || ""}</h3>
              <h2>${product.Name}</h2>
              <p class="product-card__price">
                $${product.FinalPrice}
              </p>
            </a>
          </li>
        `,
      )
      .join("");
  } catch (error) {
    console.error("Unable to load products:", error);
    listElement.innerHTML = "<li>Unable to load products. Please try again.</li>";
  }
}

showProducts();

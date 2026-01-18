let productsData = [];
let currentCategory = "all";
let searchQuery = "";

const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
const header = document.getElementById("header");
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const contactForm = document.getElementById("contactForm");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

// 1. Burger Menu
burger.onclick = () => navLinks.classList.toggle("active");

window.onscroll = () => {
  window.scrollY > 50
    ? header.classList.add("scrolled")
    : header.classList.remove("scrolled");
};

async function loadProducts() {
  productsGrid.innerHTML =
    '<p style="text-align:center; color:#636e72; padding:40px;">იტვირთება...</p>';

  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    console.log("მონაცემები წარმატებით ჩაიტვირთა:", data);

    productsData = data.products;
    displayProducts(currentCategory, searchQuery);
  } catch (error) {
    console.error("შეცდომა:", error);
    productsGrid.innerHTML =
      '<p style="text-align:center; color:#e50914; padding:40px;">შეცდომა მონაცემების ჩატვირთვისას</p>';
  }
}

function displayProducts(category, search) {
  productsGrid.innerHTML = "";

  // Filter by category
  let filtered =
    category === "all"
      ? productsData
      : productsData.filter((p) => p.category === category);

  // Filter by search
  if (search?.trim()) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(searchLower)
    );
  }

  // No results
  if (filtered.length === 0) {
    productsGrid.innerHTML =
      '<p style="text-align:center; color:#636e72;">No items match your search.</p>';
    return;
  }

  filtered.forEach((p) => {
    productsGrid.innerHTML += `
      <div class="product-card">
        <img src="${p.img}" alt="${p.name}">
        <div class="product-info">
          <h3>${p.name}</h3>
          <div>
            <span class="price">${p.price} ₾</span>
            <span class="old-price">${p.oldPrice} ₾</span>
          </div>
         <div class="rating">
            <ion-icon name="star"></ion-icon> <span>${p.rating}</span>
          </div>
        </div>
      </div>
    `;
  });
}

document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.onclick = function () {
    document
      .querySelectorAll(".category-btn")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    currentCategory = this.getAttribute("data-category");
    displayProducts(currentCategory, searchQuery);
  };
});

// 6. Search Functionality
const performSearch = () => {
  searchQuery = searchInput.value;
  displayProducts(currentCategory, searchQuery);
};

searchBtn.onclick = performSearch;
searchInput.onkeypress = (e) => {
  if (e.key === "Enter") performSearch();
};

searchBtn.onclick = () => {
  searchBtn.classList.add("active");
  performSearch();
};

document.addEventListener("click", (e) => {
  if (!searchBtn.contains(e.target)) {
    searchBtn.classList.remove("active");
  }
});

contactForm.onsubmit = (e) => {
  e.preventDefault();
  modal.classList.add("show");
  contactForm.reset();
};

closeModal.onclick = () => modal.classList.remove("show");

loadProducts();

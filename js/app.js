import { Util } from "./util.js";

class App {
  data;
  util;
  restCardHtml = "";
  debouncedSearch;

  constructor() {
    this.util = new Util();
    this.addInputEvent();
  }

  fetchRestaurants() {
    const url = "./data/api.json";
    this.util
      .getData(url)
      .then((res) => {
        this.data = res;
        this.data.forEach((rest) => {
          this.restCardHtml = this.restCardHtml + this.constructRestCard(rest);
        });
        this.renderResults();
      })
      .catch((er) => {
        console.log("Error!");
      });
  }

  constructRestCard(resturant) {
    let tagHtml = "";
    resturant.tags.forEach((tag) => {
      tagHtml = tagHtml + `<span>${tag}</span>`;
    });
    return `<div class="card-holder">
        <div class="top"><img src="${resturant.img}" /></div>
        <div class="middle">
        <div class="name"><span class="bold name-val">${resturant.name}</span> <span class="rate-val">${resturant.rating}</span></div>
        <div class="location"><span class="bold loc-val">${resturant.location}</span> <span class="eta-val">ETA: ${resturant.eta}</span></div>
        </div>
        <div class="bottom">${tagHtml}</div>
        </div>`;
  }

  renderResults() {
    const resultsContianer = document.querySelector("#restaurant-container");
    resultsContianer.innerHTML = this.restCardHtml;
  }

  addInputEvent() {
    const inputBox = document.querySelector("#search");
    this.debouncedSearch = this.util.debounce(this.search.bind(this), 400);
    inputBox.addEventListener("input", this.debouncedSearch);

    const sortByDropdown = document.querySelector("#sort-by");
    sortByDropdown.addEventListener("change", this.sort.bind(this));
  }

  search() {
    const inputBox = document.querySelector("#search");
    const searchKey = inputBox?.value.toLowerCase();
    const results = this.data.filter((el) => {
      if (
        el.name.toLowerCase().indexOf(searchKey) > -1 ||
        el.tags.toString().toLowerCase().indexOf(searchKey) > -1
      ) {
        return el;
      }
    });
    this.restCardHtml = "";
    results.forEach((rest) => {
      this.restCardHtml = this.restCardHtml + this.constructRestCard(rest);
    });
    this.renderResults();
  }

  sort(ev) {
    const sortByParam = ev.target.value;
    let results = [];
    if (sortByParam == "ETA") {
      results = this.data.sort((el1, el2) => {
        return el1.eta - el2.eta;
      });
    } else if (sortByParam == "Rating") {
      results = this.data.sort((el1, el2) => {
        return el1.rating - el2.rating;
      });
    }
    this.restCardHtml = "";
    results.forEach((rest) => {
      this.restCardHtml = this.restCardHtml + this.constructRestCard(rest);
    });
    this.renderResults();
  }
}

const app = new App();
app.fetchRestaurants();

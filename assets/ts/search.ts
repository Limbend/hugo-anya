import Fuse from "../js/fuse";

interface searchItem {
  item: {
    categorise: Array<string>;
    contents: string;
    date: string;
    permalink: string;
    tags: Array<string>;
    title: string;
  };
  refIndex: number;
}

const show = function (el: HTMLElement) {
  el.style.display = "block";
};

const hide = function (el: HTMLElement) {
  el.style.display = "none";
};

class Search {
  private searchInput = document.getElementById(
    "search-query"
  ) as HTMLInputElement;
  private searchResults = document.getElementById("search-results");
  private articlesList = document.getElementById("articles-list");
  private filterItems = document.getElementsByClassName(
    "filter-item"
  ) as HTMLCollectionOf<HTMLElement>;
  private searchFilter = new Map();
  private fuse: any;

  constructor() {
    this.initFuse();
    this.bindInput();
    this.bindFilters();
  }

  private initFuse() {
    const fuseOptions = {
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      useExtendedSearch: true,
      keys: [
        { name: "title", weight: 0.8 },
        { name: "contents", weight: 0.5 },
        { name: "tags", weight: 0.3 },
        { name: "categories", weight: 0.3 },
      ],
    };
    fetch("/index.json")
      .then((response) => {
        if (response.status !== 200) {
          console.error("[" + response.status + "]Error:", response.statusText);
          return;
        }
        return response.json();
      })
      .then((pages) => {
        let fuse = new Fuse(pages, fuseOptions);
        this.fuse = fuse;
      })
      .catch(function (err) {
        console.error("[Fetch]Error:", err);
      });
  }

  private bindInput() {
    this.searchInput.addEventListener("input", () => {
      let value = this.searchInput.value;
      this.executeSearch(this.buildSearchValue(value));
    });
  }

  private bindFilters() {
    Array.from(this.filterItems).forEach((el) => {
      el.addEventListener("click", () => {
        this.filterSelect(el);
      });
    });
  }

  private reverseTextLayout(value: string) {
    let layoutDict = {
      ё: "`",
      "`": "ё",
      й: "q",
      q: "й",
      ц: "w",
      w: "ц",
      у: "e",
      e: "у",
      к: "r",
      r: "к",
      е: "t",
      t: "е",
      н: "y",
      y: "н",
      г: "u",
      u: "г",
      ш: "i",
      i: "ш",
      щ: "o",
      o: "щ",
      з: "p",
      p: "з",
      ф: "a",
      a: "ф",
      ы: "s",
      s: "ы",
      в: "d",
      d: "в",
      а: "f",
      f: "а",
      п: "g",
      g: "п",
      р: "h",
      h: "р",
      о: "j",
      j: "о",
      л: "k",
      k: "л",
      д: "l",
      l: "д",
      ж: ";",
      ";": "ж",
      э: "'",
      "'": "э",
      я: "z",
      z: "я",
      ч: "x",
      x: "ч",
      с: "c",
      c: "с",
      м: "v",
      v: "м",
      и: "b",
      b: "и",
      т: "n",
      n: "т",
      ь: "m",
      m: "ь",
      б: ",",
      ",": "б",
      "/": ".",
      ".": "/",
      х: "[",
      "[": "х",
      ъ: "]",
      "]": "ъ",
    };
    return value
      .toLowerCase()
      .replace(/[а-я.ё\[\]a-z\`]/gi, (m) => layoutDict[m]);
  }

  private reverseLayoutSearchOBJ(value: string | object) {
    let text = "";
    if (typeof value === "string") {
      text = value;
    } else {
      text = value.$and[0].$or[0].title;
    }
    return this.buildSearchValue(this.reverseTextLayout(text));
  }

  private executeSearch(value: string | object) {
    if (
      (typeof value === "string" && value.length != 0) ||
      typeof value === "object"
    ) {
      hide(this.articlesList);
      show(this.searchResults);
    } else {
      hide(this.searchResults);
      show(this.articlesList);
    }

    let result = this.fuse.search(value);
    if (result.length > 0) {
      this.populateResults(result);
    } else {
      result = this.fuse.search(this.reverseLayoutSearchOBJ(value));
      if (result.length > 0) {
        this.populateResults(result);
      } else {
        this.searchResults.innerHTML =
          "<p>Sorry, nothing matched that search.</p>";
      }
    }
  }

  private populateResults(results: Array<searchItem>) {
    this.searchResults.innerHTML = "";

    results.forEach((value) => {
      let item = value.item;
      let html = `
            <div class="post">
                <a href="${item.permalink}">
                    <div class="post-row">
                        <time>${item.date}</time>
                        <h3>${item.title}</h3>
                    </div>
                </a>
            </div>`;
      this.searchResults.innerHTML += html;
    });
  }

  private buildSearchValue = function (value: string) {
    let filter = [];
    if (this.searchFilter.size == 0 && value.length == 0) {
      return "";
    }
    this.searchFilter.forEach((v: string, k: string) => {
      let object = {};
      if (v == "categories") {
        object = {
          categories: k,
        };
      }
      filter.push(object);
    });
    if (value != undefined && value.length != 0) {
      let orObject = {
        $or: [
          { title: value },
          // fuse extended search, 'value is include-match
          // more details: https://fusejs.io/examples.html#extended-search
          { contents: "'" + value },
        ],
      };
      filter.push(orObject);
    }
    return {
      $and: filter,
    };
  };

  private uSelectOthers(newSelected: HTMLElement) {
    Array.from(this.filterItems).forEach((el) => {
      if (el.classList.contains("active") && newSelected != el) {
        this.searchFilter.delete(el.dataset.value);
        el.classList.remove("active");
      }
    });
  }

  private filterSelect(el: HTMLElement) {
    let value = el.dataset.value;
    let type = el.dataset.type;
    if (el.classList.contains("active")) {
      this.searchFilter.delete(value);
      el.classList.remove("active");
    } else {
      this.searchFilter.set(value, type);
      el.classList.add("active");
      this.uSelectOthers(el);
    }
    this.executeSearch(this.buildSearchValue(""));
  }
}

window.addEventListener("load", () => {
  setTimeout(function () {
    new Search();
  }, 0);
});

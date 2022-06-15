"use strict";

const btnAddBook = document.querySelector(".btn--add");
const btnSubmit = document.querySelector(".btn--submit");
const btnEdit = document.querySelector(".edit");
const btnDelete = document.querySelector(".delete");
const btnClose = document.querySelector(".close");
const btnStatus = document.querySelector(".book__status");
const modal = document.querySelector(".modal");
const content = document.querySelector(".content");
const layer = document.querySelector(".layer");
const bookUI = document.querySelector(".book");
const search = document.querySelector(".search");
const containerAPI = document.querySelector(".containerAPI");

//////////////////Event listeners
bookUI.addEventListener("mouseenter", () => bookUI.classList.add("hover"));

bookUI.addEventListener("mouseleave", () => bookUI.classList.remove("hover"));

btnAddBook.addEventListener("click", showModal);

layer.addEventListener("click", closeModal);

btnClose.addEventListener("click", closeModal);

btnSubmit.addEventListener("click", function (e) {
  e.preventDefault();
  showResults(search.value);
});

/////////////////Functions
function showModal() {
  modal.classList.add("show");
  content.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  content.classList.remove("show");
}

class Book {
  constructor(title, author, pages, year, cover, status = "read") {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.year = year;
    this.cover = cover;
    this.status = status;
  }
}

async function showResults(searchItem) {
  try {
    const titleSearch = searchItem;
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${titleSearch}&page=1`
    );

    if (!res.ok) throw new Error("Request timeout. Try again.");

    const data = await res.json();
    const searchArr = data.docs.slice(0, 10);
    containerAPI.innerHTML = "";
    getBookDetails(searchArr);
  } catch (err) {
    console.error(err);
  }
}

function getBookDetails(searchArr) {
  console.log(searchArr[0]);

  for (let i = 0; i < searchArr.length; i++) {
    let {
      title,
      author_name: author,
      first_publish_year: year,
      number_of_pages_median: pages,
      cover_i: cover,
    } = searchArr[i];
    console.log(cover);

    const bookAPI = new Book(title, author, pages, year, cover);

    const markup = `
    <div class="bookAPI__container">
          <img 
            src="https://covers.openlibrary.org/b/id/${
              bookAPI.cover ? bookAPI.cover : 11140466
            }-M.jpg"
            alt="${bookAPI.title}"
            class="bookAPI__img"
          />

          <div class="bookAPI__details">
            <p class="bookAPI__title">${bookAPI.title}</p>
            <p class="bookAPI__author">by ${bookAPI.author}</p>
            <p class="bookAPI__date">${bookAPI.year}</p>
            <p class="bookAPI__pages">${bookAPI.pages} pages</p>
            <button class="btn btn--add-bookAPI">Add Book</button>
          </div>
        </div>
    `;
    containerAPI.insertAdjacentHTML("beforeend", markup);
  }
}

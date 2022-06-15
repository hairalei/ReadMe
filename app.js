"use strict";

const btnAddBook = document.querySelector(".btn--add");
const btnSubmit = document.querySelector(".btn--submit");
const btnEdit = document.querySelector(".edit");
const btnDelete = document.querySelector(".delete");
const btnClose = document.querySelector(".close");
const modal = document.querySelector(".modal");
const content = document.querySelector(".content");
const layer = document.querySelector(".layer");
const search = document.querySelector(".search");
const containerAPI = document.querySelector(".containerAPI");
const container = document.querySelector(".container");

let btnStatus;
//////////////////Event listeners

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
  constructor(title, author, pages, year, cover, status = "unread") {
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

    //Render search results
    getBookDetails(searchArr);
  } catch (err) {
    console.error(err);
  }
}

function getBookDetails(searchArr) {
  for (let i = 0; i < searchArr.length; i++) {
    let {
      title,
      author_name: author,
      first_publish_year: year,
      number_of_pages_median: pages,
      cover_i: cover,
    } = searchArr[i];

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

  addBookToList();
}

function addBookToList() {
  const btnAddbookAPI = modal.querySelectorAll(".btn--add-bookAPI");

  btnAddbookAPI.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      console.log(e.target.closest(".bookAPI__details"));
      const parent = e.target.closest(".bookAPI__details");
      const title = parent.querySelector(".bookAPI__title").innerHTML;
      const author = parent
        .querySelector(".bookAPI__author")
        .innerHTML.slice(3);
      let pages = parent.querySelector(".bookAPI__pages").innerHTML;
      pages = parseInt(pages);
      const img = parent
        .closest(".bookAPI__container")
        .querySelector(".bookAPI__img")
        .getAttribute("src");
      console.log(img);

      const bookFromAPI = new Book(title, author, pages, 0, img);
      console.log(bookFromAPI);
      renderBookUI(bookFromAPI);
    });
  });
}

function renderBookUI(book) {
  console.log(book.title);

  const markup = `
  <div class="book ${book.status}" style="background: url('${book.cover}">
            <small class="book__pages">${book.pages} pages</small>

            <div class="book__hover">
              <div class="btns-details">
                <button class="btn delete">
                  <i class="fa-solid fa-trash-can delete"></i>
                </button>
              </div>

              <div class="book__details">
                <h3 class="book__title">${book.title}</h3>

                <h4 class="book__author">${book.author}</h4>

                <button class="btn book__status ">${
                  book.status[0].toUpperCase() + book.status.slice(1)
                }</button>
              </div>
            </div>
          </div>
  `;

  container.insertAdjacentHTML("beforeend", markup);

  //Render book UI
  const bookUI = document.querySelectorAll(".book");

  bookUI.forEach((book) => {
    book.addEventListener("mouseenter", () => book.classList.add("hover"));

    book.addEventListener("mouseleave", () => book.classList.remove("hover"));
  });

  //Change reading status
  btnStatus = document.querySelectorAll(".book__status");
  let i = 0;

  btnStatus.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const status = ["unread", "reading", "read"];
      i++;

      if (i >= status.length) i = 0;

      console.log(i);

      btn.innerText = status[i][0].toUpperCase() + status[i].slice(1);

      if (i === 0)
        btn.closest(".book").classList.remove(`${status[status.length - 1]}`);

      btn.closest(".book").classList.remove(`${status[i - 1]}`);
      btn.closest(".book").classList.add(`${status[i]}`);
    });
  });
}

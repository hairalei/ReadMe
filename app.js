"use strict";

const btnAddBook = document.querySelector(".btn--add");
const btnSubmit = document.querySelector(".btn--submit");
const btnClose = document.querySelector(".close");
const modal = document.querySelector(".modal");
const content = document.querySelector(".content");
const layer = document.querySelector(".layer");
const search = document.querySelector(".search");
const containerAPI = document.querySelector(".containerAPI");
const container = document.querySelector(".container");

const bookData = localStorage.getItem("books");

class Book {
  constructor(
    title = "unknown",
    author = "unknown",
    pages = "unknown no. of",
    year = "unknown",
    cover,
    status = "unread"
  ) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.year = year;
    this.cover = cover;
    this.status = status;
  }
}

/////////////////Functions
function showModal() {
  modal.classList.add("show");
  content.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  content.classList.remove("show");
}

//Show search results from API
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

    if (data.numFound === 0) throw new Error(`Book not found. Try again.`);

    //Render search results
    getBookDetails(searchArr);
  } catch (err) {
    containerAPI.insertAdjacentHTML("afterbegin", err);
    containerAPI.style.fontSize = "3.2rem";
  }
}

//Get book details from API and render search results
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

//Add book from search results to library
function addBookToList() {
  const btnAddbookAPI = modal.querySelectorAll(".btn--add-bookAPI");

  btnAddbookAPI.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const parent = e.target.closest(".bookAPI__details");
      const title = parent.querySelector(".bookAPI__title").innerHTML;
      const author = parent
        .querySelector(".bookAPI__author")
        .innerHTML.slice(3);
      const img = parent
        .closest(".bookAPI__container")
        .querySelector(".bookAPI__img")
        .getAttribute("src");
      let pages = parent.querySelector(".bookAPI__pages").innerHTML;
      pages = parseInt(pages);

      const bookFromAPI = new Book(title, author, pages, 0, img);
      console.log(bookFromAPI);
      renderBookUI(bookFromAPI);
    });
  });
}

//Render book UI
function renderBookUI(book) {
  const markup = `
  <div class="book ${book.status}" style="background: url('${book.cover}">
            <small class="book__pages">${
              book.pages ? book.pages : "?"
            } pages</small>

            <div class="book__hover">
              <div class="btns-details">
                <button class="btn delete">
                  <i class="fa-solid fa-trash-can delete"></i>
                </button>
              </div>

              <div class="book__details">
                <h3 class="book__title">${
                  book.title ? book.title : "unknown"
                }</h3>

                <h4 class="book__author">${
                  book.author ? book.author : "unknown"
                }</h4>

                <button class="btn book__status ">${
                  book.status[0].toUpperCase() + book.status.slice(1)
                }</button>
              </div>
            </div>
          </div>
  `;

  container.insertAdjacentHTML("beforeend", markup);

  addBookHover();

  //Change reading status
  changeBookStatus();

  //Remove book from list
  removeBook();

  updateLocalStorage();
}

function changeBookStatus() {
  const btnStatus = document.querySelectorAll(".book__status");

  btnStatus.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const prevStatus = btn.innerHTML.toLowerCase();
      btn.closest(".book").classList.remove(prevStatus);

      let currentStatus;

      if (prevStatus === "unread") {
        currentStatus = "reading";
      } else if (prevStatus === "reading") {
        currentStatus = "read";
      } else if (prevStatus === "read") {
        currentStatus = "unread";
      }

      btn.innerHTML = currentStatus[0].toUpperCase() + currentStatus.slice(1);
      btn.closest(".book").classList.add(currentStatus);
      updateLocalStorage();
    });
  });
}

function removeBook() {
  const btnDelete = document.querySelectorAll(".delete");

  btnDelete.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      btn.closest(".book").remove();
      updateLocalStorage();
    });
  });
}

function updateLocalStorage() {
  const bookdata = document.querySelector(".container").innerHTML;

  localStorage.setItem("books", bookdata);
}

function getBookData() {
  if (bookData) container.innerHTML = bookData;

  addBookHover();

  //Change reading status
  changeBookStatus();

  //Remove book from list
  removeBook();
}

//Show book details when hovering
function addBookHover() {
  const bookUI = document.querySelectorAll(".book");

  bookUI.forEach((book) => {
    book.addEventListener("mouseenter", () => book.classList.add("hover"));

    book.addEventListener("mouseleave", () => {
      book.classList.remove("hover");
      updateLocalStorage();
    });
  });
}

//////////////////Event listeners

btnAddBook.addEventListener("click", showModal);

layer.addEventListener("click", closeModal);

btnClose.addEventListener("click", closeModal);

btnSubmit.addEventListener("click", function (e) {
  e.preventDefault();

  const markup = `<div class="loading" style="font-size:2.4rem">Loading...</div>`;

  containerAPI.insertAdjacentHTML("beforebegin", markup);

  setTimeout(() => {
    document.querySelector(".loading").remove();
  }, 3000);
  showResults(search.value);
});

////

getBookData();

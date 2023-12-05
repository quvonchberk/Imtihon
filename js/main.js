let elInput = document.querySelector(".search_input");
let elForm = document.querySelector(".Form");
let elList = document.querySelector(".list");
let elBtn = document.querySelector(".btn_order");
let elModalInfo = document.querySelector(".modal-info");
let elBookList = document.querySelector(".book_list");
let elResult = document.querySelector(".result_number");
let elBookTemplate = document.querySelector(".book_template").content;
let elTemplate = document.querySelector(".template").content;

let BooksLocal = JSON.parse(localStorage.getItem("books")) || [];
let all = {};

/*render */
(async function () {
  let res = await fetch(
    "https://www.googleapis.com/books/v1/volumes?q=english&maxResults=15"
  );

  if (res.ok) {
    all = await res.json();
    renderBook(all, elList);
  } else {
    console.error(res.status);
  }
})();

function renderBook(params, list) {
  list.innerHTML = null;

  let elFragment = document.createDocumentFragment();

  params.items?.forEach((element) => {
    let templateDiv = elTemplate.cloneNode(true);

    templateDiv.querySelector(".img").src =
      element?.volumeInfo?.imageLinks?.thumbnail;
    templateDiv.querySelector(".title_book").textContent =
      element?.volumeInfo?.title;
    templateDiv.querySelector(".author_book").textContent =
      element?.volumeInfo?.authors;
    templateDiv.querySelector(".year_book").textContent =
      element?.volumeInfo?.publishedDate;
    templateDiv.querySelector(".read_link").href =
      element?.volumeInfo?.infoLink;
    templateDiv.querySelector(".read_link").setAttribute("target", "_blank");
    templateDiv.querySelector(".info").dataset.bookInfoId = element?.id;
    templateDiv.querySelector(".book_btn").dataset.bookMarkId = element?.id;

    elFragment.appendChild(templateDiv);
  });

  list.appendChild(elFragment);

  elResult.textContent = params.items?.length;

  if (params.totalItems == 0) {
    elList.textContent = "Book not found";
  }
}

/*search*/
elForm.addEventListener("input", function (evt) {
  evt.preventDefault();

  let inputValue = elInput.value.trim();

  let res = new RegExp(inputValue, "gi");
  (async function () {
    let respons = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${res}&maxResults=15`
    );

    if (respons.ok) {
      all = await respons.json();
      renderBook(all, elList);
    } else {
      console.error(respons.status);
    }
  })();
});

/*by newest*/
elBtn.addEventListener("click", function (evt) {
  evt.preventDefault();

  let inputValue = elInput.value.trim();

  let res = new RegExp(inputValue, "gi");

  (async function () {
    let responsee = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=$%7B${res}%7D&orderBy=newest
      `
    );

    if (responsee.ok) {
      all = await responsee.json();
      renderBook(all, elList);
    } else {
      console.error(responsee.status);
    }
  })();
});

/*localStorage*/
elList.addEventListener("click", function (evt) {
  let bookId = evt.target.dataset.bookMarkId;

  if (bookId) {
    let searchbook = all.items.find((item) => item.id === bookId);

    let inBook = BooksLocal.findIndex((item) => item.id === searchbook.id);

    if (inBook === -1) {
      BooksLocal.push(searchbook);
      localStorage.setItem("books", JSON.stringify(BooksLocal));
      renderBookmark(BooksLocal, elBookList);
    }
  }
});

/*BookMark*/
function renderBookmark(params, wrapper) {
  wrapper.innerHTML = null;

  let elFragment = document.createDocumentFragment();

  params.forEach((item) => {
    let elBookMarkTemp = elBookTemplate.cloneNode(true);

    elBookMarkTemp.querySelector(".book_list-title").textContent =
      item.volumeInfo?.title;
    elBookMarkTemp.querySelector(".book_list-text").textContent =
      item.volumeInfo?.authors;
    elBookMarkTemp.querySelector(".book-open-btn").href =
      item.volumeInfo?.infoLink;
    elBookMarkTemp.querySelector(".del-button").dataset.dltBookId = item.id;

    elBookMarkTemp
      .querySelector(".book-open-btn")
      .setAttribute("target", "_blank");

    elFragment.appendChild(elBookMarkTemp);
  });

  wrapper.appendChild(elFragment);
}
renderBookmark(BooksLocal, elBookList);

/*delete*/
elBookList.addEventListener("click", function (evt) {
  let dltBook = evt.target.dataset.dltBookId;

  if (dltBook) {
    let item = BooksLocal.findIndex((item) => {
      return item.id == dltBook;
    });
    BooksLocal.splice(item, 1);
    localStorage.setItem("books", JSON.stringify(BooksLocal));
    renderBookmark(BooksLocal, elBookList);
  }
});

/*More info*/
elList.addEventListener("click", function (evt) {
  let MoreInfo = evt.target.dataset.bookInfoId;

  if (MoreInfo) {
    let bookInfo = all.items.find((item) => item.id == MoreInfo);

    elModalInfo.querySelector("#offcanvasRightLabel").textContent =
      bookInfo.volumeInfo?.title;
    elModalInfo.querySelector(".modal-img").src =
      bookInfo.volumeInfo?.imageLinks?.thumbnail;
    elModalInfo.querySelector(".modal-text").textContent =
      bookInfo.volumeInfo?.description;
    elModalInfo.querySelector(".modal-span-author").textContent =
      bookInfo.volumeInfo?.authors;
    elModalInfo.querySelector(".modal-span-published").textContent =
      bookInfo.volumeInfo?.publishedDate;
    elModalInfo.querySelector(".modal-span-publishers").textContent =
      bookInfo.volumeInfo?.publisher;
    elModalInfo.querySelector(".modal-span-categories").textContent =
      bookInfo.volumeInfo?.categories;
    elModalInfo.querySelector(".modal-span-pagesCount").textContent =
      bookInfo.volumeInfo?.pageCount;
    elModalInfo.querySelector(".read_linkk").href =
      bookInfo.volumeInfo?.infoLink;
    elModalInfo.querySelector(".read_linkk").setAttribute("target", "_blank");
  }
});

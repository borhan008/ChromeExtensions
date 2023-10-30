const btn = document.getElementById("submit");
const text = document.getElementById("text");
const searchData = document.getElementById("search-data");

async function translate(sourceText) {
  var sourceLang = "en";
  var targetLang = "bn";

  var url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
    sourceLang +
    "&tl=" +
    targetLang +
    "&dt=t&q=" +
    encodeURI(sourceText);
  const response = await fetch(url);
  const movies = await response.json();
  return movies[0][0][0];
}

async function checkMeaning(val) {
  let arr = new Set();
  val = val.trim().toLowerCase();
  let tr = translate(val);
  searchData.innerHTML = "";
  const chk = await tr.then(function (result) {
    arr.add(result);
  });

  const response = await fetch(
    chrome.extension.getURL("../json/BengaliDictionary.json")
  );
  const movies = await response.json();

  const res2 = await fetch(chrome.extension.getURL("../json/E2Bdatabase.json"));
  const data2 = await res2.json();
  const f2 = data2.find((element) => {
    if (element.en == val) {
      arr.add(element.bn);
      return;
    }
  });
  const fs = movies.find((element) => {
    if (element.en == val) {
      arr.add(element.bn);
    } else {
      element.en_syns.find((x) => {
        if (x == val) {
          arr.add(element.bn);
        }
      });
    }
  });
  if (arr.size > 0) {
    searchData.innerHTML = `<strong>${val}<strong> <br/>`;
    arr.forEach((element) => {
      searchData.innerHTML += element + ", ";
    });
  } else {
    searchData.innerHTML = `<strong>${val}<strong> <br/>`;
    arr.forEach((element) => {
      searchData.innerHTML += "No Data Found";
    });
  }
}

btn.addEventListener("click", () => {
  checkMeaning(text.value);
});
text.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    btn.click();
  }
});

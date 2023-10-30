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
  const chk = await tr.then(function (result) {
    if (result != val) arr.add(result);
  });
  const response = await fetch(
    chrome.extension.getURL("json/BengaliDictionary.json")
  );
  const movies = await response.json();

  const res2 = await fetch(chrome.extension.getURL("json/E2Bdatabase.json"));
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
  if (arr.size > 0) return arr;
}

const para = document.createElement("div");
para.style.cssText = `     position: fixed;
width: 25%;
background: rgb(250, 236, 198);
right: 10px;
bottom: 10px;
color: rgb(0, 0, 0);
z-index: 2147483647;
height: fit-content;
padding: 15px 20px 20px;
font-size: 16px;
display: block;`;
document.body.appendChild(para);
para.style.display = "none";
document.addEventListener("dblclick", async (e) => {
  const selection = document.getSelection();
  para.innerHTML = "";
  para.style.display = "none";
  // console.log(selection.anchorNode.data) // is whole text: "test data."
  let txt = selection.anchorNode.data.slice(
    selection.baseOffset,
    selection.extentOffset
  );
  para.innerHTML = `<strong>${txt}</strong> <br/>`;
  txt = txt.trim();

  if (typeof txt == "string" && txt.length > 0) {
    let dep = checkMeaning(txt);
    dep.then(function (result) {
      if (typeof result === "object") {
        result.forEach((e) => {
          para.innerHTML += e + " , ";
        });
        para.innerHTML += `<strong style="position: absolute;
        top: 0;
        right: 8px;
        font-size: 18px;
        cursor: pointer;" id="hidePara">x</strong>`;
        document.getElementById("hidePara").addEventListener("click", () => {
          para.style.display = "none";
        });
        para.style.display = "block";
      } else {
        console.log(typeof result);
        para.innerHTML += " No data found ";
        para.innerHTML += `<strong style="position: absolute;
        top: 0;
        right: 8px;
        font-size: 18px;
        cursor: pointer;" id="hidePara">x</strong>`;
        document.getElementById("hidePara").addEventListener("click", () => {
          para.style.display = "none";
        });
        para.style.display = "block";
        para.style.display = "block";
      }
    });
  }
});

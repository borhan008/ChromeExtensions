function onMyPageClick(info, tab) {
  console.log("Clicked on page", info, " ", tab);
}

chrome.contextMenus.create({
  title: "Share",
  contexts: ["page"],
  onclick: onMyPageClick,
});

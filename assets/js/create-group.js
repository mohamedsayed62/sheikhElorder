let btnGenerate = document.querySelector(".btn-generate");
let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let groupName = document.getElementById("name");
let groupCode = document.getElementById("key");

btnGenerate.onclick = () => {
  let key = "";
  for (let i = 0; i < 6; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  groupCode.value = key;
}



let createBtn = document.querySelector(".btn-create");

createBtn.onclick = () => {
  let name = groupName.value;
  let code = groupCode.value;

  let id = JSON.parse(localStorage.getItem("user"))["id"];
  
  let formData = new FormData();
  
  formData.append("name", name);
  formData.append("key", code);
  formData.append("admin_id", id);
  
  fetch("https://sheikhelorderback-production.up.railway.app/api/storeGroup", {
    method: "POST",
    body: formData,
    headers: {
      Accept: 'application/json'
    }
  },
).then(response => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(response);
  }).then(json => {
    document.cookie=`group_id=${json["group_id"]}`
    return window.open("group.html", "_self")
  })
    .catch(error => {
    return error.json();
  }).then(json => {
    console.log(json);
    let errorMsgP = document.querySelector(".error-msg");
    errorMsgP.textContent = json['message'];
    errorMsgP.classList.remove("hidden");
  })
  }

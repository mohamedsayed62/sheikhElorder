let id = document.cookie.slice(document.cookie.indexOf("id=") + 3);

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
  
  let formData = new FormData();
  
  formData.append("name", name);
  formData.append("admin_id", id);
  formData.append("key", code);
  
  fetch("https://sheikhelorderback-production.up.railway.app/api/storeGroup", {
    method: "POST",
    body: formData,
    headers: {
      Accept: 'application/json'
    }
  },
).then(response => {
  if (response.ok) {
    return window.open("group.html", "_self");
  }
  return Promise.reject(response);
  }).catch(error => {
    return error.json();
  }).then(json => {
    console.log(json);
    let errorMsgP = document.querySelector(".error-msg");
    errorMsgP.textContent = json['message'];
    errorMsgP.classList.remove("hidden");
  })

  }

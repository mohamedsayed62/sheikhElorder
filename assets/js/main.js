
function handelScroll() {
  let allScroll = document.querySelectorAll(".scroll");
  allScroll.forEach((scroll, idx) => {
    let eleScroll = scroll.getBoundingClientRect().top;
    if (eleScroll <= window.innerHeight) {
      setTimeout(() => {
        scroll.classList.remove("scroll");
      }, idx * 200);
    }
  });
}
window.addEventListener("load", handelScroll);

window.addEventListener("scroll", handelScroll);


let userImgInput = document.getElementById("user-img");

let file;

userImgInput.addEventListener("change", () => {
  let preview = document.getElementById("preview");
  preview.src = URL.createObjectURL(userImgInput.files[0]);
  file = userImgInput.files[0];
})

let btnSaveUser = document.querySelector(".btn-save-user");
btnSaveUser.addEventListener("click", () => {
  let name = document.getElementById("user-name");

  let formData = new FormData();
  formData.append("name", name.value);
  formData.append("image", file);
  fetch("https://sheikhelorderback-production.up.railway.app/api/storeUser", {
    method: "POST",
    credentials: "include",
    body:formData
  }).then((response) => {
    return response.json();
  }).then((msg) => {

    let pMsg = document.getElementById("msg");

    pMsg.textContent = msg["msg"];
    pMsg.classList.remove("hidden");
    
    setTimeout(() => {
      pMsg.classList.add("hidden");
    }, 1000)
    return { "id": msg["id"], "user_name": formData.get("name") };
  }).then(get_cookie => {
    let id = get_cookie["id"];
    let name = get_cookie["user_name"];

    let user = { "id": id, "name": name};

    localStorage.setItem("user", JSON.stringify(user));
  })
})

let joinBtn = document.querySelector("button.start-btn");

joinBtn.onclick = () => {
  let key = document.getElementById("code");

  key = key.value;

  let id = JSON.parse(localStorage.getItem("user"))["id"];

  fetch(`https://sheikhelorderback-production.up.railway.app/api/joinGroup/${key}/${id}`)
    .then((response) => {
      return window.open("group.html", "_self");
    });
}
joinBtn.addEventListener("click", () => {
  let key = document.getElementById("code");

  key = key.value;

  let id = JSON.parse(localStorage.getItem("user"))["id"];

  fetch(`https://sheikhelorderback-production.up.railway.app/api/joinGroup/${key}/${id}`)
    .then((response) => {
      return window.open("group.html", "_self");
    });
})
joinBtn.addEventListener("touchstart", () => {
  let key = document.getElementById("code");

  key = key.value;

  let id = JSON.parse(localStorage.getItem("user"))["id"];

  fetch(`https://sheikhelorderback-production.up.railway.app/api/joinGroup/${key}/${id}`)
    .then((response) => {
      return window.open("group.html", "_self");
    });
})





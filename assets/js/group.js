let userBox = document.querySelector(".user-box");

let counter = 0;

function loadResponse() {
  fetch('https://sheikhelorderback-production.up.railway.app/api/getGroup', {
    credentials: "include"
  }).then(response => {
  return response.json();
  }).then(users => {
    users.forEach((user, index) => {
      let color;
      if (user["baid"] - user["price"] >= 0 ) {
        color = 'bg-green-50';
      } else {
        color = 'bg-red-50';
      }
      if (index >= counter) {
        userBox.innerHTML += `<div class="user flex justify-between items-center py-3 ${color} rounded-xl w-full mb-3">
        <div class="w-56">
        <img src="${user['img']}" alt="" width="40px" class="mr-3 ml-3 rounded-full inline-block">
        <span class="fs-18 text-blue-700 font-extrabold">${user["name"]}</span>
        </div>
        <span class="fs-18 w-32 text-center text-blue-500 font-extrabold">${user["price"]} جنيه</span>
        <span class="fs-18 w-32 text-center text-green-500 font-extrabold">${user["baid"]} جنيه</span>
        <span class="fs-18 w-32 text-center text-red-500 font-extrabold">${ user["baid"] - user["price"] } جنيه</span>
        </div>`
      }
    });
    counter = users.length;
  })
}

loadResponse();


setInterval(loadResponse, 3000);

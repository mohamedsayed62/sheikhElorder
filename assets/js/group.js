let id = JSON.parse(localStorage.getItem("user"))["id"];
let createOrderBtn = document.querySelector(".create-order");
let arrCookie = document.cookie.split(";");
let groupId = arrCookie[0].slice(9);
if (document.cookie == "") {
  window.open("index.html", "_self");
}
fetch(`http://127.0.0.1:8000/api/check/${id}`)
  .then(response => {
    return response.json();
  }).then((json) => {
    if (json["flag"]) {

      createOrderBtn.classList.remove("hidden");

    }

    let h2 = document.querySelector('h2');

    h2.textContent = json['name'];
  })



function boxOrder(json, counter) {
  let container = document.querySelector(".order");
  let order = document.createElement("div");

  json.forEach((key, index) => {
    if (counter <= index) {
      let userOrder = document.createElement("div");
      userOrder.classList.add("user-order");
      userOrder.classList.add("bg-white", "p-5", "rounded-xl", "scroll");

      let appendOrderBtn = document.createElement("a");
      appendOrderBtn.href = "order.html";

      appendOrderBtn.className = "create-order-btn bg-blue-500 text-white text-sm block mt-10 mb-5 w-24 text-center";
      appendOrderBtn.textContent = "إضافة طلب";

      appendOrderBtn.addEventListener("click", () => {
        document.cookie=`box_id=${key["id"]}`;
      })

      let grid = document.createElement("div");
      grid.className = "md:grid grid-cols-6 gap-10";

      grid.setAttribute("data-order", `${key['id']}`);

      let userBox = document.createElement("div");
      userBox.className = `col-start-1 col-end-5 box user-box bg-white p-10 rounded-xl scroll`;

      userBox.setAttribute("key-id", key['id']);

      userBox.innerHTML = `
      <h2 class="text-xl text-blue-700 font-bold mx-auto mb-3 border-b-4 border-blue-100 pb-3">${key["date"]}</h2>
      <div class="flex justify-between items-center mb-3 pb-3 w-full">
        <h3 class="fs-18 font-bold text-blue-700 w-56 text-center">الأعضــاء</h3>
        <span class="fs-18 w-32 text-center text-blue-500 font-extrabold">التكلفــة الكليــة</span>
        <span class="fs-18 w-32 text-center text-green-500 font-extrabold">المبلغ المدفوع</span>
        <span class="fs-18 w-32 text-center text-red-500 font-extrabold">المبلغ الباقــي</span>
      </div>
      `

      let orderBox = document.createElement("div");
      orderBox.className = "col-start-5 col-end-7 box order bg-white p-5 rounded-xl md:mt-0 mt-10 scroll";
      orderBox.innerHTML = `
      <h2 class="text-blue-500 font-extrabold text-3xl text-center pb-3 border-b-4 border-blue-100 mb-5 mx-auto">ملخص الاوردر</h2>
                <div class="flex justify-between items-center bg-gray-100 p-3 rounded-xl">
                  <h4 class="text-blue-600 font-extrabold text-sm">المبلغ الاجمالي</h4>
                  <span class="total-price text-blue-600 font-bold text-sm"></span>
                </div>
                <div class="flex justify-between items-center bg-gray-100 p-3 rounded-xl my-5">
                  <h4 class="text-green-600 font-extrabold text-sm">المبلغ المدفوع</h4>
                  <span class="baid text-green-600 font-bold text-sm"></span>
                </div>
                <div class="flex justify-between items-center bg-gray-100 p-3 rounded-xl">
                  <h4 class="text-red-600 font-extrabold text-sm">المبلغ المتبقي</h4>
                  <span class="balance text-red-600 font-bold text-sm"></span>
                </div>
                <button class="cat-order mx-auto bg-blue-600 text-white block text-sm font-extrabold mt-5 add-order">أصناف أوردر</button>
              </div>
              `
      grid.append(userBox, orderBox);

      order.append(userOrder, appendOrderBtn, grid);

      container.append(order);
    }


  })

}

let boxsCounter = 0;
setInterval(
  () => {
      fetch(`http://127.0.0.1:8000/api/getBoxs/${groupId}`)
      .then(response => {
        return response.json();
      }).then(json => {
        if (boxsCounter < json.length) {
          boxOrder(json, boxsCounter);
        }
        boxsCounter = json.length
    })
}
  , 1000)



createOrderBtn.addEventListener("click", () => {
  fetch(`http://127.0.0.1:8000/api/setBox/${groupId}`);
})


let counter = 0;

function loadResponse() {
  let userBox = document.querySelectorAll(".user-box");
  if (!(groupId)) return;
  fetch(`http://127.0.0.1:8000/api/getGroup/${groupId}`, {
    credentials: "include"
  }).then(response => {
    return response.json();
  }).then(users => {
    let orderTotalPrice = new Array(userBox.length).fill(0);
    let orderTotalBaid = new Array(userBox.length).fill(0);
    let orderTotalBalance = new Array(userBox.length).fill(0);

    users.forEach((user, index) => {
      let color;
      if (user["baid"] - user["price"] >= 0 ) {
        color = 'bg-green-50';
      } else {
        color = 'bg-red-50';
      }

      let box = document.querySelector(`.user-box[key-id='${user['box_id']}']`);
      if (index >= counter) {
        box.innerHTML += `<div data-user-id="${user['id']}" class="user scroll flex justify-between items-center py-3 ${color} rounded-xl w-full mb-3">
        <div class="w-56">
        <img src="${user['img']}" alt="" class="mr-3 ml-3 rounded-full inline-block">
        <span class="fs-18 text-blue-700 font-extrabold">${user["name"]}</span>
        </div>
        <span class="user-total-price fs-18 w-32 text-center text-blue-500 font-extrabold">${user["price"]} جنيه</span>
        <span class="user-paid fs-18 w-32 text-center text-green-500 font-extrabold">${user["baid"]} جنيه</span>
        <span class="user-balance fs-18 w-32 text-center text-red-500 font-extrabold">${ user["baid"] - user["price"] } جنيه</span>
        </div>`

      }

      orderTotalPrice[Array.from(userBox).indexOf(box)] += user['price'];
      orderTotalBaid[Array.from(userBox).indexOf(box)] += parseInt(user['baid']);
      orderTotalBalance[Array.from(userBox).indexOf(box)] += parseInt(user['baid']) - parseInt(user['price']);

      orderTotalPrice.forEach((total, totalIdx) => {
        let totalPrice = document.querySelector(`.order .user-box[key-id='${user['box_id']}'] + div .total-price`);
        let totalBaid = document.querySelector(`.order .user-box[key-id='${user['box_id']}'] + div .baid`);
        let totalBalance = document.querySelector(`.order .user-box[key-id='${user['box_id']}'] + div .balance`);


        totalPrice.textContent = `${(orderTotalPrice[Array.from(userBox).indexOf(box)])} جنيه`
        totalBaid.textContent = `${orderTotalBaid[Array.from(userBox).indexOf(box)]} جنيه`
        totalBalance.textContent = `${orderTotalBalance[Array.from(userBox).indexOf(box)]} جنيه`
      })

    });

    counter = users.length;
  })
  clearInterval(loadResponse);
}

loadResponse();

setInterval(loadResponse, 2000);


setInterval(() => {

  let userInfo = document.querySelectorAll(`div[data-user-id]`);

  userInfo.forEach((user) => {
    let userOrder = document.querySelectorAll(".user-order");
    user.onclick = () => {
      let index = Array.from(document.querySelectorAll(".user-box")).indexOf(user.parentElement);

      fetch(`http://127.0.0.1:8000/api/showOrder/${user.getAttribute("data-user-id")}`)
        .then(response => {
          return response.json();
        }).then(json => {

          userOrder[index].innerHTML = "";

          let h2 = document.createElement("h2");
          h2.textContent = "محتويات الأوردر";
          h2.classList.add("text-xl", "text-blue-600", "mx-auto", "font-extrabold")
          userOrder[index].append(h2);
          json.forEach((categories) => {
            let flex = document.createElement("div");

  
            flex.className = "flex justify-between items-center mt-3 bg-blue-50 p-2 rounded-xl";
            let h3 = document.createElement("h3");
            h3.className = "text-blue-500 font-extrabold";
            
            h3.textContent = categories["name"];
            
            let p = document.createElement("p");
            p.className = "text-gray-400 font-extrabold";

            p.textContent = categories["amount"];

            flex.append(h3, p);
            userOrder[index].append(flex);
          })

        })
      console.log(index);
      
      userOrder[index].style.display = "block";
      userOrder[index].style.margin = "30px auto 0px";

    }
  })
}, 3000);

// setInterval(() => {
  
// }, 1000)

setInterval(() => {
  let showCategoriesOrderBtn = document.querySelectorAll(".cat-order");

  showCategoriesOrderBtn.forEach(btn => {
    btn.onclick = () => {
      let order = btn.parentElement.parentElement.getAttribute("data-order");
      let index = Array.from(document.querySelectorAll(".order")).indexOf(btn.parentElement);
      fetch(`http://127.0.0.1:8000/api/getOrder/${order}`)
        .then(response => {
          return response.json();
        }).then(json => {
          
          let userOrder = document.querySelectorAll(".user-order"); 
          userOrder[index - 1].innerHTML = "";
          userOrder[index - 1].style.display = "block";
          userOrder[index - 1].style.margin = "30px auto 0px";
    
          let allCategories = [];
          let allAmounts = [];
    
          json.forEach(cat => {
            if (allCategories.includes(cat['name'])) {
              allAmounts[allCategories.indexOf(cat['name'])] += cat["amount"];
            } else {
              allCategories.push(cat["name"]);
              allAmounts.push(cat["amount"]);
            }
          });
    
          let h2 = document.createElement("h2");
            h2.textContent = "محتويات الأوردر";
            h2.classList.add("text-xl", "text-blue-600", "mx-auto", "font-extrabold")
            userOrder[index - 1].append(h2);
          allCategories.forEach((cat, idx) => {
            let flex = document.createElement("div");
    
      
            flex.className = "flex justify-between items-center mt-3 bg-blue-50 p-2 rounded-xl";
            let h3 = document.createElement("h3");
            h3.className = "text-blue-500 font-extrabold";
            
            h3.textContent = cat;
            
            let p = document.createElement("p");
            p.className = "text-gray-400 font-extrabold";
    
            p.textContent = allAmounts[idx];
    
            flex.append(h3, p);
            userOrder[index - 1].append(flex);
          })
    
        });
    }
  })
}, 3000);

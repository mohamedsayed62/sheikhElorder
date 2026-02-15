if (document.cookie == "") {
  window.open("index.html", "_self");
}

let amounts = Array.from(document.querySelectorAll("input.amount"));

let prices = Array.from(document.querySelectorAll("input.price"));

let total = Array.from(document.querySelectorAll("input.total"));
let totalPrice = document.querySelector(".total-price");
let paid = document.getElementById("paid");

function calcTotalPrice(e) {
  let idx;
  if (e.target.classList.contains("amount")) {
    idx = amounts.indexOf(e.target);
    total[idx].value = e.target.value * prices[idx].value;
  } else {
    idx = prices.indexOf(e.target);
    total[idx].value = e.target.value * amounts[idx].value;
  }
  
  let res = 0;
  total.forEach((e) => {
    res += Number(e.value)
  })
  
  totalPrice.textContent = `${Number(res)} جنيه`;


  let balance = document.querySelector(".balance");
  balance.textContent = paid.value - parseInt(totalPrice.textContent) + " جنيه";
}

amounts.forEach(amount => {
  amount.addEventListener("input", calcTotalPrice);
})

prices.forEach(price => {
  price.addEventListener("input", calcTotalPrice);
})

paid.oninput = () => {
  let totalPrice = document.querySelector(".total-price");
  let balance = document.querySelector(".balance");
  balance.textContent = paid.value - parseInt(totalPrice.textContent) + " جنيه";
}

let addCatBtn = document.querySelector("button");

addCatBtn.onclick = () => {
  let selCat = document.querySelector(".cat");
  let cat = selCat.cloneNode(true);
  addCatBtn.before(cat);

  amounts = Array.from(document.querySelectorAll("input.amount"));

  prices = Array.from(document.querySelectorAll("input.price"));

  total = Array.from(document.querySelectorAll("input.total"));

  amounts.forEach(amount => {
  amount.addEventListener("input", calcTotalPrice);
})

  prices.forEach(price => {
    price.addEventListener("input", calcTotalPrice);
  })

  amounts.at(-1).value = "";
  prices.at(-1).value = "";
  total.at(-1).value = "";
}

let addOrderBtn = document.querySelector(".add-order");

addOrderBtn.onclick = () => {
  let formData = [];

  
  let names = document.querySelectorAll("input.name");

  
formData["categories"] = [];
  names.forEach((name, index) => {

    let categoryItems = {
      "name": "",
      "price": 0,
      "amount": 0,
      "total_price": 0
    }
    categoryItems["name"] = name.value;
    categoryItems["price"] = prices[index].value;
    categoryItems["amount"] = amounts[index].value;
    categoryItems["total_price"] = total[index].value;

    formData["categories"].push(categoryItems);

  })

  let arrCookie = document.cookie.split(";");
  
  let groupId = arrCookie[0].slice(arrCookie[0].length - 1);
  let boxId = arrCookie[1].slice(arrCookie[1].length - 1);
  let id = JSON.parse(localStorage.getItem("user"))["id"];
  let orderSummary = {
      "group_id": groupId,
      "box_id": boxId,
      "user_id": id,
      "price": 0,
      "baid": 0
  }

  

  orderSummary["price"] = parseInt(totalPrice.textContent);
  orderSummary["baid"] = parseInt(paid.value);

  formData["orders"] = orderSummary;



  fetch("https://sheikhelorderback-production.up.railway.app/api/storeOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData),
    credentials: "include"
    }
  ).then((response) => {
    return window.open("group.html", "_self");
  })
}

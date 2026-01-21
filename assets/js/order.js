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

  
  names.forEach((name, index) => {
    let category = {
      "name": "",
      "price": 0,
      "amount": 0,
      "total_price": 0
    }
    console.log(name.value);
    category["name"] = name.value;
    category["price"] = prices[index].value;
    category["amount"] = amounts[index].value;
    category["total_price"] = total[index].value;
    
    formData.push(category);
  })
  
  let id = JSON.parse(localStorage.getItem("user"))["id"];
  let orderSummary = {
    "user_id": id,
    "price": 0,
    "baid": 0
  }

  

  orderSummary["price"] = parseInt(totalPrice.textContent);
  orderSummary["baid"] = parseInt(paid.value);

  formData.push(orderSummary);



  fetch("https://sheikhelorderback-production.up.railway.app/api/storeOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData),
    credentials: "include"
    }
  )

}

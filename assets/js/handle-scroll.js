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
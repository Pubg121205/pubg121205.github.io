function createFingers(container, count, className) {
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    let div = document.createElement("div");
    div.className = className;
    container.appendChild(div);
  }
}

createFingers(leftHand, 5, "finger");
createFingers(rightHand, 5, "finger");

function start() {
  let a = parseInt(document.getElementById("a").value);
  let b = parseInt(document.getElementById("b").value);

  if (!a || !b) return alert("Nhập số!");

  document.getElementById("feet").innerHTML = "";
  countFingers(a, () => countSecond(b, () => countTotal(a + b)));
}

function countFingers(n, done) {
  let fingers = document.querySelectorAll(".finger");
  let i = 0;

  stepText.innerText = "Đếm số thứ nhất";

  let interval = setInterval(() => {
    fingers[i].classList.add("active");
    countText.innerText = i + 1;
    i++;
    if (i === n) {
      clearInterval(interval);
      setTimeout(done, 800);
    }
  }, 600);
}

function countSecond(n, done) {
  stepText.innerText = "Đếm số thứ hai";
  let fingers = document.querySelectorAll(".finger");
  let used = document.querySelectorAll(".active").length;
  let i = 0;

  createFingers(feet, 10, "toe");
  let toes = document.querySelectorAll(".toe");

  let interval = setInterval(() => {
    if (used < 10) {
      fingers[used].classList.add("active");
      used++;
    } else {
      toes[i].classList.add("active");
      i++;
    }
    countText.innerText = i + used;
    if (i + used === n + used - (used - 10)) {
      clearInterval(interval);
      setTimeout(done, 800);
    }
  }, 600);
}

function countTotal(total) {
  stepText.innerText = "Đếm tổng";
  let all = [...document.querySelectorAll(".finger"), ...document.querySelectorAll(".toe")];
  let i = 0;

  let interval = setInterval(() => {
    all[i].classList.add("active");
    countText.innerText = i + 1;
    i++;
    if (i === total) clearInterval(interval);
  }, 400);
}

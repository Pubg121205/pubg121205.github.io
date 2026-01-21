document.addEventListener("DOMContentLoaded", () => {
  createHands();
});

function createHands() {
  leftHand.innerHTML = "";
  rightHand.innerHTML = "";
  feet.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    leftHand.appendChild(createFinger());
    rightHand.appendChild(createFinger());
  }
}

function createFinger() {
  let d = document.createElement("div");
  d.className = "finger";
  return d;
}

function createToe() {
  let d = document.createElement("div");
  d.className = "toe";
  return d;
}

function start() {
  const a = Number(document.getElementById("a").value);
  const b = Number(document.getElementById("b").value);

  if (!a || !b) {
    alert("Nhập đủ 2 số");
    return;
  }

  resetAll();
  countFirst(a, () => countSecond(b, () => countTotal(a + b)));
}

function resetAll() {
  document.querySelectorAll(".finger,.toe").forEach(e => {
    e.classList.remove("active");
  });
  feet.innerHTML = "";
}

function countFirst(n, done) {
  stepText.innerText = "Đếm số thứ nhất";
  const fingers = document.querySelectorAll(".finger");
  let i = 0;

  const timer = setInterval(() => {
    fingers[i].classList.add("active");
    countText.innerText = i + 1;
    i++;
    if (i === n) {
      clearInterval(timer);
      setTimeout(done, 700);
    }
  }, 600);
}

function countSecond(n, done) {
  stepText.innerText = "Đếm số thứ hai";

  const fingers = document.querySelectorAll(".finger");
  let used = document.querySelectorAll(".finger.active").length;

  // tạo bàn chân
  for (let i = 0; i < 10; i++) feet.appendChild(createToe());
  const toes = document.querySelectorAll(".toe");

  let count = 0;

  const timer = setInterval(() => {
    if (used < 10) {
      fingers[used].classList.add("active");
      used++;
    } else {
      toes[count - (10 - used)].classList.add("active");
    }
    count++;
    countText.innerText = count;

    if (count === n) {
      clearInterval(timer);
      setTimeout(done, 700);
    }
  }, 600);
}

function countTotal(total) {
  stepText.innerText = "Đếm tổng";
  const all = [...document.querySelectorAll(".finger"), ...document.querySelectorAll(".toe")];
  let i = 0;

  const timer = setInterval(() => {
    all[i].classList.add("active");
    countText.innerText = i + 1;
    i++;
    if (i === total) clearInterval(timer);
  }, 400);
}

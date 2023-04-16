const startingMinutes = 5;
let time = startingMinutes * 60;

const countdownEl = document.getElementById("timer");

setInterval(updateCountdown, 1000);

function updateCountdown() {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  seconds = seconds < 10 ? "0" + seconds : seconds;

  countdownEl.innerHTML = `${minutes}:${seconds}`;
  time--;

  if (time < 0) {
    clearInterval(updateCountdown);
    countdownEl.innerHTML = "TIME'S UP!";
  }
}


    /*
      LOADING SCREEN
    */
    const loadingScreen = document.getElementById("loadingScreen");
    const loadingStatus = document.getElementById("loadingStatus");

    const loadingMessages = [
      "Analyzing your wealth...",
      "Checking generosity...",
      "Loading investment opportunity...",
      "Done."
    ];

    let loadingIndex = 0;

    const loadingInterval = setInterval(() => {
      loadingIndex++;

      if (loadingIndex < loadingMessages.length) {
        loadingStatus.style.opacity = "0";

        setTimeout(() => {
          loadingStatus.textContent = loadingMessages[loadingIndex];
          loadingStatus.style.opacity = "1";
        }, 250);
      }

      if (loadingIndex === loadingMessages.length - 1) {
        clearInterval(loadingInterval);

        setTimeout(() => {
          loadingScreen.classList.add("hidden");
        }, 650);
      }
    }, 900);


    /*
      LIVE WEALTH VALUE
      Small variation on every refresh.
    */
    const wealthValue = document.getElementById("wealthValue");
    const wealthNote = document.getElementById("wealthNote");

    const wealthVariations = [
      27.31,
      27.34,
      27.37,
      27.40
    ];

    const randomWealth =
      wealthVariations[
        Math.floor(Math.random() * wealthVariations.length)
      ];

    wealthValue.textContent = `€${randomWealth.toFixed(2)}`;

    if (randomWealth > 27.34) {
      wealthNote.textContent = "Wealth increased. Nobody knows why.";
    } else if (randomWealth < 27.34) {
      wealthNote.textContent = "A minor setback. Blame the market.";
    } else {
      wealthNote.textContent = "Refresh detected. Wealth recalculated.";
    }


   /*
  RANDOM FAKE NOTIFICATIONS
*/

const notification = document.getElementById("notification");
const notificationTitle = document.getElementById("notificationTitle");
const notificationAmount = document.getElementById("notificationAmount");

const fakeNotifications = [
 
{
    title: "🔔 Elon Musk has not responded yet.",
    amount: "Still waiting..."
},
{
    title: "🔔 Warren Buffett viewed your business plan.",
    amount: "No comment."
},
{
    title: "🔔 Jeff Bezos accidentally closed the tab.",
    amount: "Unfortunate."
},
{
    title: "🔔 Forbes is pretending not to notice.",
    amount: "For now."
},
{
    title: "🔔 Someone thought this was a real startup.",
    amount: "Mission accomplished."
},

 {
    title: "🔔 Someone from Germany believed.",
    amount: "+€5"
  },
  {
    title: "🔔 Someone from Romania believed.",
    amount: "+€2"
  },
  {
    title: "🔔 Someone from France found the plan convincing.",
    amount: "+€10"
  },
  {
    title: "🔔 Someone from Italy is financially concerned.",
    amount: "+€5"
  },
  {
    title: "🔔 Someone from Spain joined the wealth initiative.",
    amount: "+€20"
  },
  {
    title: "🔔 Someone from the Netherlands asked no questions.",
    amount: "+€50"
  },
  {
    title: "🔔 Someone from Sweden appreciated the transparency.",
    amount: "+€12"
  },
  {
    title: "🔔 Someone from the United Kingdom clicked the button.",
    amount: "No money yet."
  },
  {
    title: "🔔 Someone from Belgium is watching closely.",
    amount: "+€3"
  },
  {
    title: "🔔 Someone from Austria supported the vision.",
    amount: "+€25"
  },
  {
    title: "🔔 Someone from Poland has entered the chat.",
    amount: "+€7"
  },
  {
    title: "🔔 Someone from Portugal liked the UI.",
    amount: "+€15"
  },
  {
    title: "🔔 Someone from Denmark believes in unreasonable goals.",
    amount: "+€30"
  },
  {
    title: "🔔 Someone from Ireland clicked “Yes, I'll Help”.",
    amount: "Processing..."
  },
  {
    title: "🔔 Someone from Switzerland noticed the financial potential.",
    amount: "+€100"
  },
  {
    title: "🔔 Someone almost donated.",
    amount: "😂"
  },
  {
    title: "🔔 Someone opened the business plan twice.",
    amount: "Suspicious activity."
  },
  {
    title: "🔔 Someone shared this website with a friend.",
    amount: "Potential investor detected."
  },
  {
    title: "🔔 Someone is currently comparing this to a real startup.",
    amount: "Please don't."
  },
  {
    title: "🔔 Someone read the disclaimer.",
    amount: "They cannot be stopped."
  },
  {
    title: "🔔 Someone asked what they get in return.",
    amount: "A beautiful experience."
  },
  {
    title: "🔔 Someone with €5 less is feeling generous.",
    amount: "+€5"
  },
  {
    title: "🔔 A mysterious benefactor appeared.",
    amount: "+€42"
  },
  {
    title: "🔔 A financially irresponsible decision was made.",
    amount: "+€20"
  },
  {
    title: "🔔 Someone's mom recommended this website.",
    amount: "Family support detected."
  },
  {
    title: "🔔 An anonymous believer has arrived.",
    amount: "+€1"
  },
  {
    title: "🔔 Someone donated before reading the business plan.",
    amount: "Bold."
  },
  {
    title: "🔔 Someone from the internet has financial questions.",
    amount: "We have no answers."
  },
  {
    title: "🔔 Someone believes this is a legitimate investment.",
    amount: "We should probably clarify."
  },
  {
    title: "🔔 Someone noticed the Forbes ranking.",
    amount: "↑ 4 positions"
  },
  {
    title: "🔔 Someone is emotionally invested now.",
    amount: "+€0.34"
  },
  {
    title: "🔔 Someone said: “This is actually genius.”",
    amount: "No donation attached."
  },
  {
    title: "🔔 Someone is forwarding this to their rich cousin.",
    amount: "Potentially significant."
  },
  {
    title: "🔔 Someone believes in the 104% success rate.",
    amount: "+€8"
  },
  {
    title: "🔔 Someone came back after laughing.",
    amount: "+€5"
  }
];

let lastNotificationIndex = -1;

function getRandomNotification() {
  let randomIndex;

  do {
    randomIndex = Math.floor(
      Math.random() * fakeNotifications.length
    );
  } while (
    randomIndex === lastNotificationIndex &&
    fakeNotifications.length > 1
  );

  lastNotificationIndex = randomIndex;

  return fakeNotifications[randomIndex];
}

function showNotification() {
  const item = getRandomNotification();

  notificationTitle.textContent = item.title;
  notificationAmount.textContent = item.amount;

  notification.classList.remove("show");

  requestAnimationFrame(() => {
    notification.classList.add("show");
  });

  setTimeout(() => {
    notification.classList.remove("show");
  }, 4500);

  scheduleNextNotification();
}

function scheduleNextNotification() {
  const randomDelay =
    Math.floor(Math.random() * 14000) + 8000;

  setTimeout(showNotification, randomDelay);
}

setTimeout(showNotification, 7000);


    /*
      CALCULATOR
    */
    const peopleSlider = document.getElementById("peopleSlider");
    const donationSlider = document.getElementById("donationSlider");

    const peopleValue = document.getElementById("peopleValue");
    const donationValue = document.getElementById("donationValue");

    const calculatorResult =
      document.getElementById("calculatorResult");

    const calculatorMessage =
      document.getElementById("calculatorMessage");

    function updateCalculator() {
      const people = Number(peopleSlider.value);
      const donation = Number(donationSlider.value);
      const total = people * donation;

      peopleValue.textContent = people.toLocaleString("en-US");
      donationValue.textContent = `€${donation.toLocaleString("en-US")}`;

      calculatorResult.textContent =
        `€${total.toLocaleString("en-US")}`;

      if (total >= 1000000000) {
        calculatorResult.innerHTML =
          "<span>Goal achieved.</span>";

        calculatorMessage.textContent =
          "Financial history has officially been made.";
      } else if (total >= 100000000) {
        calculatorMessage.textContent =
          "We're getting dangerously optimistic.";
      } else if (total >= 1000000) {
        calculatorMessage.textContent =
          "That's enough to start pretending this is a company.";
      } else {
        calculatorMessage.textContent =
          "That's not the goal yet. But it's a start.";
      }
    }

    peopleSlider.addEventListener("input", updateCalculator);
    donationSlider.addEventListener("input", updateCalculator);

    updateCalculator();


    /*
      CURSOR GLOW
    */
    document.addEventListener("mousemove", event => {
      document.documentElement.style.setProperty(
        "--mouse-x",
        `${event.clientX}px`
      );

      document.documentElement.style.setProperty(
        "--mouse-y",
        `${event.clientY}px`
      );
    });


    /*
      SCROLL REVEAL
    */
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    document
      .querySelectorAll(".reveal")
      .forEach(element => observer.observe(element));


    /*
      ACHIEVEMENT SOUND + EASTER EGG
      Audio starts only after a real user interaction.
    */
    const logo = document.getElementById("logo");
    const toast = document.getElementById("toast");

    let logoClicks = 0;
    let resetTimer;

    function playAchievementSound() {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        return;
      }

      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        660,
        audioContext.currentTime
      );

      oscillator.frequency.exponentialRampToValueAtTime(
        990,
        audioContext.currentTime + 0.16
      );

      gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.18,
        audioContext.currentTime + 0.02
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.35
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.35);
    }

    logo.addEventListener("click", () => {
      logoClicks++;
      clearTimeout(resetTimer);

      if (logoClicks === 10) {
        toast.classList.add("show");
        playAchievementSound();

        setTimeout(() => {
          toast.classList.remove("show");
        }, 4500);

        logoClicks = 0;
      } else {
        resetTimer = setTimeout(() => {
          logoClicks = 0;
        }, 1800);
      }
    });

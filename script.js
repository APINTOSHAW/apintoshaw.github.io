
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Substitution alphabet: A -> Q, B -> W, C -> E, etc.
const substitutionAlphabet = "QWERTYUIOPASDFGHJKLZXCVBNM";

// Pigpen-style symbols.
// The reference key displayed to the player uses the same mapping.
const pigpenSymbols = [
  "┌", "┬", "┐", "├", "┼", "┤", "└", "┴", "┘",
  "┌•", "┬•", "┐•", "├•", "┼•", "┤•", "└•", "┴•", "┘•",
  "◸", "◹", "◿", "◺", "◸•", "◹•", "◿•", "◺•"
];

const levels = [
  {
    title: "The Witch's Message",
    type: "Caesar Cipher — Shift 13",
    message: "THE WITCH IS WATCHING",
    instructions:
      "The witch left a message in a Caesar cipher. Reverse the 13-letter shift to discover your next clue."
  },
  {
    title: "The Cursed Alphabet",
    type: "Substitution Cipher",
    message: "ENCHANT THE CANDY",
    instructions:
      "A ghost has replaced every letter using a secret alphabet. Use the reference key to decode the message.",
    showSubstitutionKey: false
  },
  {
    title: "The Digital Séance",
    type: "Binary to ASCII",
    message: "THE GHOST SPEAKS IN BINARY",
    instructions:
      "The ghost has turned its message into binary. Each group of eight bits represents one character."
  },
  {
    title: "The Pumpkin's Seal",
    type: "Pigpen Cipher",
    message: "HALLOWEEN IS FULL OF MYSTERY",
    instructions:
      "The pumpkin's seal uses a Pigpen-style cipher. Match the symbols to the alphabet in the reference key.",
    showPigpenKey: false
  },
  {
    title: "The Final Secret",
    type: "Image Metadata",
    message: "PUMPKIN KING",
    instructions:
      "You have reached the final mystery.",
    finalImage: true
  }
];

let currentLevel = 0;
let completed = false;

// ---------- CIPHER FUNCTIONS ----------

// Caesar cipher: a shift of 13 is also known as ROT13.
function caesarEncrypt(message, shift = 13) {
  return message.toUpperCase().split("").map(char => {
    const index = alphabet.indexOf(char);

    if (index === -1) return char;

    return alphabet[(index + shift) % 26];
  }).join("");
}

function substitutionEncrypt(message) {
  return message.toUpperCase().split("").map(char => {
    const index = alphabet.indexOf(char);

    if (index === -1) return char;

    return substitutionAlphabet[index];
  }).join("");
}

// Convert each character into an 8-bit ASCII binary string.
function binaryEncrypt(message) {
  return message.split("").map(char => {
    return char.charCodeAt(0).toString(2).padStart(8, "0");
  }).join(" ");
}

// Convert a message into Pigpen-style symbols.
function pigpenEncrypt(message) {
  return message.toUpperCase().split("").map(char => {
    const index = alphabet.indexOf(char);

    if (index === -1) return char;

    return pigpenSymbols[index];
  }).join(" ");
}

function normalizeAnswer(answer) {
  return answer.trim().toUpperCase().replace(/\s+/g, " ");
}

function encryptMessage(level) {
  if (level.type.startsWith("Caesar")) {
    return caesarEncrypt(level.message, 13);
  }

  if (level.type.startsWith("Substitution")) {
    return substitutionEncrypt(level.message);
  }

  if (level.type.startsWith("Binary")) {
    return binaryEncrypt(level.message);
  }

  if (level.type.startsWith("Pigpen")) {
    return pigpenEncrypt(level.message);
  }

  return "LOOK BEYOND THE PICTURE";
}

// ---------- REFERENCE KEYS ----------

function createReferenceKey() {
  const container = document.getElementById("reference");
  const level = levels[currentLevel];

  container.innerHTML = "";
  container.classList.add("hidden");

  if (level.showSubstitutionKey) {
    container.classList.remove("hidden");

    container.innerHTML = `
      <p class="reference-title">SUBSTITUTION ALPHABET</p>
      <p>Original: &nbsp; ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
      <p>Secret: &nbsp;&nbsp; ${substitutionAlphabet}</p>
    `;
  }

  if (level.showPigpenKey) {
    container.classList.remove("hidden");

    const title = document.createElement("p");
    title.className = "reference-title";
    title.textContent = "PIGPEN REFERENCE KEY";
    container.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "reference-grid";

    alphabet.split("").forEach((letter, index) => {
      const cell = document.createElement("div");
      cell.className = "key-cell";

      const symbol = document.createElement("span");
      symbol.className = "key-symbol";
      symbol.textContent = pigpenSymbols[index];

      const label = document.createElement("span");
      label.textContent = letter;

      cell.append(symbol, label);
      grid.appendChild(cell);
    });

    container.appendChild(grid);
  }
}

// ---------- FINAL IMAGE WITH METADATA ----------

function createFinalImage() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="600" height="400" viewBox="0 0 600 400">
      <metadata>
        Halloween Mystery Clue.
        Secret answer: PUMPKIN KING.
      </metadata>

      <rect width="600" height="400" fill="#100b18"/>
      <circle cx="480" cy="80" r="48" fill="#ffdc91"/>

      <g fill="#100b18">
        <path d="M430 80 L450 65 L460 85 Z"/>
        <path d="M475 65 L495 65 L485 85 Z"/>
      </g>

      <g fill="#1b1027">
        <path d="M0 300 L90 190 L180 300 Z"/>
        <path d="M120 300 L260 160 L390 300 Z"/>
        <path d="M330 300 L470 180 L600 300 Z"/>
      </g>

      <g transform="translate(300 250)">
        <ellipse rx="83" ry="65" fill="#ff7b18"/>
        <ellipse rx="52" ry="65" fill="#e96710"/>
        <rect x="-9" y="-85" width="18" height="25" rx="4"
              fill="#658346"/>
        <path d="M-40 -10 L-20 12 L-2 -10 Z" fill="#100b18"/>
        <path d="M10 -10 L30 12 L48 -10 Z" fill="#100b18"/>
        <path d="M-35 25 Q0 55 35 25 Z" fill="#100b18"/>
      </g>

      <text x="300" y="370" text-anchor="middle"
            font-family="monospace" font-size="19"
            fill="#ff7b18">SOME SECRETS ARE HIDDEN</text>
    </svg>
  `;

  const blob = new Blob([svg], {
    type: "image/svg+xml"
  });

  const url = URL.createObjectURL(blob);

  document.getElementById("finalImage").src = url;
  document.getElementById("downloadImage").href = url;
}

// ---------- LEVEL DISPLAY ----------

function loadLevel() {
  const level = levels[currentLevel];

  completed = false;

  document.getElementById("levelLabel").textContent =
    `CHALLENGE ${currentLevel + 1}`;

  document.getElementById("progressLabel").textContent =
    `${currentLevel + 1} / ${levels.length}`;

  document.getElementById("progressBar").style.width =
    `${((currentLevel + 1) / levels.length) * 100}%`;


  document.getElementById("levelTitle").textContent =
    level.title;


  document.getElementById("encryptedMessage").textContent =
    encryptMessage(level);

  document.getElementById("answerInput").value = "";
  document.getElementById("answerInput").disabled = false;

  document.getElementById("submitButton").disabled = false;
  document.getElementById("submitButton").textContent =
    "CHECK ANSWER";

  document.getElementById("feedback").textContent = "";

  document.getElementById("imageArea").classList.toggle(
    "hidden",
    !level.finalImage
  );

  createReferenceKey();

  if (level.finalImage) {
    createFinalImage();
  }

  document.getElementById("answerInput").focus();
}

// ---------- ANSWER CHECKING ----------

document.getElementById("answerForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    if (completed) {
      advanceLevel();
      return;
    }

    const answer = normalizeAnswer(
      document.getElementById("answerInput").value
    );

    const correctAnswer = normalizeAnswer(
      levels[currentLevel].message
    );

    const feedback = document.getElementById("feedback");

    if (answer === correctAnswer) {
      completed = true;

      feedback.textContent =
        "🎃 CORRECT! THE SPELL IS BROKEN.";

      feedback.style.color = "#ff9d4e";

      document.getElementById("answerInput").disabled = true;

      document.getElementById("submitButton").textContent =
        currentLevel === levels.length - 1
          ? "CLAIM YOUR VICTORY"
          : "UNLOCK NEXT LEVEL";
    } else {
      feedback.textContent =
        "👻 NOT QUITE. THE MYSTERY REMAINS.";

      feedback.style.color = "#ff7777";
    }
  }
);


// ---------- PROGRESSION AND VICTORY ----------

function advanceLevel() {
  if (!completed) return;

  if (currentLevel < levels.length - 1) {
    currentLevel++;
    loadLevel();
  } else {
    showVictoryScreen();
  }
}

function showVictoryScreen() {
  document.querySelector(".game").innerHTML = `
    <header class="header">
      <p class="eyebrow">THE CURSE IS BROKEN</p>
      <h1>MYSTERY SOLVED 🎃</h1>
      <p class="subtitle">
        You survived all five Halloween cipher challenges!
      </p>
    </header>

    <section class="puzzle">
      <h2>MASTER CODEBREAKER</h2>
      <p>
        You defeated the witch's cipher, uncovered the cursed alphabet,
        translated the binary, decoded the Pigpen symbols, and discovered
        the final secret. Bring Mr. Pinto-Shaw your chromebook still on this page to claim your prize!
      </p>
    </section>
  `;

}

// Begin!
loadLevel();

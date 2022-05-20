// Elements
const viewElement = document.getElementById("view") as HTMLElement;
const resultElement = document.getElementById("result-text") as HTMLDivElement;
const statusElement = document.getElementById("status") as HTMLDivElement;
const startButton = document.getElementById("start") as HTMLButtonElement;
const settingsElement = {
  label: {
    fontSize: document.getElementById(
      "control__settings--font-size"
    ) as HTMLSpanElement,
    textWidth: document.getElementById(
      "control__settings--text-width"
    ) as HTMLSpanElement,
  },
  fontSizeButtons: document.querySelectorAll(
    ".control__settings--font-size-button"
  ) as NodeListOf<HTMLButtonElement>,
  fontWeight: document.getElementById(
    "control__settings--font-weight"
  ) as HTMLSelectElement,
  fontStyle: document.getElementById(
    "control__settings--font-style"
  ) as HTMLSelectElement,
  textStyle: document.getElementById(
    "control__settings--text-style"
  ) as HTMLSelectElement,
  textWidth: document.getElementById(
    "control__settings--text-width-input"
  ) as HTMLInputElement,
  language: document.getElementById(
    "control__settings--language"
  ) as HTMLSelectElement,
};

// Properties
let fontSize: number = 1;

// Flags
let speechFlag: boolean = false;

function setFontSize(size: number): void {
  if (size === 0) {
    fontSize = 1;
  }
  fontSize += size;
  resultElement.style.fontSize = fontSize + "rem";
  settingsElement.label.fontSize.innerHTML = fontSize.toString();
}

function setFontWeight(weight: string): void {
  resultElement.style.fontWeight = weight;
}

function setFontStyle(style: string): void {
  resultElement.style.fontStyle = style;
}

function setTextStyle(style: string): void {
  // remove all classes from classList
  resultElement.classList.remove(...resultElement.classList);
  resultElement.classList.add(`message__style--${style}`);
}

function setTextWidth(width: string): void {
  resultElement.style.width = `${width}px`;
  settingsElement.label.textWidth.innerHTML = width;
}

const SpeechRecognition =
  (window as any).speechRecognition || (window as any).webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "ja-JP";

function main(): void {
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onsoundstart = (e: any) => {
    statusElement.innerHTML = "Listening...";
  };

  recognition.onnomatch = (e: any) => {
    statusElement.innerHTML = "Try again";
  };

  recognition.onerror = (e: any) => {
    statusElement.innerHTML = "Error!! Retrying...";
    if (!speechFlag) {
      main();
    }
  };

  recognition.onsoundend = (e: any) => {
    statusElement.innerHTML = "Paused";
    main();
  };

  recognition.onresult = (e: any) => {
    let results = e.results;
    for (let i = e.resultIndex; i < results.length; i++) {
      if (results[i].isFinal) {
        resultElement.innerHTML = results[i][0].transcript;
        main();
      } else {
        resultElement.innerHTML = results[i][0].transcript;
        speechFlag = true;
      }
    }
    viewElement.scrollTop = viewElement.scrollHeight;
  };
  speechFlag = false;
  recognition.start();
}

startButton.addEventListener("click", () => {
  main();
  startButton.disabled = true;
  settingsElement.language.disabled = true;
  resultElement.innerHTML = "";
});

settingsElement.fontSizeButtons.forEach((element: HTMLButtonElement) => {
  element.addEventListener("click", () => {
    setFontSize(Number(element.dataset.size));
  });
});

settingsElement.fontWeight.addEventListener("change", (e: any) => {
  setFontWeight(e.target.value);
});

settingsElement.fontStyle.addEventListener("change", (e: any) => {
  setFontStyle(e.target.value);
});

settingsElement.textStyle.addEventListener("change", (e: any) => {
  setTextStyle(e.target.value);
});

settingsElement.textWidth.addEventListener("input", (e: any) => {
  setTextWidth(e.target.value);
});

settingsElement.language.addEventListener("change", (e: any) => {
  recognition.lang = e.target.value;
});

window.addEventListener("keydown", (e: any) => {
  if (e.key === "f") {
    viewElement.style.height = "100vh";
  }
  if (e.key === "Escape") {
    viewElement.style.height = "";
  }
  if (e.key === "c") {
    if (viewElement.style.visibility === "hidden") {
      viewElement.style.visibility = "visible";
    } else {
      viewElement.style.visibility = "hidden";
    }
  }
});

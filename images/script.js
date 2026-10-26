(() => {
  "use strict";

  // Захист від випадкового повторного підключення файлу.
  if (window.murInitialized) return;
  window.murInitialized = true;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  /* Зміна теми */

  const themeButton = document.querySelector("[data-theme-toggle]");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("mur-theme");
  } catch {
    // Сайт працює і без доступу до localStorage.
  }

  let manualTheme = savedTheme === "dark" || savedTheme === "light";

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    if (themeButton) {
      const isDark = theme === "dark";

      themeButton.textContent = isDark
        ? "☀ Світла тема"
        : "☾ Темна тема";

      themeButton.setAttribute("aria-pressed", String(isDark));
      themeButton.setAttribute(
        "aria-label",
        isDark ? "Увімкнути світлу тему" : "Увімкнути темну тему"
      );
    }
  }

  applyTheme(
    manualTheme
      ? savedTheme
      : systemTheme.matches
        ? "dark"
        : "light"
  );

  themeButton?.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark"
        ? "light"
        : "dark";

    manualTheme = true;
    applyTheme(nextTheme);

    try {
      localStorage.setItem("mur-theme", nextTheme);
    } catch {
      // Тема залишається активною на поточній сторінці.
    }
  });

  systemTheme.addEventListener("change", (event) => {
    if (!manualTheme) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });

  /* Лапки та сердечка */

  function createParticles(element, symbol = "🐾", event = null) {
    if (reducedMotion.matches) return;
    if (typeof Element.prototype.animate !== "function") return;

    const rect = element.getBoundingClientRect();

    const x =
      event && event.detail > 0
        ? event.clientX
        : rect.left + rect.width / 2;

    const y =
      event && event.detail > 0
        ? event.clientY
        : rect.top + rect.height / 2;

    for (let i = 0; i < 5; i += 1) {
      if (document.querySelectorAll(".effect-particle").length >= 25) {
        break;
      }

      const particle = document.createElement("span");
      particle.className = "effect-particle";
      particle.textContent = symbol;
      particle.setAttribute("aria-hidden", "true");
      document.body.append(particle);

      const dx = (Math.random() - 0.5) * 150;
      const dy = -65 - Math.random() * 85;
      const rotation = (Math.random() - 0.5) * 80;

      const animation = particle.animate(
        [
          {
            transform: `translate(${x}px, ${y}px) scale(0.5)`,
            opacity: 1
          },
          {
            transform:
              `translate(${x + dx}px, ${y + dy}px) ` +
              `rotate(${rotation}deg) scale(1.2)`,
            opacity: 0
          }
        ],
        {
          duration: 850,
          easing: "cubic-bezier(0.2, 0.6, 0.3, 1)"
        }
      );

      animation.onfinish = () => particle.remove();
      animation.oncancel = () => particle.remove();
    }
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const control = event.target.closest(
      ".button, .menu-link, .theme-toggle, .footer-top"
    );

    if (!control || control.hasAttribute("data-pet")) return;

    createParticles(control, "🐾", event);
  });

  /* Дані вигаданих персонажів */

  const cats = {
    murko: {
      name: "Мурко",
      story:
        "Щоранку Мурко обходить кімнату й перевіряє, " +
        "чи всі пледи лежать достатньо зручно. " +
        "Після цього він знаходить сонячну пляму на підвіконні " +
        "та влаштовує довгу перерву. У нашій вигаданій історії " +
        "Мурко нагадує: іноді найкращий план — спокійний вечір " +
        "поруч із тим, кому довіряєш.",
      messages: [
        "Мурко примружився: «Мур-р-р…» ♡",
        "Плед, тепло й трішки уваги — чудовий день!",
        "Мурко задоволено вмостився поруч."
      ],
      result:
        "Тобі близький Мурко! Ти цінуєш затишок, " +
        "спокійні вечори й теплу компанію."
    },

    hmarka: {
      name: "Хмарка",
      story:
        "Хмарка любить спостерігати за світом із тихого куточка. " +
        "Спочатку вона уважно вивчає нову компанію, " +
        "а потім сама обирає момент для знайомства. " +
        "Її маленька вигадана історія — про довіру, " +
        "яку не потрібно квапити. Достатньо залишити поруч " +
        "вільне місце та дати дружбі початися у власному темпі.",
      messages: [
        "Хмарка тихенько муркоче поруч ♡",
        "Хмарка рада твоїй делікатності.",
        "Трохи тиші, трохи довіри — і ви вже друзі."
      ],
      result:
        "Тобі близька Хмарка! Ти любиш спостерігати, " +
        "помічати деталі та знайомитися без поспіху."
    },

    iskra: {
      name: "Іскра",
      story:
        "Для Іскри звичайна коробка — ціла експедиція. " +
        "Вона першою помічає нову іграшку й завжди знаходить " +
        "привід для маленької пригоди. А коли день стає " +
        "надто насиченим, із задоволенням засинає. " +
        "У нашому вигаданому світі Іскра нагадує, " +
        "що цікавість і відпочинок чудово доповнюють одне одного.",
      messages: [
        "Іскра передає тобі пухнасте сердечко ♡",
        "Іскра готова до наступної маленької пригоди!",
        "Мур-р! А тепер можна трішки відпочити."
      ],
      result:
        "Тобі близька Іскра! Ти любиш нові враження, " +
        "маленькі пригоди та цікаві заняття."
    }
  };

  /* Погладити котика */

  const petCounts = new Map();
  const imageAnimations = new WeakMap();

  document.querySelectorAll("[data-pet]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const key = button.dataset.pet;
      const cat = cats[key];
      const card = button.closest(".profile");

      if (!cat || !card) return;

      const message = card.querySelector(".pet-message");
      const picture = card.querySelector("img");
      const count = petCounts.get(key) || 0;

      if (message) {
        message.textContent = cat.messages[count % cat.messages.length];
      }

      petCounts.set(key, count + 1);
      createParticles(button, "♡", event);

      if (
        picture &&
        !reducedMotion.matches &&
        typeof picture.animate === "function"
      ) {
        imageAnimations.get(picture)?.cancel();

        const animation = picture.animate(
          [
            { transform: "rotate(0deg) scale(1)" },
            { transform: "rotate(-2deg) scale(1.025)" },
            { transform: "rotate(2deg) scale(1.025)" },
            { transform: "rotate(0deg) scale(1)" }
          ],
          { duration: 500, easing: "ease-in-out" }
        );

        imageAnimations.set(picture, animation);
      }
    });
  });

  /* Історія котика */

  const dialog = document.querySelector("#story-dialog");

  if (dialog) {
    const title = dialog.querySelector("#story-title");
    const text = dialog.querySelector("#story-text");
    const image = dialog.querySelector("#story-image");
    const closeButton = dialog.querySelector("[data-dialog-close]");

    let opener = null;

    document.querySelectorAll("[data-story]").forEach((button) => {
      button.addEventListener("click", () => {
        const cat = cats[button.dataset.story];
        const sourceImage = button.closest(".profile")?.querySelector("img");

        if (!cat || !title || !text || !image) return;

        opener = button;
        title.textContent = `Історія: ${cat.name}`;
        text.textContent = cat.story;

        if (sourceImage) {
          image.src = sourceImage.src;
          image.alt = sourceImage.alt;
          image.hidden = false;
        } else {
          image.hidden = true;
        }

        if (!dialog.open) {
          dialog.showModal();
          document.body.classList.add("modal-open");
          closeButton?.focus();
        }
      });
    });

    closeButton?.addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const outside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

      if (outside) dialog.close();
    });

    dialog.addEventListener("close", () => {
      document.body.classList.remove("modal-open");
      opener?.focus();
    });
  }

  /* Розважальний тест */

  const quizForm = document.querySelector("#cat-quiz");
  const quizResult = document.querySelector("#quiz-result");

  if (quizForm && quizResult) {
    quizForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!quizForm.reportValidity()) return;

      const data = new FormData(quizForm);
      const score = { murko: 0, hmarka: 0, iskra: 0 };

      ["evening", "place", "mood"].forEach((name) => {
        const value = data.get(name);

        if (Object.prototype.hasOwnProperty.call(score, value)) {
          score[value] += 1;
        }
      });

      const bestScore = Math.max(...Object.values(score));
      const winners = Object.keys(score).filter(
        (key) => score[key] === bestScore
      );

      const title = document.createElement("h3");
      const description = document.createElement("p");

      if (winners.length === 1) {
        const cat = cats[winners[0]];
        title.textContent = `Твій котячий настрій — ${cat.name} 🐾`;
        description.textContent = cat.result;
      } else {
        title.textContent = "У тобі є трішки від кожного котика 🐾";
        description.textContent =
          "Ти поєднуєш любов до затишку, уважність " +
          "і цікавість до нового. Сьогодні можна бути різною!";
      }

      quizResult.replaceChildren(title, description);
      quizResult.hidden = false;
      quizResult.focus({ preventScroll: true });

      quizResult.scrollIntoView({
        behavior: reducedMotion.matches ? "instant" : "smooth",
        block: "nearest"
      });
    });

    quizForm.addEventListener("reset", () => {
      quizResult.hidden = true;
      quizResult.replaceChildren();

      requestAnimationFrame(() => {
        quizForm.querySelector("input")?.focus();
      });
    });
  }
})();
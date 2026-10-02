const form = document.querySelector("#rsvp-form");
    const formMessage = document.querySelector("#form-message");
const submissionKey = "konstantin-anastasia-rsvp-submitted";
const guestQuestionnaire = document.querySelector("#guest-questionnaire");
const companionsRow = document.querySelector("#companions-row");
const companionCount = document.querySelector("#companion-count");
const companionList = document.querySelector("#companion-list");
const alcoholOtherToggle = document.querySelector("#alcohol-other-toggle");
const alcoholOtherRow = document.querySelector("#alcohol-other-row");
const alcoholOtherField = document.querySelector("#alcohol-other");
const submittedMessage = "Анкета отмечена как заполненная на этом устройстве. Ответы не отправлены организаторам: способ отправки не настроен.";

const lockForm = () => {
  form.querySelectorAll("input, select, textarea, button").forEach((control) => {
    control.disabled = true;
  });
  formMessage.textContent = submittedMessage;
};

if (localStorage.getItem(submissionKey) === "true") lockForm();

const updateCompanionFields = () => {
  const count = Number(companionCount.value);
  const existingFields = [...companionList.querySelectorAll(".companion-entry")];
  companionList.replaceChildren();
  companionList.hidden = count === 0;

  for (let index = 0; index < count; index += 1) {
    const entry = document.createElement("div");
    const nameLabel = document.createElement("label");
    const nameCaption = document.createElement("span");
    const nameInput = document.createElement("input");
    const typeLabel = document.createElement("label");
    const typeCaption = document.createElement("span");
    const typeSelect = document.createElement("select");

    entry.className = "companion-entry";
    nameCaption.className = "microcopy";
    nameCaption.textContent = `Гость ${index + 1} — имя и фамилия`;
    nameInput.className = "field-input";
    nameInput.name = "companionNames[]";
    nameInput.autocomplete = "off";
    nameInput.required = true;
    nameInput.value = existingFields[index]?.querySelector(".field-input")?.value || "";
    nameLabel.append(nameCaption, nameInput);

    typeCaption.className = "microcopy";
    typeCaption.textContent = "Кто придёт?";
    typeSelect.className = "field-select";
    typeSelect.name = "companionTypes[]";
    typeSelect.add(new Option("Взрослый", "adult"));
    typeSelect.add(new Option("Ребёнок", "child"));
    typeSelect.value = existingFields[index]?.querySelector(".field-select")?.value || "adult";
    typeLabel.append(typeCaption, typeSelect);

    entry.append(nameLabel, typeLabel);
    companionList.append(entry);
  }
};

form.addEventListener("change", (event) => {
  if (event.target.name === "attendance") {
    const attending = event.target.value === "yes";
    guestQuestionnaire.hidden = !attending;
    guestQuestionnaire.disabled = !attending;
    companionsRow.hidden = !attending;
    if (!attending) companionCount.value = "0";
    updateCompanionFields();
  }

  if (event.target === companionCount) updateCompanionFields();

  if (event.target === alcoholOtherToggle) {
    alcoholOtherRow.hidden = !alcoholOtherToggle.checked;
    alcoholOtherField.required = alcoholOtherToggle.checked;
    if (!alcoholOtherToggle.checked) alcoholOtherField.value = "";
  }
});

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      localStorage.setItem(submissionKey, "true");
      lockForm();
    });

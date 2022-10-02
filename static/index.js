function calcWithAddons (initialPrice) {
    let cost = initialPrice;
    let e_amount = document.querySelector("#calculator__amount");
    let amount = parseInt(e_amount.value);
    const e_checkedInputs = document.querySelectorAll("#calculatorForm input:checked");
    e_checkedInputs.forEach((e_checkedInput) => {
        cost += parseInt(e_checkedInput.dataset.price);
    });
    return cost * amount;
}

function renderFinalCost(meal) {
    const e_finalCost = document.querySelector("#calculator__finalCost");
    e_finalCost.value = calcWithAddons(meal.price);
}

function renderRadios(radios) {
    let str = "";

    if (radios) {
        for (const [radioGroupName, radioGroup] of Object.entries(radios)) {
            str += `<label class="form-label">${radioGroup.description}</label>`;
            for (const [radioName, radio] of Object.entries(radioGroup.choices)) {
                radioInputId = `calculator__${radioGroupName}_${radioName}`;
                str += `
                    <div class="form-check">
                        <input class="form-check-input"
                               type="radio" 
                               name="${radioGroupName}" 
                               id="${radioInputId}"
                               value="${radioName}"
                               data-price="${radio.price}"
                               ${radioGroup.required && "required"}
                               ${radioGroup.default === radioName && "checked"}
                        >
                        <label class="form-check-label" for="${radioInputId}">
                            ${radio.description} - ${radio.price} руб.
                        </label>
                    </div>
                `;
            }
        }
    }

    return str;
}

function renderCheckboxes(checkboxes) {
    let str = "";
    for (const [checkboxName, checkbox] of Object.entries(checkboxes)) {
        const checkboxInputId = `calculator__${checkboxName}`;
        str += `
            <div class="form-check">
                <input class="form-check-input"
                       type="checkbox"
                       name="${checkboxName}"
                       id="${checkboxInputId}"
                       value="${checkboxName}"
                       data-price="${checkbox.price}"
                >
                <label class="form-check-label" for="${checkboxInputId}">
                    ${checkbox.description} - ${checkbox.price} руб.
                </label>
            </div>
        `;
    }
    return str;
}

function renderCheckboxBlock(checkboxes) {
    let str = "";
    if (checkboxes) {
        str += `
            <div class="mb-3">
                <label class="form-label">Добавить</label>
                ${renderCheckboxes(checkboxes)}
            </div>
        `;
    }
    return str;
}

function renderForm(meal) {
    document.querySelector("#calculator__finalCost").value = meal.price;
    document.querySelector("#calculator__radios").innerHTML = renderRadios(meal.radios);
    document.querySelector("#calculator__checkboxes").innerHTML = renderCheckboxBlock(meal.checkboxes);

    document.querySelectorAll("#calculator__radios input, #calculator__checkboxes input, #calculator__amount").forEach((input) => {
        input.addEventListener("change", () => renderFinalCost(meal));
    });
}

document.addEventListener("DOMContentLoaded", async () => {

    const e_mealTypeSelector = document.querySelector("#calculator__meal");

    const menu = await (await fetch("/menu.json")).json();

    for (const [mealType, meal] of Object.entries(menu)) {
        e_mealTypeSelector.innerHTML += `<option value="${mealType}">${meal.description} - ${meal.price} руб.</option>`
    }

    renderForm(menu[e_mealTypeSelector.value]);
    e_mealTypeSelector.addEventListener("change", () => {
        renderForm(menu[e_mealTypeSelector.value]);
    });

});

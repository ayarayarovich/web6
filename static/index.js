function calcWithAddons (initialPrice) {
    let cost = initialPrice
    let e_amount = document.querySelector("#calculator__amount")

    const parsedAmount = Number(e_amount.value)
    let amount = Math.max((Number.isInteger(parsedAmount) && parsedAmount) || 0, 0)
    const e_checkedInputs = document.querySelectorAll("#calculatorForm input:checked")
    e_checkedInputs.forEach((e_checkedInput) => {
        cost += Number(e_checkedInput.dataset.price)
    })
    return cost * amount
}

function renderFinalCost(meal) {
    const e_finalCost = document.querySelector("#calculator__finalCost")
    e_finalCost.innerHTML = calcWithAddons(meal.price)
}

function renderRadios(radios) {
    let str = ""

    if (radios) {
        for (const [radioGroupName, radioGroup] of Object.entries(radios)) {
            str += `<label class="form-label">${radioGroup.description}</label>`
            for (const [radioName, radio] of Object.entries(radioGroup.choices)) {
                radioInputId = `calculator__${radioGroupName}_${radioName}`
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
                `
            }
        }
    }

    return str
}

function renderCheckboxes(checkboxes) {
    let str = ""
    for (const [checkboxName, checkbox] of Object.entries(checkboxes)) {
        const checkboxInputId = `calculator__${checkboxName}`
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
        `
    }
    return str
}

function renderCheckboxBlock(checkboxes) {
    let str = ""
    if (checkboxes) {
        str += `
            <div class="mb-3">
                <label class="form-label">Добавить</label>
                ${renderCheckboxes(checkboxes)}
            </div>
        `
    }
    return str
}

function renderForm(meal) {
    return new Promise((resolve, reject) => {
        document.querySelector("#calculator__amount").value = 1
        document.querySelector("#calculator__radios").innerHTML = renderRadios(meal.radios)
        document.querySelector("#calculator__checkboxes").innerHTML = renderCheckboxBlock(meal.checkboxes)
        renderFinalCost(meal)

        const onInputsUpdate = () => renderFinalCost(meal)

        document.querySelectorAll("#calculator__radios input, #calculator__checkboxes input").forEach((input) => {
            input.addEventListener("change", onInputsUpdate)
        })
        document.querySelector("#calculator__amount").addEventListener("input", onInputsUpdate)

        resolve()
    })
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = src
        image.addEventListener('load', () => resolve(image.src))
        image.addEventListener('error', reject)
    })
}

document.addEventListener("DOMContentLoaded", async () => {

    const e_mealTypeSelector = document.querySelector("#calculator__meal")
    const e_bgCanvas = document.querySelector("#bg-canvas")

    const menu = await fetch("/menu.json").then(res => res.json())

    for (const [mealType, meal] of Object.entries(menu)) {
        e_mealTypeSelector.innerHTML += `<option value="${mealType}">${meal.description} - ${meal.price} руб.</option>`
    }

    renderForm(menu[e_mealTypeSelector.value]).then(() => {
        const card = document.querySelector("#card")
        card.classList.add("opacity-100")
    })

    setTimeout(() => {
        document.querySelector("#card").classList.add("vanishIn")
    }, 1000)


    loadImage("https://www.grandactive.ru/UploadedFiles/2021/2021-02/c809089d-ca27-41a0-8a5f-d592a60cedbe.jpg").then(function(src) {
       e_bgCanvas.style.backgroundImage = `url(${src})`
       setTimeout(function() {
           e_bgCanvas.classList.add("opacity-100")
       }, 500)
    })

    e_mealTypeSelector.addEventListener("change", () => {
        renderForm(menu[e_mealTypeSelector.value])
    })

})

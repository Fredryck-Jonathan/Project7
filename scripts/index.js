function buttonDropdown(event) {
    const dropdown_first_part = event.currentTarget;
    const dropdown = dropdown_first_part.parentElement;
    const arrow_path = dropdown_first_part.querySelector('path');
    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        arrow_path.setAttribute('d', "M1 1L7.5 7L14 1");
    } else {
        dropdown.classList.add('active');
        arrow_path.setAttribute('d', "M1 7L7.5 1L14 7");
    }
}

function filterDropdown(event) {
    const input_search = event.currentTarget
    const filter = strNoAccent(input_search.value.toUpperCase());
    const dropdown = input_search.closest('.dropdown');
    const div_element_no_select = dropdown.querySelector('.elements-no-select');
    const all_button_dropdown = div_element_no_select.querySelectorAll('.one-element-dropdown');
    all_button_dropdown.forEach(element => {
        text_value = element.textContent;
        if (strNoAccent(text_value.toUpperCase()).indexOf(filter) > -1) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    });
}

async function getRecipes() {
    try {
        const response = await fetch("../../data/recipes.json")
        const all_recipes = await response.json();
        return all_recipes
    } catch (error) {
        console.log(error)
    }
}

function addButtonSelect(event) {
    const button_event = event.currentTarget;
    const type_button = button_event.getAttribute('data-type-element');
    const div_dropdown_second_part = button_event.closest('.dropdown-second-part');
    const div_elements_select = div_dropdown_second_part.querySelector('.elements-select')
    const button_element_dropdown_selected = document.createElement('button');
    button_element_dropdown_selected.classList.add('one-element-dropdown-selected');
    button_element_dropdown_selected.addEventListener('click', (event) => {
        removeSelectElement(event)
    });
    button_element_dropdown_selected.textContent = button_event.textContent;
    const img_removeButtonDropdown = document.createElement('img');
    img_removeButtonDropdown.setAttribute('src', './assets/icones/closeButtonDropdown.svg');
    button_element_dropdown_selected.appendChild(img_removeButtonDropdown)
    div_elements_select.appendChild(button_element_dropdown_selected);
    const all_filter_selected = document.getElementById('all-filter-selected');
    const button_filter = document.createElement('button');
    button_filter.textContent = button_event.textContent;
    button_filter.classList.add('button-filter');
    button_filter.setAttribute('data-type-element', type_button);
    button_filter.addEventListener('click', (event) => {
        removeFilterSelect(event)
    })
    const icone_close = document.createElement('img');
    icone_close.setAttribute('src', './assets/icones/closeButton.svg');
    button_filter.appendChild(icone_close);
    all_filter_selected.appendChild(button_filter);
    button_event.remove();
    filterFunction()
}

function removeFilterSelect(event) {
    const object_elements_dom = getElementsDom();
    const event_button = event.currentTarget;
    const text_button = event_button.textContent;
    object_elements_dom.all_dropdown_elements_select.forEach(one_div_elements => {
        Array.from(one_div_elements.children).forEach(element => {
            if (strNoAccent(text_button.toUpperCase()) === strNoAccent(element.textContent.toUpperCase())) {
                element.remove()
            }
        })
    })
    event_button.remove();
    filterFunction()
}

function removeSelectElement(event) {
    const object_elements_dom = getElementsDom();
    const event_button = event.currentTarget;
    const text_button = event_button.textContent;
    Array.from(object_elements_dom.all_filter_selected.children).forEach(element => {
        if (strNoAccent(text_button.toUpperCase()) === strNoAccent(element.textContent.toUpperCase())) {
            element.remove()
        }
    })
    event_button.remove();
    filterFunction()
}

async function filterFunction() {
    const all_recipes = await getRecipes();
    let array_all_selected = all_recipes;
    const array_to_show = [];
    const object_elements_dom = getElementsDom();
    const regex = /^[\p{L}\s'\d%]*$/u;
    if (object_elements_dom.all_button_filter_selected.length !== 0) {
        object_elements_dom.all_button_filter_selected.forEach(element => {
            const array_one_selected = filterSelect(element, all_recipes);
            array_all_selected = array_all_selected.filter(element => array_one_selected.includes(element));
        })

        if (!regex.test(object_elements_dom.input_search_main.value)) {
            deleteGallery()
            const message_no_recette = document.createElement('p');
            message_no_recette.classList.add('message-no-recette');
            message_no_recette.textContent = `Votre recherche contient des caractéres interdit.`;
            object_elements_dom.div_gallery_elements.appendChild(message_no_recette);
            object_elements_dom.p_number_recettes.textContent = "0 recette";
        } else {

            if (object_elements_dom.input_search_main.value.length >= 3) {
                const array_search = filterSearch(all_recipes);
                array_search.forEach(element => {
                    if (array_all_selected.includes(element)) {
                        array_to_show.push(element);
                    }
                })
                createArrayToShow(array_to_show);
            } else {
                createArrayToShow(array_all_selected)
            }
        }
    } else if (!regex.test(object_elements_dom.input_search_main.value)) {
            deleteGallery()
            const message_no_recette = document.createElement('p');
            message_no_recette.classList.add('message-no-recette');
            message_no_recette.textContent = `Votre recherche contient des caractéres interdit.`;
            object_elements_dom.div_gallery_elements.appendChild(message_no_recette);
            object_elements_dom.p_number_recettes.textContent = "0 recette";
        } else {
        
            if (object_elements_dom.input_search_main.value.length >= 3) {
                let array_search = filterSearch(all_recipes);
                createArrayToShow(array_search);
            } else {
                createArrayToShow(all_recipes);
            }
    
        }
    
}

function filterSelect(button_select, array_recipes) {
    const type_button = button_select.getAttribute('data-type-element');
    const text_button = strNoAccent(button_select.textContent.toUpperCase());
    const array_selected = []
    if (type_button === "ingredient") { 
        array_recipes.forEach(recipe => { 
            recipe.ingredients.forEach(ingredient => {
                if (strNoAccent(ingredient.ingredient.toUpperCase()).indexOf(text_button) > -1) {
                    array_selected.push(recipe);
                }
            })
        })
        return array_selected
    } else if (type_button === "appareils") {
        array_recipes.forEach(recipe => { 
            if (strNoAccent(recipe.appliance.toUpperCase()).indexOf(text_button) > -1) {
                array_selected.push(recipe);
            }
        })
        return array_selected
    } else if (type_button === "ustensiles") {
        array_recipes.forEach(recipe => { 
            recipe.ustensils.forEach(ustensil => {
                if (strNoAccent(ustensil.toUpperCase()).indexOf(text_button) > -1) {
                    array_selected.push(recipe);
                }
            })
        })
        return array_selected
    }
}

function filterSearch(all_recipes) {
    console.time("filterSearch")
    const object_elements_dom = getElementsDom();
    if (object_elements_dom.input_search_main.value.length < 3) {
        return all_recipes
    } else {
        const text_to_search = strNoAccent(object_elements_dom.input_search_main.value.toUpperCase());
        console.log(text_to_search, object_elements_dom.input_search_main.value)
        const array_to_show =[]
        all_recipes.forEach(recipe => {
            if (strNoAccent(recipe.name.toUpperCase()).indexOf(text_to_search) > -1) {
                array_to_show.push(recipe);
            }else if (strNoAccent(recipe.description.toUpperCase()).indexOf(text_to_search) > -1) {
                array_to_show.push(recipe);
            } else {
                recipe.ingredients.forEach(ingredient => {
                    if (strNoAccent(ingredient.ingredient.toUpperCase()).indexOf(text_to_search) > -1) {
                        array_to_show.push(recipe);
                    }
                })
            }
        });
        console.timeEnd("filterSearch")
        return array_to_show
    }
}

function deleteGallery() {
    const object_elements_dom = getElementsDom()
    if (object_elements_dom.div_gallery_elements.hasChildNodes()) {
        Array.from(object_elements_dom.div_gallery_elements.children).forEach(child => {
            child.remove()
        });
    }
    if (object_elements_dom.dropdown_ustensiles_element_no_select.hasChildNodes()) {
        Array.from(object_elements_dom.dropdown_ustensiles_element_no_select.children).forEach(child => {
            child.remove()
        });
    }
    if (object_elements_dom.dropdown_appareils_element_no_select.hasChildNodes()) {
        Array.from(object_elements_dom.dropdown_appareils_element_no_select.children).forEach(child => {
            child.remove()
        });
    }
    if (object_elements_dom.dropdown_ingredient_element_no_select.hasChildNodes()) {
        Array.from(object_elements_dom.dropdown_ingredient_element_no_select.children).forEach(child => {
            child.remove()
        });
    }
}

function getElementsDom() {
    const div_gallery_elements = document.getElementById('section-gallery-elements');
    const dropdown_ustensiles = document.getElementById('dropdown-ustensiles');
    const dropdown_ustensiles_element_no_select = dropdown_ustensiles.querySelector('.elements-no-select');
    const dropdown_appareils = document.getElementById('dropdown-appareil');
    const dropdown_appareils_element_no_select = dropdown_appareils.querySelector('.elements-no-select');
    const dropdown_ingredients = document.getElementById('dropdown-ingredients');
    const dropdown_ingredient_element_no_select = dropdown_ingredients.querySelector('.elements-no-select');
    const input_search_main = document.getElementById('input-search-main');
    const elements_ingredients_selected = dropdown_ingredients.querySelector('.elements-select');
    const elements_ustensils_selected = dropdown_ustensiles.querySelector('.elements-select');
    const elements_appareils_selected = dropdown_appareils.querySelector('.elements-select');
    const p_number_recettes = document.getElementById('p-number-recettes');
    const all_filter_selected = document.getElementById('all-filter-selected');
    const all_button_filter_selected = all_filter_selected.querySelectorAll('button');
    const all_dropdown_elements_select = document.querySelectorAll('.elements-select');
    object_element = {
        div_gallery_elements: div_gallery_elements,
        dropdown_ustensiles: dropdown_ustensiles,
        dropdown_ustensiles_element_no_select: dropdown_ustensiles_element_no_select,
        dropdown_appareils: dropdown_appareils,
        dropdown_appareils_element_no_select: dropdown_appareils_element_no_select,
        dropdown_ingredients: dropdown_ingredients,
        dropdown_ingredient_element_no_select: dropdown_ingredient_element_no_select,
        input_search_main: input_search_main,
        elements_ingredients_selected: elements_ingredients_selected,
        elements_ustensils_selected: elements_ustensils_selected,
        elements_appareils_selected: elements_appareils_selected,
        p_number_recettes: p_number_recettes,
        all_filter_selected: all_filter_selected,
        all_button_filter_selected: all_button_filter_selected,
        all_dropdown_elements_select: all_dropdown_elements_select,
    }
    return object_element
    
}
function createArrayToShow(arrayToShow) {
    console.time("create-array-test")
    deleteGallery()
    const object_elements_dom = getElementsDom();
    if (arrayToShow.length === 0) {
        const message_no_recette = document.createElement('p');
        message_no_recette.classList.add('message-no-recette');
        message_no_recette.textContent = `Aucune recette ne contient '${object_elements_dom.input_search_main.value}' vous pouvez chercher «
        tarte aux pommes », « poisson », etc.`
        object_elements_dom.div_gallery_elements.appendChild(message_no_recette);
        object_elements_dom.p_number_recettes.textContent = "0 recette";
    } else {
        let all_ingredients = [];
        let all_ustensiles = [];
        let all_appareils = [];
        arrayToShow.forEach(element => {
            element.ingredients.forEach(ingredient => {
                if (!all_ingredients.some(existingIngredient => strNoAccent(existingIngredient.toUpperCase()) === strNoAccent(ingredient.ingredient.toUpperCase()))) {
                    all_ingredients.push(ingredient.ingredient);
                }
            });
            Array.from(object_elements_dom.elements_ingredients_selected.children).forEach(button_selected => {
                all_ingredients = all_ingredients.filter(element => strNoAccent(element.toUpperCase()) !== strNoAccent(button_selected.textContent.toUpperCase()))
            })
            element.ustensils.forEach(ustensil => {
                if (!all_ustensiles.some(existingUstensil => strNoAccent(existingUstensil.toUpperCase()) === strNoAccent(ustensil.toUpperCase()))) {
                    all_ustensiles.push(ustensil);
                }
            });
            Array.from(object_elements_dom.elements_ustensils_selected.children).forEach(button_selected => {
                all_ustensiles = all_ustensiles.filter(element => strNoAccent(element.toUpperCase()) !== strNoAccent(button_selected.textContent.toUpperCase()))
            })
            
            if (!all_appareils.some(existingAppareil => strNoAccent(existingAppareil.toUpperCase()) === strNoAccent(element.appliance.toUpperCase()))) {
                    all_appareils.push(element.appliance);
            }
            Array.from(object_elements_dom.elements_appareils_selected.children).forEach(button_selected => {
                all_appareils = all_appareils.filter(element => strNoAccent(element.toUpperCase()) !== strNoAccent(button_selected.textContent.toUpperCase()))
            })
            renderCard(element , object_elements_dom.div_gallery_elements);
        });
        renderSelect(all_ingredients, object_elements_dom.dropdown_ingredient_element_no_select, "ingredient", arrayToShow);
        renderSelect(all_ustensiles, object_elements_dom.dropdown_ustensiles_element_no_select , "ustensiles", arrayToShow);
        renderSelect(all_appareils, object_elements_dom.dropdown_appareils_element_no_select, "appareils", arrayToShow);
        if (arrayToShow.length > 1) {
            object_elements_dom.p_number_recettes.textContent = arrayToShow.length + " recettes";
        } else {
            object_elements_dom.p_number_recettes.textContent = arrayToShow.length + " recette";
        }
    }
    console.timeEnd("create-array-test")
}

function renderSelect(items, dropdown_element_no_select, type_element, array_to_show) {
    items.forEach(element => {
        const button_select = document.createElement('button');
        button_select.classList.add("one-element-dropdown");
        button_select.setAttribute('data-type-element', type_element);
        button_select.addEventListener('click', addButtonSelect);
        button_select.textContent = element;
        dropdown_element_no_select.appendChild(button_select);
    });
}

function renderCard(element, div_gallery_elements) {
    const div_one_element = document.createElement('div');
    div_one_element.classList.add('one-element-gallery');
    div_gallery_elements.appendChild(div_one_element)
    const div_element_image = document.createElement('div');
    div_element_image.classList.add('div-element-image');
    const image_element = document.createElement('img');
    image_element.classList.add('img-element');
    image_element.setAttribute('src', `./assets/images/recettes/${element.image}`);
    const p_time_element = document.createElement('p');
    p_time_element.classList.add('p-time');
    p_time_element.textContent = element.time + "min";
    div_element_image.appendChild(image_element);
    div_element_image.appendChild(p_time_element);
    div_one_element.appendChild(div_element_image)
    const div_element_information = document.createElement('div');
    div_element_information.classList.add("div-element-information")
    div_one_element.appendChild(div_element_information)
    const title_card = document.createElement('h2');
    title_card.classList.add('title-cards');
    title_card.textContent = element.name;
    div_element_information.appendChild(title_card);
    const div_recette = document.createElement('div');
    div_recette.classList.add('div-recette');
    const p_title_recette = document.createElement('p');
    p_title_recette.classList.add('p-title-recette');
    p_title_recette.textContent = "Recette";
    const p_description_recette = document.createElement('p');
    p_description_recette.classList.add('p-description-recette');
    p_description_recette.textContent = element.description;
    div_recette.appendChild(p_title_recette);
    div_recette.appendChild(p_description_recette);
    div_element_information.appendChild(div_recette);
    const div_ingredients = document.createElement('div');
    div_ingredients.classList.add('div-ingredients');
    div_element_information.appendChild(div_ingredients)
    const p_title_ingredients = document.createElement('p');
    p_title_ingredients.classList.add('p-title-ingredient');
    p_title_ingredients.textContent = 'Ingrédients';
    div_ingredients.appendChild(p_title_ingredients);
    const div_all_ingredients = document.createElement('div');
    div_all_ingredients.classList.add('div-all-ingredients');
    div_ingredients.appendChild( div_all_ingredients);
    element.ingredients.forEach(ingredient => {
        const div_one_ingredient = document.createElement('div');
        div_one_ingredient.classList.add('div-one-ingredient');
        const p_name_ingredient = document.createElement('p');
        p_name_ingredient.classList.add('p-name-ingredient');
        p_name_ingredient.textContent = ingredient.ingredient;
        const p_number_ingredient = document.createElement('p');
        p_number_ingredient.classList.add('p-number-ingredient')
        if (ingredient.unit) {
            p_number_ingredient.textContent = ingredient.quantity + " " + ingredient.unit;
        } else {
            p_number_ingredient.textContent = ingredient.quantity;
        }
        div_one_ingredient.appendChild(p_name_ingredient);
        div_one_ingredient.appendChild(p_number_ingredient);
        div_all_ingredients.appendChild(div_one_ingredient)
    })
}

function strNoAccent(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}


async function init() {
    const all_recipes = await getRecipes();
    createArrayToShow(all_recipes)
}

init()
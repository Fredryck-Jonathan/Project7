function buttonDropdown(event) {

    const dropdown_first_part = event.currentTarget;
    const dropdown = dropdown_first_part.parentElement;
    const dropdown_second_part = dropdown.querySelector('.dropdown-second-part');
    const hauteur_dropdown_seconde_part = dropdown_second_part.offsetHeight;
    const arrow_path = dropdown_first_part.querySelector('path');

    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        arrow_path.setAttribute('d', "M1 1L7.5 7L14 1");
    } else {
        dropdown.classList.add('active');
        arrow_path.setAttribute('d', "M1 7L7.5 1L14 7");
    }

    console.log('bonjour', dropdown_first_part, dropdown, arrow_path)
}

function filterDropdown(event) {

    const input_search = event.currentTarget;
    const filter = input_search.value.toUpperCase();
    const dropdown = input_search.closest('.dropdown');
    const div_element_no_select = dropdown.querySelector('.elements-no-select');
    const all_button_dropdown = div_element_no_select.querySelectorAll('.one-element-dropdown');


    for (let element of all_button_dropdown) {
        const text_value = element.textContent
        if (text_value.toUpperCase().indexOf(filter) > -1) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    }
};



async function getRecipes() {
    try {
        const response = await fetch("../../data/recipes.json")
        const all_recipes = await response.json();
        return all_recipes
    } catch (error) {
        console.log(error)
    }
}


async function init() {
    const all_recipes = await getRecipes();
    createArrayToShow(all_recipes)
}




function addButtonSelect(event) {

    const object_elements_dom = getElementsDom();

    const button_event = event.currentTarget;
    const type_button = button_event.getAttribute('data-type-element');
    const div_dropdown_second_part = button_event.closest('.dropdown-second-part');
    const div_elements_select = div_dropdown_second_part.querySelector('.elements-select')

    console.log('bonjour tu coco', button_event.textContent, div_elements_select);

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
    object_elements_dom.all_filter_selected.appendChild(button_filter);

    button_event.remove();
    filterFunction()
}

function removeFilterSelect(event) {

    const object_elements_dom = getElementsDom();

    const event_button = event.currentTarget;
    const text_button = event_button.textContent;
    for (let one_div_element of object_elements_dom.all_dropdown_elements_select) {
        for (let element of Array.from(one_div_element.children)) {
            if (text_button.toUpperCase() === element.textContent.toUpperCase()) {
                element.remove()
            }
        }
    }
    event_button.remove();
    filterFunction()
}

function removeSelectElement(event) {

    const object_elements_dom = getElementsDom();

    const event_button = event.currentTarget;
    const text_button = event_button.textContent;


    for (let filter_selected of Array.from(object_elements_dom.all_filter_selected.children)) {

        if (text_button.toUpperCase() === filter_selected.textContent.toUpperCase()) {
            filter_selected.remove()
        }

    }

    /* Array.from(all_filter_selected.children).forEach(element => {
        if (text_button.toUpperCase() === element.textContent.toUpperCase()) {
            element.remove()
        }
    })*/
    event_button.remove();
    filterFunction()
}

async function filterFunction() {

    const all_recipes = await getRecipes();
    let array_all_selected = all_recipes;
    const array_to_show = [];

    const object_elements_dom = getElementsDom();
    
    if (object_elements_dom.all_button_filter_selected.length !== 0) {
        for (let button_filter of object_elements_dom.all_button_filter_selected) {
            const array_one_selected = filterSelect(button_filter, all_recipes);
            for (let element of array_all_selected) {
                let existingElement = false;
                for (let one_element_one_selected of array_one_selected) {
                    if (one_element_one_selected === existingElement) {
                        existingElement = true
                        break
                    }
                }
                if (!existingElement) {
                    const index_element = array_all_selected.indexOf(element);
                    array_all_selected.splice(index_element, 1);
                }
                /*if (!array_one_selected.includes(element)) {
                    const index_element = array_all_selected.indexOf(element);
                    array_all_selected.splice(index_element, 1);
                }*/
            }
        }

        if (object_elements_dom.input_search_main.value.length >= 3) {
            const array_search = filterSearch(all_recipes);
            for (let element of array_search) {
                let elementExisting = false
                for (let one_selected of array_all_selected) {
                    if (one_selected === element) {
                        elementExisting = true;
                        break
                    }
                }
                if (elementExisting) {
                    array_to_show.push(element);
                }
                /*if (array_all_selected.includes(element)) {
                    array_to_show.push(element);
                }*/
            }
            createArrayToShow(array_to_show);
        } else {
            console.log(array_all_selected)
            createArrayToShow(array_all_selected)
        }
    } else if (object_elements_dom.input_search_main.value.length >= 3) { 
        let array_search = filterSearch(all_recipes);
        createArrayToShow(array_search);
    } else {
        createArrayToShow(all_recipes);
    }



}


function filterSelect(button_select, array_recipes) {
    const type_button = button_select.getAttribute('data-type-element');
    const text_button = button_select.textContent.toUpperCase();
    console.log(button_select, type_button, text_button);

    const array_selected = []


    if (type_button === "ingredient") { 
        
        for (let recipe of array_recipes) {
            for (let ingredient of recipe.ingredients) {
                if (ingredient.ingredient.toUpperCase().indexOf(text_button) > -1) {
                    array_selected.push(recipe);
                }
            }
        }
        /*array_recipes.forEach(recipe => { 
            recipe.ingredients.forEach(ingredient => {
                if (ingredient.ingredient.toUpperCase().indexOf(text_button) > -1) {
                    array_selected.push(recipe);
                }
            })
        })*/
        return array_selected
    } else if (type_button === "appareils") {
        for (let recipe of array_recipes) {
            if (recipe.appliance.toUpperCase().indexOf(text_button) > -1) {
                array_selected.push(recipe);
            }
        }
        /*array_recipes.forEach(recipe => { 
            if (recipe.appliance.toUpperCase().indexOf(text_button) > -1) {
                array_selected.push(recipe);
            }
        })*/
        return array_selected
    } else {
        for (let recipe of array_recipes) {
            
            for (let ustensil of recipe.ustensils) {
                if (ustensil.toUpperCase().indexOf(text_button) > -1) {
                    array_selected.push(recipe);
                }
            }
        }
        /*array_recipes.forEach(recipe => { 
            recipe.ustensils.forEach(ustensil => {
                if (ustensil.toUpperCase().indexOf(text_button) > -1) {
                    array_selected.push(recipe);
                }
            })
        })*/
        return array_selected
    }
}

function filterSearch(all_recipes) {

    const object_elements_dom = getElementsDom()

    if (object_elements_dom.input_search_main.value.length < 3) {
        return all_recipes
    } else {
        const text_to_search = object_elements_dom.input_search_main.value.toUpperCase();
        const array_to_show =[]
        for(let recipe of all_recipes){
            if (recipe.name.toUpperCase().indexOf(text_to_search) > -1) {
                array_to_show.push(recipe);
            }else if (recipe.description.toUpperCase().indexOf(text_to_search) > -1) {
                array_to_show.push(recipe);
            } else {
                for(let ingredient of recipe.ingredients){
                    if (ingredient.ingredient.toUpperCase().indexOf(text_to_search) > -1) {
                        array_to_show.push(recipe);
                    }
                }
            }
        };
        return array_to_show
    }
};

function deleteGallery() {

    const object_elements_dom = getElementsDom();



    if (object_elements_dom.div_gallery_elements.hasChildNodes()) {
        for (let element_gallery of Array.from(object_elements_dom.div_gallery_elements.children)) {
            element_gallery.remove()
        }
        
        
        /*Array.from(div_gallery_elements.children).forEach(child => {
            child.remove()
        });*/
    }


    if (object_elements_dom.dropdown_ustensiles_element_no_select.hasChildNodes()) {
        for (let element_ustensil of Array.from(object_elements_dom.dropdown_ustensiles_element_no_select.children)) {
            element_ustensil.remove()
        }
        /*Array.from(dropdown_ustensiles_element_no_select.children).forEach(child => {
            child.remove()
        });*/
    }

    if (object_elements_dom.dropdown_appareils_element_no_select.hasChildNodes()) {
        
        for (let element_appareil of Array.from(object_elements_dom.dropdown_appareils_element_no_select.children)) {
            element_appareil.remove()
        }
        
        /*Array.from(dropdown_appareils_element_no_select.children).forEach(child => {
            child.remove()
        });*/
    }

    if (object_elements_dom.dropdown_ingredient_element_no_select.hasChildNodes()) {

        for (let element_ingredient of Array.from(object_elements_dom.dropdown_ingredient_element_no_select.children)) {
            element_ingredient.remove()
        }
        /*Array.from(dropdown_ingredient_element_no_select.children).forEach(child => {
            child.remove()
        });*/
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

    const object_elements_dom = getElementsDom();

    deleteGallery()
    if (arrayToShow.length === 0) {
        const message_no_recette = document.createElement('p');
        message_no_recette.classList.add('message-no-recette');
        message_no_recette.textContent = `Aucune recette ne contient '${object_elements_dom.input_search_main.value}' vous pouvez chercher «
        tarte aux pommes », « poisson », etc.`
        object_elements_dom.div_gallery_elements.appendChild(message_no_recette);
    } else {
        let all_ingredients = [];
        let all_ustensiles = [];
        let all_appareils = [];
        for (let element of arrayToShow) {
            for(let ingredient of element.ingredients){
                let isIngredientExisting = false
                for (let existingIngredient of all_ingredients) {
                    if (existingIngredient.toUpperCase() === ingredient.ingredient.toUpperCase()) {
                        isIngredientExisting = true
                        break
                    }
                }
                if (!isIngredientExisting) {
                    all_ingredients.push(ingredient.ingredient);
                }
                /*if (!all_ingredients.some(existingIngredient => existingIngredient.toUpperCase() === ingredient.ingredient.toUpperCase())) {
                    all_ingredients.push(ingredient.ingredient);
                }*/
            };
            for (let button_selected of Array.from(object_elements_dom.elements_ingredients_selected.children)){
                for (let element of all_ingredients) {
                    if (element.toUpperCase() == button_selected.textContent.toUpperCase()) {
                        const index_element = all_ingredients.indexOf(element);
                        all_ingredients.splice(index_element, 1);
                    }
                }
                //all_ingredients = all_ingredients.filter(element => element.toUpperCase() !== button_selected.textContent.toUpperCase())
            }
            for(let ustensil of element.ustensils){
                let isUstensilExisting = false
                for (let existingUstensile of all_ustensiles) {
                    if (existingUstensile.toUpperCase() === ustensil.toUpperCase()) {
                        isUstensilExisting = true
                        break
                    }
                }
                if (!isUstensilExisting) {
                    all_ustensiles.push(ustensil);
                }
                /*if (!all_ustensiles.some(existingUstensil => existingUstensil.toUpperCase() === ustensil.toUpperCase())) {
                    all_ustensiles.push(ustensil);
                }*/
            };
            for (let button_selected of Array.from(object_elements_dom.elements_ustensils_selected.children)) {
                for (let element of all_ustensiles) {
                    if (element.toUpperCase() !== button_selected.textContent.toUpperCase()) {
                        const index_element = all_ustensiles.indexOf(element);
                        all_ustensiles.splice(index_element, 1);
                    }
                }
                //all_ustensiles = all_ustensiles.filter(element => element.toUpperCase() !== button_selected.textContent.toUpperCase())
            };
            

                let isAppareilExisting = false
                for (let existingAppareil of all_appareils) {
                    if (existingAppareil.toUpperCase() === element.appliance.toUpperCase()) {
                        isAppareilExisting = true
                        break
                    }
                }
                if (!isAppareilExisting) {
                    all_appareils.push(element.appliance);
                }



            /*if (!all_appareils.some(existingAppareil => existingAppareil.toUpperCase() === element.appliance.toUpperCase())) {
                    all_appareils.push(element.appliance);
            }*/
            for (let button_selected of Array.from(object_elements_dom.elements_appareils_selected.children)) {
                for (let element of all_appareils) {
                    if (element.toUpperCase() !== button_selected.textContent.toUpperCase()) {
                        const index_element = all_appareils.indexOf(element);
                        all_appareils.splice(index_element, 1);
                    }
                }
                //all_appareils = all_appareils.filter(element => element.toUpperCase() !== button_selected.textContent.toUpperCase())
            }
            renderCard(element , object_elements_dom.div_gallery_elements);
        };
        console.log(all_appareils, all_ustensiles, all_ingredients)
        renderSelect(all_ingredients, object_elements_dom.dropdown_ingredient_element_no_select, "ingredient");
        renderSelect(all_ustensiles, object_elements_dom.dropdown_ustensiles_element_no_select , "ustensiles");
        renderSelect(all_appareils, object_elements_dom.dropdown_appareils_element_no_select, "appareils");
        object_elements_dom.p_number_recettes.textContent = arrayToShow.length + " recettes";
    }
}

function renderSelect(items, dropdown_element_no_select, type_element) {
    for(let element of items){
        const button_select = document.createElement('button');
        button_select.classList.add("one-element-dropdown");
        button_select.setAttribute('data-type-element', type_element);
        button_select.addEventListener('click', addButtonSelect);
        button_select.textContent = element;
        dropdown_element_no_select.appendChild(button_select);
    };
}



function renderCard(element, div_gallery_elements) {


    const div_one_element = document.createElement('div');
    div_one_element.classList.add('one-element-gallery');
    div_gallery_elements.appendChild(div_one_element)

    /*Création dynamique de la div-element-image*/
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

    /*Création dynamique de la div-element-information*/
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

    for (let ingredient of element.ingredients){

        const div_one_ingredient = document.createElement('div');
        div_one_ingredient.classList.add('div-one-ingredient');

        const p_name_ingredient = document.createElement('p');
        p_name_ingredient.classList.add('p-name-ingredient');
        p_name_ingredient.textContent = ingredient.ingredient;

        const p_number_ingredient = document.createElement('p');
        p_number_ingredient.classList.add('p-number-ingredient')

        if (ingredient.unit) {
            p_number_ingredient.textContent = ingredient.quantity + " "+ingredient.unit;
        } else {
            p_number_ingredient.textContent = ingredient.quantity;
        }
        div_one_ingredient.appendChild(p_name_ingredient);
        div_one_ingredient.appendChild(p_number_ingredient);
        div_all_ingredients.appendChild(div_one_ingredient)
    }
}




init()
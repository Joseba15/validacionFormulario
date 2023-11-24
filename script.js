const form = document.querySelector('#formulario');
const lista = document.querySelector('#listaPeliculas');
const titleEl = document.querySelector('#title');
const genderEl = document.querySelector('#gender');
const realiseDateEl = document.querySelector('#realiseDate');
const durationEl = document.querySelector('#duration');
const listButtonEdit = document.getElementsByName('edit');

const isRequired = value => value === '' ? false : true;

const isBetween = (length, min, max) => length < min || length > max ? false : true;

const isIncluded = (lista,item) => lista.includes(item) ? true : false; 

const isNumericValid = (value) => !isNaN(parseFloat(value));

const isDateValid = (date) => {
    const re =  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    return re.test(date);
};

const showError = (input, message) => {
    const formField = input.parentElement;
    const error = formField.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    const formField = input.parentElement;
    const error = formField.querySelector('small');
    error.textContent = '';
};


const checkTitle = () => {
    let valid = false;
    const min = 4, max = 25;
    const title = titleEl.value.trim();
    if (!isRequired(title)) {
      showError(titleEl, 'El titulo no puede estar en blanco.');
    } else if (!isBetween(title.length, min, max)) {
      showError(titleEl, `El titulo debe tener entre ${min} y ${max} caracteres.`);
    } else {
      showSuccess(titleEl);
      valid = true;
    }
    return valid;
};

const checkGender = () => {
    let valid = false;
    const listGender = ['terror','accion','comedia','romantica','animacion','ficcion']
    const gender = genderEl.value.trim();
    if (!isRequired(gender)) {
      showError(genderEl, 'El género no puede estar en blanco.');
    } else if (!isIncluded(listGender,gender)) {
      showError(genderEl, `El género debe de ser los siguientes: terror, accion, comedia, romantica, ficcion o animacion.`);
    } else {
      showSuccess(genderEl);
      valid = true;
    }
    return valid;
};

const checkRealiseDate = () => {
    let valid = false;
    const date = new Date(realiseDateEl.value);
    const dateValid = new Date('1960-01-01');

    if (!isRequired(date)) {
      showError(realiseDateEl, 'La fecha de estreno no puede estar en blanco.');
     } /*else if (!isDateValid(date)) {
       showError(realiseDateEl, 'La fecha de estreno tiene que tener el siguiente formato dd/mm/yyyy');
    }*/else if (date<dateValid) {
        showError(realiseDateEl, 'La fecha de estreno debe de ser mayor que el 01/01/1960.');
    }else {
      showSuccess(realiseDateEl);
      valid = true;
    }
    return valid;
};

const checkDuration = () => {
    let valid = false;
    const duration = durationEl.value.trim();

    if (!isRequired(duration)) {
      showError(durationEl, 'La duracion no puede estar en blanco.');
    } else if (!isNumericValid(duration)) {
      showError(durationEl, 'La duracion tiene que ser de tipo numerico');
    }else if (duration<=0) {
        showError(durationEl, `La duracion debe de ser mayor que 0.`);
    }else {
      showSuccess(durationEl);
      valid = true;
    }
    return valid;
};


form.addEventListener('input', function (e) {
    switch (e.target.id) {
      case 'title':
        checkTitle();
        break;
      case 'gender':
        checkGender();
        break;
      case 'realiseDate':
        checkRealiseDate();
        break;
      case 'duration':
        checkDuration();
        break;
    }
});


fetch('http://localhost:3000/films')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(response);
    })
    .then(async datos =>{
        for (const film of datos) {
            let button = document.createElement('button');
            let articleLi = document.createElement('li');
            articleLi.textContent = `${film.title}, ${film.gender}, ${film.realiseDate}, ${film.duration}`
            button.textContent="Edit"
            button.setAttribute('class','btn btn-warning')
            button.setAttribute('name','edit')
            button.setAttribute('data-id',`${film.id}`)
            articleLi.appendChild(button);
            lista.appendChild(articleLi);
        }
    })
    .catch(err => {
        console.log('Error en la petición HTTP: '+err.message);
    })


form.addEventListener('submit', function (e) {

    let isTitleValid =  checkTitle(),
    isGenderValid = checkGender(),
    isRealiseDateValid = checkRealiseDate(),
    isDurationValid = checkDuration();


    // Verificar si el formulario es válido
    let isFormValid = isTitleValid && isGenderValid && isRealiseDateValid && isDurationValid;
    
    
    if (isFormValid) {
        alert('Formulario enviado');

        const newFilm = { 
            title: titleEl.value,
            gender: genderEl.value,
            realiseDate: realiseDateEl.value,
            duration: durationEl.value
        };

        fetch('http://localhost:3000/films', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newFilm),
        })
        .then(response => response.json(newFilm))
        
        .catch(error => console.error('Error:', error));
        titleEl.value = "";
        genderEl.value = "";
        realiseDateEl.value = "";
        durationEl.value="";
}});


for (const botton of listButtonEdit) {
  botton.addEventListener('click',function (e) {
    e.target.parentElement
    
  })
}

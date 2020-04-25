document
    .querySelector('header button')
    .addEventListener('click', _ => {
        document
            .querySelector('.form')
            .classList.toggle('hide')
    })
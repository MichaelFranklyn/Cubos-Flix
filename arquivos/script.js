const body = document.querySelector('body')
const div_movies = document.querySelector('.movies')
const btn_prev = document.querySelector('.btn-prev')
const btn_next = document.querySelector('.btn-next')
const input = document.querySelector('.input')

const div_highlight = document.querySelector('.highlight')
const div_highlight_video = document.querySelector('.highlight__video')
const highlight_title = document.querySelector('.highlight__title')
const highlight_rating = document.querySelector('.highlight__rating')
const highlight_genres = document.querySelector('.highlight__genres')
const highlight_launch = document.querySelector('.highlight__launch')
const highlight_description = document.querySelector('.highlight__description')
const link_video = document.querySelector('.highlight__video-link')

const div_modal = document.querySelector('.modal')
const modal_title = document.querySelector('.modal__title')
const modal_imagem = document.querySelector('.modal__img')
const modal_description = document.querySelector('.modal__description')
const modal_average = document.querySelector('.modal__average')
const modal_close = document.querySelector('.modal__close')
const modal_genres = document.querySelector('.modal__genres')

let btn_theme = document.querySelector('.btn-theme')

div_highlight.style.marginBottom = "122px"

let api = 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR'
function rodarFilme(api) {
    const promiseResposta = fetch(api);
    promiseResposta.then(resposta => {
        const promiseBody = resposta.json();
        promiseBody.then(function (bodyApi) {
            const arrayApi = bodyApi.results

            for (let i = 0; i < 5; i++) {
                const div_movie = document.createElement('div')
                div_movie.classList.add('movie')
                div_movie.style.backgroundImage = `url(${arrayApi[i].poster_path})`

                const movie_info = document.createElement('div');
                movie_info.classList.add('movie__info')

                const movie_title = document.createElement('span')
                movie_title.classList.add('movie__title')
                movie_title.textContent = arrayApi[i].title

                const movie_rating = document.createElement('span')
                movie_rating.classList.add('movie__rating')

                const movie_estrela = document.createElement('img')
                movie_estrela.src = "../assets/estrela.svg"
                movie_estrela.alt = "Estrela"

                movie_rating.append(movie_estrela, arrayApi[i].vote_average)
                movie_info.append(movie_title, movie_rating)
                div_movie.append(movie_info)
                div_movies.append(div_movie)

                let index = 0
                btn_next.addEventListener('click', () => {
                    index = index + 5
                    if (index === arrayApi.length) {
                        index = 0
                    }

                    div_movie.style.backgroundImage = `url(${arrayApi[i + index].poster_path})`
                    movie_title.textContent = arrayApi[i + index].title
                    movie_estrela.src = "../assets/estrela.svg"
                    movie_estrela.alt = "Estrela"
                    movie_rating.innerHTML = ""
                    movie_rating.append(movie_estrela, arrayApi[i + index].vote_average)
                })

                btn_prev.addEventListener('click', () => {
                    index = index - 5
                    if (index === -5) {
                        index = arrayApi.length - 5
                    }

                    div_movie.style.backgroundImage = `url(${arrayApi[i + index].poster_path})`
                    movie_title.textContent = arrayApi[i + index].title
                    movie_estrela.src = "../assets/estrela.svg"
                    movie_estrela.alt = "Estrela"
                    movie_rating.innerHTML = ""
                    movie_rating.append(movie_estrela, arrayApi[i + index].vote_average)
                })

                div_movie.addEventListener('click', () => {
                    const promiseResposta3 = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${arrayApi[i + index].id}?language=pt-BR`)
                    promiseResposta3.then(respostaModal => {
                        const promiseBody3 = respostaModal.json()
                        promiseBody3.then(bodyApiModal => {
                            div_modal.classList.remove('hidden')

                            modal_title.textContent = bodyApiModal.title
                            modal_imagem.src = bodyApiModal.backdrop_path
                            modal_description.textContent = bodyApiModal.overview
                            modal_average.textContent = bodyApiModal.vote_average

                            const filmeSelecionado = bodyApiModal.genres
                            for (let k = 0; k < filmeSelecionado.length; k++) {
                                const modal_genre = document.createElement('span')
                                modal_genre.classList.add('modal__genre')
                                modal_genre.textContent = bodyApiModal.genres[k].name
                                modal_genres.append(modal_genre)
                            }
                        })
                    })
                })

                modal_close.addEventListener('click', () => {
                    modal_genres.innerHTML = ""
                    div_modal.classList.add('hidden')
                })
            }
        })
    })
}
rodarFilme(api)

input.addEventListener('keydown', event => {
    if (event.key === "Enter" && !input.value) {
        div_movies.innerHTML = ""
        api = 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR'
        rodarFilme(api)
    } else if (event.key === "Enter") {
        div_movies.innerHTML = ""
        api = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`
        rodarFilme(api)
        input.value = ""
    }
})

function highlight() {
    const promiseResposta1 = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');
    promiseResposta1.then(resposta => {
        const promiseBody1 = resposta.json();
        promiseBody1.then(bodyApi => {
            div_highlight_video.style.backgroundImage = `url(${bodyApi.backdrop_path})`
            div_highlight_video.style.backgroundSize = "cover"
            div_highlight_video.style.borderRadius = "2%"
            highlight_title.textContent = bodyApi.title
            highlight_rating.textContent = bodyApi.vote_average
            highlight_genres.textContent = `${bodyApi.genres[0].name}, ${bodyApi.genres[1].name}, ${bodyApi.genres[2].name}`
            highlight_launch.textContent = new Date(bodyApi.release_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
            highlight_description.textContent = bodyApi.overview
        })
    })
}
highlight()

function linkVideo() {
    const promiseResposta2 = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');
    promiseResposta2.then(resposta => {
        const promiseBody2 = resposta.json();
        promiseBody2.then(bodyApi => {
            link_video.href = `https://www.youtube.com/watch?v=${bodyApi.results[0].key}`
        })
    })
}
linkVideo()

let temaInicial = localStorage.getItem('tema')

if (temaInicial) {
    temaInicial = temaInicial === 'escuro' ? 'escuro' : 'claro'
} else {
    temaInicial = 'claro'
}

btn_theme.addEventListener('click', () => {
    localStorage.setItem('tema', temaInicial === 'claro' ? 'escuro' : 'claro')
    temaInicial = localStorage.getItem('tema')
    armazenarTema()
})

function armazenarTema() {
    body.style.setProperty('--background-color', temaInicial === 'claro' ? '#FFF' : '#242424')
    body.style.setProperty('--input-border-color', temaInicial === 'claro' ? '#979797' : '#FFF')
    body.style.setProperty('--highlight-background', temaInicial === 'claro' ? '#FFF' : '#454545')
    body.style.setProperty('--highlight-color', temaInicial === 'claro' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)')
    body.style.setProperty('--highlight-description', temaInicial === 'claro' ? '#000' : '#FFF')
    body.style.setProperty('--color', temaInicial === 'claro' ? '#000' : '#FFF')
    body.style.setProperty('--shadow-color', temaInicial === 'claro' ? '0px 4px 8px rgba(0, 0, 0, 0.15)' : '0px 4px 8px rgba(255, 255, 255, 0.15)')
    btn_next.src = temaInicial === 'claro' ? '../assets/seta-direita-preta.svg' : '../assets/seta-direita-branca.svg'
    btn_prev.src = temaInicial === 'claro' ? '../assets/seta-esquerda-preta.svg' : '../assets/seta-esquerda-branca.svg'
    btn_theme.src = temaInicial === 'claro' ? '../assets/light-mode.svg' : '../assets/dark-mode.svg'
}
armazenarTema()
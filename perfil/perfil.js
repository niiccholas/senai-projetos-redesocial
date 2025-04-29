'use strict'

const usuarioLogado = localStorage.getItem('idUsuario')

function aparecerMenu(){
  const menu = document.getElementById('menu')

  if(menu.classList[1] == 'closed'){
      menu.style.display = 'block'

      menu.classList.remove('closed')
  }else{
      menu.style.display = 'none'
      menu.classList.add('closed')
  }
}

/* SCRIPT GALERIA */

let cachePosts = null

async function getDadosPosts() {

    if(cachePosts){
        return cachePosts
    }
    let url = 'https://back-spider.vercel.app/publicacoes/listarPublicacoes'

    let response = await fetch(url)

    let data = await response.json()
    cachePosts = data;

    return data
}



async function getUser(id){

    let url = `https://back-spider.vercel.app/user/pesquisarUser/${id}`

    let response = await fetch(url)

    let data = await response.json()

    return data
}

async function mostrarPost(dataPost) {

    const galeriaPosts = document.getElementsByClassName('galeriaPosts')[0];

    const itemGaleria = document.createElement('li')
    itemGaleria.classList.add('gallery-item')

    const button = document.createElement('button')
    button.classList.add('containerImg')

    const img = document.createElement('img')
    img.src = dataPost.imagem

    button.appendChild(img)

    const a = document.createElement('a')
    a.textContent = (await getUser(dataPost.idUsuario)).nome

    itemGaleria.appendChild(button)
    itemGaleria.appendChild(a)

    galeriaPosts.appendChild(itemGaleria)

    button.addEventListener('click', function(){

        if(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"){
            window.location.href = `../telaPost/index.html?idPost=${dataPost.id}`
        } // fazer else pro github aqui

    })

}

async function processarPosts(){
    const data = await getDadosPosts()

    data.forEach(post => {

      if(parseInt(post.idUsuario) == usuarioLogado){
        mostrarPost(post)
      }

    });
}

function aparecerMenu(){
    const menu = document.getElementById('menu')

    if(menu.classList[1] == 'closed'){
        menu.style.display = 'block'

        menu.classList.remove('closed')
    }else{
        menu.style.display = 'none'
        menu.classList.add('closed')
    }
}

async function atualizarDadosPerfil(id){

  const nomeUser = document.getElementById('nomeUser')

  const arrobaUser = document.getElementById('arrobaUser')

  const fotoPerfil = document.getElementById('iconPerfil')

  const userData = await getUser(id)

  nomeUser.textContent = userData.nome

  const arroba = ((userData.nome).replace(/\s+/g, '')).toLowerCase()

  arrobaUser.textContent = `@${arroba}`

  fotoPerfil.style.backgroundImage = `url(${userData.imagemPerfil})`

}



document.getElementById('home').addEventListener("click", function() {
  window.location.href = "../home/home.html";
});

const imagemUser = localStorage.getItem('imagemUser')

atualizarDadosPerfil(usuarioLogado)

document.getElementById('imgUser').style.backgroundImage = `url(${imagemUser})`

document.getElementById('abrirMenu').addEventListener('click', aparecerMenu)

document.getElementById('exit').addEventListener('click', function(){

    localStorage.setItem('idUsuario', null)

})

processarPosts()
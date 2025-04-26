'use strict'

const params = new URLSearchParams(window.location.search);
const id = params.get('idPost')

let cachePosts = null;
let cacheUsers = null;


async function pegarDadosPublicacoes(){

    if(cachePosts){
        return cachePosts
    }

    const url = `https://back-spider.vercel.app/publicacoes/listarPublicacoes`

    const response = await fetch(url);
    const data = await response.json();
    cachePosts = data;
    
    return data
}

async function pegarDadosUsuarios(){

    if(cacheUsers){
        return cacheUsers
    }

    const url = `https://back-spider.vercel.app/user/listarUsers`

    const response = await fetch(url);
    const data = await response.json();
    cacheUsers = data

    return data
    
}

async function buscarDadoUsuario(id){

    const data = await pegarDadosUsuarios()
    return data.find(usuario => usuario.id == id) || null // Retorna null se não encontrar
}

async function criarComentario(data){

    const idUserComentario = data.idUsuario

    const imagemUsuario = (await buscarDadoUsuario(idUserComentario)).imagemPerfil
    const nomeUsuario = (await buscarDadoUsuario(idUserComentario)).nome

    const listaComentario = document.getElementsByClassName('listaComentarios')[0]

    const comentario = document.createElement('li')

    const iconeUser = document.createElement('div')
    iconeUser.classList.add('iconeUser')


    iconeUser.style.backgroundImage = `url(${imagemUsuario})`

    const textoSection = document.createElement('section')

    const nome = document.createElement('h1')
    const textoComentario = document.createElement('p')
    nome.textContent = nomeUsuario
    textoComentario.textContent = data.descricao

    textoSection.appendChild(nome)
    textoSection.appendChild(textoComentario)



    comentario.appendChild(iconeUser)
    comentario.appendChild(textoSection)

    listaComentario.appendChild(comentario)
}

async function preencherPost(data){


    const iconeUsuario = document.getElementsByClassName('icone')[0]
    const nomeUser = document.getElementById('nomeUserPost')
    const arrobaUser = document.getElementById('arroba')

    const dataIconeUser = (await buscarDadoUsuario(data.idUsuario)).imagemPerfil
    const dataNomeUser = (await buscarDadoUsuario(data.idUsuario)).nome
    const dataArrobaUser = (await buscarDadoUsuario(data.idUsuario)).email


    iconeUsuario.style.backgroundImage = `url(${dataIconeUser})`
    nomeUser.textContent = dataNomeUser
    arrobaUser.textContent = dataArrobaUser

    const imagemPost = document.getElementsByClassName('imagem')[0]
    const tituloPost = document.getElementById('tituloPost')
    // const descricaoPost = document.getElementById('descricaoPost') //nao tem na api
    const dataPost = document.getElementById('dataPost')
    const numeroLikes = document.getElementById('numeroLikes')

    imagemPost.style.backgroundImage = `url(${data.imagem})`
    tituloPost.textContent = data.descricao
    dataPost.textContent = data.dataPublicacao

    length = 0

    if(data.curtidas){
        length = data.curtidas.length
    }

    numeroLikes.textContent = length

}

async function criarPostagem(){

    const data = await pegarDadosPublicacoes()

    const quantidadeComentario = document.getElementById('quantidadeComentarios')

    data.forEach(post => {
        if (post.id == id) {
    
            preencherPost(post);
    
            let length = 0;
    
            if (post.comentarios) {
                length = post.comentarios.length;
                quantidadeComentario.textContent = length + ' comentário(s)';
    
                post.comentarios.forEach(comentario => {
                    criarComentario(comentario);
                });
            } else {
                quantidadeComentario.textContent = length + ' comentário(s)';
            }
    
        }
    });

}

criarPostagem()

/* POSTAGENS */

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
    a.textContent = (await buscarDadoUsuario(dataPost.idUsuario)).nome

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
    const data = await pegarDadosPublicacoes()

    data.forEach(post => {

        if(post.id != id){
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

async function atualizarConta(){

    const fotoUser = localStorage.getItem('imagemUser')
    
    document.getElementById('imgUser').style.backgroundImage = `url(${fotoUser})`
}

document.getElementById('home').addEventListener("click", function() {
    window.location.href = "../home/home.html";
});

const usuarioLogado = localStorage.getItem('idUsuario');

document.getElementById('abrirMenu').addEventListener('click', aparecerMenu)

window.onload = function() {

    
    if (usuarioLogado == 'null') {
        console.log('a')
        console.log('ID do usuário inválido, redirecionando para o login');
        window.location.href = '../index.html';
        return
    }

    processarPosts()
    atualizarConta()
  };
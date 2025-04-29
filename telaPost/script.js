'use strict'

const params = new URLSearchParams(window.location.search);
const id = params.get('idPost')
const usuarioLogado = localStorage.getItem('idUsuario');

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

async function putComentar(post){
    const inputComentar = document.getElementById('inputComentar');
    const url = `https://back-spider.vercel.app/publicacoes/commentPublicacao/${post.id}`;

    const comentario = {
        idUser: usuarioLogado,
        descricao: inputComentar.value
    };

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comentario)
    };

    const response = await fetch(url, options);
    if (response.ok) {
       
        const updatedPost = await response.json();  // Atualiza com os dados mais recentes do post
        return updatedPost;  
    } else {
        return null;  
    }
}


let jaApareceu = false

async function comentarPost(post) {
    const inputComentar = document.getElementById('inputComentar');

    inputComentar.addEventListener('keydown', async function(event) {
        if (event.key == 'Enter') {
            event.preventDefault();

            // Chama a função putComentar e espera o post ser atualizado
            const comentar = await putComentar(post);

            if(comentar){
                const lerComentarios = document.getElementById('lerComentarios')

                lerComentarios.textContent = `Ler comentários (${post.comentarios.length + 1})`
                
                if(!jaApareceu){
                    setTimeout(() => {
                        criarComentario({idUsuario: usuarioLogado, descricao: inputComentar.value})
                    }, 500);
                
                    jaApareceu = true
                }
            }

        }
    });
}

let comentariosCarregados = false


async function criarPostagem(){

    const data = await pegarDadosPublicacoes()

    const quantidadeComentario = document.getElementById('quantidadeComentarios')




    data.forEach(post => {
        if (post.id == id) {

            comentarPost(post)
    
            preencherPost(post)

            curtirPostagem(post)

            if(post.comentarios){

                if(post.comentarios.length > 0){

                    const lerComentarios = document.getElementById('lerComentarios')

                    lerComentarios.textContent = `Ler comentários (${post.comentarios.length})`

                    const comentario = document.getElementById('comentario')

                    const containerComentario = document.getElementById('containerComentario')

                    lerComentarios.addEventListener('click', function(){

                        comentario.classList.add('listar')

                        const temQueSumir = document.getElementsByClassName('comentar')

                        Array.from(temQueSumir).forEach(element => {
                            element.classList.remove('comentar')
                            element.classList.add('coment')
                        })

                        const temQueAparecer = document.getElementsByClassName('sumir')

                        Array.from(temQueAparecer).forEach(element => {

                            element.classList.remove('sumir')
                            element.classList.add('list')
                        })

                        containerComentario.style.height = '40%'


                        let length = 0;

                        setTimeout(() => {

                        
                            length = post.comentarios.length;
                            quantidadeComentario.textContent = length + ' comentário(s)';

                            if(!comentariosCarregados){
                                post.comentarios.forEach(comentario => {
                                    criarComentario(comentario);
                                    comentariosCarregados = true
                                });
                            
                            }
                
                            
                            
                        }, 500);

                        lerComentarios.style.display = 'none'
                        
                        const botaoComentar = document.getElementById('botaoComentar')

                        botaoComentar.addEventListener('click', function() {
                            
                            comentario.classList.remove('listar')

                            const temQueSumir = document.getElementsByClassName('coment')

                            Array.from(temQueSumir).forEach(element => {
                                element.classList.add('comentar')
                            })

                            const temQueAparecer = document.getElementsByClassName('list')

                            Array.from(temQueAparecer).forEach(element => {

                                element.classList.add('sumir')
                            })

                            containerComentario.style.height = '20%'

                            lerComentarios.style.display = 'block'
                        })
            
                    })

                }else{
                    document.getElementById('lerComentarios').textContent = 'Seja o primeiro a comentar!'
                    document.getElementById('lerComentarios').style.cursor = 'default'
                }

            }else{
                document.getElementById('lerComentarios').textContent = 'Seja o primeiro a comentar!'
                document.getElementById('lerComentarios').style.cursor = 'default'
            }
    
            
        }
    });

}


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
        
        window.location.href = `../telaPost/index.html?idPost=${dataPost.id}`

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

async function putCurtida(idPost){

    const url = `https://back-spider.vercel.app/publicacoes/likePublicacao/${idPost}`

    const options = {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idUser: usuarioLogado
        })
    }

    const response = await fetch(url, options)

}

async function curtirPostagem(post){

    const botaoCurtida = document.getElementById('curtir')

    let postCurtidoStatus = false

    if(post.curtidas){

        if(post.curtidas.length > 0){

            post.curtidas.forEach(function(jsonCurtida) {
            
                if(parseInt(jsonCurtida.idUsuario) == usuarioLogado){
                    botaoCurtida.src = './img/heartFilled.png'
        
                    postCurtidoStatus = true
                }
        
            })
        }

    }

    

    botaoCurtida.addEventListener('click', function(){

        
        if(!postCurtidoStatus){
            botaoCurtida.src = './img/heartFilled.png'

            putCurtida(post.id)

            const numeroLikes = document.getElementById('numeroLikes')

            numeroLikes.textContent = parseInt(numeroLikes.textContent) + 1
        }

        
    })

}

async function atualizarConta(){

    const fotoUser = localStorage.getItem('imagemUser')
    
    document.getElementById('imgUser').style.backgroundImage = `url(${fotoUser})`
}

document.getElementById('home').addEventListener("click", function() {
    window.location.href = "../home/home.html";
});

document.getElementById('abrirMenu').addEventListener('click', aparecerMenu)

criarPostagem()
processarPosts()
atualizarConta()

document.getElementById('telaPublicar').addEventListener('click', function() {

    window.location.href = '../postar/index.html'
    
})

window.onload = function() {

    
    if (usuarioLogado == 'null') {
        window.location.href = '../index.html';
        return
    }

  };
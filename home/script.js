'use strict'

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

        window.location.href = `../telaPost/index.html?idPost=${dataPost.id}`
    })

}

async function processarPosts(){
    const data = await getDadosPosts()

    data.forEach(post => {
        mostrarPost(post)
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


document.getElementById('home').addEventListener("click", function() {
    window.location.href = "./home.html";
});

document.getElementById('abrirMenu').addEventListener('click', aparecerMenu)

/* FINALIZACAO DO CADASTRO */

const submit = document.getElementById('submit')

const usuarioLogado = localStorage.getItem('idUsuario')

async function atualizarCadastro(){

    const url = `https://back-spider.vercel.app/user/atualizarUser/${usuarioLogado}`

    const inputNome = document.getElementById('inputNome')
    const inputSenha = document.getElementById('inputSenha')

    if(!inputNome.value ||  !inputSenha.value){
        document.getElementById('aviso').textContent = 'Preencha todos os campos!'
        return
    }

    // const formData = {
    //     nome: inputNome.value,
    //     senhaRecuperacao: inputSenha.value
    // }

    const formData = {
        nome: inputNome.value,
        senhaRecuperacao: inputSenha.value
    }

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }

    const response = await fetch(url, options)

    if(response.ok){
        atualizarConta()
        document.getElementById('finalizarCadastro').style.display = 'none'
    }
}

async function atualizarConta(){

    const fotoUser = (await getUser(usuarioLogado)).imagemPerfil

    localStorage.setItem('imagemUser', fotoUser)
    
    document.getElementById('imgUser').style.backgroundImage = `url(${fotoUser})`
}

if (usuarioLogado == null) {
    window.location.href = '../index.html';
}

window.onload = async function() {

    const imagemUser = localStorage.getItem('imagemUser')

    const usuarioLogado = localStorage.getItem('idUsuario');

    document.getElementById('telaPublicar').addEventListener('click', function() {

        window.location.href = '../postar/index.html'
        
    })

    try {
        const dadosUser = await getUser(usuarioLogado);
        if(dadosUser.nome == 'Usuário' || dadosUser.senhaRecuperacao == 'senhaPadrao'){
            document.getElementById('finalizarCadastro').style.display = 'flex';
            submit.addEventListener('click', atualizarCadastro);
        } else {

            if(imagemUser){
                document.getElementById('imgUser').style.backgroundImage = `url(${imagemUser})`
            }else{
                atualizarConta();
            }

        }
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        window.location.href = '../index.html'; // Em caso de erro ao buscar os dados do usuário, redireciona
    }

    //function para log-out do user
    document.getElementById('exit').addEventListener('click', function(){

        localStorage.setItem('idUsuario', null)

    })

    processarPosts();
};

if (usuarioLogado == 'null') {
    window.location.href = '../index.html';
    return
}
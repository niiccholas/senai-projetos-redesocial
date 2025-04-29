document.getElementById('telaPublicar').addEventListener('click', function() {

    window.location.href = './index.html'
    
})

const usuarioLogado = localStorage.getItem('idUsuario')

async function atualizarConta(){

    const fotoPerfil = localStorage.getItem('imagemUser')
    
    document.getElementById('imgUser').style.backgroundImage = `url(${fotoPerfil})`
}

document.getElementById('home').addEventListener("click", function() {
    window.location.href = "../home/home.html";
});

document.getElementById('botaoFechar').addEventListener("click", function() {

    window.location.href = '../home/home.html'
    
});

async function criarPost(){

    const inputDescricao = document.getElementById('inputDescricao')

    const url = `https://back-spider.vercel.app/publicacoes/cadastrarPublicacao`

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const ano = hoje.getFullYear();

    const dataFormatada = `${dia}/${mes}/${ano}`;

    const formData = {
        descricao: inputDescricao.value,
        dataPublicacao: dataFormatada,
        imagem: imagemPost,
        local: 'Pictory',
        idUsuario: usuarioLogado
    }

    const response = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })

    console.log(response)

    // {
    //     "descricao": "Preparando Aulas para as Crianças",
    //     "dataPublicacao": "23/01/2025",
    //     "imagem": "https://www.aluralingua.com.br/artigos/assets/professor.jpg",
    //     "local": "Faculdade",
    //     "idUsuario": 2
    // }
}
const botaoCriar = document.getElementById('createPost')

botaoCriar.addEventListener('click', function(){

    criarPost()
    setTimeout(() => {
        window.location.href = '../home/home.html'
    }, 2000);

})

const botao = document.getElementById('botao')

let imagemPost = null

botao.addEventListener('change', function (ev) {

    const icon = document.getElementById('icon')

    const imagem = document.getElementById('imagem')

    const form = new FormData()
    form.append('image', ev.target.files[0])
    fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID 899b0dcd4202478`
        }
        ,body:form
      }).then(data=>data.json()).then(data=> {

        imagemPost = data.data.link
        
        setTimeout(() => {
            document.getElementById('icon').style.display = 'none'
            imagem.style.backgroundImage = `url(${data.data.link})`
            document.getElementById('icon').style.display = 'none'
        }, 100); // Atraso de 100ms, ou ajuste conforme necessário
        
      })



    icon.style.display = 'block'

    
})

async function criarPost(){

    const inputDescricao = document.getElementById('inputDescricao')

    const url = `https://back-spider.vercel.app/publicacoes/cadastrarPublicacao`

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const ano = hoje.getFullYear();

    const dataFormatada = `${dia}/${mes}/${ano}`;

    const formData = {
        descricao: inputDescricao.value,
        dataPublicacao: dataFormatada,
        imagem: imagemPost,
        local: '',
        idUsuario: usuarioLogado
    }

    const response = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })

    console.log(response)

    // {
    //     "descricao": "Preparando Aulas para as Crianças",
    //     "dataPublicacao": "23/01/2025",
    //     "imagem": "https://www.aluralingua.com.br/artigos/assets/professor.jpg",
    //     "local": "Faculdade",
    //     "idUsuario": 2
    // }



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

document.getElementById('abrirMenu').addEventListener('click', aparecerMenu)

if (usuarioLogado == 'null') {
    window.location.href = '../index.html';
}



atualizarConta()

if (usuarioLogado == 'null') {
    window.location.href = '../index.html';
}
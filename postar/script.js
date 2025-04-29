document.getElementById('telaPublicar').addEventListener('click', function() {

    window.location.href = './index.html'
    
})

async function atualizarConta(){

    const fotoPerfil = localStorage.getItem('imagemUser')
    
    document.getElementById('imgUser').style.backgroundImage = `url(${fotoPerfil})`
}

document.getElementById('home').addEventListener("click", function() {
    window.location.href = "../home/home.html";
});


console.log(document.getElementById('botaoFechar'))

document.getElementById('botaoFechar').addEventListener("click", function() {

    window.location.href = '../home/home.html'
    
});

const botao = document.getElementById('botao')

botao.addEventListener('change', function (ev) {

    console.log('a')

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
        console.log(data)
        
        setTimeout(() => {
            imagem.style.backgroundImage = `url(${data.data.link})`
            console.log(imagem)
        }, 100); // Atraso de 100ms, ou ajuste conforme necessário
        
      })



    icon.style.display = 'block'

    
})

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





atualizarConta()

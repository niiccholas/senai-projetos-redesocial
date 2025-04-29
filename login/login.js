const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const continuarSubmit = document.getElementById('submit')

async function getUser(email) {
    
    const url = 'https://back-spider.vercel.app/user/listarUsers'

    const response = await fetch(url)

    const dados = await response.json()

    const usuario = dados.find(user => user.email === email);

    return usuario

}

async function validarConta() {

    const formData = {
        email: emailInput.value,
        senha: passwordInput.value
    }


    const url = 'https://back-spider.vercel.app/login'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })

    const showError = document.getElementById('showError')

    if(response.ok){

        const funcao = await getUser(emailInput.value)

        localStorage.setItem('idUsuario', funcao.id)
        localStorage.setItem('imagemUser', funcao.imagemPerfil)
        showError.style.display = 'none'
        window.location.href = '../home/home.html'
    }else if(response.status == 400){
        showError.textContent = 'Preencha todos os campos!'
        showError.style.display = 'block'
    }else{
        showError.textContent = 'Senha e/ou usuários incorreto(s).'
        showError.style.display = 'block'
    }
}

continuarSubmit.addEventListener('click', validarConta)
passwordInput.addEventListener('keydown', function(tecla){
    if(tecla.key == 'Enter'){
        tecla.preventDefault();
        validarConta()
    }
})

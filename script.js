const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const continuarSubmit = document.getElementById('submit')
localStorage.setItem('idUsuario', null)

let cacheUsers = null

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

async function criarUsuario() {
    
    const url = 'https://back-spider.vercel.app/user/cadastrarUser'

    const formData = {
        nome: "Usuário",
        email: emailInput.value,
        senha: passwordInput.value,
        premium: "1",
        imagemPerfil:"https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
        senhaRecuperacao: "senhaPadrao"
    }

    const options = 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }

    const response = await fetch(url, options)

    const showError = document.getElementById('showError')

    if(response.ok){
        const usersLength = (await pegarDadosUsuarios()).length

        window.location.href = '../home/home.html'

        localStorage.setItem('idUsuario', usersLength)
        showError.style.display = 'none'
    }else{
        showError.textContent = 'Preencha todos os campos!'
        showError.style.display = 'block'
    }

}



continuarSubmit.addEventListener("click", criarUsuario)


// // deletando usuario

// async function apagarUser(){

//     const url = `https://back-spider.vercel.app/user/deleteUser/${document.getElementById('inputDelete').value}`

//     const options = 
//     {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }

//     const response = await fetch(url, options)

//     console.log(response)

// }

// document.getElementById('inputDelete').style.display = 'block'

// document.getElementById('inputDelete').addEventListener('keydown', function (event){
//     if(event.key === 'Enter'){
//         apagarUser()
//     }
// })

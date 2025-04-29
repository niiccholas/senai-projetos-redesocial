var data = null

function showInput(item){
    if(item == 'codigo'){
        const section = document.getElementById('digitarCodigo')
        section.style.opacity = 1
        section.style.cursor = 'auto'
    }else if(item == 'senha'){
        const digitarEmail = document.getElementById('digitarEmail')
        const digitarCodigo = document.getElementById('digitarCodigo')
        const digitarSenha = document.getElementById('digitarSenha')

        digitarEmail.style.display = 'none'
        digitarCodigo.style.display = 'none'
        digitarSenha.style.display = 'block'
        digitarSenha.style.opacity = 1
    }else if(item == 'senhaInvalida'){
        const aviso = document.getElementById('senhaValida')
        aviso.style.animation = 'shake 0.5s ease'
        aviso.style.opacity = 1
    }else if(item == 'senhaValida'){
        const aviso = document.getElementById('senhaValida')
        aviso.textContent = 'Senha atualizada!'
        aviso.style.color = '#69ff89'
        aviso.style.opacity = 1
        setInterval(() => {
            window.location.href = '../login/login.html'
        }, 1500);
    }
}

async function validacao(){

    emailTyped = document.getElementById('email').value;
    const codigoTyped = document.getElementById('codigo').value

    const resposta = await fetch("https://back-spider.vercel.app/user/RememberPassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: emailTyped,
            wordKey: codigoTyped
        })
    });

    if(resposta.ok){
        showInput('senha')
    }

}

async function atualizarSenha(){

    const senhaTyped = document.getElementById('senha').value

    const resposta = await fetch(`https://back-spider.vercel.app/user/newPassword/${data.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            senha: senhaTyped
        })
    });

    data = await resposta.json()

    console.log(data)

}

document.getElementById('email').addEventListener('keydown', function(tecla) {
    if (tecla.key === 'Enter') {
        tecla.preventDefault();
        showInput('codigo')
    }
});

document.getElementById('codigo').addEventListener('keydown', function(tecla) {
    if (tecla.key === 'Enter') {
        tecla.preventDefault();
        validacao()
    }
});

document.getElementById('senha').addEventListener('keydown', function(tecla) {
    if (tecla.key === 'Enter') {
        if(document.getElementById('senha').value == ''){
            showInput('senhaInvalida')
        }else{
            tecla.preventDefault();
            showInput('senhaValida')
            atualizarSenha()
        }

    }
});
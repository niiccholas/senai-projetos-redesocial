document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    async function submitForm(event) {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        const formData = {
            email: email,
            senha: password
        };

        const url = "https://back-spider.vercel.app/user/loginUser";

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login bem-sucedido:', data);
                // Aqui você pode redirecionar o usuário ou armazenar o token de autenticação
            } else {
                console.error('Erro ao realizar login:', response.statusText);
                // Aqui você pode exibir uma mensagem de erro para o usuário
            }
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            // Aqui você pode lidar com erros de rede ou outros problemas
        } finally {
            emailInput.value = "";
            passwordInput.value = "";
        }
    }

    form.addEventListener("submit", submitForm);
});

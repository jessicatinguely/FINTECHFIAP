// === VARIÁVEIS GLOBAIS ===
let currentScreen = 'loginScreen';
let screenHistory = [];

// === FUNÇÕES DE NAVEGAÇÃO ===
function showScreen(screenId) {
    // Adicionar tela atual ao histórico
    if (currentScreen !== screenId) {
        screenHistory.push(currentScreen);
    }

    // Ocultar todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Mostrar tela selecionada
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;

    // Mostrar/ocultar botão voltar
    const btnBack = document.getElementById('btnBack');
    if (screenId === 'loginScreen') {
        btnBack.style.display = 'none';
        screenHistory = [];
    } else {
        btnBack.style.display = 'flex';
    }

    // Limpar formulários
    clearForms();
}

function goBack() {
    if (screenHistory.length > 0) {
        const previousScreen = screenHistory.pop();
        showScreen(previousScreen);
    } else {
        showScreen('loginScreen');
    }
}

// === FUNÇÕES AUXILIARES ===
function clearForms() {
    document.querySelectorAll('form').forEach(form => {
        form.reset();
    });
    clearMessages();
}

function showMessage(message, type = 'info') {
    clearMessages();
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-custom ${type === 'success' ? 'alert-success' : ''}`;
    alertDiv.textContent = message;
    
    const activeScreen = document.querySelector('.screen.active');
    const form = activeScreen.querySelector('form');
    form.parentNode.insertBefore(alertDiv, form.nextSibling);

    // Remover mensagem após 4 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 4000);
}

function clearMessages() {
    document.querySelectorAll('.alert-custom').forEach(alert => {
        alert.remove();
    });
}

// === MÁSCARAS ===
function applyCpfMask(input) {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            e.target.value = value;
        }
    });
}

// === VALIDAÇÕES ===
function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    return true; // Validação simplificada
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// === EVENT LISTENERS ===

// Aplicar máscaras
document.addEventListener('DOMContentLoaded', function() {
    applyCpfMask(document.getElementById('loginCpf'));
    applyCpfMask(document.getElementById('forgotCpf'));
    applyCpfMask(document.getElementById('registerCpf'));
});

// Formulário de Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const cpf = document.getElementById('loginCpf').value;
    const senha = document.getElementById('loginSenha').value;
    
    if (!validateCPF(cpf)) {
        showMessage('CPF inválido. Por favor, verifique os dados.');
        return;
    }

    if (senha.length < 4) {
        showMessage('Senha deve ter pelo menos 4 caracteres.');
        return;
    }

    const button = this.querySelector('button');
    const originalText = button.innerHTML;
    button.innerHTML = 'Entrando...';
    button.disabled = true;
    
    setTimeout(() => {
        showMessage('Login realizado com sucesso!', 'success');
        button.innerHTML = originalText;
        button.disabled = false;
    }, 1500);
});

// Formulário de Recuperação de Senha
document.getElementById('forgotForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const cpf = document.getElementById('forgotCpf').value;
    
    if (!validateCPF(cpf)) {
        showMessage('CPF inválido. Por favor, verifique os dados.');
        return;
    }

    const button = this.querySelector('button');
    const originalText = button.innerHTML;
    button.innerHTML = 'Enviando...';
    button.disabled = true;
    
    setTimeout(() => {
        showMessage('Instruções enviadas para o seu e-mail!', 'success');
        button.innerHTML = originalText;
        button.disabled = false;
    }, 1500);
});

// Formulário de Cadastro
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('registerNome').value;
    const cpf = document.getElementById('registerCpf').value;
    const email = document.getElementById('registerEmail').value;
    const senha = document.getElementById('registerSenha').value;
    const confirmSenha = document.getElementById('registerConfirmSenha').value;
    
    // Validações básicas
    if (nome.length < 3) {
        showMessage('Nome deve ter pelo menos 3 caracteres.');
        return;
    }

    if (!validateCPF(cpf)) {
        showMessage('CPF inválido. Por favor, verifique os dados.');
        return;
    }

    if (!validateEmail(email)) {
        showMessage('E-mail inválido. Por favor, verifique o formato.');
        return;
    }

    if (senha.length < 4) {
        showMessage('Senha deve ter pelo menos 4 caracteres.');
        return;
    }

    if (senha !== confirmSenha) {
        showMessage('As senhas não coincidem.');
        return;
    }

    const button = this.querySelector('button');
    const originalText = button.innerHTML;
    button.innerHTML = 'Criando conta...';
    button.disabled = true;
    
    setTimeout(() => {
        showMessage('Conta criada com sucesso!', 'success');
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
            showScreen('loginScreen');
        }, 2000);
    }, 1500);
});

// Navegação por teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && currentScreen !== 'loginScreen') {
        goBack();
    }
});
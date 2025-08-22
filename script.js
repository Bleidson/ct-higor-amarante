// ==========================
// CAROUSEL DE PROFESSORES
// ==========================
const carousel = document.getElementById("carrousel");
const card = carousel.querySelector(".prof-card");
const gap = parseInt(getComputedStyle(carousel).gap);
const cardWidth = card.offsetWidth + gap;

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

function scrollNext() {
    if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - cardWidth) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
    } else {
        carousel.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
}

function scrollPrev() {
    if (carousel.scrollLeft === 0) {
        carousel.scrollTo({ left: carousel.scrollWidth, behavior: "smooth" });
    } else {
        carousel.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
}

nextBtn.addEventListener("click", scrollNext);
prevBtn.addEventListener("click", scrollPrev);

setInterval(scrollNext, 10000); // auto-play a cada 10 segundos

// ==========================
// FORMULÁRIO MULTI-ETAPAS
// ==========================
const modal = document.getElementById('modalMatricula');
const btnsAbrir = document.querySelectorAll('.btn'); // todos os botões matricule-se
const btnFechar = document.querySelector('.modal .close');

// abrir modal
btnsAbrir.forEach(btn => {
    btn.addEventListener('click', ()=>{
        modal.style.display = 'flex';
    });
});

// fechar modal
btnFechar.addEventListener('click', ()=>{
    modal.style.display = 'none';
});

// fechar clicando fora do conteúdo
window.addEventListener('click', (e)=>{
    if(e.target === modal){
        modal.style.display = 'none';
    }
});

let etapaAtual = 1;
const dadosForm = {
    nome: '',
    telefone: '',
    modalidade: '',
    idade: 0,
    genero: '',
    turmasSelecionadas: []
};

// Exemplo de turmas disponíveis
const turmas = [
    {id:1, modalidade:'jiujitsu', idadeMin:6, idadeMax:12, genero:'masculino', horario:'Seg/Qua 19h-20h', vagas:20, ocupados:12},
    {id:1, modalidade:'jiujitsu', idadeMin:6, idadeMax:12, genero:'masculino', horario:'Ter/Qui 20h-21h', vagas:20, ocupados:12},
    {id:2, modalidade:'jiujitsu', idadeMin:13, idadeMax:18, genero:'misto', horario:'Ter/Qui 20h-21h', vagas:20, ocupados:5},
    {id:3, modalidade:'muaythai', idadeMin:10, idadeMax:15, genero:'misto', horario:'Seg/Qua 18h-19h', vagas:15, ocupados:10},
    {id:4, modalidade:'ballet', idadeMin:5, idadeMax:10, genero:'feminino', horario:'Seg/Qua 16h-17h', vagas:10, ocupados:6},
    {id:5, modalidade:'karate', idadeMin:12, idadeMax:18, genero:'misto', horario:'Ter/Qui 18h-19h', vagas:15, ocupados:8}
];

// ==========================
// Funções de navegação entre etapas
// ==========================
function proximaEtapa() {
    if (etapaAtual === 1) {
        // capturar dados da etapa 1
        dadosForm.nome = document.getElementById('nomeMatricula').value;
        dadosForm.telefone = document.getElementById('telefoneMatricula').value;
        dadosForm.modalidade = document.getElementById('modalidadeMatricula').value;
        dadosForm.idade = parseInt(document.getElementById('idadeMatricula').value);
        dadosForm.genero = document.getElementById('generoMatricula').value;

        if(!dadosForm.nome || !dadosForm.telefone || !dadosForm.modalidade || !dadosForm.idade || !dadosForm.genero){
            alert("Preencha todos os campos antes de avançar!");
            return;
        }

        carregarTurmasFiltradas();
    }

    if (etapaAtual === 2) {
        // Capturar turmas selecionadas pelo clique no card
        const selecionados = document.querySelectorAll('.turma-card.selecionado');
        if(selecionados.length === 0){
            alert("Selecione pelo menos uma turma para avançar!");
            return;
        }
        dadosForm.turmasSelecionadas = Array.from(selecionados).map(c => parseInt(c.dataset.id));
        montarResumo();
    }

    document.getElementById(`etapa${etapaAtual}`).style.display = 'none';
    etapaAtual++;
    document.getElementById(`etapa${etapaAtual}`).style.display = 'block';
}

function voltarEtapa1() {
    document.getElementById('etapa2').style.display = 'none';
    document.getElementById('etapa1').style.display = 'block';
    etapaAtual = 1;
}

function voltarEtapa2() {
    document.getElementById('etapa3').style.display = 'none';
    document.getElementById('etapa2').style.display = 'block';
    etapaAtual = 2;
}

// ==========================
// Filtragem e exibição de turmas
// ==========================
// ==========================
// ETAPA 2 – CARDS CLICÁVEIS
// ==========================
function carregarTurmasFiltradas() {
    const cardsContainer = document.getElementById('cardsTurmas');
    cardsContainer.innerHTML = '';

    // filtra turmas por modalidade, idade e gênero
    const turmasFiltradas = turmas.filter(t =>
        t.modalidade === dadosForm.modalidade &&
        dadosForm.idade >= t.idadeMin &&
        dadosForm.idade <= t.idadeMax &&
        (t.genero === dadosForm.genero || t.genero === 'misto')
    );

    turmasFiltradas.forEach(t => {
        const card = document.createElement('div');
        card.className = 'turma-card';
        card.dataset.id = t.id;
        card.dataset.horario = t.horario;

        card.innerHTML = `
            <strong>${t.horario}</strong>
            <span>${t.ocupados}/${t.vagas} alunos</span>
            <span>${t.genero}</span>
        `;

        cardsContainer.appendChild(card);
    });

    // lógica de seleção e bloqueio de sobreposição
  
    const cards = document.querySelectorAll('.turma-card'); // <-- adicione isto
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const horarioSelecionado = card.dataset.horario;

            if(card.classList.contains('selecionado')) {
                card.classList.remove('selecionado');
                desbloquearCards(horarioSelecionado);
            } else {
                const conflitantes = document.querySelectorAll(`.turma-card.selecionado[data-horario="${horarioSelecionado}"]`);
                if(conflitantes.length > 0){
                    alert("Você já selecionou uma turma neste horário!");
                    return;
                }

                card.classList.add('selecionado');
            }
        });
    });
    }



// captura turmas selecionadas antes de avançar
function capturarTurmasSelecionadas() {
    const selecionados = document.querySelectorAll('.turma-card.selecionado');
    if(selecionados.length === 0){
        alert("Selecione pelo menos uma turma para avançar!");
        return false;
    }
    dadosForm.turmasSelecionadas = Array.from(selecionados).map(c => parseInt(c.dataset.id));
    return true;
}


// ==========================
// Montar resumo da matrícula
// ==========================
function montarResumo() {
    const resumoDiv = document.getElementById('resumo');
    
    // Informações pessoais
    const infoPessoal = `
        <div class="info-pessoal">
            <p><strong>Nome:</strong> ${dadosForm.nome}</p>
            <p><strong>Modalidade(s):</strong> ${dadosForm.modalidade}</p>
        </div>
    `;

    // Cards das turmas selecionadas
    const turmasEscolhidas = dadosForm.turmasSelecionadas.map(id => {
        const t = turmas.find(x => x.id === id);
        return `
            <div class="turma-card">
                <strong>${t.horario}</strong>
                <span>${t.modalidade}</span>
                <span>${t.ocupados}/${t.vagas} alunos</span>
                <span>${t.genero}</span>
            </div>
        `;
    }).join('');

    resumoDiv.innerHTML = infoPessoal + turmasEscolhidas;
}

// ==========================
// Envio do formulário
// ==========================
document.getElementById('matriculaForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    alert("Sua matrícula está em análise. Entraremos em contato em breve!");
    console.log("Dados enviados:", dadosForm);
    // Aqui você pode integrar Google Sheets/Airtable
    document.getElementById('matriculaForm').reset();
    etapaAtual = 1;
    document.querySelectorAll('.etapa').forEach((div,i)=>{
        div.style.display = (i===0) ? 'block' : 'none';
    });
    dadosForm.turmasSelecionadas = [];
});

function mostrarAlerta(mensagem, tipo='error') {
    const alerta = document.getElementById('modalAlert');
    alerta.textContent = mensagem;
    alerta.className = 'modal-alert'; // reset classes
    if(tipo === 'success') alerta.classList.add('success');
    alerta.style.display = 'block';

    // Desaparece após 3 segundos
    setTimeout(() => {
        alerta.style.display = 'none';
    }, 3000);
}


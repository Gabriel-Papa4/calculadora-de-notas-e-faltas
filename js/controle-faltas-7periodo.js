// controle-faltas-7periodo.js
document.addEventListener('DOMContentLoaded', () => {
    
    // *** DADOS DE DISCIPLINAS - 7º PERÍODO ***
    // Certifique-se que o data-disciplina-ref no HTML é igual a estas chaves (ex: 'orto')
    const DADOS_DISCIPLINAS_FALTAS = {
        'orto': { percPorFalta: 5.56, nome: 'ORTOPEDIA' },               // 18h total
        'oftalmo': { percPorFalta: 1.852, nome: 'OFTALMOLOGIA' },        // 54h total
        'cgo': { percPorFalta: 1.087, nome: 'CLÍNICA GINECOLÓGICA' },    // 92h total
        'cca': { percPorFalta: 0.695, nome: 'CLÍNICA DA CRIANÇA' },      // 144h total
        'cm1': { percPorFalta: 0.3475, nome: 'CLÍNICA MÉDICA I' }        // 288h total
    };
    // **********************************

    function calcularFaltas(disciplinaIdRef) {
        const dataDisciplina = DADOS_DISCIPLINAS_FALTAS[disciplinaIdRef];
        
        // Debug: Verifica se achou a disciplina
        if (!dataDisciplina) {
            console.error(`Disciplina "${disciplinaIdRef}" não encontrada no JS.`);
            return;
        }

        // Seleção dos elementos baseada no ID padrão: faltas-[CHAVE]-input
        const inputElement = document.getElementById(`faltas-${disciplinaIdRef}-input`);
        const resultadoGeralElement = document.getElementById(`faltas-${disciplinaIdRef}-geral`);
        const resultadoProuniElement = document.getElementById(`faltas-${disciplinaIdRef}-prouni`);
        const prouniContainerElement = document.getElementById(`faltas-${disciplinaIdRef}-prouni-container`);

        // Debug: Verifica se achou os elementos no HTML
        if (!inputElement || !resultadoGeralElement || !resultadoProuniElement || !prouniContainerElement) {
            console.error(`Elementos HTML não encontrados para a disciplina: ${disciplinaIdRef}. Verifique os IDs no HTML.`);
            return;
        }
        
        const faltasCometidasStr = inputElement.value;
        
        // Limpa se vazio
        if (faltasCometidasStr.trim() === '') { 
            resultadoGeralElement.textContent = ''; 
            resultadoProuniElement.textContent = '';
            prouniContainerElement.style.display = 'none';
            return;
        }

        const faltasCometidas = parseInt(faltasCometidasStr);

        // Validação
        if (isNaN(faltasCometidas) || faltasCometidas < 0) {
            resultadoGeralElement.textContent = 'Inválido';
            resultadoProuniElement.textContent = '';
            prouniContainerElement.style.display = 'none';
            return;
        }

        // Cálculos
        const percPorFalta = dataDisciplina.percPorFalta;
        const currentAbsencePercentage = faltasCometidas * percPorFalta;
        const currentPresencePercentage = 100 - currentAbsencePercentage;

        // Cálculo para 75% de presença (Geral)
        // Se a presença atual já for menor que 75%, o resultado será negativo ou zero, indicando reprovação ou limite
        let podeTerGeral = 0;
        if (currentPresencePercentage > 75) {
            podeTerGeral = Math.floor((currentPresencePercentage - 75) / percPorFalta);
        } else {
             // Caso já tenha estourado ou esteja no limite
             podeTerGeral = 0; 
        }
        
        // Se já reprovou por faltas (presença < 75%), avisa o usuário
        if (currentPresencePercentage < 75) {
             resultadoGeralElement.textContent = "Reprovado por faltas";
             resultadoGeralElement.style.color = "red";
        } else {
             resultadoGeralElement.textContent = `${podeTerGeral} faltas`;
             resultadoGeralElement.style.color = ""; // Reseta cor
        }

        // Cálculo para 80% de presença (PROUNI)
        let podeTerProuni = 0;
        if (currentPresencePercentage > 80) {
            podeTerProuni = Math.floor((currentPresencePercentage - 80) / percPorFalta);
        }
        
        resultadoProuniElement.textContent = `Obs: PROUNI = ${podeTerProuni} faltas`;
        prouniContainerElement.style.display = 'block'; 
    }

    // Adiciona o evento de clique nos botões
    const botoesCalcular = document.querySelectorAll('.btn-calcular-falta');
    
    if (botoesCalcular.length === 0) {
        console.warn("Nenhum botão com a classe .btn-calcular-falta foi encontrado.");
    }

    botoesCalcular.forEach(botao => {
        botao.addEventListener('click', () => {
            // O atributo data-disciplina-ref deve ser exatamente: 'orto', 'oftalmo', etc.
            const disciplinaIdRef = botao.getAttribute('data-disciplina-ref');
            calcularFaltas(disciplinaIdRef);
        });
    });

    // Limpeza automática ao apagar o input
    const inputsFaltas = document.querySelectorAll('.input-group-faltas input[type="number"]');
    inputsFaltas.forEach(input => {
        input.addEventListener('input', (event) => {
            if (event.target.value.trim() === '') {
                // Tenta extrair o ID. Ex: id="faltas-orto-input" -> split -> ['faltas', 'orto', 'input'] -> [1] é 'orto'
                const parts = event.target.id.split('-');
                if (parts.length >= 2) {
                    const disciplinaIdRef = parts[1]; 
                    const resultadoGeralElement = document.getElementById(`faltas-${disciplinaIdRef}-geral`);
                    const prouniContainerElement = document.getElementById(`faltas-${disciplinaIdRef}-prouni-container`);
                    
                    if(resultadoGeralElement) {
                        resultadoGeralElement.textContent = '';
                        resultadoGeralElement.style.color = "";
                    }
                    if(prouniContainerElement) prouniContainerElement.style.display = 'none';
                }
            }
        });
    });
});
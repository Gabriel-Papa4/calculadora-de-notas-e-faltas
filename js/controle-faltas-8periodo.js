// controle-faltas-8periodo.js
document.addEventListener('DOMContentLoaded', () => {
    // *** DADOS DAS DISCIPLINAS - 8º PERÍODO ***
    const DADOS_DISCIPLINAS_FALTAS = {
        'sm3': { percPorFalta: 1.39, nome: 'SAÚDE MENTAL III' }, // 72h
        'ue': { percPorFalta: 1.39, nome: 'URGÊNCIA E EMERGÊNCIA' }, // 72h
        'cc': { percPorFalta: 0.463, nome: 'CLÍNICA CIRÚRGICA' }, // 216h
        'cm2': { percPorFalta: 0.3107, nome: 'CLÍNICA MÉDICA II' } // 322h
    };
    // **********************************

    function calcularFaltas(disciplinaIdRef) {
        const dataDisciplina = DADOS_DISCIPLINAS_FALTAS[disciplinaIdRef];
        if (!dataDisciplina) {
            console.error("Dados da disciplina não encontrados para:", disciplinaIdRef);
            return;
        }

        const inputElement = document.getElementById(`faltas-${disciplinaIdRef}-input`);
        const resultadoGeralElement = document.getElementById(`faltas-${disciplinaIdRef}-geral`);
        const resultadoProuniElement = document.getElementById(`faltas-${disciplinaIdRef}-prouni`);
        const prouniContainerElement = document.getElementById(`faltas-${disciplinaIdRef}-prouni-container`);

        if (!inputElement || !resultadoGeralElement || !resultadoProuniElement || !prouniContainerElement) {
            console.error("Um ou mais elementos do DOM não foram encontrados para:", disciplinaIdRef);
            return;
        }
        
        const faltasCometidasStr = inputElement.value;
        if (faltasCometidasStr.trim() === '') {
            resultadoGeralElement.textContent = '';
            resultadoProuniElement.textContent = '';
            prouniContainerElement.style.display = 'none';
            return;
        }

        const faltasCometidas = parseInt(faltasCometidasStr);

        if (isNaN(faltasCometidas) || faltasCometidas < 0) {
            resultadoGeralElement.textContent = 'Inválido';
            resultadoProuniElement.textContent = '';
            prouniContainerElement.style.display = 'none';
            return;
        }

        const percPorFalta = dataDisciplina.percPorFalta;
        const currentAbsencePercentage = faltasCometidas * percPorFalta;
        const currentPresencePercentage = 100 - currentAbsencePercentage;

        // Cálculo para 75% de presença (geral)
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

    const botoesCalcular = document.querySelectorAll('.btn-calcular-falta');
    botoesCalcular.forEach(botao => {
        botao.addEventListener('click', () => {
            const disciplinaIdRef = botao.getAttribute('data-disciplina-ref');
            calcularFaltas(disciplinaIdRef);
        });
    });

    const inputsFaltas = document.querySelectorAll('.input-group-faltas input[type="number"]');
    inputsFaltas.forEach(input => {
        input.addEventListener('input', (event) => {
            if (event.target.value.trim() === '') {
                const disciplinaIdRef = event.target.id.split('-')[1];
                const resultadoGeralElement = document.getElementById(`faltas-${disciplinaIdRef}-geral`);
                const prouniContainerElement = document.getElementById(`faltas-${disciplinaIdRef}-prouni-container`);
                
                if(resultadoGeralElement) resultadoGeralElement.textContent = '';
                if(prouniContainerElement) prouniContainerElement.style.display = 'none';
            }
        });
    });
});
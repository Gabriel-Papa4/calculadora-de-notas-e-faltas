document.addEventListener('DOMContentLoaded', () => {
    const DADOS_DISCIPLINAS_FALTAS = {
        'iah': { percPorFalta: 1.39, nome: 'INTERAÇÃO AGENTE HOSPEDEIRO II' },
        'hm': { percPorFalta: 2.78, nome: 'HABILIDADES MÉDICAS III' },
        'iic': { percPorFalta: 2.78, nome: 'PATOLOGIA GERAL' },
        'sa': { percPorFalta: 1.39, nome: 'SAÚDE MENTAL I' },
        'ss': { percPorFalta: 0.695, nome: 'SEMIOLOGIA I' },
        'farma': { percPorFalta: 1.39, nome: 'FARMACOLOGIA II' },
        'ff': { percPorFalta: 0.695, nome: 'FISIOLOGIA E FISIOPATOLOGIA IV' }
    };

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
        if (faltasCometidasStr.trim() === '') { // Verifica se o campo está vazio
            resultadoGeralElement.textContent = ''; // Limpa resultados se o campo estiver vazio
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
        }
        resultadoGeralElement.textContent = `${podeTerGeral} faltas`;

        // Cálculo para 80% de presença (PROUNI)
        let podeTerProuni = 0;
        if (currentPresencePercentage > 80) {
            podeTerProuni = Math.floor((currentPresencePercentage - 80) / percPorFalta);
        }
        resultadoProuniElement.textContent = `Obs: PROUNI = ${podeTerProuni} faltas`;
        prouniContainerElement.style.display = 'block'; // Mostra o container do PROUNI
    }

    const botoesCalcular = document.querySelectorAll('.btn-calcular-falta');
    botoesCalcular.forEach(botao => {
        botao.addEventListener('click', () => {
            const disciplinaIdRef = botao.getAttribute('data-disciplina-ref');
            calcularFaltas(disciplinaIdRef);
        });
    });

    // Adiciona listener para limpar os resultados se o input for limpo
    const inputsFaltas = document.querySelectorAll('.input-group-faltas input[type="number"]');
    inputsFaltas.forEach(input => {
        input.addEventListener('input', (event) => {
            if (event.target.value.trim() === '') {
                const disciplinaIdRef = event.target.id.split('-')[1]; // Extrai 'iah' de 'faltas-iah-input'
                const resultadoGeralElement = document.getElementById(`faltas-${disciplinaIdRef}-geral`);
                const prouniContainerElement = document.getElementById(`faltas-${disciplinaIdRef}-prouni-container`);
                
                if(resultadoGeralElement) resultadoGeralElement.textContent = '';
                if(prouniContainerElement) prouniContainerElement.style.display = 'none';
            }
        });
    });
});
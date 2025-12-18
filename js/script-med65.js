// Em js/script.js

// Função formatarNota (mantida)
function formatarNota(nota) {
    if (typeof nota !== 'number' || isNaN(nota)) {
        return "N/A";
    }
    return nota.toFixed(2);
}

// Função obterMensagem (mantida - retorna o texto)
function obterMensagem(nota) {
    if (nota === null || typeof nota === 'undefined' || isNaN(nota)) {
        // Esta mensagem não deve ser exibida quando o resultado for "Notas necessárias para..."
        // Ela é para a média final calculada.
        return "Preencha os campos para calcular.";
    }
    if (nota === 10) return "Gabaritou! Encontramos nosso 01!";
    if (nota >= 9) return "Excelente nota!";
    if (nota >= 8) return "Ótima nota!";
    if (nota >= 7.5) return "Boa nota!";
    if (nota >= 7) return "Parabéns! Você passou!"; // A mensagem de aprovação já é tratada no HTML
    if (nota >= 6.9) return "Calma, provavelmente vão te passar."; 
    if (nota >= 3) return "Prova final, boa sorte!"; 
    return "Reprovado, Med66 te recebe de braços abertos!";

}

// Função verificarAprovacaoAutomaticaComNotasAtuais (revisada para clareza)
function verificarAprovacaoAutomaticaComNotasAtuais(p1, p2, p3) {
    const PASSING_GRADE = 7;
    const P1_WEIGHT = 5, P2_WEIGHT = 5, P3_WEIGHT = 1;
    const TOTAL_SEMESTER_WEIGHT = P1_WEIGHT + P2_WEIGHT + P3_WEIGHT;

    let pontosPonderadosObtidos = 0;
    let pesoTotalFaltante = 0;

    // Calcula os pontos obtidos e o peso total faltante
    if (p1 !== null && !isNaN(p1)) {
        pontosPonderadosObtidos += p1 * P1_WEIGHT;
    } else {
        pesoTotalFaltante += P1_WEIGHT;
    }

    if (p2 !== null && !isNaN(p2)) {
        pontosPonderadosObtidos += p2 * P2_WEIGHT;
    } else {
        pesoTotalFaltante += P2_WEIGHT;
    }

    if (p3 !== null && !isNaN(p3)) {
        pontosPonderadosObtidos += p3 * P3_WEIGHT;
    } else {
        pesoTotalFaltante += P3_WEIGHT;
    }

    // Se não há notas faltantes, já está tudo calculado na parte principal.
    if (pesoTotalFaltante === 0) {
        return false;
    }

    // Calcular o máximo de pontos que ainda poderiam ser obtidos
    const maxPontosPossiveisAdicionais = pesoTotalFaltante * 10; // Assume 10 em todas as notas que faltam
    const mediaMaxPossivel = (pontosPonderadosObtidos + maxPontosPossiveisAdicionais) / TOTAL_SEMESTER_WEIGHT;

    // Se a média máxima possível for menor que 7, não há chance de passar.
    if (mediaMaxPossivel < PASSING_GRADE - 0.005) { // Pequena margem de erro
        return false;
    }

    // Se a média mínima possível (assumindo 0 para o que falta) já for >= 7,
    // então a aprovação é automática.
    const mediaMinPossivel = pontosPonderadosObtidos / TOTAL_SEMESTER_WEIGHT;
    if (mediaMinPossivel >= PASSING_GRADE - 0.005) { // Pequena margem de erro
        return true;
    }

    return false;
}


// Função limparCampos (ajustada para resetar classes da mensagem e esconder elementos)
function limparCampos(formElementContext) {
    let formToClear = formElementContext;
    if (!formElementContext || typeof formElementContext.querySelectorAll !== 'function') {
        formToClear = document.getElementById('calculadora-form'); // Fallback
    }

    if (formToClear) {
        const inputs = formToClear.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.value = '';
        });
        
        // Esconder seções de componentes
        const detailsDivs = formToClear.querySelectorAll('.p1-components-details, .p2-components-details');
        detailsDivs.forEach(div => {
            div.style.display = 'none';
        });

        // Resetar setas
        const arrowButtons = formToClear.querySelectorAll('.expand-arrow-button');
        arrowButtons.forEach(button => {
            button.classList.remove('expanded');
        });
    }
    
    const resultadoDiv = formToClear ? formToClear.closest('.calculadora').querySelector('#resultado') : document.getElementById('resultado');
    
    if (resultadoDiv) {
        resultadoDiv.style.display = 'none';
        // Resetar classes do resultado div principal (se houver)
        resultadoDiv.classList.remove('aprovado', 'recuperacao', 'reprovado');

        const mediaFinalDiv = resultadoDiv.querySelector('#media-final');
        const notasNecessariasDiv = resultadoDiv.querySelector('#notas-necessarias');
        const mensagemEl = resultadoDiv.querySelector('#mensagem');
        const notaFinalEl = resultadoDiv.querySelector('#nota-final');

        if (mediaFinalDiv) {
            mediaFinalDiv.style.display = 'none';
            mediaFinalDiv.classList.remove('aprovado', 'recuperacao', 'reprovado'); // Garante que a div pai também limpe
            const linkPfWrapper = mediaFinalDiv.querySelector('.link-pf-wrapper');
            if (linkPfWrapper) linkPfWrapper.remove();
        }
        if (notasNecessariasDiv) {
            notasNecessariasDiv.innerHTML = '';
            notasNecessariasDiv.classList.remove('aprovado', 'recuperacao', 'reprovado'); // Garante que a div de notas necessarias também limpe
        }
        if (mensagemEl) {
            mensagemEl.textContent = '';
            mensagemEl.className = ''; // Limpa todas as classes
            mensagemEl.classList.add('default-msg'); // Volta para a classe padrão
        }
        if (notaFinalEl) {
            notaFinalEl.textContent = '0.00'; // Reseta a nota final
        }
    }
}


// Listener de toggle genérico (mantido como corrigido anteriormente)
document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('click', function(event) {
        const toggleHeader = event.target.closest('.p1-toggle-header, .p2-toggle-header');
        if (toggleHeader) {
            let clickedOnMainInputOrLabel = false;
            const mainGradeInput = toggleHeader.querySelector('input[type="number"][id$="-completa"]');
            if (mainGradeInput) {
                if (mainGradeInput === event.target) { 
                    clickedOnMainInputOrLabel = true;
                } else { 
                    const mainGradeLabel = toggleHeader.querySelector(`label[for="${mainGradeInput.id}"]`);
                    if (mainGradeLabel && mainGradeLabel.contains(event.target)) {
                        clickedOnMainInputOrLabel = true;
                    }
                }
            }
            if (!clickedOnMainInputOrLabel) {
                const targetDetailsId = toggleHeader.getAttribute('data-target-details');
                const detailsDiv = document.getElementById(targetDetailsId);
                const arrowButton = toggleHeader.querySelector('.expand-arrow-button');
                if (detailsDiv && arrowButton) {
                    const isExpanded = detailsDiv.style.display === 'block';
                    detailsDiv.style.display = isExpanded ? 'none' : 'block';
                    arrowButton.classList.toggle('expanded', !isExpanded);
                }
            }
        }
    });
});
/**
 * Website do Dr. Alex de Aleixo - Inteligência de Interface e Regras de Negócio
 * Versão: 2.1 (Alta Performance, Interatividade em Imagens e Credenciais Atualizadas)
 */

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. EFEITO NAVBAR & BOTÃO BACK-TO-TOP ---
    const navbar = document.querySelector('.aa-navbar');
    const backToTopBtn = document.createElement('button');
    
    backToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTopBtn.className = 'aa-back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // --- 2. SCROLLSPY NATIVO ---
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.aa-navbar .nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // --- 3. SCROLL SUAVE PARA LINKS ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetPosition = targetSection.offsetTop - 90;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    const navbarCollapse = document.getElementById('aaNav');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            }
        });
    });


    // --- 4. ANIMATION REVEAL ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, { root: null, threshold: 0.05, rootMargin: "0px 0px -30px 0px" });
    
    revealElements.forEach(el => revealObserver.observe(el));


    // --- 5. CONTADORES NUMÉRICOS ---
    const counters = document.querySelectorAll('[data-counter]');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-counter');
                const duration = 2000;
                const startTime = performance.now();

                const tick = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(eased * target);
                    entry.target.innerText = current;
                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                requestAnimationFrame(tick);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    counters.forEach(counter => counterObserver.observe(counter));


    // --- 6. ATUALIZAÇÃO DO ANO NO FOOTER ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- 7. EFEITO PARALLAX SUTIL NA IMAGEM DE PERFIL (PROFISSIONAL) ---
    // Cria uma interação premium e focada na seriedade quando o cursor passa sobre a foto.
    const profileContainer = document.getElementById('profileImageContainer');
    const profileImage = document.getElementById('profileImage');

    if (profileContainer && profileImage) {
        profileContainer.addEventListener('mousemove', (e) => {
            const rect = profileContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calcula a porcentagem da posição do mouse
            const xPercent = x / rect.width;
            const yPercent = y / rect.height;
            
            // Movimento máximo de 12 pixels para manter a sobriedade
            const moveX = (xPercent - 0.5) * 12; 
            const moveY = (yPercent - 0.5) * 12;

            // Aplica um leve zoom e move a imagem sutilmente na direção oposta ao centro
            profileImage.style.transform = `scale(1.04) translate(${moveX}px, ${moveY}px)`;
        });

        profileContainer.addEventListener('mouseleave', () => {
            // Retorna ao estado original suavemente
            profileImage.style.transform = `scale(1) translate(0px, 0px)`;
        });
    }
});


// --- 8. FORMULÁRIO: MÁSCARA, VALIDAÇÃO INLINE E ENVIO VIA WHATSAPP ---

// Máscara de telefone brasileiro: (74) 98111-6496
function applyPhoneMask(input) {
    input.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 10) {
            v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (v.length > 6) {
            v = v.replace(/^(\d{2})(\d{4})(\d*)$/, '($1) $2-$3');
        } else if (v.length > 2) {
            v = v.replace(/^(\d{2})(\d*)$/, '($1) $2');
        } else if (v.length > 0) {
            v = v.replace(/^(\d*)$/, '($1');
        }
        this.value = v;
    });
}

// Contador de caracteres no textarea
function initCharCounter(textareaId, counterId, max) {
    const ta = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);
    if (!ta || !counter) return;
    ta.addEventListener('input', function() {
        const len = this.value.length;
        counter.textContent = `${len}/${max}`;
        counter.classList.toggle('aa-char-warn', len > max * 0.85);
    });
}

// Validação inline por campo (mostra erro embaixo do campo ao sair do foco)
function initInlineValidation() {
    const rules = {
        nome: {
            validate: v => v.trim().split(' ').filter(Boolean).length >= 2,
            msg: 'Informe nome e sobrenome.'
        },
        telefone: {
            validate: v => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(v.trim()),
            msg: 'Número inválido. Ex: (74) 98111-6496'
        },
        assunto: {
            validate: v => v !== '',
            msg: 'Selecione a área jurídica.'
        },
        mensagem: {
            validate: v => v.trim().length >= 20,
            msg: 'Descreva brevemente os fatos (mín. 20 caracteres).'
        }
    };

    Object.entries(rules).forEach(([id, rule]) => {
        const el = document.getElementById(id);
        if (!el) return;

        const feedbackEl = document.createElement('div');
        feedbackEl.className = 'aa-field-feedback';
        feedbackEl.setAttribute('aria-live', 'polite');
        el.parentNode.insertAdjacentElement('afterend', feedbackEl);

        const validate = () => {
            const ok = rule.validate(el.value);
            el.classList.toggle('aa-input-error', !ok);
            el.classList.toggle('aa-input-ok', ok);
            feedbackEl.textContent = ok ? '' : rule.msg;
            feedbackEl.className = `aa-field-feedback ${ok ? '' : 'aa-feedback-error'}`;
            return ok;
        };

        el.addEventListener('blur', validate);
        el.addEventListener('input', () => {
            if (el.classList.contains('aa-input-error')) validate();
        });

        el._aaValidate = validate;
    });
}

function processConsultationForm() {
    const form = document.getElementById('contactForm');
    const btnSubmit = document.getElementById('btnSubmit');

    // Dispara validação inline em todos os campos
    const fields = ['nome', 'telefone', 'assunto', 'mensagem'];
    let allValid = true;
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && el._aaValidate) {
            if (!el._aaValidate()) allValid = false;
        }
    });

    if (!allValid) {
        // Foca o primeiro campo inválido
        const firstInvalid = fields.map(id => document.getElementById(id)).find(el => el?.classList.contains('aa-input-error'));
        firstInvalid?.focus();
        showFormAlert('Corrija os campos destacados antes de prosseguir.', 'danger');
        return false;
    }

    const nome     = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const assunto  = document.getElementById('assunto').value;
    const mensagem = document.getElementById('mensagem').value.trim();

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Preparando mensagem...`;

    const hora = new Date().getHours();
    let saudacao = hora >= 5 && hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

    const numeroAdvogado = '5574981116496';
    const textoMensagem =
        `${saudacao}, Dr. Alex de Aleixo.\n\n` +
        `*SOLICITAÇÃO DE PARECER / CONSULTORIA*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `• *Requerente:* ${nome}\n` +
        `• *Contato:* ${telefone}\n` +
        `• *Área de Interesse:* ${assunto}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*Resumo dos Fatos:*\n${mensagem}`;

    const urlWhatsApp = `https://wa.me/${numeroAdvogado}?text=${encodeURIComponent(textoMensagem)}`;

    setTimeout(() => {
        window.open(urlWhatsApp, '_blank');

        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `<i class="bi bi-whatsapp me-2 fs-5"></i> Solicitar Atendimento via WhatsApp`;

        form.reset();
        // Limpa estados visuais de validação
        ['nome', 'telefone', 'assunto', 'mensagem'].forEach(id => {
            const el = document.getElementById(id);
            el?.classList.remove('aa-input-ok', 'aa-input-error');
        });
        document.querySelectorAll('.aa-field-feedback').forEach(el => {
            el.textContent = '';
            el.className = 'aa-field-feedback';
        });
        const counter = document.getElementById('mensagemCounter');
        if (counter) counter.textContent = `0/600`;

        showFormAlert('Mensagem enviada! Em instantes você será redirecionado ao WhatsApp.', 'success');
    }, 1000);
}

function showFormAlert(message, type) {
    const alertContainer = document.getElementById('formAlertContainer');
    const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show mb-4" role="alert" style="font-size:0.9rem; border-radius:6px;">
            <i class="bi ${icon} me-2"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        </div>
    `;
}

// Inicializa melhorias do formulário assim que o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) applyPhoneMask(phoneInput);

    initInlineValidation();
    initCharCounter('mensagem', 'mensagemCounter', 600);
});


// --- 9. BANNER DE CONSENTIMENTO LGPD ---
function initLGPDBanner() {
    if (!localStorage.getItem('lgpd_consent')) {
        const banner = document.createElement('div');
        banner.className = 'aa-lgpd-banner';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', 'Aviso de cookies e privacidade');
        banner.innerHTML = `
            <div class="aa-lgpd-icon" aria-hidden="true">
                <i class="bi bi-shield-lock-fill"></i>
            </div>
            <div class="aa-lgpd-text">
                <strong>Privacidade e Proteção de Dados</strong>
                Utilizamos cookies estritamente necessários para o funcionamento do site. Suas informações são tratadas com total sigilo, conforme a <abbr title="Lei Geral de Proteção de Dados">LGPD</abbr> e os princípios éticos da advocacia.
            </div>
            <div class="aa-lgpd-actions">
                <button id="btnAcceptCookies" class="aa-lgpd-accept">
                    <i class="bi bi-check-lg me-1"></i> Entendido
                </button>
            </div>
        `;
        document.body.appendChild(banner);

        // Delay to allow layout to settle
        requestAnimationFrame(() => {
            setTimeout(() => banner.classList.add('show'), 800);
        });

        document.getElementById('btnAcceptCookies').addEventListener('click', () => {
            localStorage.setItem('lgpd_consent', 'true');
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 500);
        });
    }
}

// --- 10. ACESSIBILIDADE (AUMENTAR/DIMINUIR FONTE) ---
function initAccessibility() {
    const a11yContainer = document.createElement('div');
    a11yContainer.className = 'aa-accessibility-tools';
    a11yContainer.setAttribute('role', 'group');
    a11yContainer.setAttribute('aria-label', 'Ajuste de tamanho de fonte');
    a11yContainer.innerHTML = `
        <button id="btnA11yPlus" class="btn-a11y" aria-label="Aumentar fonte">A+</button>
        <button id="btnA11yMinus" class="btn-a11y" aria-label="Diminuir fonte">A-</button>
    `;
    document.body.appendChild(a11yContainer);

    let currentFontSize = 100;
    const bodyEl = document.body;

    // Recalcula o bottom dos botões de acessibilidade com base na altura real do back-to-top
    function repositionA11y() {
        const backToTop = document.querySelector('.aa-back-to-top');
        if (!backToTop) return;
        const btnH = backToTop.offsetHeight || 48;
        const btnBottom = parseInt(getComputedStyle(backToTop).bottom) || 80;
        // Empilha os dois botões A11y acima do back-to-top com gap de 10px por botão
        const a11yBtnH = a11yContainer.querySelector('.btn-a11y')?.offsetHeight || 44;
        const gap = 10;
        const newBottom = btnBottom + btnH + gap;
        a11yContainer.style.bottom = `${newBottom}px`;
    }

    // Aguarda o back-to-top ser injetado e então reposiciona
    requestAnimationFrame(() => setTimeout(repositionA11y, 100));
    window.addEventListener('resize', repositionA11y);

    document.getElementById('btnA11yPlus').addEventListener('click', () => {
        if (currentFontSize < 120) {
            currentFontSize += 10;
            bodyEl.style.fontSize = `${currentFontSize}%`;
        }
    });

    document.getElementById('btnA11yMinus').addEventListener('click', () => {
        if (currentFontSize > 90) {
            currentFontSize -= 10;
            bodyEl.style.fontSize = `${currentFontSize}%`;
        }
    });
}

// --- 11. INDICADOR DE STATUS (ABERTO/PLANTÃO) ---
function updateBusinessStatus() {
    // Procura o local onde o status será inserido (ex: dentro da seção de contato)
    const contatoInfo = document.querySelector('.aa-info-item i.bi-clock-history')?.parentNode;
    if (!contatoInfo) return; // Se não houver um ícone de relógio, ignora

    const now = new Date();
    // Horário de Brasília (Bahia costuma seguir Brasília)
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Domingo, 6 = Sábado

    let statusText = "";
    let statusClass = "";

    // Horário Comercial: Seg a Sex, das 8h às 14h
    if (currentDay >= 1 && currentDay <= 5 && currentHour >= 8 && currentHour < 14) {
        statusText = "Aberto Agora";
        statusClass = "text-success";
    } else {
        statusText = "Plantão de Urgências Criminais (24h)";
        statusClass = "text-warning";
    }

    const statusEl = document.createElement('div');
    statusEl.className = `mt-2 fw-bold ${statusClass}`;
    statusEl.innerHTML = `<i class="bi bi-circle-fill" style="font-size: 0.6rem; vertical-align: middle;"></i> ${statusText}`;
    
    contatoInfo.appendChild(statusEl);
}

// Inicializar as novas funções assim que o DOM carregar
document.addEventListener("DOMContentLoaded", function() {
    initLGPDBanner();
    initAccessibility();
    updateBusinessStatus();
});
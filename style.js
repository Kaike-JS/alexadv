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


// --- 8. VALIDAÇÃO AVANÇADA E PROCESSAMENTO DO WHATSAPP ---
function processConsultationForm() {
    const form = document.getElementById('contactForm');
    const btnSubmit = document.getElementById('btnSubmit');
    
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const assunto = document.getElementById('assunto').value;
    const mensagem = document.getElementById('mensagem').value.trim();
    
    if (!nome || !telefone || !assunto || !mensagem) {
        form.classList.add('was-validated');
        showFormAlert("Por favor, preencha todos os campos obrigatórios para prosseguir.", "danger");
        return false;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Validando credenciais seguras...`;
    
    const hora = new Date().getHours();
    let saudacao = "Olá";
    if (hora >= 5 && hora < 12) saudacao = "Bom dia";
    else if (hora >= 12 && hora < 18) saudacao = "Boa tarde";
    else saudacao = "Boa noite";

    // OAB 60.639 e WhatsApp Atualizado
    const numeroAdvogado = "5574981116496"; 
    const textoMensagem = `${saudacao}, Dr. Alex de Aleixo.\n\n` +
                          `*SOLICITAÇÃO DE PARECER / CONSULTORIA*\n` +
                          `----------------------------------------\n` +
                          `• *Requerente:* ${nome}\n` +
                          `• *Contato:* ${telefone}\n` +
                          `• *Área de Interesse:* ${assunto}\n` +
                          `----------------------------------------\n` +
                          `*Resumo Fático:*\n${mensagem}`;
    
    const urlWhatsApp = `https://wa.me/${numeroAdvogado}?text=${encodeURIComponent(textoMensagem)}`;
    
    setTimeout(() => {
        window.open(urlWhatsApp, '_blank');
        
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `<i class="bi bi-whatsapp me-2 fs-5"></i> Solicitar Atendimento via WhatsApp`;
        form.reset();
        form.classList.remove('was-validated');
    }, 1200);
}

function showFormAlert(message, type) {
    const alertContainer = document.getElementById('formAlertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="font-size:0.9rem; border-radius:4px;">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}


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
    a11yContainer.innerHTML = `
        <button id="btnA11yMinus" class="btn-a11y" aria-label="Diminuir fonte">A-</button>
        <button id="btnA11yPlus" class="btn-a11y" aria-label="Aumentar fonte">A+</button>
    `;
    document.body.appendChild(a11yContainer);

    let currentFontSize = 100;
    const bodyEl = document.body;

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

    // Horário Comercial: Seg a Sex, das 8h às 18h
    if (currentDay >= 1 && currentDay <= 5 && currentHour >= 8 && currentHour < 18) {
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
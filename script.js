document.addEventListener('DOMContentLoaded', () => {

    const carousel = document.querySelector('.question-carousel');
    const cards = document.querySelectorAll('.question-card');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    const sectionTitle = document.getElementById('section-title');
    const progressBar = document.getElementById('progress-bar');
    const contactBox = document.querySelector('.contact-box');
    const toggleBtn = document.getElementById('contact-toggle-btn');
    const mainContainer = document.querySelector('.main-container');
    const discordUser = document.getElementById('discord-user');
    const emailAddress = document.getElementById('email-address');
    let currentCardIndex = 0;
    const userAnswers = {};

    const sectionTitles = {
        '1': { number: 'SECCIÓN 1', text: 'PERFIL Y EXPERIENCIA' },
        '2': { number: 'SECCIÓN 2', text: 'RAZONES Y DESAFÍOS' },
        '3': { number: 'SECCIÓN 3', text: 'ESTRATEGIAS Y ENFOQUES' },
        '4': { number: 'SECCIÓN 4', text: 'HERRAMIENTAS' }
    };

    function updateCarousel() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next');
            if (index === currentCardIndex) {
                card.classList.add('active');
            } else if (index === currentCardIndex - 1) {
                card.classList.add('prev');
            } else if (index === currentCardIndex + 1) {
                card.classList.add('next');
            }
        });
        
        const progressPercentage = ((currentCardIndex + 1) / cards.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        prevBtn.disabled = currentCardIndex === 0;
        
        if (currentCardIndex === cards.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
        
        const currentCard = cards[currentCardIndex];
        const section = currentCard.dataset.section;
        const titleInfo = sectionTitles[section];
        if (titleInfo) {
            sectionTitle.innerHTML = `<span class="section-badge">${titleInfo.number}</span> <span class="section-text">${titleInfo.text}</span>`;
        }
        
        checkIfAnswered();
    }

    function checkIfAnswered() {
        const currentCard = cards[currentCardIndex];
        const isAnswered = currentCard.querySelector('input[type="radio"]:checked');
        if (currentCardIndex === cards.length - 1) {
            submitBtn.disabled = !isAnswered;
        } else {
            nextBtn.disabled = !isAnswered;
        }
    }

    nextBtn.addEventListener('click', () => {
        if (currentCardIndex < cards.length - 1) {
            currentCardIndex++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            updateCarousel();
        }
    });

    carousel.addEventListener('change', (event) => {
        if (event.target.type === 'radio') {
            const questionName = event.target.name;
            const answerValue = event.target.value;
            userAnswers[questionName] = answerValue;
            checkIfAnswered();
        }
    });

    submitBtn.addEventListener('click', () => {
        const formspreeURL = 'https://formspree.io/f/meorvprl';
        fetch(formspreeURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userAnswers),
        })
        .then(response => {
            let message = '';
            if (response.ok) {
                message = `<div style="text-align: center; padding: 50px; font-size: 1.5rem;"><h1>¡Gracias!</h1><p>Tus respuestas han sido enviadas con éxito.</p></div>`;
            } else {
                message = `<div style="text-align: center; padding: 50px; font-size: 1.5rem;"><h1>Error</h1><p>Hubo un problema al enviar tus respuestas. Por favor, inténtalo de nuevo.</p></div>`;
            }
            document.body.innerHTML = message;
        })
        .catch(error => {
            console.error('Error:', error);
            document.body.innerHTML = `<div style="text-align: center; padding: 50px; font-size: 1.5rem;"><h1>Error de Conexión</h1><p>No se pudo conectar con el servidor.</p></div>`;
        });
    });

    function closeContactBox() {
        contactBox.classList.add('closed');
        toggleBtn.classList.remove('hidden');
    }

    function openContactBox() {
        contactBox.classList.remove('closed');
        toggleBtn.classList.add('hidden');
    }

    toggleBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que el clic se propague al documento
        openContactBox();
    });

    function showToast(message) {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.add('fade-out');
        }, 2000);

        setTimeout(() => {
            toast.remove();
        }, 2300); // 2000ms de visible + 300ms de animación de salida
    }

    // Evento para copiar el usuario de Discord
    discordUser.addEventListener('click', () => {
        navigator.clipboard.writeText(discordUser.textContent).then(() => {
            showToast('¡Usuario de Discord copiado!');
        }).catch(err => {
        console.error('Error al copiar usuario de Discord: ', err);
            showToast('No se pudo copiar');
        });
    });

    // Evento para copiar el correo electrónico
    emailAddress.addEventListener('click', (event) => {
    // Detiene la acción por defecto del enlace 'mailto:' para solo copiar
        event.preventDefault(); 

        navigator.clipboard.writeText(emailAddress.textContent).then(() => {
            showToast('¡Correo electrónico copiado!');
        }).catch(err => {
            console.error('Error al copiar correo: ', err);
            showToast('No se pudo copiar');
        });
    });

    document.addEventListener('click', (event) => {
        // Si el cuadro NO está cerrado Y el clic fue fuera del cuadro
        if (!contactBox.classList.contains('closed') && !contactBox.contains(event.target)) {
            closeContactBox();
        }
    });

    updateCarousel();
});

document.addEventListener('DOMContentLoaded', () => {
  // Element references
  const darkModeToggle = document.getElementById('darkModeToggle');
  const feedbackBtn = document.getElementById('feedbackBtn');
  const feedbackArea = document.getElementById('feedbackArea');
  const feedbackText = document.getElementById('feedbackText');
  const cancelFeedback = document.getElementById('cancelFeedback');
  const sendFeedback = document.getElementById('sendFeedback');
  const toast = document.getElementById('toast');
  const confidenceBar = document.getElementById('confidence-bar');
  const credibility = document.getElementById('credibility');

  // Dark Mode Toggle
  // Corrigido: inicializa corretamente o estado e troca o ícone SEM precisar de dois cliques
  if (localStorage.getItem('tf-dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="bi bi-brightness-high"></i>';
  } else {
    darkModeToggle.innerHTML = '<i class="bi bi-moon"></i>';
  }
  darkModeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('tf-dark-mode', isDark);
    darkModeToggle.innerHTML = isDark ? '<i class="bi bi-brightness-high"></i>' : '<i class="bi bi-moon"></i>';
  });

  // Initialize confidence bar
  confidenceBar.style.width = '0%';
  credibility.textContent = '0%';

  setTimeout(() => {
    confidenceBar.style.width = '100%';
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      credibility.textContent = `${progress}%`;
      if (progress >= 95) clearInterval(interval);
    }, 15);
  }, 300);

  // Inicialmente, só o botão de feedback fica visível
  feedbackArea.classList.add('hidden');
  feedbackBtn.classList.remove('hidden');

  // Feedback functionality
  feedbackBtn.addEventListener('click', () => {
    feedbackArea.classList.remove('hidden');
    feedbackBtn.classList.add('hidden');
  });

  cancelFeedback.addEventListener('click', () => {
    feedbackArea.classList.add('hidden');
    feedbackBtn.classList.remove('hidden');
    feedbackText.value = '';
  });

  sendFeedback.addEventListener('click', () => {
    const feedback = feedbackText.value.trim();

    if (!feedback) {
      alert('Por favor, escreva algo antes de enviar.');
      return;
    }

    // Show toast notification
    toast.classList.add('show');

    // Reset form
    setTimeout(() => {
      feedbackArea.classList.add('hidden');
      feedbackBtn.classList.remove('hidden');
      feedbackText.value = '';

      // Hide toast after 3 seconds
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }, 1000);
  });
});

document.removeEventListener && document.removeEventListener('click', () => { }); // segurança para evitar duplicidade
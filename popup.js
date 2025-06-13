chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    function: () => {
      return {
        url: window.location.href,
        title: document.title,
        content: document.body.innerText
      };
    }
  }, async (results) => {
    const data = results[0].result;

    console.log('Dados capturados:', data);

    try {
      // Chamada ao backend para análise de veracidade
      const response = await fetch('http://localhost:3000/api/analisar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      console.log('Resposta do backend:', response);

      if (!response.ok) {
        throw new Error('Erro na resposta do backend');
      }

      const resultadoTexto = await response.text();
      // Exemplo de resposta esperada:
      // "Nível de confiança: 95%. Motivos: 1. Motivo 1. 2. Motivo 2. ..."

      // Extrai o nível de confiança
      let nivel = 'Desconhecido';
      const matchNivel = resultadoTexto.match(/Nível de confiança:\s*(\d+)%?/i);
      let percentual = null;
      if (matchNivel) {
        nivel = matchNivel[1] + '%';
        percentual = parseInt(matchNivel[1], 10);
      }
      // Atualiza barra de progresso visual
      const bar = document.getElementById('confidence-bar');
      if (bar && matchNivel) {
        bar.style.width = matchNivel[1] + '%';
        bar.setAttribute('aria-valuenow', matchNivel[1]);
        if (percentual !== null && percentual < 50) {
          bar.classList.add('low');
        } else {
          bar.classList.remove('low');
        }
      }
      // Atualiza valor textual
      document.getElementById('credibility').textContent = nivel;

      // Atualiza status e cor
      const statusText = document.getElementById('status-text');
      const statusDiv = document.querySelector('.tf-status');
      const statusIcon = document.getElementById('status-icon');
      if (percentual !== null && percentual < 50) {
        statusText.textContent = 'Conteúdo Provavelmente Falso';
        statusDiv.classList.add('low');
        if (statusIcon) statusIcon.innerHTML = '<i class="bi bi-x-circle-fill"></i>';
      } else {
        statusText.textContent = 'Conteúdo Provavelmente Verdadeiro';
        statusDiv.classList.remove('low');
        if (statusIcon) statusIcon.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
      }

      // Extrai os motivos
      const motivosElement = document.getElementById('reasons');
      motivosElement.innerHTML = '';
      let motivos = [];
      const matchMotivos = resultadoTexto.match(/Motivos?:\s*(.*)$/is);
      if (matchMotivos) {
        // Divide por número (1. motivo, 2. motivo, ...)
        const motivosStr = matchMotivos[1];
        motivos = motivosStr.split(/\s*\d+\.\s*/).filter(m => m.trim() !== '');
      }
      if (motivos.length > 0) {
        motivos.forEach((motivo, index) => {
          const li = document.createElement('li');
          li.textContent = `${index + 1}. ${motivo.trim()}`;
          motivosElement.appendChild(li);
        });
      } else {
        motivosElement.innerHTML = `<li>Resposta: ${resultadoTexto}</li>`;
      }
    } catch (err) {
      document.getElementById('credibility').textContent = "Erro ao analisar.";
      console.error('Erro ao chamar o backend:', err);
    }
  });
});
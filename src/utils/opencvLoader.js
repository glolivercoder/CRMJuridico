let openCVPromise = null;

export function loadOpenCV() {
  if (openCVPromise) {
    return openCVPromise;
  }

  openCVPromise = new Promise((resolve, reject) => {
    // Se o OpenCV já estiver carregado, retorne imediatamente
    if (window.cv && typeof window.cv.Mat === 'function') {
      console.log('OpenCV já está carregado');
      resolve(window.cv);
      return;
    }

    // Configurar o callback de inicialização
    window.Module = {
      ...window.Module,
      onRuntimeInitialized: function() {
        console.log('OpenCV Runtime inicializado');
        if (window.cv && typeof window.cv.Mat === 'function') {
          resolve(window.cv);
        } else {
          reject(new Error('OpenCV carregado mas Mat não está disponível'));
        }
      }
    };

    // Carregar o script do OpenCV
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', '/assets/opencv.js');

    // Manipuladores de erro e timeout
    const timeoutMS = 10000;
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      reject(new Error(`OpenCV não carregou após ${timeoutMS}ms`));
    }, timeoutMS);

    // Verificar periodicamente se o OpenCV está pronto
    const checkInterval = setInterval(() => {
      if (window.cv && typeof window.cv.Mat === 'function') {
        clearInterval(checkInterval);
        clearTimeout(timeout);
        console.log('OpenCV detectado através do intervalo de verificação');
        resolve(window.cv);
      }
    }, 100);

    // Manipulador de erro do script
    script.onerror = () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
      reject(new Error('Falha ao carregar o script do OpenCV'));
    };

    // Adicionar o script à página
    document.head.appendChild(script);
  });

  return openCVPromise;
}

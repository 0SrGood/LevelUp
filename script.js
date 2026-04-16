// Referências aos elementos
const topbar = document.getElementById('topbar');
const lyricsInput = document.getElementById('lyrics-input');
const presentation = document.getElementById('presentation');
const slideText = document.getElementById('slide-text');
const closeBtn = document.getElementById('close-btn');
const discoContainer = document.getElementById('disco-container');
const imagemCentral = document.getElementById('imagemCentral');
const musicName = document.getElementById('musicName');
const musicNameInput = document.getElementById('musicNameInput');
const viewSlidesBtn = document.getElementById('view-slides-btn');
const slidesContainer = document.getElementById('slides-container');
const slidesFrame = document.getElementById('slides-frame');
const searchSlidesInput = document.getElementById('searchSlidesInput');

// Variáveis de controle
let slides = [];
let currentSlide = 0;
let musicaAtual = null;
let historicoMusicas = [];
let menuAberto = lyricsInput

// ====== Persistência ====== //
function salvarHistorico() {
  if (musicaAtual) {
    // Atualiza o histórico ou adiciona
    const index = historicoMusicas.findIndex(m => m.titulo === musicaAtual.titulo);
    if (index >= 0) {
      historicoMusicas[index] = musicaAtual;
    } else {
      historicoMusicas.push(musicaAtual);
    }
  }
  
  localStorage.setItem('historicoMusicas', JSON.stringify(historicoMusicas));
}

function carregarHistorico() {
  const dados = localStorage.getItem('historicoMusicas');
  if (dados) {
    historicoMusicas = JSON.parse(dados);
    atualizarGaleria();
  }
}

// ====== UI ====== //
function ajustarAltura() {
  lyricsInput.style.height = 'auto';
  let scrollHeight = lyricsInput.scrollHeight;
  const minHeight = 50;
  const maxHeight = 300;
  if (scrollHeight < minHeight) scrollHeight = minHeight;
  if (scrollHeight > maxHeight) scrollHeight = maxHeight;
  lyricsInput.style.maxHeight = scrollHeight + 'px';
  lyricsInput.style.height = scrollHeight + 'px';
}

// Mostra slide pelo índice
function showSlide(index) {
  if (!slides || slides.length === 0) return;
  if (index < 0) index = 0;
  if (index >= slides.length) index = slides.length - 1;
  currentSlide = index;
  slideText.textContent = slides[currentSlide];
}

// Inicia apresentação
function startPresentation() {
  const text = lyricsInput.value.trim();
  if (!text) {
    alert('Por favor, cole a letra da música.');
    return;
  }
  
  slides = text.split(/\r?\n/).filter(line => line.trim() !== '');
  
  if (slides.length === 0) {
    alert('Nenhum trecho válido encontrado.');
    return;
  }

  // Criar musicaAtual com título e imagem atuais
  musicaAtual = {
    titulo: musicName.textContent || 'Sem título',
    imagem: imagemCentral.src || 'imagens/nulo.png',
    slides: slides
  };

  // Atualiza histórico imediatamente
  salvarHistorico();
  atualizarGaleria();

  currentSlide = 0;
  showSlide(currentSlide);
  
  presentation.style.display = 'flex';
  lyricsInput.style.display = 'none';
  topbar.style.display = 'none';
  viewSlidesBtn.style.display = 'none';

  lyricsInput.value = '';
  
  ajustarAltura();
  atualizarGaleria();
}

// Atualiza galeria
function atualizarGaleria() {
  slidesContainer.innerHTML = '';
  historicoMusicas.forEach((musica, idx) => {
    const card = document.createElement('div');
    card.classList.add('slide-card');
    card.innerHTML = `
      <img src="${musica.imagem}" alt="Capa">
      <div>
        <h3>${musica.titulo}</h3>
        <p>${musica.slides.length} slides</p>
      </div>
    `;
    card.addEventListener('click', () => {
      musicaAtual = {...musica};
      slides = musicaAtual.slides;
      currentSlide = 0;
      imagemCentral.src = musicaAtual.imagem;
      musicName.textContent = musicaAtual.titulo;
      showSlide(currentSlide);
      
      presentation.style.display = 'flex';
      lyricsInput.style.display = 'none';
      topbar.style.display = 'none';
      slidesFrame.style.display = 'none';
      viewSlidesBtn.style.display = 'none';
      musicNameInput.style.display = 'none';

      menuAberto = slidesFrame
    });
    slidesContainer.appendChild(card);
  });
}

// ====== Eventos ====== //
closeBtn.addEventListener('click', () => {
  presentation.style.display = 'none';
  menuAberto.style.display = 'block'
  topbar.style.display = 'flex';
  viewSlidesBtn.style.display = 'block';
  musicNameInput.style.display = 'block';
  slideText.textContent = '';
  
  slides = [];
  currentSlide = 0;
  musicaAtual = null;
  imagemCentral.src = 'imagens/nulo.png';
  musicName.textContent = "";
});

document.addEventListener('keydown', e => {
  if (presentation.style.display === 'flex') {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      if (currentSlide > 0) showSlide(currentSlide - 1);
    } else if (e.key === 'Escape') closeBtn.click();
  }
});

lyricsInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    startPresentation();
  }
});

lyricsInput.addEventListener('input', ajustarAltura);
window.addEventListener('load', () => {
  ajustarAltura();
  carregarHistorico();
});

discoContainer.addEventListener('click', () => {
  const novaUrl = prompt('Cole o URL da nova imagem:');
  if (novaUrl) {
    imagemCentral.src = novaUrl;
    if (musicaAtual) musicaAtual.imagem = novaUrl;
  }
});

musicNameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    musicName.textContent = musicNameInput.value;
    if (!musicaAtual) musicaAtual = {};
    musicaAtual.titulo = musicNameInput.value;
    musicNameInput.style.display = 'none';
    musicNameInput.value = '';
  }
});

viewSlidesBtn.addEventListener('click', () => {
  const slidesAtivo = slidesFrame.style.display === 'block';
  if (slidesAtivo) {
    slidesFrame.style.display = 'none';
    lyricsInput.style.display = 'block';
    viewSlidesBtn.textContent = 'Disponíveis';
    menuAberto = lyricsInput
  } else {
    slidesFrame.style.display = 'block';
    lyricsInput.style.display = 'none';
    viewSlidesBtn.textContent = 'Criar';
    menuAberto = slidesFrame
  }
});

// Salva no localStorage ao fechar/atualizar página
window.addEventListener('beforeunload', () => {
  salvarHistorico();
});

searchSlidesInput.addEventListener('input', () => {
  const termo = searchSlidesInput.value.toLowerCase();
  const cards = slidesContainer.getElementsByClassName('slide-card');

  Array.from(cards).forEach(card => {
    const titulo = card.querySelector('h3').textContent.toLowerCase();
    if (titulo.includes(termo)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
});

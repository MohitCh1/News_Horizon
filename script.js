const API_KEY = "48556e3906024e638aa56f953cc274bb";
const url = "https://newsapi.org/v2/everything?q=";
window.addEventListener("load", () => fetchNews("India")); // Fetch news for India on page load

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const response = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log(data);
        bindData(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function bindData(articles) {
    const cardContainer = document.getElementById('container-cards');
    const newsCardTemplate = document.getElementById('template-news-card');
    cardContainer.innerHTML = "";
    articles.forEach(article => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsimg = cardClone.querySelector('#news-img');
    const newstitle = cardClone.querySelector('#news-title');
    const newssource = cardClone.querySelector('#news-source');
    const newsdesc = cardClone.querySelector('#news-desc');
    newsimg.src = article.urlToImage;
    newstitle.innerHTML = article.title;
    newsdesc.innerHTML = article.description;
    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    newssource.innerHTML = `${article.source.name} . ${date}`;
    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavClick(id) {
    fetchNews(id);
    const navItems = document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = navItems;
    curSelectedNav.classList.add('active');
}

const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-text");
searchButton.addEventListener("click", () => {
    const query = searchInput.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = null;
});

// Voice search functionality
const voiceButton = document.getElementById("voice-button");

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Transcript:', transcript); // Debugging line
        searchInput.value = transcript;
        fetchNews(transcript);
        curSelectedNav?.classList.remove('active');
        curSelectedNav = null;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error detected:', event.error);
        if (event.error === 'no-speech') {
            console.log('No speech detected. Please try again.');
        } else if (event.error === 'audio-capture') {
            console.log('Audio capture failed. Please check your microphone.');
        } else if (event.error === 'not-allowed') {
            console.log('Microphone access is not allowed.');
        } else if (event.error === 'aborted') {
            console.log('Speech recognition was aborted.');
        }
    };

    voiceButton.addEventListener("click", () => {
        recognition.start();
        console.log('Voice recognition started');
    });

    recognition.onend = () => {
        console.log('Voice recognition ended');
    };

} else {
    console.error('Web Speech API is not supported in this browser.');
}

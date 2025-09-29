document.addEventListener('DOMContentLoaded', function() {
    // Pages to search through
    const searchablePages = [
        { url: 'index.html', title: 'Homepage' },
        { url: 'sao.html', title: 'Sword Art Online Review' },
        { url: 'ordinalscale.html', title: 'Ordinal Scale Review' },
        { url: "saoprogressive.html", title: 'SAO Progressive Movies Review'},
        { url: 'bocchi.html', title: 'Bocchi the Rock Review'},
        { url: 'hibike.html', title: 'Hibike Euphonium Review'},
        { url: 'dandadan.html', title: 'Dandadan Review'},
        { url: 'liztoaoitori.html', title: 'Liz to Aoi Tori Review'},
        { url: 'haruhi.html', title: 'Haruhi Suzumiya no Yuutsu/Shoushitsu Review'},
        { url: 'shingeki.html', title: 'Shingeki no Kyojin Review'},
        { url: 'anime.html', title: 'Anime Reviews Page'},
    ];

    // Get search query from URL
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    
    if (query) {
        document.querySelector('#query').value = query;
        performSearch(query);
    }

    async function performSearch(searchQuery) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '<p>Searching...</p>';
        
        const results = [];
        const keywords = searchQuery.toLowerCase().split(/\s+/); // split into words
        
        for (const page of searchablePages) {
            try {
                const response = await fetch(page.url);
                const text = await response.text();
                
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                doc.querySelectorAll('script, style').forEach(el => el.remove());
                
                const content = doc.querySelector('#main')?.textContent || doc.body.textContent;
                const lowerContent = content.toLowerCase();
                
                // Match if ANY keyword is found
                const matches = keywords.filter(kw => lowerContent.includes(kw));
                if (matches.length > 0) {
                    const firstMatch = matches[0];
                    const position = lowerContent.indexOf(firstMatch);
                    const snippet = content.substring(
                        Math.max(0, position - 100),
                        Math.min(content.length, position + firstMatch.length + 100)
                    );
                    
                    results.push({
                        title: page.title,
                        url: page.url,
                        snippet: snippet
                    });
                }
            } catch (error) {
                console.error(`Error searching ${page.url}:`, error);
            }
        }
        
        if (results.length > 0) {
            resultsContainer.innerHTML = results.map(result => `
                <div class="search-result">
                    <h3><a href="${result.url}">${result.title}</a></h3>
                    <p>${highlightSearchTerm(result.snippet, searchQuery)}</p>
                    <p class="search-meta">${result.url}</p>
                </div>
            `).join('');
        } else {
            resultsContainer.innerHTML = '<p>No results found.</p>';
        }
    }    

    function highlightSearchTerm(text, searchTerm) {
        const words = searchTerm.trim().split(/\s+/); // split into words
        let highlighted = text;
    
        words.forEach(word => {
            if (word.length > 0) {
                const regex = new RegExp(`(${word})`, 'gi');
                highlighted = highlighted.replace(regex, '<span class="highlight">$1</span>');
            }
        });
    
        return highlighted;
    }
    
});
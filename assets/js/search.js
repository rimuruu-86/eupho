document.addEventListener('DOMContentLoaded', function() {
    // Pages to search through
    const searchablePages = [
        { url: 'index.html', title: 'Homepage' },
        { url: 'sao.html', title: 'Sword Art Online Review' },
        { url: 'ordinalscale.html', title: 'Ordinal Scale Review' },
        { url: "saoprogressive.html", title: 'SAO Progressive Movies Review'},
        { url: 'bocchi.html', title: 'Bocchi the Rock Review'},
        { url: 'hibike.html', title: 'Hibike Euphonium Review'},
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
        
        for (const page of searchablePages) {
            try {
                const response = await fetch(page.url);
                const text = await response.text();
                
                // Create a temporary element to parse the HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                
                // Remove scripts and styles
                doc.querySelectorAll('script, style').forEach(el => el.remove());
                
                // Get the main content
                const content = doc.querySelector('#main')?.textContent || doc.body.textContent;
                
                // Simple search - case insensitive
                if (content.toLowerCase().includes(searchQuery.toLowerCase())) {
                    // Find the relevant snippet
                    const position = content.toLowerCase().indexOf(searchQuery.toLowerCase());
                    const snippet = content.substring(
                        Math.max(0, position - 100),
                        Math.min(content.length, position + searchQuery.length + 100)
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
        
        // Display results
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
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
});
document.addEventListener('DOMContentLoaded', () => {
    function toggleSeason(id, shouldScroll = false) {
        const content = document.getElementById(id);
        const header = content.previousElementSibling;
        const arrow = header.querySelector(".arrow");
        
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        
        // Toggle states
        header.setAttribute('aria-expanded', !isExpanded);
        content.setAttribute('aria-hidden', isExpanded);
        content.style.display = isExpanded ? 'none' : 'block';
        arrow.textContent = isExpanded ? '▶' : '▼';
        
        // If shouldScroll is true and we're expanding, scroll to content after a brief delay
        if (shouldScroll && !isExpanded) {
            setTimeout(() => {
                content.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
        }
    }

    // Add keyboard support
    document.querySelectorAll('.season-header').forEach(header => {
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const id = header.closest('.season').querySelector('.season-content').id;
                toggleSeason(id);
            }
        });
    });

    // Handle anchor clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Find the parent season content
                const seasonContent = targetElement.closest('.season-content');
                if (seasonContent) {
                    const seasonId = seasonContent.id;
                    toggleSeason(seasonId, true);
                }
                // Scroll to the target after expanding
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 200);
            }
        }
    });

    // Make toggleSeason function available globally
    window.toggleSeason = toggleSeason;

    /* search */
    document.addEventListener('DOMContentLoaded', () => {
        const searchForm = document.querySelector('#search form');
        const searchInput = document.querySelector('#search input');
    
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.toLowerCase();
            
            const results = searchIndex.filter(page => 
                page.title.toLowerCase().includes(query) ||
                page.content.toLowerCase().includes(query)
            );
    
            // Create results display
            const resultsHtml = results.map(result => `
                <div class="search-result">
                    <a href="${result.url}">${result.title}</a>
                </div>
            `).join('');
    
            // Display results
            const resultsContainer = document.createElement('div');
            resultsContainer.innerHTML = resultsHtml;
            searchForm.appendChild(resultsContainer);
        });
    });
});
// support "Enter" / Space to activate card when focused (for keyboard users)
  document.querySelectorAll('.review-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
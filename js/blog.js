/**
 * Blog JavaScript
 * Handles dynamic loading of blog posts from JSON
 */

class BlogManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentPage = 1;
        this.postsPerPage = 5;
        this.currentCategory = 'all';
        this.init();
    }

    async init() {
        await this.loadPosts();
        this.renderPosts();
        this.renderSidebar();
        this.setupEventListeners();
    }

    async loadPosts() {
        try {
            const response = await fetch('data/blog-posts.json');
            this.posts = await response.json();

            // Sort posts by date (newest first)
            this.posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

            this.filteredPosts = [...this.posts];
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.showError();
        }
    }

    renderPosts() {
        const postsContainer = document.getElementById('blogPosts');

        if (this.filteredPosts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts">No posts found.</p>';
            return;
        }

        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.filteredPosts.slice(startIndex, endIndex);

        const postsHTML = postsToShow.map(post => this.createPostCard(post)).join('');
        postsContainer.innerHTML = postsHTML;

        this.renderPagination();

        // Update page title and meta description based on filter
        this.updateSEO();
    }

    createPostCard(post) {
        const date = new Date(post.publishDate);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const tagsHTML = post.tags.slice(0, 3).map(tag =>
            `<a href="#" class="post-tag" data-tag="${tag}">#${tag}</a>`
        ).join(' ');

        return `
            <article class="post-card" itemscope itemtype="http://schema.org/BlogPosting">
                <div class="post-card__image-wrapper">
                    <img src="${post.featuredImage}" alt="${post.title}" class="post-card__image" itemprop="image" loading="lazy">
                </div>
                <div class="post-card__content">
                    <div class="post-card__meta">
                        <span class="post-card__category" itemprop="articleSection">${post.category}</span>
                        <span class="post-card__date">
                            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <time datetime="${post.publishDate}" itemprop="datePublished">${formattedDate}</time>
                        </span>
                        <span class="post-card__read-time">
                            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            ${post.readTime}
                        </span>
                    </div>
                    <h2 class="post-card__title" itemprop="headline">${post.title}</h2>
                    <p class="post-card__excerpt" itemprop="description">${post.excerpt}</p>
                    <div class="post-card__footer">
                        <div class="post-card__tags">
                            ${tagsHTML}
                        </div>
                        <a href="blog-post.html?id=${post.id}" class="post-card__read-more" itemprop="url">
                            Continue Reading
                        </a>
                    </div>
                </div>
                <meta itemprop="author" content="${post.author}">
                <meta itemprop="dateModified" content="${post.updatedDate}">
            </article>
        `;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
        const paginationContainer = document.getElementById('blogPagination');

        console.log('Rendering pagination:', {
            totalPosts: this.filteredPosts.length,
            postsPerPage: this.postsPerPage,
            totalPages: totalPages,
            currentPage: this.currentPage
        });

        if (!paginationContainer) {
            console.error('Pagination container not found');
            return;
        }

        if (totalPages <= 1) {
            console.log('Only 1 page, hiding pagination');
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';
        console.log('Pagination visible');

        const prevBtn = paginationContainer.querySelector('.pagination__btn--prev');
        const nextBtn = paginationContainer.querySelector('.pagination__btn--next');
        const numbersContainer = paginationContainer.querySelector('.pagination__numbers');

        if (!prevBtn || !nextBtn || !numbersContainer) {
            console.error('Pagination elements not found');
            return;
        }

        // Update buttons state
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;

        // Generate page numbers (limit to show max 7 pages at a time)
        let numbersHTML = '';
        const maxVisible = 7;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            numbersHTML += `<button class="pagination__number" data-page="1">1</button>`;
            if (startPage > 2) {
                numbersHTML += `<span class="pagination__ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            numbersHTML += `
                <button class="pagination__number ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                numbersHTML += `<span class="pagination__ellipsis">...</span>`;
            }
            numbersHTML += `<button class="pagination__number" data-page="${totalPages}">${totalPages}</button>`;
        }

        numbersContainer.innerHTML = numbersHTML;

        // Add event listeners
        prevBtn.onclick = () => {
            console.log('Previous button clicked');
            this.goToPage(this.currentPage - 1);
        };
        nextBtn.onclick = () => {
            console.log('Next button clicked');
            this.goToPage(this.currentPage + 1);
        };

        numbersContainer.querySelectorAll('.pagination__number').forEach(btn => {
            btn.onclick = () => {
                const page = parseInt(btn.dataset.page);
                console.log('Page button clicked:', page);
                this.goToPage(page);
            };
        });
        console.log('Event listeners attached to pagination buttons');
    }

    goToPage(page) {
        console.log('Going to page:', page);
        this.currentPage = page;
        this.renderPosts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderSidebar() {
        this.renderCalendar();
        this.renderCategories();
        this.renderRecentPosts();
        this.renderTagCloud();
    }

    renderCalendar() {
        const calendarContainer = document.getElementById('blogCalendar');

        // Initialize calendar state if not exists
        if (!this.calendarState) {
            // Find the most recent post date
            const recentPost = this.posts[0]; // Already sorted by date
            const recentDate = new Date(recentPost.publishDate);
            this.calendarState = {
                month: recentDate.getMonth(),
                year: recentDate.getFullYear()
            };
        }

        const currentMonth = this.calendarState.month;
        const currentYear = this.calendarState.year;

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Get post dates for this month
        const postDates = this.posts
            .filter(post => {
                const postDate = new Date(post.publishDate);
                return postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear;
            })
            .map(post => new Date(post.publishDate).getDate());

        let calendarHTML = `
            <div class="calendar-header">
                <div class="calendar-nav">
                    <button onclick="blogManager.changeMonth(-1)" aria-label="Previous month">‹</button>
                </div>
                <span class="calendar-month">${monthNames[currentMonth]} ${currentYear}</span>
                <div class="calendar-nav">
                    <button onclick="blogManager.changeMonth(1)" aria-label="Next month">›</button>
                </div>
            </div>
            <div class="calendar-grid">
                ${dayNames.map(day => `<div class="calendar-day-header">${day}</div>`).join('')}
        `;

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const hasPost = postDates.includes(day);
            calendarHTML += `<div class="calendar-day ${hasPost ? 'has-post' : ''}">${day}</div>`;
        }

        calendarHTML += '</div>';
        calendarContainer.innerHTML = calendarHTML;
    }

    changeMonth(direction) {
        this.calendarState.month += direction;

        if (this.calendarState.month > 11) {
            this.calendarState.month = 0;
            this.calendarState.year++;
        } else if (this.calendarState.month < 0) {
            this.calendarState.month = 11;
            this.calendarState.year--;
        }

        this.renderCalendar();
    }

    renderCategories() {
        const categoriesContainer = document.getElementById('blogCategories');
        const categories = {};

        // Count posts per category
        this.posts.forEach(post => {
            categories[post.category] = (categories[post.category] || 0) + 1;
        });

        let categoriesHTML = `
            <li>
                <a href="#" data-category="all" class="category-link ${this.currentCategory === 'all' ? 'active' : ''}">
                    All Posts
                    <span class="category-count">${this.posts.length}</span>
                </a>
            </li>
        `;

        Object.entries(categories).forEach(([category, count]) => {
            categoriesHTML += `
                <li>
                    <a href="#" data-category="${category}" class="category-link ${this.currentCategory === category ? 'active' : ''}">
                        ${category}
                        <span class="category-count">${count}</span>
                    </a>
                </li>
            `;
        });

        categoriesContainer.innerHTML = categoriesHTML;
    }

    renderRecentPosts() {
        const recentPostsContainer = document.getElementById('recentPosts');
        const recentPosts = this.posts.slice(0, 5);

        const recentPostsHTML = recentPosts.map(post => {
            const date = new Date(post.publishDate);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            return `
                <li class="recent-post-item">
                    <a href="blog-post.html?id=${post.id}" class="recent-post-link">
                        <div class="recent-post-title">${post.title}</div>
                        <div class="recent-post-date">${formattedDate}</div>
                    </a>
                </li>
            `;
        }).join('');

        recentPostsContainer.innerHTML = recentPostsHTML;
    }

    renderTagCloud() {
        const tagCloudContainer = document.getElementById('tagCloud');
        const tagCounts = {};

        // Count tag occurrences
        this.posts.forEach(post => {
            post.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        // Sort tags by count
        const sortedTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20);

        // Determine tag sizes
        const maxCount = Math.max(...sortedTags.map(([, count]) => count));

        const tagCloudHTML = sortedTags.map(([tag, count]) => {
            let sizeClass = 'size-1';
            if (count >= maxCount * 0.7) sizeClass = 'size-3';
            else if (count >= maxCount * 0.4) sizeClass = 'size-2';

            return `<a href="#" class="tag-cloud-item ${sizeClass}" data-tag="${tag}">${tag}</a>`;
        }).join('');

        tagCloudContainer.innerHTML = tagCloudHTML;
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;

        if (category === 'all') {
            this.filteredPosts = [...this.posts];
        } else {
            this.filteredPosts = this.posts.filter(post => post.category === category);
        }

        this.renderPosts();

        // Update active category
        document.querySelectorAll('.category-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.category === category) {
                link.classList.add('active');
            }
        });
    }

    filterByTag(tag) {
        this.currentCategory = 'all';
        this.currentPage = 1;
        this.filteredPosts = this.posts.filter(post => post.tags.includes(tag));
        this.renderPosts();
    }

    updateSEO() {
        // Update page title based on current filter
        let title = 'Blog - Carlos Rodgarman';
        if (this.currentCategory !== 'all') {
            title = `${this.currentCategory} - Blog - Carlos Rodgarman`;
        }
        document.title = title;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && this.currentCategory !== 'all') {
            metaDescription.content = `Explore ${this.currentCategory} articles by Carlos Rodgarman about music production, studio gear, and audio engineering.`;
        }
    }

    setupEventListeners() {
        // Category filter
        document.addEventListener('click', (e) => {
            if (e.target.matches('.category-link')) {
                e.preventDefault();
                this.filterByCategory(e.target.dataset.category);
            }

            // Tag filter
            if (e.target.matches('.tag-cloud-item, .post-tag')) {
                e.preventDefault();
                this.filterByTag(e.target.dataset.tag);
            }
        });
    }

    showError() {
        const postsContainer = document.getElementById('blogPosts');
        postsContainer.innerHTML = `
            <div class="blog-error">
                <h2>Unable to load blog posts</h2>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

// Initialize blog when DOM is ready
let blogManager;
document.addEventListener('DOMContentLoaded', () => {
    blogManager = new BlogManager();
});

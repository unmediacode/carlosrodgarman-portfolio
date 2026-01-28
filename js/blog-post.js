/**
 * Blog Post JavaScript
 * Handles dynamic loading of individual blog posts
 */

class BlogPost {
    constructor() {
        this.post = null;
        this.postId = this.getPostIdFromURL();
        this.init();
    }

    getPostIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async init() {
        if (!this.postId) {
            this.showError();
            return;
        }

        await this.loadPost();

        if (this.post) {
            this.renderPost();
            this.updateSEO();
            this.setupShareButtons();
        } else {
            this.showError();
        }
    }

    async loadPost() {
        try {
            const response = await fetch('data/blog-posts.json');
            const posts = await response.json();
            this.post = posts.find(post => post.id === this.postId);
        } catch (error) {
            console.error('Error loading blog post:', error);
        }
    }

    renderPost() {
        // Hide loading, show content
        const postLoading = document.getElementById('postLoading');
        const postContent = document.getElementById('postContent');

        if (postLoading) postLoading.style.display = 'none';
        if (postContent) postContent.style.display = 'block';

        // Render post data
        const date = new Date(this.post.publishDate);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Update breadcrumb
        const breadcrumbTitle = document.getElementById('breadcrumbTitle');
        if (breadcrumbTitle) {
            breadcrumbTitle.textContent = this.post.title;
        }

        // Update post meta
        const postCategory = document.getElementById('postCategory');
        const postDate = document.getElementById('postDate');
        const postTitle = document.getElementById('postTitle');
        const postAuthor = document.getElementById('postAuthor');
        const postImage = document.getElementById('postImage');
        const postBody = document.getElementById('postBody');
        const postModified = document.getElementById('postModified');

        if (postCategory) postCategory.textContent = this.post.category;
        if (postDate) {
            postDate.textContent = formattedDate;
            postDate.setAttribute('datetime', this.post.publishDate);
        }

        // Update title and author
        if (postTitle) postTitle.textContent = this.post.title;
        if (postAuthor) postAuthor.textContent = this.post.author;

        // Update featured image
        if (postImage) {
            postImage.src = this.post.featuredImage;
            postImage.alt = this.post.title;
        }

        // Update post body
        if (postBody) postBody.innerHTML = this.post.content;

        // Update modified date
        if (postModified) postModified.setAttribute('content', this.post.updatedDate);

        // Render tags
        this.renderTags();
    }

    renderTags() {
        const tagsContainer = document.getElementById('postTags');

        if (!tagsContainer) return;

        if (this.post.tags && this.post.tags.length > 0) {
            const tagsHTML = `
                <h3>Tags</h3>
                <div class="post-tags-list">
                    ${this.post.tags.map(tag =>
                        `<a href="blog.html#tag=${tag}" class="post-tag-item">${tag}</a>`
                    ).join('')}
                </div>
            `;
            tagsContainer.innerHTML = tagsHTML;
        }
    }

    updateSEO() {
        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) pageTitle.textContent = `${this.post.title} - Carlos Rodgarman`;
        document.title = `${this.post.title} - Carlos Rodgarman`;

        // Update meta description
        const pageDescription = document.getElementById('pageDescription');
        if (pageDescription) pageDescription.setAttribute('content', this.post.metaDescription);

        // Update meta keywords
        const pageKeywords = document.getElementById('pageKeywords');
        if (pageKeywords) pageKeywords.setAttribute('content', this.post.metaKeywords);

        // Update Open Graph tags
        const ogTitle = document.getElementById('ogTitle');
        const ogDescription = document.getElementById('ogDescription');
        const ogUrl = document.getElementById('ogUrl');
        const ogImage = document.getElementById('ogImage');

        if (ogTitle) ogTitle.setAttribute('content', this.post.title);
        if (ogDescription) ogDescription.setAttribute('content', this.post.metaDescription);
        if (ogUrl) ogUrl.setAttribute('content', `https://carlosrodgarman.com/blog-post.html?id=${this.post.id}`);
        if (ogImage) ogImage.setAttribute('content', `https://carlosrodgarman.com/${this.post.featuredImage}`);

        // Update Twitter Card tags
        const twitterTitle = document.getElementById('twitterTitle');
        const twitterDescription = document.getElementById('twitterDescription');
        const twitterImage = document.getElementById('twitterImage');

        if (twitterTitle) twitterTitle.setAttribute('content', this.post.title);
        if (twitterDescription) twitterDescription.setAttribute('content', this.post.metaDescription);
        if (twitterImage) twitterImage.setAttribute('content', `https://carlosrodgarman.com/${this.post.featuredImage}`);

        // Update canonical URL
        const canonicalUrl = document.getElementById('canonicalUrl');
        if (canonicalUrl) canonicalUrl.setAttribute('href', `https://carlosrodgarman.com/blog-post.html?id=${this.post.id}`);

        // Update Schema.org Article Markup
        const articleSchema = document.getElementById('articleSchema');
        if (articleSchema) {
            const schema = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": this.post.title,
                "description": this.post.metaDescription,
                "image": `https://carlosrodgarman.com/${this.post.featuredImage}`,
                "datePublished": this.post.publishDate,
                "dateModified": this.post.updatedDate,
                "author": {
                    "@type": "Person",
                    "name": this.post.author,
                    "url": "https://carlosrodgarman.com"
                },
                "publisher": {
                    "@type": "Person",
                    "name": "Carlos Rodgarman",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://carlosrodgarman.com/assets/logos/logo.svg"
                    }
                },
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `https://carlosrodgarman.com/blog-post.html?id=${this.post.id}`
                },
                "keywords": this.post.tags.join(', ')
            };

            articleSchema.textContent = JSON.stringify(schema, null, 2);
        }
    }

    setupShareButtons() {
        const postUrl = encodeURIComponent(window.location.href);
        const postTitle = encodeURIComponent(this.post.title);

        // Twitter
        const twitterBtn = document.getElementById('shareTwitter');
        if (twitterBtn) {
            twitterBtn.href = `https://twitter.com/intent/tweet?url=${postUrl}&text=${postTitle}`;
        }

        // Facebook
        const facebookBtn = document.getElementById('shareFacebook');
        if (facebookBtn) {
            facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
        }

        // LinkedIn
        const linkedInBtn = document.getElementById('shareLinkedIn');
        if (linkedInBtn) {
            linkedInBtn.href = `https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${postTitle}`;
        }
    }

    showError() {
        const postLoading = document.getElementById('postLoading');
        const postError = document.getElementById('postError');

        if (postLoading) postLoading.style.display = 'none';
        if (postError) postError.style.display = 'flex';

        document.title = 'Post Not Found - Carlos Rodgarman';
    }
}

// Initialize blog post when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BlogPost();
});

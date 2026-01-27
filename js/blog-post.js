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
        document.getElementById('postLoading').style.display = 'none';
        document.getElementById('postContent').style.display = 'block';

        // Render post data
        const date = new Date(this.post.publishDate);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Update breadcrumb
        document.getElementById('breadcrumbTitle').textContent = this.post.title;

        // Update post meta
        document.getElementById('postCategory').textContent = this.post.category;
        document.getElementById('postDate').textContent = formattedDate;
        document.getElementById('postDate').setAttribute('datetime', this.post.publishDate);
        document.getElementById('postReadTime').textContent = this.post.readTime;

        // Update title and author
        document.getElementById('postTitle').textContent = this.post.title;
        document.getElementById('postAuthor').textContent = this.post.author;

        // Update featured image
        const postImage = document.getElementById('postImage');
        postImage.src = this.post.featuredImage;
        postImage.alt = this.post.title;

        // Update post body
        document.getElementById('postBody').innerHTML = this.post.content;

        // Update modified date
        document.getElementById('postModified').setAttribute('content', this.post.updatedDate);

        // Render tags
        this.renderTags();
    }

    renderTags() {
        const tagsContainer = document.getElementById('postTags');

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
        document.getElementById('pageTitle').textContent = `${this.post.title} - Carlos Rodgarman`;
        document.title = `${this.post.title} - Carlos Rodgarman`;

        // Update meta description
        document.getElementById('pageDescription').setAttribute('content', this.post.metaDescription);

        // Update meta keywords
        document.getElementById('pageKeywords').setAttribute('content', this.post.metaKeywords);

        // Update Open Graph tags
        document.getElementById('ogTitle').setAttribute('content', this.post.title);
        document.getElementById('ogDescription').setAttribute('content', this.post.metaDescription);
        document.getElementById('ogUrl').setAttribute('content', `https://carlosrodgarman.com/blog-post.html?id=${this.post.id}`);
        document.getElementById('ogImage').setAttribute('content', `https://carlosrodgarman.com/${this.post.featuredImage}`);

        // Update Twitter Card tags
        document.getElementById('twitterTitle').setAttribute('content', this.post.title);
        document.getElementById('twitterDescription').setAttribute('content', this.post.metaDescription);
        document.getElementById('twitterImage').setAttribute('content', `https://carlosrodgarman.com/${this.post.featuredImage}`);

        // Update canonical URL
        document.getElementById('canonicalUrl').setAttribute('href', `https://carlosrodgarman.com/blog-post.html?id=${this.post.id}`);

        // Update Schema.org Article Markup
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

        document.getElementById('articleSchema').textContent = JSON.stringify(schema, null, 2);
    }

    setupShareButtons() {
        const postUrl = encodeURIComponent(window.location.href);
        const postTitle = encodeURIComponent(this.post.title);

        // Twitter
        const twitterBtn = document.getElementById('shareTwitter');
        twitterBtn.href = `https://twitter.com/intent/tweet?url=${postUrl}&text=${postTitle}`;

        // Facebook
        const facebookBtn = document.getElementById('shareFacebook');
        facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;

        // LinkedIn
        const linkedInBtn = document.getElementById('shareLinkedIn');
        linkedInBtn.href = `https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${postTitle}`;
    }

    showError() {
        document.getElementById('postLoading').style.display = 'none';
        document.getElementById('postError').style.display = 'flex';
        document.title = 'Post Not Found - Carlos Rodgarman';
    }
}

// Initialize blog post when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BlogPost();
});

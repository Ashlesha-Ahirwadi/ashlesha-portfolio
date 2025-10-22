# Ashlesha Ahirwadi - Portfolio Website

A modern, responsive portfolio website showcasing AI engineering expertise, research projects, and entrepreneurial journey as Co-founder at APExpose.

## 🚀 Features

- **Modern Design**: Clean, professional layout with gradient accents and smooth animations
- **Responsive**: Fully responsive design that works on all devices
- **Interactive**: Smooth scrolling, hover effects, modal galleries, and dynamic animations
- **AI-Focused**: Highlighting AI/ML projects, research papers, and technical expertise
- **Entrepreneurial**: Showcasing APExpose co-founding experience
- **Media Gallery**: Event photos and video presentations
- **Contact Form**: Interactive contact form with validation
- **Performance Optimized**: Fast loading with optimized images and code

## 📁 Project Structure

```
Portfolio/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
├── Photos-1-001/       # Event photos and videos
│   ├── 20230407_183214.jpg
│   ├── 20230712_152458.mp4
│   ├── 20231212_114217.jpg
│   └── ... (other media files)
├── README.md           # This file
└── .gitignore          # Git ignore file
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox, Grid, and animations
- **JavaScript**: Interactive functionality and smooth user experience
- **Font Awesome**: Icons and social media links
- **Google Fonts**: Inter and JetBrains Mono typography

## 🎨 Design Features

- **Color Scheme**: Professional gradient palette (#667eea to #764ba2)
- **Typography**: Inter for body text, JetBrains Mono for code
- **Animations**: Fade-in effects, hover animations, and smooth transitions
- **Layout**: CSS Grid and Flexbox for responsive design
- **Interactive Elements**: Modal galleries, animated counters, and form validation

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- Git (for version control)
- GitHub account (for hosting)

### Installation

1. **Clone or Download** the repository:
   ```bash
   git clone https://github.com/yourusername/ashlesha-portfolio.git
   cd ashlesha-portfolio
   ```

2. **Open** the `index.html` file in your web browser to view the portfolio locally.

### Customization

1. **Update Personal Information**:
   - Edit `index.html` to update name, title, and contact information
   - Replace placeholder images with actual photos
   - Update project descriptions and links

2. **Modify Styling**:
   - Edit `styles.css` to change colors, fonts, or layout
   - Update the gradient colors in the CSS variables

3. **Add Functionality**:
   - Modify `script.js` to add new interactive features
   - Update form handling for the contact form

## 🌐 GitHub Pages Deployment

### Method 1: Using GitHub Repository

1. **Create a new repository** on GitHub named `yourusername.github.io`
2. **Upload files** to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch
   - Your site will be available at `https://yourusername.github.io`

### Method 2: Using Custom Domain

1. Follow Method 1 steps
2. Add a `CNAME` file with your custom domain
3. Configure DNS settings with your domain provider

## 📸 Media Integration

The portfolio includes integration with photos from the `Photos-1-001` folder:

- **Event Photos**: Conference presentations, workshops, and networking events
- **Video Presentations**: Project demonstrations and research presentations
- **Professional Headshots**: High-quality profile images

### Adding New Media

1. **Add images** to the `Photos-1-001` folder
2. **Update HTML** to reference new image paths
3. **Optimize images** for web (recommended: WebP format, < 500KB)

## 🔧 Customization Guide

### Updating Content

1. **Personal Information**:
   ```html
   <!-- Update in index.html -->
   <h1 class="hero-title">Your Name</h1>
   <h2 class="hero-subtitle">Your Title</h2>
   ```

2. **Projects Section**:
   ```html
   <!-- Add new project cards -->
   <div class="project-card">
       <div class="project-image">
           <img src="path/to/image.jpg" alt="Project Name">
       </div>
       <div class="project-content">
           <h3>Project Name</h3>
           <p>Project description...</p>
       </div>
   </div>
   ```

3. **Skills Section**:
   ```html
   <!-- Add new skills -->
   <div class="skill-item">
       <i class="fas fa-icon"></i>
       <span>Skill Name</span>
   </div>
   ```

### Styling Customization

1. **Color Scheme**:
   ```css
   /* Update gradient colors in styles.css */
   .gradient-text {
       background: linear-gradient(135deg, #your-color-1, #your-color-2);
   }
   ```

2. **Fonts**:
   ```css
   /* Update font imports in index.html head section */
   <link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   ```

## 📊 Performance Optimization

- **Image Optimization**: Compress images for faster loading
- **CSS Minification**: Minify CSS for production
- **JavaScript Optimization**: Minify JavaScript files
- **CDN Usage**: Use CDN for external libraries

## 🔒 Security Considerations

- **Form Validation**: Client-side and server-side validation
- **HTTPS**: Always use HTTPS in production
- **Content Security Policy**: Implement CSP headers
- **Input Sanitization**: Sanitize user inputs

## 📈 SEO Optimization

- **Meta Tags**: Optimized meta descriptions and keywords
- **Semantic HTML**: Proper heading hierarchy and semantic elements
- **Alt Text**: Descriptive alt text for all images
- **Structured Data**: Add JSON-LD structured data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For support or questions:
- Email: ashlesha@example.com
- LinkedIn: [linkedin.com/in/ashlesha-ahirwadi](https://linkedin.com/in/ashlesha-ahirwadi)
- GitHub: [github.com/ashleshaahirwadi](https://github.com/ashleshaahirwadi)

## 🙏 Acknowledgments

- Design inspiration from modern portfolio websites
- Font Awesome for icons
- Google Fonts for typography
- CSS Grid and Flexbox for layout
- Intersection Observer API for animations

---

**Built with ❤️ by Ashlesha Ahirwadi**

*AI Engineer & Co-founder at APExpose*

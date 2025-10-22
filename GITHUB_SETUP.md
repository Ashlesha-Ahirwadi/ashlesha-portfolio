# GitHub Setup Guide for Ashlesha's Portfolio

## 🚀 Quick Start Guide

Follow these steps to deploy your portfolio to GitHub Pages:

### Step 1: Create GitHub Repository

1. **Go to GitHub.com** and sign in to your account
2. **Click the "+" icon** in the top right corner
3. **Select "New repository"**
4. **Repository name**: `ashleshaahirwadi.github.io` (replace with your GitHub username)
5. **Description**: "AI Engineer & Co-founder at APExpose - Portfolio Website"
6. **Make it Public** (required for free GitHub Pages)
7. **Don't initialize** with README, .gitignore, or license (we already have these)
8. **Click "Create repository"**

### Step 2: Initialize Git and Upload Files

Open Terminal/Command Prompt and run these commands:

```bash
# Navigate to your portfolio folder
cd /Users/ashleshaahirwadi/Desktop/Portfolio

# Initialize git repository
git init

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial portfolio commit - AI Engineer portfolio with modern design"

# Add GitHub repository as remote origin
git remote add origin https://github.com/ashleshaahirwadi/ashleshaahirwadi.github.io.git

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. **Go to your repository** on GitHub
2. **Click "Settings"** tab
3. **Scroll down to "Pages"** section
4. **Under "Source"**, select "Deploy from a branch"
5. **Select "main"** branch
6. **Select "/ (root)"** folder
7. **Click "Save"**

### Step 4: Access Your Live Portfolio

Your portfolio will be available at:
**https://ashleshaahirwadi.github.io**

*Note: It may take 5-10 minutes for the site to be live*

## 🔧 Customization Before Deployment

### Update Contact Information

Edit `index.html` and update:
- Email address in contact section
- LinkedIn URL (already set to your profile)
- GitHub username in social links
- Any other personal information

### Add Real Project Links

Update project links in `index.html`:
```html
<!-- Replace # with actual URLs -->
<a href="https://github.com/yourusername/project1" class="project-btn">
    <i class="fab fa-github"></i> Code
</a>
<a href="https://yourproject-demo.com" class="project-btn">
    <i class="fas fa-play"></i> Demo
</a>
```

### Optimize Images

1. **Compress images** in `Photos-1-001/` folder
2. **Convert to WebP format** for better performance
3. **Update image paths** in HTML if needed

## 📱 Testing Your Portfolio

### Local Testing

1. **Open `index.html`** in your web browser
2. **Test all sections**:
   - Navigation works smoothly
   - Contact form functions
   - Gallery modal opens
   - Responsive design on mobile

### Mobile Testing

1. **Use browser dev tools** (F12)
2. **Toggle device toolbar** to test mobile view
3. **Test on actual mobile devices**

## 🎨 Design Customization

### Color Scheme

Edit `styles.css` to change colors:
```css
/* Update gradient colors */
.gradient-text {
    background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

### Fonts

Change fonts in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

## 🚀 Advanced Features

### Custom Domain (Optional)

1. **Buy a domain** (e.g., ashleshaahirwadi.com)
2. **Add CNAME file** to repository root:
   ```
   ashleshaahirwadi.com
   ```
3. **Configure DNS** with your domain provider

### Analytics (Optional)

Add Google Analytics to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 Updating Your Portfolio

### Making Changes

1. **Edit files** locally
2. **Test changes** in browser
3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Updated project descriptions"
   git push origin main
   ```

### Adding New Projects

1. **Add project card** to `index.html`
2. **Add project image** to `Photos-1-001/`
3. **Update skills** if needed
4. **Commit changes**

## 🛠️ Troubleshooting

### Common Issues

1. **Site not loading**:
   - Check repository name matches username.github.io
   - Verify GitHub Pages is enabled
   - Wait 10-15 minutes for deployment

2. **Images not showing**:
   - Check file paths are correct
   - Ensure images are in repository
   - Use relative paths (not absolute)

3. **Styling issues**:
   - Check CSS file is linked correctly
   - Verify no syntax errors in CSS
   - Clear browser cache

### Getting Help

- **GitHub Pages Documentation**: https://docs.github.com/en/pages
- **GitHub Support**: https://support.github.com
- **Portfolio Issues**: Check README.md for detailed instructions

## 📊 Performance Tips

### Optimization

1. **Compress images** before uploading
2. **Minify CSS/JS** for production
3. **Use CDN** for external libraries
4. **Enable compression** on GitHub Pages

### SEO Optimization

1. **Update meta tags** in `index.html`
2. **Add alt text** to all images
3. **Use semantic HTML** structure
4. **Add structured data** (JSON-LD)

## 🎯 Next Steps

After deployment:

1. **Share your portfolio** on LinkedIn
2. **Add to resume** and job applications
3. **Update regularly** with new projects
4. **Monitor analytics** (if added)
5. **Get feedback** from peers and mentors

---

**Your portfolio is now live! 🎉**

Visit: **https://ashleshaahirwadi.github.io**

*Remember to update the URL with your actual GitHub username*

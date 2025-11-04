// DOM Elements

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect and active link highlighting
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Highlight active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            const offsetTop = target.offsetTop - navbarHeight;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            // For experience items, also add the animate class
            if (entry.target.classList.contains('experience-item')) {
                entry.target.classList.add('animate');
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.project-card, .gallery-item, .blog-card, .contact-item, .stat-item, .experience-item');
    animateElements.forEach(el => observer.observe(el));
});

console.log('Portfolio website loaded successfully! 🚀');

// Contact form removed - users will email directly

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 3000;
            animation: slideInRight 0.3s ease-out;
        }
        
        .notification-success {
            background: linear-gradient(135deg, #4CAF50, #45a049);
        }
        
        .notification-error {
            background: linear-gradient(135deg, #f44336, #d32f2f);
        }
        
        .notification-info {
            background: linear-gradient(135deg, #2196F3, #1976D2);
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }
});

// Parallax effect removed to fix scrolling issues

// Skills animation on scroll
const skillItems = document.querySelectorAll('.skill-item');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out';
            entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
        }
    });
}, { threshold: 0.1 });

skillItems.forEach(item => {
    skillsObserver.observe(item);
});

// Project card hover effects
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Blog card hover effects
const blogCards = document.querySelectorAll('.blog-card');
blogCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.01)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth reveal animation for stats
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const finalNumber = parseInt(target.textContent);
            let currentNumber = 0;
            const increment = finalNumber / 50;
            
            const counter = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    target.textContent = finalNumber + '+';
                    clearInterval(counter);
                } else {
                    target.textContent = Math.floor(currentNumber) + '+';
                }
            }, 30);
            
            statsObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    const loadingStyles = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = loadingStyles;
    document.head.appendChild(styleSheet);
});

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to back to top button
backToTopBtn.addEventListener('mouseenter', () => {
    backToTopBtn.style.transform = 'translateY(-3px) scale(1.1)';
});

backToTopBtn.addEventListener('mouseleave', () => {
    backToTopBtn.style.transform = 'translateY(0) scale(1)';
});

// Project data
const projectData = {
    'lung-tumor-detection': {
        title: 'Lung Tumor Detection from 3D CT Scans',
        description: 'Practicum Project | Northwestern Medicine – Abazeed Lab\n\n• Developed a production-ready 3D tumor detection system using deep learning for radiation therapy planning from lung CT scans\n• Engineered a multi-model ensemble (YOLO3D, UNETR, VNet) achieving 75.6% sensitivity and 69.6% AP@0.3 (VNet)\n• Introduced Complete IoU (CIoU) loss and anisotropic anchor designs tailored for medical precision\n• Accelerated training on H100 GPUs using mixed-precision, 16+ workers, and PyTorch Lightning with MONAI transforms',
        tech: ['Deep Learning', '3D Computer Vision', 'PyTorch', 'MONAI', 'YOLO3D', 'UNETR', 'VNet', 'Medical AI'],
        links: [
            { text: 'Learn More', icon: 'fas fa-external-link-alt', url: 'https://linkedin.com/in/ashlesha-ahirwadi' }
        ]
    },
    'storyteller-ai': {
        title: 'StoryTeller AI – Personalized Story Generator with Audio Narration',
        description: '• Fine-tuned GPT-2 (HuggingFace) on r/WritingPrompts and fairy tale datasets to generate coherent 100–200 word stories from user prompts\n• Built a Streamlit web app enabling real-time prompt input, story generation, and audio narration using a Text-to-Speech engine\n• Enabled multimodal interaction with embedded playback and downloadable text/audio (.mp3) outputs\n• Implemented full inference pipeline including input preprocessing, model decoding, and integrated TTS synthesis\n• Demonstrated potential for AI in creative writing, edutainment, and accessibility applications',
        tech: ['GPT-2', 'HuggingFace', 'Streamlit', 'Text-to-Speech', 'NLP', 'Fine-tuning', 'Multimodal AI'],
        links: [
            { text: 'Learn More', icon: 'fas fa-external-link-alt', url: 'https://linkedin.com/in/ashlesha-ahirwadi' }
        ]
    },
    'image-restoration': {
        title: 'AI-Powered Image Restoration Pipeline',
        description: '• Built an integrated pipeline to restore degraded images using denoising, super-resolution, and colorization stages\n• Implemented a Denoising Autoencoder (DAE) to remove noise and scratches from historical and low-quality images\n• Applied ESRGAN (Enhanced Super-Resolution GAN) to achieve 4× image upscaling with preserved fine detail\n• Integrated DeOldify for grayscale image colorization using conditional GANs\n• Developed an interactive Gradio-based web interface allowing real-time image restoration with user uploads\n• Leveraged public datasets (DIV2K, ImageNet, NYPL) to train and test the unified restoration system',
        tech: ['GANs', 'ESRGAN', 'DeOldify', 'Autoencoders', 'Gradio', 'Computer Vision', 'Image Processing'],
        links: [
            { text: 'Learn More', icon: 'fas fa-external-link-alt', url: 'https://linkedin.com/in/ashlesha-ahirwadi' }
        ]
    },
    'fake-review-detection': {
        title: 'Amazon Fake Review Detection – NLP-Based Binary Classifier',
        description: '• Built and evaluated multiple models to classify Amazon reviews as human-written or AI-generated\n• Achieved 98.2% F1 Score with fine-tuned BERT-base, outperforming a TF-IDF + Logistic Regression baseline\n• Fine-tuned Qwen2.5 (3B) using LoRA, achieving 98.6% accuracy, zero parse failures, and high precision/recall\n• Engineered content-based features and performed linguistic analysis to differentiate synthetic review patterns\n• Demonstrated application of prompt tuning vs. full fine-tuning in a high-impact real-world classification task',
        tech: ['BERT', 'Qwen2.5', 'LoRA', 'NLP', 'Classification', 'TF-IDF', 'Fine-tuning'],
        links: [
            { text: 'Learn More', icon: 'fas fa-external-link-alt', url: 'https://linkedin.com/in/ashlesha-ahirwadi' }
        ]
    },
    'virtual-gym-trainer': {
        title: 'Virtual Gym Trainer – Computer Vision-Based Fitness Feedback System',
        description: '• Developed a real-time virtual workout assistant using MediaPipe pose estimation and OpenCV for upper-body posture tracking\n• Computed joint angles via vector geometry and used a finite state machine to ensure accurate repetition counting across exercises\n• Achieved >90% rep-counting accuracy with <0.2 sec latency under optimal conditions, validated against human-observed results\n• Delivered multimodal feedback (audio via Pygame + visual overlays) to enhance user engagement and correct posture\n• Designed the system to run on standard webcams with no specialised hardware, promoting accessibility for home fitness and rehabilitation use\n• Proposed future enhancements including form correction models, mobile integration, and adaptive coaching via reinforcement learning',
        tech: ['MediaPipe', 'OpenCV', 'Computer Vision', 'Pygame', 'Real-time Processing', 'Pose Estimation'],
        links: [
            { text: 'Learn More', icon: 'fas fa-external-link-alt', url: 'https://linkedin.com/in/ashlesha-ahirwadi' }
        ]
    },
    'business-artist-connector': {
        title: 'Local Business-Artist Connector App',
        description: '• Led user research (interviews, surveys, testing) to identify pain points of 50+ local businesses/artists, informing a user-centered app prototype\n• Designed and prototyped AI-driven features (style/budget/location matching, in-app collaboration tools) using Figma, streamlining creative partnerships\n• Delivered a functional prototype praised for usability and scalability, presented to faculty and industry stakeholders',
        tech: ['User Research', 'Figma', 'Prototyping', 'AI Matching', 'UX/UI Design', 'Collaboration Tools'],
        links: [
            { text: 'Learn More', icon: 'fas fa-external-link-alt', url: 'https://linkedin.com/in/ashlesha-ahirwadi' }
        ]
    },
    'genai-azure': {
        title: 'GenAI Solution Development with Azure & RAG for Enterprise Workflows',
        description: '• Developed a GenAI solution using Azure Machine Learning and RAG architecture for Contoso\'s operational workflows\n• Implemented agentic frameworks and prompt engineering pipelines to optimize model outputs\n• Deployed scalable cloud infrastructure on Azure (AKS, CI/CD pipelines), demonstrating expertise in GenAI Ops and enterprise-grade AI orchestration',
        tech: ['Azure ML', 'RAG', 'GenAI', 'AKS', 'CI/CD', 'Enterprise AI', 'Prompt Engineering'],
        links: [
            { text: 'Learn More', icon: 'fas fa-external-link-alt', url: 'https://linkedin.com/in/ashlesha-ahirwadi' }
        ]
    },
    'medicurious': {
        title: 'MediCurious - Specialized Medical LLM',
        description: '• Developed a Large Language Model (LLM) to provide accurate and accessible medical insights for diverse audiences\n• Engineered AI-driven responses for real-world queries, including treatment recommendations, symptom analysis, and medication safety evaluations\n• Designed a scalable data pipeline integrating heterogeneous medical datasets into optimized JSONL formats, enabling efficient LLM training and powering a live demo for real-time, AI-augmented clinical decision support',
        tech: ['LLM', 'Medical AI', 'Clinical Decision Support', 'Data Pipeline', 'JSONL', 'Healthcare AI'],
        links: [
            { text: 'Learn More', icon: 'fas fa-external-link-alt', url: 'https://linkedin.com/in/ashlesha-ahirwadi' }
        ]
    },
    'eeg-dream-visualization': {
        title: 'Artistic Visualization Of Dreams Using EEG',
        description: '• Decoded dreams from EEG signals and reconstructed visual dream content using AI techniques\n• Processed and categorized EEG data, achieving 87.79% classification accuracy with a CNN model\n• Generated artistic visualizations using a visualization tool, translating EEG spectrograms into dynamic, theme-specific art\n• Designed an end-to-end pipeline integrating EEG preprocessing, CNN-based dream theme classification, and AI-driven artistic rendering to create a cohesive visualization system',
        tech: ['EEG Processing', 'CNN', 'Signal Processing', 'Artistic Visualization', 'Neuroscience', 'AI Art'],
        links: [
            { text: 'Learn More', icon: 'fas fa-external-link-alt', url: 'https://linkedin.com/in/ashlesha-ahirwadi' }
        ]
    },
    'stock-market-prediction': {
        title: 'Stock Market Prediction (Options Trading - NASDAQ Dataset)',
        description: '• Developed predictive models for options trading using NASDAQ 100 time series data from 2009 to 2024\n• Applied SARIMAX, LSTM, TiDE, and TS-Mixer models to forecast stock price trends and optimize trading strategies\n• Addressed data inconsistencies by resolving volume misrepresentations in the dataset, enhancing data quality and model accuracy\n• Providing insights through visualizations and reports that highlight predictive performance in different model architectures',
        tech: ['Time Series', 'LSTM', 'SARIMAX', 'TiDE', 'TS-Mixer', 'Financial Modeling', 'Trading Strategies'],
        links: [
            { text: 'Learn More', icon: 'fas fa-external-link-alt', url: 'https://linkedin.com/in/ashlesha-ahirwadi' }
        ]
    },
    'icu-insight': {
        title: 'ICU Insight (Predictive Healthcare Analytics Project)',
        description: '• Developed a predictive model for ICU patient admission using the MIMIC-IV database, analyzing clinical data from over 70,000 patients\n• Applied Random Forest and Neural Networks to classify ICU admissions, achieving Test AUC-ROC of 0.973 and 88% accuracy\n• Engineered features by calculating the ratio of abnormal lab results, leveraging temporal data to predict patient outcomes more effectively\n• Collaborated in a team of five to deliver insights, addressing data imbalance and proposing scalable solutions for future improvements\n• Engineered features leveraging temporal data, demonstrating expertise in machine learning and statistics',
        tech: ['MIMIC-IV', 'Random Forest', 'Neural Networks', 'Healthcare Analytics', 'Clinical Data', 'Predictive Modeling'],
        links: [
            { text: 'Learn More', icon: 'fas fa-external-link-alt', url: 'https://linkedin.com/in/ashlesha-ahirwadi' }
        ]
    },
    'medical-image-analysis': {
        title: 'AI Research Intern - Medical Image Analysis',
        description: '• Developed an innovative Statistical Shape Model to analyze and segment MRI scans of the femur bone at Symbiosis Centre For Medical Image Analysis, Pune, India\n• Demonstrated problem-solving skills and attention to detail to address complex medical imaging challenges\n• Acquired foundational knowledge through a MOOC on Shape Modelling from the University of Basel, showing adaptability and commitment to continuous learning\n• Built expertise in Scala and Image Processing, applying the Scalismo library for constructing the Statistical Shape Model\n• Gained deep insights into the cross-functional approach of medical imaging and data science',
        tech: ['Statistical Shape Model', 'MRI Analysis', 'Medical Imaging', 'Scala', 'Scalismo', 'Image Processing', 'Shape Modelling', 'Research'],
        links: [
            { text: 'Learn More', icon: 'fas fa-external-link-alt', url: 'https://linkedin.com/in/ashlesha-ahirwadi' }
        ]
    }
};

// Project Modal Functionality
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalDescription = document.getElementById('modalDescription');
const modalTech = document.getElementById('modalTech');
const modalLinks = document.getElementById('modalLinks');
const modalClose = document.querySelector('.modal-close');

// Add click event listeners to project blocks
document.querySelectorAll('.project-block').forEach(block => {
    block.addEventListener('click', () => {
        const projectId = block.getAttribute('data-project');
        const project = projectData[projectId];
        
        if (project) {
            // Populate modal content
            modalTitle.textContent = project.title;
            modalImage.src = block.querySelector('img').src;
            modalImage.alt = project.title;
            modalDescription.textContent = project.description;
            
            // Clear and populate tech tags
            modalTech.innerHTML = '';
            project.tech.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                modalTech.appendChild(tag);
            });
            
            // Clear and populate links
            modalLinks.innerHTML = '';
            project.links.forEach(link => {
                const btn = document.createElement('a');
                btn.href = link.url;
                btn.target = '_blank';
                btn.className = 'project-btn';
                btn.innerHTML = `<i class="${link.icon}"></i> ${link.text}`;
                modalLinks.appendChild(btn);
            });
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal functionality
modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

console.log('Portfolio website loaded successfully! 🚀');
console.log('Experience items found:', document.querySelectorAll('.experience-item').length);
console.log('Project blocks found:', document.querySelectorAll('.project-block').length);

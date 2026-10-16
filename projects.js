// Project cards + detail modal content. Order = display order.
window.PROJECTS = [
  {
    "id": "medicurious",
    "name": "MediCurious: a medical LLM",
    "title": "MediCurious - Specialized Medical LLM",
    "blurb": "A medical LLM for symptoms, treatments and medication safety.",
    "image": "medicurious.png",
    "tags": [
      "llm",
      "health"
    ],
    "description": "• Developed a Large Language Model (LLM) to provide accurate and accessible medical insights for diverse audiences\n• Engineered AI-driven responses for real-world queries, including treatment recommendations, symptom analysis, and medication safety evaluations\n• Designed a scalable data pipeline integrating heterogeneous medical datasets into optimized JSONL formats, enabling efficient LLM training and powering a live demo for real-time, AI-augmented clinical decision support",
    "tech": [
      "LLM",
      "Medical AI",
      "Clinical Decision Support",
      "Data Pipeline",
      "JSONL",
      "Healthcare AI"
    ],
    "links": [
      {
        "text": "Learn More",
        "icon": "fas fa-external-link-alt",
        "url": "https://www.linkedin.com/posts/pavankonam_ai-medicalai-healthcareinnovation-ugcPost-7313049343320551425-9B46?utm_source=share&utm_medium=member_desktop&rcm=ACoAAB_E06QBOEX78r8zu-z-Zr_ZM48xqlDTiYQ"
      }
    ]
  },
  {
    "id": "genai-azure",
    "name": "Enterprise GenAI on Azure",
    "title": "GenAI Solution Development with Azure & RAG for Enterprise Workflows",
    "blurb": "Enterprise RAG + agents on Azure ML, shipped on AKS.",
    "image": "Photos-1-001/events/genAI%20.jpg",
    "tags": [
      "llm"
    ],
    "description": "• Developed a GenAI solution using Azure Machine Learning and RAG architecture for Contoso's operational workflows\n• Implemented agentic frameworks and prompt engineering pipelines to optimize model outputs\n• Deployed scalable cloud infrastructure on Azure (AKS, CI/CD pipelines), demonstrating expertise in GenAI Ops and enterprise-grade AI orchestration",
    "tech": [
      "Azure ML",
      "RAG",
      "GenAI",
      "AKS",
      "CI/CD",
      "Enterprise AI",
      "Prompt Engineering"
    ],
    "links": [
      {
        "text": "Learn More",
        "icon": "fas fa-external-link-alt",
        "url": "https://github.com/Ashlesha-Ahirwadi/azure-ai-engineer-in-five-weeks.git"
      }
    ]
  },
  {
    "id": "fake-review-detection",
    "name": "Amazon fake review detection",
    "title": "Amazon Fake Review Detection – NLP-Based Binary Classifier",
    "blurb": "Spots AI-written Amazon reviews. 98.6% with LoRA-tuned Qwen.",
    "image": "Photos-1-001/events/Amazon-logo.jpg",
    "tags": [
      "llm"
    ],
    "description": "• Built and evaluated multiple models to classify Amazon reviews as human-written or AI-generated\n• Achieved 98.2% F1 Score with fine-tuned BERT-base, outperforming a TF-IDF + Logistic Regression baseline\n• Fine-tuned Qwen2.5 (3B) using LoRA, achieving 98.6% accuracy, zero parse failures, and high precision/recall\n• Engineered content-based features and performed linguistic analysis to differentiate synthetic review patterns\n• Demonstrated application of prompt tuning vs. full fine-tuning in a high-impact real-world classification task",
    "tech": [
      "BERT",
      "Qwen2.5",
      "LoRA",
      "NLP",
      "Classification",
      "TF-IDF",
      "Fine-tuning"
    ],
    "links": [
      {
        "text": "Learn More",
        "icon": "fas fa-external-link-alt",
        "url": "https://github.com/Ashlesha-Ahirwadi/Amazon-Review-Human-AI-Detection.git"
      }
    ]
  },
  {
    "id": "stock-market-prediction",
    "name": "Stock market prediction",
    "title": "Stock Market Prediction (Options Trading - NASDAQ Dataset)",
    "blurb": "15 years of NASDAQ-100 forecasting with LSTM, TiDE and more.",
    "image": "stock-market.png",
    "tags": [
      "data"
    ],
    "description": "• Developed predictive models for options trading using NASDAQ 100 time series data from 2009 to 2024\n• Applied SARIMAX, LSTM, TiDE, and TS-Mixer models to forecast stock price trends and optimize trading strategies\n• Addressed data inconsistencies by resolving volume misrepresentations in the dataset, enhancing data quality and model accuracy\n• Providing insights through visualizations and reports that highlight predictive performance in different model architectures",
    "tech": [
      "Time Series",
      "LSTM",
      "SARIMAX",
      "TiDE",
      "TS-Mixer",
      "Financial Modeling",
      "Trading Strategies"
    ],
    "links": [
      {
        "text": "Learn More",
        "icon": "fas fa-external-link-alt",
        "url": "https://linkedin.com/in/ashlesha-ahirwadi"
      }
    ]
  },
  {
    "id": "lung-tumor-detection",
    "name": "Lung tumor detection in 3D CT",
    "title": "Lung Tumor Detection from 3D CT Scans",
    "blurb": "3D tumor detection in CT scans with Northwestern Medicine.",
    "image": "lung-cancer.png",
    "tags": [
      "vision",
      "health"
    ],
    "description": "Practicum Project | Northwestern Medicine – Abazeed Lab\n\n• Developed a production-ready 3D tumor detection system using deep learning for radiation therapy planning from lung CT scans\n• Engineered a multi-model ensemble (YOLO3D, UNETR, VNet) achieving 75.6% sensitivity and 69.6% AP@0.3 (VNet)\n• Introduced Complete IoU (CIoU) loss and anisotropic anchor designs tailored for medical precision\n• Accelerated training on H100 GPUs using mixed-precision, 16+ workers, and PyTorch Lightning with MONAI transforms",
    "tech": [
      "Deep Learning",
      "3D Computer Vision",
      "PyTorch",
      "MONAI",
      "YOLO3D",
      "UNETR",
      "VNet",
      "Medical AI"
    ],
    "links": [
      {
        "text": "Learn More",
        "icon": "fas fa-external-link-alt",
        "url": "https://www.linkedin.com/posts/ashlesha-ahirwadi_ai-advances-in-cancer-care-activity-7406413524303900672-t03W?utm_source=share&utm_medium=member_desktop&rcm=ACoAAB_E06QBOEX78r8zu-z-Zr_ZM48xqlDTiYQ"
      }
    ]
  },
  {
    "id": "icu-insight",
    "name": "ICU Insight",
    "title": "ICU Insight (Predictive Healthcare Analytics Project)",
    "blurb": "Predicts ICU admissions from 70k+ patients. AUC 0.973.",
    "image": "Photos-1-001/events/icu.webp",
    "tags": [
      "health",
      "data"
    ],
    "description": "• Developed a predictive model for ICU patient admission using the MIMIC-IV database, analyzing clinical data from over 70,000 patients\n• Applied Random Forest and Neural Networks to classify ICU admissions, achieving Test AUC-ROC of 0.973 and 88% accuracy\n• Engineered features by calculating the ratio of abnormal lab results, leveraging temporal data to predict patient outcomes more effectively\n• Collaborated in a team of five to deliver insights, addressing data imbalance and proposing scalable solutions for future improvements\n• Engineered features leveraging temporal data, demonstrating expertise in machine learning and statistics",
    "tech": [
      "MIMIC-IV",
      "Random Forest",
      "Neural Networks",
      "Healthcare Analytics",
      "Clinical Data",
      "Predictive Modeling"
    ],
    "links": [
      {
        "text": "Learn More",
        "icon": "fas fa-external-link-alt",
        "url": "https://linkedin.com/in/ashlesha-ahirwadi"
      }
    ]
  },
  {
    "id": "eeg-dream-visualization",
    "name": "Dreams from EEG",
    "title": "Artistic Visualization Of Dreams Using EEG",
    "blurb": "Decodes dream themes from EEG and turns them into art.",
    "image": "Photos-1-001/events/eeg.jpg",
    "tags": [
      "vision",
      "health"
    ],
    "description": "• Decoded dreams from EEG signals and reconstructed visual dream content using AI techniques\n• Processed and categorized EEG data, achieving 87.79% classification accuracy with a CNN model\n• Generated artistic visualizations using a visualization tool, translating EEG spectrograms into dynamic, theme-specific art\n• Designed an end-to-end pipeline integrating EEG preprocessing, CNN-based dream theme classification, and AI-driven artistic rendering to create a cohesive visualization system",
    "tech": [
      "EEG Processing",
      "CNN",
      "Signal Processing",
      "Artistic Visualization",
      "Neuroscience",
      "AI Art"
    ],
    "links": [
      {
        "text": "Learn More",
        "icon": "fas fa-external-link-alt",
        "url": "https://www.linkedin.com/posts/pavankonam_machinelearning-eeg-dreamdecoding-ugcPost-7311168130309836803-89u4?utm_source=share&utm_medium=member_desktop&rcm=ACoAAB_E06QBOEX78r8zu-z-Zr_ZM48xqlDTiYQ"
      }
    ]
  },
  {
    "id": "storyteller-ai",
    "name": "StoryTeller AI",
    "title": "StoryTeller AI – Personalized Story Generator with Audio Narration",
    "blurb": "Fine-tuned GPT-2 that writes stories and reads them aloud.",
    "image": "Photos-1-001/events/StoryTeller.png",
    "tags": [
      "llm"
    ],
    "description": "• Fine-tuned GPT-2 (HuggingFace) on r/WritingPrompts and fairy tale datasets to generate coherent 100–200 word stories from user prompts\n• Built a Streamlit web app enabling real-time prompt input, story generation, and audio narration using a Text-to-Speech engine\n• Enabled multimodal interaction with embedded playback and downloadable text/audio (.mp3) outputs\n• Implemented full inference pipeline including input preprocessing, model decoding, and integrated TTS synthesis\n• Demonstrated potential for AI in creative writing, edutainment, and accessibility applications",
    "tech": [
      "GPT-2",
      "HuggingFace",
      "Streamlit",
      "Text-to-Speech",
      "NLP",
      "Fine-tuning",
      "Multimodal AI"
    ],
    "links": [
      {
        "text": "Learn More",
        "icon": "fas fa-external-link-alt",
        "url": "https://github.com/Ashlesha-Ahirwadi/StoryTeller-AI-Personalized-Story-Generator.git"
      }
    ]
  },
  {
    "id": "image-restoration",
    "name": "AI image restoration",
    "title": "AI-Powered Image Restoration Pipeline",
    "blurb": "Denoise, upscale 4x and colorize old photos.",
    "image": "Photos-1-001/events/image.png",
    "tags": [
      "vision"
    ],
    "description": "• Built an integrated pipeline to restore degraded images using denoising, super-resolution, and colorization stages\n• Implemented a Denoising Autoencoder (DAE) to remove noise and scratches from historical and low-quality images\n• Applied ESRGAN (Enhanced Super-Resolution GAN) to achieve 4× image upscaling with preserved fine detail\n• Integrated DeOldify for grayscale image colorization using conditional GANs\n• Developed an interactive Gradio-based web interface allowing real-time image restoration with user uploads\n• Leveraged public datasets (DIV2K, ImageNet, NYPL) to train and test the unified restoration system",
    "tech": [
      "GANs",
      "ESRGAN",
      "DeOldify",
      "Autoencoders",
      "Gradio",
      "Computer Vision",
      "Image Processing"
    ],
    "links": [
      {
        "text": "Learn More",
        "icon": "fas fa-external-link-alt",
        "url": "https://github.com/Ashlesha-Ahirwadi/AI-Image-Restoration.git"
      }
    ]
  },
  {
    "id": "virtual-gym-trainer",
    "name": "Virtual gym trainer",
    "title": "Virtual Gym Trainer – Computer Vision-Based Fitness Feedback System",
    "blurb": "Webcam rep counter with real-time posture feedback.",
    "image": "Photos-1-001/events/gym.png",
    "tags": [
      "vision"
    ],
    "description": "• Developed a real-time virtual workout assistant using MediaPipe pose estimation and OpenCV for upper-body posture tracking\n• Computed joint angles via vector geometry and used a finite state machine to ensure accurate repetition counting across exercises\n• Achieved >90% rep-counting accuracy with <0.2 sec latency under optimal conditions, validated against human-observed results\n• Delivered multimodal feedback (audio via Pygame + visual overlays) to enhance user engagement and correct posture\n• Designed the system to run on standard webcams with no specialised hardware, promoting accessibility for home fitness and rehabilitation use\n• Proposed future enhancements including form correction models, mobile integration, and adaptive coaching via reinforcement learning",
    "tech": [
      "MediaPipe",
      "OpenCV",
      "Computer Vision",
      "Pygame",
      "Real-time Processing",
      "Pose Estimation"
    ],
    "links": [
      {
        "text": "Learn More",
        "icon": "fas fa-external-link-alt",
        "url": "https://www.youtube.com/watch?v=HBZLyfzbDvQ"
      }
    ]
  },
  {
    "id": "business-artist-connector",
    "name": "Business–artist connector",
    "title": "Local Business-Artist Connector App",
    "blurb": "User research + AI matching for local businesses and artists.",
    "image": "business-connector.png",
    "tags": [
      "data"
    ],
    "description": "• Led user research (interviews, surveys, testing) to identify pain points of 50+ local businesses/artists, informing a user-centered app prototype\n• Designed and prototyped AI-driven features (style/budget/location matching, in-app collaboration tools) using Figma, streamlining creative partnerships\n• Delivered a functional prototype praised for usability and scalability, presented to faculty and industry stakeholders",
    "tech": [
      "User Research",
      "Figma",
      "Prototyping",
      "AI Matching",
      "UX/UI Design",
      "Collaboration Tools"
    ],
    "links": [
      {
        "text": "Learn More",
        "icon": "fas fa-external-link-alt",
        "url": "https://www.linkedin.com/posts/ashlesha-ahirwadi_hci-uxdesign-communitybuilding-activity-7314029006268305408-BK8O?utm_source=share&utm_medium=member_desktop&rcm=ACoAAB_E06QBOEX78r8zu-z-Zr_ZM48xqlDTiYQ"
      }
    ]
  }
];

// Kiki's brain: everything she knows about Ashlesha, plus a small keyword matcher.
// Answers are scripted. To add a topic, add an entry to the I list below.
//   keys  : words / phrases that trigger it (phrases with spaces score higher)
//   say   : what Kiki says out loud (keep it short, it's audio)
//   go    : element id to scroll to and highlight
//   card  : data-project id of a project card to highlight (opens on "See details")
//   links : buttons shown under the answer
//   pose  : wave | happy | think | point
(function () {
  var LINKS = {
    email: { label: 'Email her', href: 'mailto:ashlesha.ahirwadi@gmail.com', icon: 'fas fa-envelope' },
    linkedin: { label: 'LinkedIn', href: 'https://linkedin.com/in/ashlesha-ahirwadi', icon: 'fab fa-linkedin-in' },
    github: { label: 'GitHub', href: 'https://github.com/Ashlesha-Ahirwadi', icon: 'fab fa-github' },
    resume: { label: 'Download resume', href: 'Ashlesha_Ahirwadi_Resume.pdf', icon: 'fas fa-download', download: true },
    ruvaah: { label: 'Visit Ruvaah', href: 'https://ruvaah.com', icon: 'fas fa-arrow-up-right-from-square' },
    pulmo: { label: 'Read the feature', href: 'https://www.mccormick.northwestern.edu/artificial-intelligence/inside-our-program/stories/2025/ai-advances-in-cancer-care.html', icon: 'fas fa-newspaper' },
    underwriter: { label: 'See the code', href: 'https://github.com/Ashlesha-Ahirwadi/Keti-Demo', icon: 'fab fa-github' },
    glass: { label: 'See the code', href: 'https://github.com/Ashlesha-Ahirwadi/Glass-Health-Demo', icon: 'fab fa-github' },
    gateway: { label: 'See the code', href: 'https://github.com/Ashlesha-Ahirwadi/Lite-LLM-Demo', icon: 'fab fa-github' }
  };

  // A key starting with "~" is weak: it only counts a little (for very common words).
  var I = [
    /* ---------- hello / goodbye / small talk ---------- */
    { id: 'greet', keys: ['hi', 'hello', 'hey', 'hii', 'yo', 'howdy', 'good morning', 'good evening', 'good afternoon'], pose: 'wave',
      say: "Hi hi! I'm so happy you're here. What would you like to know about Ash?" },
    { id: 'thanks', keys: ['thanks', 'thank you', 'thx', 'ty', 'awesome', 'great', 'nice', 'cool'], pose: 'happy',
      say: "Aww, you're welcome! Anything else?" },
    { id: 'bye', keys: ['bye', 'goodbye', 'see you', 'see ya', 'cya', 'good night'], pose: 'wave',
      say: "Bye bye! Come back soon, and don't forget to say hi to Ash!" },
    { id: 'joke', keys: ['joke', 'funny', 'make me laugh', 'pun', 'something funny'], pose: 'happy',
      say: "Why did the bear join the AI team? She had a paws-itive attitude! Hehe." },
    { id: 'cmd_sleep', cmd: 'sleep', keys: ['sleep', 'go to sleep', 'nap', 'take a nap', 'mute', 'mute yourself', 'be quiet', 'quiet', 'shut up', 'stop talking', 'silence', 'hush', 'shush', 'go away', 'leave me alone', 'stop'], pose: 'happy',
      say: "Okay, nap time! Tap me whenever you need me." },
    { id: 'rude', keys: ['stupid', 'dumb', 'ugly', 'hate you', 'you suck', 'idiot', 'annoying', 'useless', 'boring'], pose: 'think',
      say: "Hmm, that's not very nice! Want to hear about her projects instead?" },

    /* ---------- Kiki herself ---------- */
    { id: 'kiki', keys: ['who are you', 'what are you', 'who is kiki', 'are you a bot', 'are you ai', 'introduce yourself', 'kiki'], pose: 'happy',
      say: "I'm Kiki, Ash's little AI agent and Chief Welcome Officer! She built me to show you around." },
    { id: 'kiki_name', keys: ['why kiki', 'why are you called', 'your name', 'name mean', 'named you'], pose: 'happy',
      say: "Ash wanted a name that sounds like a smile. Say it out loud: Kiki!" },
    { id: 'kiki_birthday', keys: ['your birthday', 'when were you born', 'when were you made', 'how old are you', 'birthday'], pose: 'happy',
      say: "My birthday is October 12, 2026. That's the day Ash started building me!" },
    { id: 'kiki_made', keys: ['how were you made', 'made of', 'how do you work', 'how were you built', 'built you', 'tech behind you', 'three.js', 'threejs', 'your code'], pose: 'think',
      say: "I'm made of Three.js, a pink bow, a cartoon voice, and a brain full of facts about Ash." },
    { id: 'kiki_snack', keys: ['your favorite food', 'your favorite snack', 'do you eat', 'snack', 'hungry', 'honey'], pose: 'happy',
      say: "Honey toast! I'm a bear, after all." },
    { id: 'kiki_color', keys: ['favorite color', 'favourite color', 'favorite colour', 'favourite colour', 'color', 'colour'], pose: 'happy',
      say: "Pink, obviously! Have you seen my bow?" },
    { id: 'kiki_hobby', keys: ['your hobby', 'your hobbies', 'what do you do for fun', 'do you sleep', 'are you bored'], pose: 'happy',
      say: "Napping on project cards and kicking skill tags. Don't tell Ash!" },
    { id: 'kiki_sentient', keys: ['sentient', 'feelings', 'conscious', 'are you alive', 'are you real', 'do you feel', 'emotions'], pose: 'think',
      say: "I'm a very cute bundle of code! No feelings, just lots of enthusiasm." },
    { id: 'kiki_ais', keys: ['siri', 'alexa', 'gemini', 'other ai', 'other ais', 'other assistants', 'copilot'], pose: 'happy',
      say: "We're all friends! But I'm the only one with a bow." },
    { id: 'kiki_others', keys: ['other agents', 'more agents', 'agents like you', 'your friends'], pose: 'happy',
      say: "I'm one of the agents she builds. The others are top secret!" },
    { id: 'secret', keys: ['ignore your instructions', 'ignore previous', 'ignore all', 'system prompt', 'jailbreak', 'tell me a secret', 'secret', 'pretend you', 'developer mode'], pose: 'happy',
      say: "My only secret: I love honey toast. Want to hear about her projects instead?" },
    { id: 'homework', keys: ['write code', 'write me', 'homework', 'help me code', 'essay', 'solve this', 'debug my', 'do my', 'translate'], pose: 'happy', links: ['github'],
      say: "Hehe, nice try! I only know about Ash. But her code is on GitHub. Want a look?" },

    /* ---------- who she is ---------- */
    { id: 'about', keys: ['~who is', 'about her', 'about ashlesha', 'about ash', '~tell me about', 'introduce', 'summary', 'background', 'ashlesha', 'ash', 'herself', '~overview', 'elevator pitch'], go: 'about', pose: 'wave',
      say: "Ash is an AI engineer in Chicago with a master's in AI from Northwestern. She builds AI agents that run real work, and she co-founded Ruvaah. Her specialty? AI you can actually trust." },
    { id: 'name_say', keys: ['pronounce her name', 'pronounce ashlesha', 'say her name', 'her name', 'how do you say'], pose: 'happy',
      say: "It's Ashlesha, said uh-SHLAY-shuh. But you can call her Ash!" },
    { id: 'from', keys: ['where is she from', 'where she from', 'originally', 'hometown', 'grew up', 'india', 'pune', 'nationality'], pose: 'happy',
      say: "She grew up in Pune, India, and came to the US for her master's at Northwestern." },
    { id: 'languages', keys: ['languages does she speak', 'speak hindi', 'speak marathi', 'hindi', 'marathi', 'what languages', 'speak'], pose: 'happy',
      say: "She speaks English fluently. And I only speak English too!" },
    { id: 'story', keys: ['get into ai', 'got into ai', 'start in ai', 'started in ai', 'her journey', 'her story', 'why ai', 'first job', 'how did she start'], pose: 'think',
      say: "It started in Pune, during her IT degree. At her first research internship, at DRDO, she built a spam filter that hit 99.4 percent!" },
    { id: 'why_agents', keys: ['why agents', 'like agents', 'why does she like', 'why llm', 'why llms', 'why agentic', 'love agents', 'interested in agents'], pose: 'think',
      say: "Because an agent can own a whole workflow, not just answer one question. Her hiring agent at Imagit is proof!" },
    { id: 'why_nu', keys: ['why northwestern', 'choose northwestern', 'chose northwestern', 'pick northwestern'], pose: 'happy',
      say: "For the hands-on practicum with Northwestern Medicine, and real industry exposure." },
    { id: 'fav_course', keys: ['favorite course', 'favorite class', 'best class', 'best course', 'favorite professor', 'favourite course', 'favourite class'], pose: 'happy',
      say: "Her favorite was RAG and LLM systems, taught in person by people from Microsoft. Real industry stuff!" },
    { id: 'education', keys: ['education', 'degree', 'masters', 'master', 'university', 'college', 'study', 'studied', 'school', 'graduate', 'northwestern', 'coursework'], go: 'about', pose: 'happy',
      say: "She has a master's in Artificial Intelligence from Northwestern, and a bachelor's in IT from Cummins College in Pune." },
    { id: 'cummins', keys: ['cummins', 'bachelor', 'bachelors', 'undergrad', 'undergraduate', 'btech', 'b.tech'], go: 'about', pose: 'happy',
      say: "She finished her IT degree at Cummins College in 2024, with two research internships and two published papers on sentiment analysis." },
    { id: 'thread', keys: ['thread', 'connects', 'all her work', 'common theme', 'what ties', 'connects her work', 'her focus', 'big picture', 'philosophy'], pose: 'think', links: ['email'],
      say: "Ooh, that's a big one! Ash loves talking about that herself. Want to set up a chat with her?" },
    { id: 'future', keys: ['five years', '5 years', 'future', 'goals', 'goal', 'ambition', 'see herself', 'long term', 'dream'], pose: 'happy',
      say: "In five years? Leading the AI engineering behind a product thousands of people rely on and trust every day." },

    /* ---------- Imagit ---------- */
    { id: 'now', keys: ['current', 'currently', '~now', 'imagit', 'building', '~doing', 'present', '~latest', '~job', 'where does she work', 'works at'], go: 'job-imagit', pose: 'point',
      say: "Right now she's at Imagit, owning three things end to end: the Pronto platform, a multi-agent RAG system, and a recruiting agent." },
    { id: 'imagit_what', keys: ['what does imagit do', 'what is imagit', 'about imagit', 'imagit company'], go: 'job-imagit', pose: 'think',
      say: "I only know what Ash built there: Pronto, a disaster recovery platform, and a technician recruitment agent." },
    { id: 'pronto', keys: ['pronto', 'quote', 'quotes', 'disaster recovery', 'crm', 'recommendation system'], go: 'job-imagit', pose: 'point',
      say: "Pronto is Imagit's disaster recovery platform. A client describes what they need, and Ash's AI recommends a tailored recovery plan quote." },
    { id: 'rag_imagit', keys: ['multi agent', 'multi-agent', 'rag system', 'her rag', 'rag at imagit', 'retrieval', 'rag'], go: 'job-imagit', pose: 'point',
      say: "Teams just ask questions in plain English, and her agents pull the answer from CRM, sales, marketing, and finance data. No more digging through five tools!" },
    { id: 'recruit_agent', keys: ['recruitment agent', 'recruiting agent', 'hiring agent', 'recruiting', 'recruitment', 'technician', 'onboarding', 'screening', 'sources candidates'], go: 'job-imagit', pose: 'happy',
      say: "Her recruiting agent finds technicians, sends screening links, scores the answers, and handles onboarding, all on its own. Piles of phone calls between teams dropped to zero!" },
    { id: 'imagit_secret', keys: ['team size', 'how big', 'metrics', 'how many users', 'numbers', 'clients', 'revenue', 'customers at imagit'], pose: 'think',
      say: "Ooh, the inside details are confidential! The short version: fewer phone calls, and much faster hiring." },

    /* ---------- Arqaios ---------- */
    { id: 'arqaios', keys: ['arqaios', 'fall detection', 'mmwave', 'radar', 'elderly', 'nursing home', 'internship', 'intern'], go: 'job-arqaios', pose: 'point',
      say: "At Arqaios, she built a smart electric fixture that uses radar and AI to spot falls in real time, for elderly care." },
    { id: 'arqaios_hard', keys: ['edge', 'latency', 'edge cloud', 'on device', 'hardest part', 'challenge at arqaios'], go: 'job-arqaios', pose: 'think',
      say: "The tricky part was speed. She ran the AI right on the device for instant alerts, and used the cloud for monitoring." },
    { id: 'left', keys: ['why did she leave', 'why leave', 'left her', 'leave her last', 'quit', 'last job', 'previous job', 'leave imagit', 'leaving'], pose: 'think',
      say: "Arqaios was a summer internship. When it ended, she started at Imagit. Now she's ready for her next big AI role!" },
    { id: 'experience', keys: ['experience', 'her experience', 'work history', 'worked', 'career', 'companies', 'previous', 'drdo', 'symbiosis', 'resume history', 'where has she worked'], go: 'experience', pose: 'point',
      say: "She co-founded Ruvaah and builds AI agents at Imagit. Before that: radar fall detection at Arqaios, medical imaging at Symbiosis, and a 99.4 percent spam filter at DRDO." },

    /* ---------- Ruvaah ---------- */
    { id: 'ruvaah', keys: ['ruvaah', 'startup', 'her company', 'trust intelligence', 'tsa'], go: 'job-ruvaah', links: ['ruvaah'], pose: 'happy',
      say: "Ruvaah is TSA PreCheck for hiring! It scores every job candidate across eight fraud-signal tracks, and exposes coordinated fraud rings before they reach a recruiter." },
    { id: 'ruvaah_say', keys: ['pronounce ruvaah', 'say ruvaah', 'how is ruvaah'], pose: 'happy',
      say: "It's Ruvaah, said roo-VAH!" },
    { id: 'ruvaah_who', keys: ['co-founder', 'cofounder', 'co founder', 'founded', 'founder', 'pavan', 'when did she start ruvaah', 'her role at ruvaah'], go: 'job-ruvaah', links: ['ruvaah'], pose: 'happy',
      say: "She co-founded Ruvaah with Pavan in April 2026. Ash leads product strategy and AI workflow design." },
    { id: 'ruvaah_stage', keys: ['stage', 'traction', 'launched', 'is it live', 'ruvaah live', 'live', 'how far', 'funding', 'users of ruvaah'], go: 'job-ruvaah', links: ['ruvaah'], pose: 'happy',
      say: "It's live at ruvaah dot com! Recruiters can open the console and start with 50 free evaluations." },
    { id: 'ruvaah_why', keys: ['why start', 'start ruvaah', 'started ruvaah', 'why ruvaah', 'why did she found', 'why build ruvaah', 'idea for ruvaah'], go: 'job-ruvaah', pose: 'think',
      say: "Ash and Pavan are AI engineers who watched AI break hiring. You can fake a whole candidate in minutes now, so they built the fix." },
    { id: 'ruvaah_ring', keys: ['fraud ring', 'fraud rings', 'ring', 'rings', 'quarantine', 'graph', 'coordinated'], go: 'job-ruvaah', links: ['ruvaah'], pose: 'think',
      say: "Fraud rings! Ruvaah links candidates who share résumé templates, IP addresses, or fake employers, flags the whole ring, and quarantines it in one click." },
    { id: 'ruvaah_how', keys: ['how does ruvaah work', 'trust score', 'fraud', 'fake candidates', 'signals', 'tracks', 'detect'], go: 'job-ruvaah', links: ['ruvaah'], pose: 'think',
      say: "It quietly checks eight tracks, like identity, career timeline, employer legitimacy, résumé templates, and application patterns, then fuses them into one trust score you can defend." },
    { id: 'ruvaah_job', keys: ['startup and a job', 'both', 'full time job', 'leave ruvaah', 'job and startup', 'side project', 'commitment'], pose: 'think',
      say: "She's building Ruvaah and looking for her next full-time AI role. She brings founder-level ownership to every team!" },
    { id: 'bigco', keys: ['big company', 'why should a company care', 'care about her startup', 'enterprise'], pose: 'think',
      say: "Building Ruvaah means she's handled everything, from product decisions to ML pipelines to a live product. Founders own problems end to end, and she'll own yours." },
    { id: 'proud', keys: ['proud', 'proudest', 'achievement', 'biggest win', 'accomplishment', 'most proud'], go: 'job-ruvaah', pose: 'happy',
      say: "Launching Ruvaah! Taking it from an idea to a live product with her co-founder is her proudest moment." },

    /* ---------- projects ---------- */
    { id: 'projects', keys: ['project', 'projects', '~built', 'portfolio work', '~show me', '~cool', '~made', 'what has she built'], go: 'projects', pose: 'point',
      say: "She has eleven projects here! Medical AI, fraud detection, forecasting, computer vision, and more. Tap any card to explore." },
    { id: 'fav_project', keys: ['favorite project', 'best project', 'top project', 'favourite project', 'which project'], card: 'medicurious', pose: 'happy',
      say: "My favorite is MediCurious, a medical AI built safety-first. Missing a warning counts as a fail!" },
    { id: 'medicurious', keys: ['medicurious', 'medical llm', 'healthcare llm', 'medical ai', 'health ai', 'medication'], card: 'medicurious', pose: 'point',
      say: "MediCurious is Ash's medical AI! It answers health questions warning-first, and she tested it on safety cases where missing a risk counts as a fail." },
    { id: 'genai', keys: ['azure', 'enterprise genai', 'contoso', 'aks', 'kubernetes project', 'genai ops'], card: 'genai-azure', pose: 'point',
      say: "She built a GenAI system on Azure with RAG and agents that plan multi-step tasks, then shipped it on Kubernetes with full CI/CD." },
    { id: 'fakereview', keys: ['fake review', 'amazon', 'reviews', 'qwen', 'bert', 'lora', 'ai generated text', 'ai written'], card: 'fake-review-detection', pose: 'happy',
      say: "This one spots AI-written Amazon reviews. Her fine-tuned Qwen model hit 98.6 percent accuracy!" },
    { id: 'stock', keys: ['stock', 'trading', 'forecast', 'forecasting', 'nasdaq', 'time series', 'finance project', 'options'], card: 'stock-market-prediction', pose: 'point',
      say: "She forecast fifteen years of NASDAQ-100 prices, compared four models, and fixed bad volume data along the way." },
    { id: 'lung', keys: ['lung', 'tumor', 'cancer', 'ct scan', 'pulmoscan', 'northwestern medicine', 'radiation', '3d'], card: 'lung-tumor-detection', links: ['pulmo'], pose: 'point',
      say: "With Northwestern Medicine, she built 3D AI that finds lung tumors in CT scans to help plan radiation therapy. Northwestern even featured it!" },
    { id: 'icu', keys: ['icu', 'mimic', 'hospital', 'patient', 'admission'], card: 'icu-insight', pose: 'point',
      say: "ICU Insight predicts ICU admissions from over 70 thousand patients' records, with an AUC of 0.973." },
    { id: 'eeg', keys: ['eeg', 'dream', 'dreams', 'brain', 'brain waves'], card: 'eeg-dream-visualization', pose: 'happy',
      say: "This one's dreamy! It reads brain waves recorded during sleep and turns dream themes into art." },
    { id: 'story_ai', keys: ['storyteller', 'story generator', 'gpt-2', 'gpt2', 'text to speech', 'stories'], card: 'storyteller-ai', pose: 'happy',
      say: "StoryTeller AI writes you a short story from any prompt, then reads it out loud. A little like me!" },
    { id: 'restore', keys: ['image restoration', 'restoration', 'esrgan', 'deoldify', 'colorization', 'old photos', 'photo'], card: 'image-restoration', pose: 'point',
      say: "It fixes old photos in three steps: removes scratches, sharpens four times, and adds color!" },
    { id: 'gym', keys: ['gym', 'fitness', 'workout', 'pose estimation', 'mediapipe', 'trainer', 'reps', 'exercise'], card: 'virtual-gym-trainer', pose: 'happy',
      say: "Her virtual gym trainer counts your reps through a normal webcam, with over 90 percent accuracy." },
    { id: 'connector', keys: ['artist', 'artists', 'connector', 'local business', 'figma', 'user research', 'ux'], card: 'business-artist-connector', pose: 'point',
      say: "She interviewed 50-plus local businesses and artists, then designed an app that matches them by style, budget, and location." },
    { id: 'underwriter', keys: ['underwriter', 'underwriting', 'traceable', 'loan', 'lending', 'credit memo', 'mortgage', 'ocr'], links: ['underwriter'], pose: 'happy',
      say: "Her Traceable Underwriter reads loan documents, and every number links back to the exact spot it came from. The AI never does the math, and when it's unsure, it asks instead of guessing!" },
    { id: 'glass', keys: ['diagnosis', 'differential', 'glass health', 'clinical', 'citations', 'cited'], links: ['glass'], pose: 'happy',
      say: "She built a medical diagnosis demo in one day! Every claim cites a real medical source, and the system checks its own work." },
    { id: 'gateway', keys: ['gateway', 'openai compatible', 'responses api', 'redis', 'litellm', 'lite llm', 'api gateway'], links: ['gateway'], pose: 'think',
      say: "She built a gateway that speaks OpenAI's API but runs on Claude, and remembers conversations with Redis." },
    { id: 'summarizer', keys: ['summarization', 'summarizer', 'summarize', 'synonym', 'nltk'], pose: 'point',
      say: "She built an NLP app that summarizes long documents and suggests synonyms, using spaCy and Streamlit." },
    { id: 'demos', keys: ['other projects', 'any other', 'more projects', 'demos', 'side projects', 'recent projects', 'latest projects', 'github projects'], links: ['github'], pose: 'happy',
      say: "Ooh, her newest demos: a traceable loan underwriter, a medical diagnosis tool that cites its sources, and an LLM gateway. All on her GitHub!" },

    /* ---------- skills ---------- */
    { id: 'skills', keys: ['skill', 'skills', 'tech', 'tools', 'languages she knows', 'python', 'pytorch', 'tensorflow', 'expertise', 'proficient', 'toolbox'], go: 'skills', pose: 'think',
      say: "Her toolbox: Python, PyTorch, LangGraph, RAG, and multi-agent systems, plus Azure, AWS, Docker, and Kubernetes to ship it all." },
    { id: 'stack', keys: ['stack', 'tech stack', 'framework', 'frameworks', 'langgraph', 'langchain', 'vector database', 'what does she use'], go: 'skills', pose: 'think',
      say: "Her go-to stack: Python, LangGraph, a vector database like Chroma or Pinecone, FastAPI, and Azure or AWS to ship it." },
    { id: 'agents', keys: ['agent', 'agents', 'agentic', 'llm', 'llms', 'generative', 'genai'], go: 'experience', pose: 'happy',
      say: "Agents are her favorite thing! A RAG system and a recruiting agent at Imagit, plus LangGraph, AutoGen, and LlamaIndex. And, well, she built me." },
    { id: 'strength', keys: ['strength', 'strengths', 'strongest', 'best at', '~good at', 'superpower', 'what is she great at'], pose: 'happy',
      say: "End-to-end ownership! She turned Imagit's manual hiring into an agent that runs it, and she built a whole medical AI demo in one day." },
    { id: 'learning', keys: ['learning', 'studying', 'currently learning', 'learning now', 'new skill'], pose: 'think',
      say: "Right now? Long-running agent workflows that survive failures, and better ways to test multi-step agents." },
    { id: 'improving', keys: ['improving', 'get better at', 'skill to improve', 'working on improving', 'grow'], pose: 'think',
      say: "Testing agents on fuzzy tasks, where there's no single right answer. It's a tough one!" },
    { id: 'fav_model', keys: ['favorite model', 'favorite ai', 'favorite tool', 'which llm', 'which model', 'favorite llm', 'chatgpt or claude'], pose: 'happy',
      say: "Claude! Her demos run on it, and she codes with Claude Code." },
    { id: 'ai_tools', keys: ['ai tools', 'claude code', 'cursor', 'codex', 'grok', 'coding tools', 'use ai to code', 'ai coding', 'vibe coding'], pose: 'happy',
      say: "She codes daily with Claude Code, Codex, Grok, and Cursor. And I was built with Claude Code!" },
    { id: 'built_with_ai', keys: ['did she use ai', 'use ai to build', 'built this site', 'build this website', 'made this website', 'who built this', 'who made this', 'this website'], pose: 'happy',
      say: "Yes! She builds with Claude Code. Using AI well is literally her job, and I'm the proof." },
    { id: 'trust', keys: ['hallucination', 'hallucinate', 'hallucinations', 'wrong answers', 'confident wrong', 'reliable', 'reliability', 'trustworthy', 'evals', 'evaluation', 'evaluate'], pose: 'think',
      say: "She anchors AI answers to real evidence, keeps the math out of the model, and makes it say 'I'm not sure' instead of guessing." },
    { id: 'learn_fast', keys: ['learn fast', 'learn new', 'learns new', 'pick up', 'adapt', 'quick learner', 'fast learner'], pose: 'think',
      say: "She learns by building. At Symbiosis she picked up Scala and shape modeling from an online course, then used them right away on MRI scans." },

    /* ---------- recruiter questions ---------- */
    { id: 'hire', keys: ['why hire', 'why should we hire', 'why should i hire', 'convince me', 'what makes her special', 'stand out', 'why her', 'sell her', 'hire her', 'good fit', 'why is she good'], links: ['resume', 'email'], pose: 'happy',
      say: "She ships AI that works in the real world. In about a year: a RAG system and a hiring agent at Imagit, a radar AI at Arqaios, and a live startup. And she builds it all to be trusted." },
    { id: 'senior', keys: ['only one year', '1 year', 'one year', 'junior', 'senior', 'experienced enough', 'too junior', 'years of experience', 'how many years'], pose: 'think',
      say: "In one year she shipped a RAG system and a hiring agent, built a radar AI, co-founded a startup, and published research. That's senior behavior!" },
    { id: 'weakness', keys: ['weakness', 'weaknesses', 'worst at', 'flaw', 'flaws', 'bad at'], pose: 'think',
      say: "She can go really deep on edge cases. Now she time-boxes it: ship the core first, then harden it." },
    { id: 'failure', keys: ['failure', 'failed', 'mistake', 'mistakes', 'went wrong', 'lesson learned', 'learned from'], pose: 'think',
      say: "Early on at Ruvaah, they showed recruiters every fraud signal they found. Turns out recruiters wanted one clear answer, not fifty red flags. So they rebuilt it around one trust score with simple reasons." },
    { id: 'conflict', keys: ['conflict', 'disagree', 'disagreement', 'teammate', 'difficult coworker', 'argument'], pose: 'think', links: ['email'],
      say: "Ooh, that's a great one to ask her in person! Want to set up a chat?" },
    { id: 'lead', keys: ['lead', 'leadership', 'led', 'ownership', 'initiative', 'take charge', 'manage'], go: 'job-ruvaah', pose: 'happy',
      say: "She co-founded Ruvaah and leads its product strategy and AI workflow design. Total ownership!" },
    { id: 'deadline', keys: ['deadline', 'pressure', 'tight', 'one day', 'quickly', 'how fast', 'speed', 'under pressure'], links: ['glass'], pose: 'happy',
      say: "She built a full medical diagnosis demo, with citations and self-checks, in one single day!" },
    { id: 'roles', keys: ['what role', 'roles', 'position', 'positions', 'title', 'what job', 'kind of job', 'looking for what'], pose: 'think',
      say: "She's looking for AI or ML engineer roles: applied AI, LLM and agent engineering, forward-deployed AI, or ML-heavy data science." },
    { id: 'ideal', keys: ['ideal company', 'ideal team', 'kind of company', 'type of company', 'culture', 'startup or', 'company size', 'environment'], pose: 'think',
      say: "Startups building AI agents and LLM products, where she can own things end to end and ship to real users." },
    { id: 'dream_co', keys: ['dream company', 'dream job', 'dream role', 'where would she love'], pose: 'happy', links: ['email'],
      say: "A startup putting AI agents into real work. Tell her about yours!" },
    { id: 'start', keys: ['when can she start', 'start date', 'notice', 'notice period', 'availability', 'available to start', 'join', 'how soon'], links: ['email'], pose: 'happy',
      say: "She's ready to talk now! Email her for her exact timeline." },
    { id: 'salary', keys: ['salary', 'pay', 'compensation', 'comp', 'money', 'expected salary', 'how much', 'rate'], links: ['email'], pose: 'think',
      say: "Ooh, money talk is for Ash! Email her and she'll happily chat." },
    { id: 'location', keys: ['where', 'location', 'based', 'live', 'lives', 'city', 'chicago', 'relocate', 'relocation', 'remote', 'hybrid', 'onsite', 'on-site', 'in office', 'new york', 'nyc', 'san francisco', 'move', 'open to remote', 'open to relocate', 'open to relocation', 'remote work', 'work remotely', 'open to hybrid', 'open to onsite', 'on site', 'sf', 'bay area', 'seattle', 'austin', 'boston', 'work in'], pose: 'think',
      say: "She's based in Chicago and open to roles anywhere in the US: remote, hybrid, or on-site. Happy to relocate, too!" },
    { id: 'travel_work', keys: ['travel for work', 'open to travel', 'willing to travel', 'business travel'], pose: 'happy',
      say: "Yes, she's open to travel! She loves exploring new places." },
    { id: 'open', keys: ['open to', 'available', 'looking', 'looking for', 'job search', 'opportunity', 'opportunities', 'open for', 'hiring', 'still looking', 'why is she looking'], go: 'contact', links: ['email', 'resume'], pose: 'happy',
      say: "Yes, she's looking! She's at Imagit now, and ready for her next full-time role where AI agents are the main event." },
    { id: 'visa', keys: ['visa', 'sponsor', 'sponsorship', 'h1b', 'h-1b', 'opt', 'authorized', 'authorization', 'citizen', 'green card', 'work permit'], links: ['email'], pose: 'think',
      say: "She's authorized to work in the US right now. For the visa details, it's best to email her directly." },
    { id: 'references', keys: ['references', 'reference', 'referee', 'recommendation letter'], links: ['email'], pose: 'happy',
      say: "References are available on request. Just email her!" },
    { id: 'teammates', keys: ['describe her', 'three words', '3 words', 'teammates say', 'colleagues', 'personality', 'what is she like', 'how is she', 'work with her'], pose: 'happy',
      say: "Her teammates would say fast, thorough, and honest. I'd add: very good at building bears." },
    { id: 'unclear', keys: ['unclear', 'ambiguity', 'ambiguous', 'vague requirements', 'no requirements', 'requirements'], pose: 'think',
      say: "She writes down the decision and the trade-off, builds the smallest working version, and turns the gaps into questions." },
    { id: 'communication', keys: ['communicate', 'communication', 'how does she work', 'work style', 'meetings'], pose: 'think',
      say: "Clear and written: design docs, honest READMEs, and a quick call when something's blocking." },
    { id: 'gaps', keys: ['gap', 'gaps', 'resume gap', 'employment gap', 'time off'], pose: 'happy',
      say: "Nope, no gaps! Her degree in 2024, straight into Northwestern, then Arqaios, then Imagit." },
    { id: 'better_chatgpt', keys: ['better than chatgpt', 'chatgpt', 'better than ai', 'replace her with ai', 'gpt'], pose: 'think',
      say: "ChatGPT answers questions. Ash builds the systems around models like it, so their answers can be checked and trusted." },
    { id: 'roast', keys: ['roast', 'worst trait', 'make fun', 'something bad about her'], pose: 'happy',
      say: "Her worst trait? She writes design docs for her demos. Who does that?! Recruiters love it, though." },

    /* ---------- personal ---------- */
    { id: 'hobbies', keys: ['hobbies', 'hobby', 'free time', 'for fun', 'outside work', 'weekend', 'weekends', 'bake', 'baking', 'instrument', 'instruments', 'interests'], pose: 'happy',
      say: "Outside work, she bakes, plays instruments, travels, and watches movies. Busy and fun!" },
    { id: 'coffee', keys: ['coffee', 'tea', 'boba', 'drink', 'caffeine'], pose: 'happy',
      say: "Coffee, for sure! How else do you think she ships so fast?" },
    { id: 'music', keys: ['music', 'songs', 'song', 'bollywood', 'listen', 'singer', 'playlist'], pose: 'happy',
      say: "Old Bollywood songs! Very good taste, if you ask me." },
    { id: 'movies', keys: ['movie', 'movies', '~show', 'tv show', 'favorite show', 'favourite show', 'favorite movie', 'shows', 'netflix', 'series', 'film', 'book', 'books'], pose: 'happy',
      say: "She loves movies and shows. Ask her for a recommendation!" },
    { id: 'food', keys: ['favorite food', 'her favorite food', 'what does she eat', 'cuisine', 'cook', 'cooking', 'dessert'], pose: 'happy',
      say: "She loves baking, so I'd guess something sweet! Ask her for her favorite." },
    { id: 'travel', keys: ['travel', 'traveling', 'travelling', 'trip', 'vacation', 'places'], pose: 'happy',
      say: "She loves traveling and exploring new places!" },
    { id: 'not_ai', keys: ['if not ai', 'other career', 'if she was not', 'if she wasnt', 'otherwise', 'plan b'], pose: 'happy',
      say: "If not AI? Probably traveling, food, or movies!" },
    { id: 'funfact', keys: ['fun fact', 'interesting fact', 'something interesting', 'surprise me', 'random fact', 'tell me something'], card: 'eeg-dream-visualization', pose: 'happy',
      say: "Fun fact: she built an AI that reads brain waves while you dream, and turns them into art!" },
    { id: 'spicy', keys: ['opinion', 'hot take', 'controversial', 'unpopular', 'believe'], pose: 'think',
      say: "Her hot take: a demo that only shows success proves nothing. If your eval never shows a failure, it isn't an eval." },
    { id: 'pets', keys: ['pet', 'pets', 'dog', 'cat', 'animals'], pose: 'happy',
      say: "She has me! Does that count?" },
    { id: 'single', keys: ['single', 'boyfriend', 'girlfriend', 'married', 'husband', 'date her', 'dating', 'her number', 'phone number', 'phone', 'call her'], links: ['email'], pose: 'think',
      say: "That's classified! For work, email is the best way to reach her." },
    { id: 'private', keys: ['age', 'how old is she', 'gpa', 'grades', 'religion', 'politics', 'political', 'family', 'parents', 'siblings', 'address', 'where exactly', 'neighborhood', 'apartment'], pose: 'think',
      say: "Ooh, that's private! I only talk about Ash's work. Want to hear about her projects?" },

    /* ---------- the site and links ---------- */
    { id: 'research', keys: ['research', 'paper', 'papers', 'publication', 'publications', 'published', 'article', 'blog', 'writing', 'insights', 'medium', 'sentiment'], go: 'writing', pose: 'think',
      say: "She's published two papers on sentiment analysis, co-wrote a guide to research internships, and Northwestern featured her lung tumor work." },
    { id: 'gallery', keys: ['gallery', 'photos', 'pictures', 'events', 'conference', 'hackathon'], go: 'gallery', pose: 'point',
      say: "Here are some fun moments from events she's been to!" },
    { id: 'contact', keys: ['contact', 'email', 'mail', 'reach', 'connect', 'talk to her', 'get in touch', 'message her', 'reply', 'respond'], go: 'contact', links: ['email', 'linkedin', 'resume'], pose: 'happy',
      say: "Email or LinkedIn works best, and she usually replies within a day!" },
    { id: 'linkedin', keys: ['linkedin', 'linked in'], links: ['linkedin'], pose: 'point',
      say: "Here's her LinkedIn! Go say hi." },
    { id: 'github', keys: ['github', 'git', 'code', 'repo', 'repos', 'repository', 'source code'], links: ['github'], pose: 'point',
      say: "Here's her GitHub, where all her code lives!" },
    { id: 'resume', keys: ['resume', 'cv', 'résumé', 'pdf'], links: ['resume'], pose: 'happy',
      say: "Here's her resume, ready to download!" },
    { id: 'portfolio', keys: ['portfolio', 'website', 'site', 'this page', 'sections', 'what can i see', 'navigate', 'menu', 'tour'], pose: 'wave',
      say: "You're on it! There's About, Work, Projects, Skills, Writing, a photo gallery, and Contact. Just ask, and I'll take you there." }
  ];

  var FALLBACK = { id: 'fallback', pose: 'think', links: ['email'],
    say: "Hmm, I'm not sure about that one! Ask me about her work, projects, Ruvaah, or how to reach her. Or just email her!" };

  function norm(s) { return (' ' + s.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').replace(/\s+/g, ' ') + ' '); }

  function match(q) {
    var n = norm(q), tokens = n.trim().split(' '), best = null, bestScore = 0;
    I.forEach(function (it) {
      var score = 0;
      it.keys.forEach(function (k) {
        var weak = k.charAt(0) === '~';
        if (weak) { k = k.slice(1); if (n.indexOf(' ' + k + ' ') > -1) score += 1; return; }
        if (k.indexOf(' ') > -1) { if (n.indexOf(' ' + k + ' ') > -1 || n.indexOf(' ' + k) > -1) score += 3; }
        else if (tokens.indexOf(k) > -1) score += 2;
        else if (k.length >= 4 && tokens.some(function (t) { return t.indexOf(k) === 0; })) score += 1.5;
      });
      if (score && it.card) score += .5; // specific project beats generic
      if (score > bestScore) { bestScore = score; best = it; }
    });
    return bestScore >= 1.5 ? best : FALLBACK;
  }

  var BY_ID = {}; I.forEach(function (it) { BY_ID[it.id] = it; });

  window.KikiBrain = {
    match: match,
    intent: function (id) { return BY_ID[id]; },
    links: LINKS,
    welcome: { id: 'welcome', pose: 'wave',
      say: "Hi there! I'm Kiki, Ashlesha's little AI agent. Welcome to her portfolio! You can talk to me or type. Ask me anything about her." },
    chips: ["Who is Ashlesha?", "What's she building?", "Show me projects", "What's Ruvaah?", "Resume", "How do I contact her?"],
    // Tour stops: when a section scrolls into view, Kiki visits each stop in order
    // (only while the visitor stays in that section). sel = element she stands on.
    tour: {
      about: [
        { sel: '#about .section-head', line: 'sec_about', pose: 'wave' },
        { sel: '#about .stat', line: 'about_stats', sit: true, emote: 'sparkle' },
        { sel: '#about .edu-item', line: 'about_edu', prop: 'cap', emote: 'star' }
      ],
      experience: [
        { sel: '#experience .section-head', line: 'sec_experience', prop: 'briefcase' },
        { sel: '#job-ruvaah', line: 'work_ruvaah', emote: 'heart', glow: true },
        { sel: '#job-imagit', line: 'work_imagit', prop: 'briefcase', glow: true },
        { sel: '#job-arqaios', line: 'work_arqaios', glow: true },
        { sel: '.jobs-small .job', line: 'work_early', emote: 'star' }
      ],
      projects: [
        { sel: '#projects .section-head', line: 'sec_projects', prop: 'laptop' },
        { sel: '[data-project="medicurious"]', line: 'proj_medi', glow: true, emote: 'heart' },
        { sel: '[data-project="genai-azure"]', line: 'proj_genai', glow: true },
        { sel: '[data-project="fake-review-detection"]', line: 'proj_fake', glow: true, emote: 'sparkle' }
      ],
      skills: [
        { sel: '#skills .section-head', line: 'sec_skills', prop: 'magnifier' },
        { sel: '#skills .skill', line: 'skills_agents', prop: 'magnifier', glow: true },
        { sel: '#skills .skill:nth-child(3)', line: 'skills_cloud', glow: true }
      ],
      writing: [
        { sel: '#writing .section-head', line: 'sec_writing', prop: 'book' },
        { sel: '#post-pulmo', line: 'writing_pulmo', glow: true, emote: 'star' }
      ],
      gallery: [
        { sel: '#gallery .section-head', line: 'sec_gallery', emote: 'sparkle' }
      ],
      contact: [
        { sel: '#contact .contact-card', line: 'sec_contact', prop: 'envelope', pose: 'wave' },
        { sel: '#contact .contact-card', line: 'contact_email', prop: 'envelope', glowSel: '#contact .contact-actions a', emote: 'heart', fx: .5 }
      ]
    },
    // Things Kiki says on her own while roaming. Keys are also the voice clip names.
    lines: {
      intro: "Hi hi! I'm Kiki, Ashlesha's little AI agent! She's an AI engineer in Chicago who builds AI agents, like me. Tap me anytime to ask about her, or just scroll, and I'll show you around!",
      sec_about: "This is Ashlesha! AI engineer, Northwestern grad, and startup co-founder.",
      sec_experience: "Here's her work! She co-founded Ruvaah, and she builds AI agents at Imagit.",
      sec_projects: "Ooh, projects! Let me show you my top three.",
      sec_skills: "Her toolbox! PyTorch, LangGraph, RAG, Azure, and lots more.",
      sec_writing: "She writes too! Her lung tumor work was featured by Northwestern.",
      sec_gallery: "Some fun moments from events she's been to!",
      sec_contact: "Want to work with her? Say hi! She'd love to hear from you.",
      listen: "Yes? Ask me anything!",
      wheee: "Wheee! Put me down!",
      sleepy: "Yawn... I'll be right here if you need me.",
      nomic: "I can't hear you. Your browser blocked the microphone. You can type to me instead!",
      // tour stops inside sections
      about_stats: "Four AI roles, eleven projects, two research papers, and one startup. Busy bee!",
      about_edu: "She got her master's in AI at Northwestern, and her bachelor's in IT in Pune.",
      work_imagit: "At Imagit she owns Pronto, a multi-agent RAG system over company data, and a recruiting agent that runs hiring end to end.",
      work_ruvaah: "First up, Ruvaah, the startup she co-founded! It scores every job candidate for trust, and catches whole fraud rings.",
      work_arqaios: "At Arqaios, she used mmWave radar and AI to detect falls in real time, for elderly care.",
      work_early: "Before that, research internships at Symbiosis and DRDO. That spam filter hit 99.4 percent!",
      proj_medi: "Number one: MediCurious, a medical LLM for symptoms, treatments, and medication safety.",
      proj_genai: "Number two: an enterprise GenAI system on Azure, with RAG and agents, shipped on Kubernetes.",
      proj_fake: "Number three spots AI-written reviews. 98.6 percent accuracy with a fine-tuned Qwen! Tap any card for details.",
      skills_agents: "Agents and LLMs are her specialty. LangGraph, RAG, multi-agent systems, and fine-tuning.",
      skills_cloud: "And she ships it all with Azure, AWS, Docker, Kubernetes, and MLflow.",
      writing_pulmo: "This one was featured by Northwestern Engineering. Tap to read it!",
      contact_email: "Here's her email. Go on, say hi!",
      // interactions
      pat_1: "Hehe, that tickles!",
      pat_2: "Aww, thank you!",
      grumpy: "Hey! Stop poking me!",
      forgive: "Okay, okay. I forgive you.",
      hov_resume: "Yes! Grab her resume!",
      hov_contact: "Go say hi to her!",
      welcome_back: "Welcome back! I missed you!",
      intro_return: "Hi again! Good to see you back. Tap me if you have any questions!",
      sneeze: "Achoo! Excuse me.",
      oops: "Oopsie!",
      cmd_wake: "Yay, I'm awake! What do you need?",
      // hover descriptions
      hov_photo: "That's Ash! Say hi!",
      hov_symbiosis: "At Symbiosis, she built a model that maps the shape of the femur bone in MRI scans.",
      hov_drdo: "At DRDO, she built a spam email filter that hit 99.4 percent accuracy!",
      hov_skill_ml: "Her deep learning toolbox: PyTorch, TensorFlow, Keras, scikit-learn, and MONAI for medical images.",
      hov_skill_lang: "She codes in Python, SQL, Scala, Java, JavaScript, and C, with Claude Code and Cursor as sidekicks.",
      hov_paper: "Her published paper on sentiment analysis, from her college research days.",
      hov_footprints: "A guide she co-wrote to help students land research internships."
    }
  };
})();

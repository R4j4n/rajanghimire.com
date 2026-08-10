/**
 * Portfolio content — single source of truth for every section.
 * Keeping copy out of the components makes the layout components purely
 * presentational and the site trivially editable.
 */

export const meta = {
    name: "Rajan Ghimire",
    firstName: "RAJAN",
    lastName: "GHIMIRE",
    title: "ML Engineer & AI Systems Builder",
    email: "rajan@rajanghimire.com",
    phone: "+1 (437) 438 3992",
    phoneHref: "tel:+14374383992",
    github: "https://github.com/R4j4n",
    githubLabel: "github.com/R4j4n",
    linkedin: "https://linkedin.com/in/r4j4n/",
    linkedinLabel: "linkedin.com/in/r4j4n",
    location: "Toronto, Ontario",
    locationShort: "Toronto, CA",
    timezone: "America/Toronto",
    resume: "/Resume_2026.pdf",
}

export const nav = [
    { id: "work", label: "Work", index: "01" },
    { id: "stack", label: "Stack", index: "02" },
    { id: "projects", label: "Projects", index: "03" },
    { id: "research", label: "Research", index: "04" },
    { id: "contact", label: "Contact", index: "05" },
]

export const hero = {
    badge: "Open to opportunities",
    roles: [
        "ML Engineer",
        "AI Systems Builder",
        "NLP Specialist",
        "Backend Engineer",
        "LLM Engineer",
    ],
    description:
        "I build AI-powered software. LLM agents, NLP and vision models, and the pipelines and services that carry them from a notebook into something people actually use.",
}

export const stats = [
    { value: "4+", label: "Years shipping ML" },
    { value: "5k+", label: "Weekly bookings automated" },
    { value: "70%", label: "Model size cut, 2% loss" },
    { value: "2", label: "Peer-reviewed papers" },
]

export const about = {
    lead: "I build models, then the software that keeps them alive.",
    body: [
        "Half of my work is research-shaped. Fine-tuning transformers, quantizing segmentation models, teaching an LLM to write its own SQL, annotating a corpus by hand because nobody else was going to.",
        "The other half is production software: FastAPI services, agent orchestration, scheduled data pipelines and the web control panels people drive them from. An AI phone agent that answers on the first ring is only interesting once it holds up against live booking data at two in the afternoon.",
    ],
    globeWord: "machine learning · nlp · llm agents · systems · ",
}

export type ExperienceItem = {
    company: string
    role: string
    location: string
    period: string
    current: boolean
    stack: string[]
    bullets: string[]
}

export const experience: ExperienceItem[] = [
    {
        company: "Aerosports Trampoline Parks",
        role: "IT Lead",
        location: "Scarborough, Ontario",
        period: "Aug 2025 — Present",
        current: true,
        stack: ["Python", "LLM Agents", "Automation", "Real-time", "Scheduling"],
        bullets: [
            "Built an AI phone agent handling 100+ inbound calls — answers questions and books events against live company data rather than a static script.",
            "Built an automated outreach system over 5,000+ weekly bookings, letting sales run 1,000+ targeted SMS and email campaigns on configurable schedules.",
            "Wrote the show-control software driving the venue's lighting: programmable animation sequences and automated scheduling synced to operating hours.",
            "Built the real-time scoring services behind 3+ interactive game rooms — live event ingestion, per-player state and leaderboards.",
        ],
    },
    {
        company: "K1 Speed St Catharines",
        role: "IT Solutions Engineer",
        location: "St. Catharines, Ontario",
        period: "May 2025 — Aug 2025",
        current: false,
        stack: ["Python", "REST API", "Raspberry Pi", "Automation", "VLC/CEC"],
        bullets: [
            "Engineered a digital signage platform driving 30+ screens from a Raspberry Pi fleet — web control panel, zone scheduling, live broadcast and remote playback control over CEC and VLC.",
            "Built the cloud credit-validation service behind a tap-to-play payment system, replacing coin operation on 20+ arcade machines with authenticated per-tap transactions.",
            "Wrote the device-side firmware and provisioning flow that keeps the machine fleet talking to that service unattended.",
        ],
    },
    {
        company: "E.K. Solutions Pvt. Ltd.",
        role: "Machine Learning Engineer",
        location: "Lalitpur, Nepal",
        period: "Apr 2022 — Nov 2023",
        current: false,
        stack: ["PyTorch", "LLaMA2", "YOLOv5", "LoRA", "Hugging Face"],
        bullets: [
            "Built multilingual resume parser and semantic job matcher using LLaMA2 — P@10: 0.95, P@20: 0.92, MAP: 0.85 for job description matching.",
            "Applied quantization to semantic segmentation model — 70% size reduction, 32% speed increase, only 2% accuracy loss.",
            "Fine-tuned Donut and table transformers on 30+ samples for invoice parsing — 95% precision, 92% cell coverage, 1.5 seconds per invoice.",
            "Developed orientation-free YOLOv5 object detection model for medical kits; manually collected 3,000+ images with data augmentation.",
            "Built SQL database agent using CodeLlama + LoRA (NSText2SQL + custom data) — converts human queries to SQL and generates Plotly visualizations.",
        ],
    },
    {
        company: "E.K. Solutions Pvt. Ltd.",
        role: "NLP Trainee",
        location: "Lalitpur, Nepal",
        period: "Dec 2021 — Apr 2022",
        current: false,
        stack: ["NLTK", "spaCy", "BERT", "XLNet", "GPT"],
        bullets: [
            "Research and practical implementation of NLP tools: NLTK, spaCy, word embeddings, and NumPy operations.",
            "Trained and evaluated models including PCA, K-Means, Logistic Regression, BERT, XLNET, and GPT using PyTorch and Hugging Face — for sentiment and news classification.",
        ],
    },
]

export const skills = [
    {
        name: "Languages",
        items: ["Python", "C/C++", "C#", "Bash", "SQL", "LaTeX"],
    },
    {
        name: "ML / AI",
        items: [
            "PyTorch",
            "TensorFlow",
            "Scikit-learn",
            "OpenCV",
            "Hugging Face",
            "LangChain",
            "LlamaIndex",
            "spaCy",
            "NLTK",
        ],
    },
    {
        name: "Web & Data",
        items: [
            "FastAPI",
            "Flask",
            "Django",
            "Streamlit",
            "Vue.js",
            "MongoDB",
            "PostgreSQL",
            "MySQL",
            "Spark",
            "Hadoop",
        ],
    },
    {
        name: "DevOps & Tools",
        items: ["Git", "Docker", "Kubernetes", "MLflow", "Power BI", "DAX"],
    },
]

export type Project = {
    title: string
    period: string
    kind: "software" | "engineering"
    summary: string
    bullets: string[]
    tags: string[]
    link?: string
}

export const projects: Project[] = [
    {
        title: "Chat2Plot",
        period: "Dec 2023 — Present",
        kind: "software",
        summary:
            "Text-to-visualization system that turns plain questions about tabular data into interactive charts.",
        bullets: [
            "Secure, language-independent architecture: the LLM emits declarative plot specifications as JSON rather than executable code.",
            "No arbitrary code execution path, so the same pipeline is safe to expose to untrusted prompts.",
        ],
        tags: ["LLM", "Plotly", "JSON Spec", "Python"],
    },
    {
        title: "CaptionCraft",
        period: "Nov 2023 — Dec 2023",
        kind: "software",
        summary:
            "Automatic subtitling with speaker identification and multilingual translation for arbitrarily long video.",
        bullets: [
            "Wav2Vec + MBart pipeline handling captioning, speaker diarization and translation in a single pass.",
            "Chunked processing for long-form video, subtitle embedding and direct YouTube integration.",
        ],
        tags: ["Wav2Vec", "MBart", "Diarization", "FFmpeg"],
    },
    {
        title: "End-to-End Nepali OCR",
        period: "Feb 2023 — Apr 2023",
        kind: "software",
        summary:
            "Handwritten Nepali recognition built from differentiable binarization detection through to transformer recognition.",
        bullets: [
            "Trained a DBNet text detector in PyTorch — precision 91.79%, recall 90.69%, IoU 83.64% on a hand-annotated dataset.",
            "Annotated the corpus and fine-tuned TrOCR for the recognition stage.",
        ],
        tags: ["DBNet", "TrOCR", "PyTorch", "Annotation"],
    },
    {
        title: "NepaliLy",
        period: "May 2021 — Jan 2022",
        kind: "software",
        summary:
            "A Grammarly-shaped writing assistant for Nepali: transliteration, tagging, spelling and prediction.",
        bullets: [
            "Transliteration engine with 32,000+ mappings and a spell-check store of 500,000+ stemmed words.",
            "BERT-based POS tagging at F1 0.933, plus a pre-trained BERT head for next-word prediction.",
        ],
        tags: ["BERT", "Transliteration", "POS Tagging"],
    },
    {
        title: "Venue Ops AI Suite",
        period: "2025 — Present",
        kind: "engineering",
        summary:
            "The software layer a busy venue runs on: an AI phone agent, an outreach engine and real-time scoring services.",
        bullets: [
            "LLM phone agent answering questions and booking events against live company data, not a scripted IVR tree.",
            "Outreach engine over 5,000+ weekly bookings — segmentation, scheduling and 1,000+ SMS/email sends per campaign.",
            "Show-control and scoring services: programmable animation sequences on a venue clock, plus live per-player state for three game rooms.",
        ],
        tags: ["LLM Agent", "Python", "Automation", "Real-time"],
    },
    {
        title: "Signage & Tap-to-Play Platform",
        period: "2025",
        kind: "engineering",
        summary:
            "Two fleet-management services for a karting venue: screens and arcade payments, both driven from the browser.",
        bullets: [
            "Signage platform managing 30+ screens from a Raspberry Pi fleet — web control panel, zone scheduling, live broadcast, remote playback over CEC and VLC.",
            "Cloud credit-validation service turning 20+ coin-op machines into authenticated tap-to-play, with device provisioning and per-tap transactions.",
        ],
        tags: ["Python", "REST API", "Fleet Control", "Scheduling"],
    },
]

export const publications = [
    {
        authors: "Ghimire R, Basnet R, Shahi R, Joshi S.",
        title:
            "Leveraging Transliteration, Spelling Detection and Correction, Parts of Speech Tagging and Next Word Prediction for Effective Nepali Typing",
        venue: "KEC Conference Proceedings",
        year: "2022",
        details: "Vol. 4, pp 55–62 · ISSN 2961-1695 (Print) · ISSN 2961-1997 (Online)",
    },
    {
        authors: "Ghimire R, Basnet R, Maharjan R.",
        title: "Eye Controlled Virtual Keyboard Using Convolutional Neural Networks",
        venue: "KEC Conference Proceedings",
        year: "2021",
        details: "Vol. 3, pp 237–242 · ISBN 978-9937-0-9019-3",
    },
]

export const education = [
    {
        school: "Lambton College",
        degree: "Graduate Certificate — Artificial Intelligence & Machine Learning",
        location: "Toronto, Ontario",
        period: "Jan 2024 — Aug 2025",
    },
    {
        school: "Kantipur Engineering College",
        degree: "Bachelor's in Computer Engineering",
        location: "Lalitpur, Nepal",
        period: "Dec 2017 — Apr 2022",
    },
]

export const contact = {
    lead: "Let's build\nsomething",
    intro:
        "Whether it's an ML role, AI consulting, or an interesting technical problem — I'm always open to a conversation.",
    links: [
        { label: "Email", value: meta.email, href: `mailto:${meta.email}` },
        { label: "Phone", value: meta.phone, href: meta.phoneHref },
        { label: "GitHub", value: meta.githubLabel, href: meta.github },
        { label: "LinkedIn", value: meta.linkedinLabel, href: meta.linkedin },
    ],
}

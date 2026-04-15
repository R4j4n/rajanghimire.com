/**
 * rajan.portfolio — Portfolio Data
 * Centralised content for Rajan Ghimire's portfolio site.
 */

const portfolioData = {
  meta: {
    name: "Rajan Ghimire",
    firstName: "RAJAN",
    lastName: "GHIMIRE",
    title: "ML Engineer & AI Systems Builder",
    email: "rjnghimire0@gmail.com",
    phone: "+1 (437) 438 3992",
    github: "https://github.com/R4j4n",
    githubLabel: "R4j4n",
    linkedin: "https://linkedin.com/in/r4j4n/",
    linkedinLabel: "r4j4n",
    blogs: "#",
    location: "Toronto, Ontario"
  },

  hero: {
    badge: "Open to opportunities",
    roles: ["ML Engineer", "AI Systems Builder", "NLP Specialist", "IoT Developer", "LLM Hacker"],
    description: "I build AI-powered systems, intelligent infrastructure, and machine learning pipelines — from LLM-based automation to RFID arcade systems and DMX lighting controllers.",
    actions: [
      { text: "View Experience", link: "#experience", type: "primary" },
      { text: "Get In Touch", link: "#contact", type: "ghost" }
    ]
  },

  experience: {
    tag: "Experience",
    title: "Where I've Worked",
    items: [
      {
        company: "Aerosports Trampoline Parks",
        role: "IT Lead",
        location: "Scarborough, Ontario",
        period: "Aug 2025 – Present",
        current: true,
        bullets: [
          "Built complete IT infrastructure for a 60,000+ sq ft facility — network, audio systems, 64+ security cameras, 30,000+ ft of Cat6 cabling.",
          "Developed custom DMX controller software managing 300+ lighting fixtures with programmable animations and automated scheduling synced to venue operations.",
          "Designed and deployed 3+ interactive game rooms with LED floor grids, touch sensors, motion-tracking, laser mazes, RFID wristband tracking, real-time scoring.",
          "Built an AI-powered phone system handling 100+ inbound calls, answering queries and booking events using live company data.",
          "Built automated outreach system processing 5,000+ weekly bookings — enabling sales teams to deliver 1,000+ targeted SMS and email campaigns on configurable schedules."
        ]
      },
      {
        company: "K1 Speed St Catharines",
        role: "Information Technology Solutions Engineer",
        location: "St. Catharines, Ontario",
        period: "May 2025 – Aug 2025",
        current: false,
        bullets: [
          "Built complete IT infrastructure for a 60,000+ sq ft facility from the ground up — network architecture, 48+ cameras, NVR/NAS configuration, full cable routing.",
          "Engineered fully automated digital signage platform managing 30+ TVs via Raspberry Pi with CEC and VLC — web-based control panel, HDMI switching, live broadcasting, zone scheduling.",
          "Developed RFID-based arcade payment system converting 20+ coin-operated machines to tap-to-play using ESP32 microcontrollers, custom PCB design, 3D-printed enclosures, and cloud-based credit validation."
        ]
      },
      {
        company: "E.K. Solutions Pvt. Ltd.",
        role: "Machine Learning Engineer",
        location: "Lalitpur, Nepal",
        period: "Apr 2022 – Nov 2023",
        current: false,
        bullets: [
          "Built multilingual resume parser and semantic job matcher using LLaMA2 — P@10: 0.95, P@20: 0.92, MAP: 0.85 for job description matching.",
          "Applied quantization to semantic segmentation model — 70% size reduction, 32% speed increase, only 2% accuracy loss.",
          "Fine-tuned Donut and table transformers on 30+ samples for invoice parsing — 95% precision, 92% cell coverage, 1.5 seconds per invoice.",
          "Developed orientation-free YOLOv5 object detection model for medical kits; manually collected 3,000+ images with data augmentation.",
          "Built SQL database agent using CodeLlama + LoRA (NSText2SQL + custom data) — converts human queries to SQL and generates Plotly visualizations."
        ]
      },
      {
        company: "E.K. Solutions Pvt. Ltd.",
        role: "Natural Language Processing Trainee",
        location: "Lalitpur, Nepal",
        period: "Dec 2021 – Apr 2022",
        current: false,
        bullets: [
          "Research and practical implementation of NLP tools: NLTK, spaCy, word embeddings, and NumPy operations.",
          "Trained and evaluated models including PCA, K-Means, Logistic Regression, BERT, XLNET, and GPT using PyTorch and Hugging Face — for sentiment and news classification."
        ]
      }
    ]
  },

  skills: {
    tag: "Skills",
    title: "What I Build With",
    categories: [
      {
        name: "Languages",
        icon: "fa-terminal",
        items: ["Python", "C/C++", "C#", "Bash", "SQL", "LaTeX"]
      },
      {
        name: "ML / AI",
        icon: "fa-robot",
        items: ["PyTorch", "TensorFlow", "Sklearn", "OpenCV", "Hugging Face", "LangChain", "LlamaIndex", "spaCy", "NLTK"]
      },
      {
        name: "Web & Data",
        icon: "fa-server",
        items: ["FastAPI", "Flask", "Django", "Streamlit", "Vue.js", "MongoDB", "PostgreSQL", "MySQL", "Spark", "Hadoop"]
      },
      {
        name: "DevOps & Tools",
        icon: "fa-gear",
        items: ["Git", "Docker", "Kubernetes", "MLflow", "Power BI", "DAX"]
      }
    ]
  },

  education: {
    tag: "Education",
    title: "Academic Background",
    items: [
      {
        school: "Lambton College",
        degree: "Graduate Certificate — Artificial Intelligence & Machine Learning",
        location: "Toronto, Ontario",
        period: "Jan 2024 – Aug 2025",
        icon: "fa-graduation-cap"
      },
      {
        school: "Kantipur Engineering College",
        degree: "Bachelor's in Computer Engineering",
        location: "Lalitpur, Nepal",
        period: "Dec 2017 – Apr 2022",
        icon: "fa-microchip"
      }
    ]
  },

  publications: {
    tag: "Research",
    title: "Published Work",
    items: [
      {
        authors: "Ghimire R, Basnet R, Shahi R, Joshi S.",
        title: "Leveraging Transliteration, Spelling Detection and Correction, Parts of Speech Tagging and Next Word Prediction for Effective Nepali Typing",
        venue: "KEC Conference Proceedings",
        year: "2022",
        details: "Vol. 4, pp 55–62 · ISSN 2961-1695 (Print) · ISSN 2961-1997 (Online)"
      },
      {
        authors: "Ghimire R, Basnet R, Maharjan R.",
        title: "Eye Controlled Virtual Keyboard Using Convolutional Neural Networks",
        venue: "KEC Conference Proceedings",
        year: "2021",
        details: "Vol. 3, pp 237–242 · ISBN 978-9937-0-9019-3"
      }
    ]
  },

  projects: {
    tag: "Projects",
    title: "Things I've Built",
    software: {
      label: "Software Projects",
      items: [
        {
          title: "Chat2Plot",
          period: "Dec 2023 – Present",
          thumbnail: "img/projects/chat2plot.png",
          description: "Innovative text-to-visualization system using LLMs to generate interactive charts and insights from tabular data.",
          bullets: [
            "Implemented secure, language-independent architecture using LLMs to generate declarative plot specifications in JSON format.",
            "Ensures language-agnostic data visualization with no arbitrary code execution risk."
          ],
          link: ""
        },
        {
          title: "CaptionCraft",
          period: "Nov 2023 – Dec 2023",
          thumbnail: "img/projects/captioncraft.png",
          description: "Automatically generate subtitles, identify speakers, and translate content.",
          bullets: [
            "Created pipeline with Wav2Vec and MBart for automated captioning, speaker diarization, and multilingual translation.",
            "Implemented pipeline for handling arbitrarily long videos, subtitle embedding, and YouTube integration."
          ],
          link: ""
        },
        {
          title: "End-to-End Nepali OCR",
          period: "Feb 2023 – Apr 2023",
          thumbnail: "img/projects/nepali-ocr.png",
          description: "End-to-End Nepali OCR system using Differentiable Binarization and TrOCR for handwritten text recognition.",
          bullets: [
            "Trained DBNet text detection model in PyTorch — precision 91.79%, recall 90.69%, IoU 83.64%. Manually annotated handwritten dataset.",
            "Annotated data and fine-tuned TrOCR model on text recognition task."
          ],
          link: ""
        },
        {
          title: "NepaliLy",
          period: "May 2021 – Jan 2022",
          thumbnail: "img/projects/nepalily.png",
          description: "Grammarly-like tool for enhanced Nepali text processing.",
          bullets: [
            "Developed transliteration with 32,000+ mappings, POS tagging using BERT (F1: 0.933), and spell-checking database with 500,000+ stemmed words.",
            "Pre-trained BERT model for next word prediction."
          ],
          link: ""
        }
      ]
    },
    engineering: {
      label: "Engineering Projects",
      items: [
        {
          title: "AeroSports Parks",
          thumbnail: "img/projects/aerosports-thumb.png",
          description: "Complete IT infrastructure build-out for a 60,000+ sq ft trampoline park — network, AV, 64+ cameras, game rooms, AI phone system, and automated outreach.",
          images: [
            "img/projects/aerosports-1.png",
            "img/projects/aerosports-2.png",
            "img/projects/aerosports-3.png"
          ]
        },
        {
          title: "K1 Speed St Catharines",
          thumbnail: "img/projects/k1speed-thumb.png",
          description: "Full IT infrastructure for a 60,000+ sq ft indoor karting facility — network, 48+ cameras, digital signage on 30+ TVs, and RFID arcade payment system.",
          images: [
            "img/projects/k1speed-1.png",
            "img/projects/k1speed-2.png",
            "img/projects/k1speed-3.png"
          ]
        }
      ]
    }
  },

  contact: {
    tag: "Contact",
    title: "Let's Connect",
    intro: "Whether it's an ML role, AI consulting, or an interesting technical problem — I'm always open to a conversation.",
    links: [
      { label: "Email", value: "rjnghimire0@gmail.com", href: "mailto:rjnghimire0@gmail.com", icon: "fa-envelope", brand: false },
      { label: "Phone", value: "+1 (437) 438 3992", href: "tel:+14374383992", icon: "fa-phone", brand: false },
      { label: "GitHub", value: "github.com/R4j4n", href: "https://github.com/R4j4n", icon: "fa-github", brand: true },
      { label: "LinkedIn", value: "linkedin.com/in/r4j4n", href: "https://linkedin.com/in/r4j4n/", icon: "fa-linkedin", brand: true }
    ]
  }
};

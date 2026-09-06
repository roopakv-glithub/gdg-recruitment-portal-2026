// Current Date
import {
  ManageAccounts,
  Trophy,
  Campaign,
  ConnectWithoutContact,
  DesignServices,
  Palette,
  Language,
  Mobile2,
  SportsEsports,
  Analytics,
  Hub,
  Link,
  Cloud,
} from "@material-symbols-svg/react";

export const curDay = new Date().getDay();
export const curYear = new Date().getFullYear();
export const curDate = new Date().getDate();
export const curMonth = new Date().getMonth();
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Contact Links
export const LINKS = {
  instagram: "#",
  discord: "#",
  gmail: "#",
  linkedin: "#",
  x: "#",
};

// Department Details
export const reviews = [
  {
    "id": "c21ca066-ab4d-40a3-943c-f170d6312bdc",
    "icon": ManageAccounts,
    "tone": "#8ab4f8",
    "name": "Management",
    "studentLeads": [{"name":"Varun Achary","role":"Lead"},{"name":"Dhyan","role":"Lead"}],
    "description": "The backbone of the organization, turning vision into reality by planning, executing, and improvising. Oversees events, operations, and growth, ensuring smooth functioning, success, and impactful experiences."
  },
  {
    "id": "4499a966-2740-4c36-88dd-8916a909fc77",
    "icon": Campaign,
    "tone": "#FF7A6B",
    "name": "Publicity",
    "studentLeads": [{"name":"Vedanti","role":"Lead"},{"name":"Ananya Harithas","role":"Lead"}],
    "description": "Drives online presence with creative campaigns, video editing, and storytelling, boosting engagement, promoting events, and showcasing the club to inspire participation and community growth."
  },
  {
    "id": "3936d5a2-acd9-4a98-ac97-42c2c92f5c02",
    "icon": ConnectWithoutContact,
    "tone": "#FFD45E",
    "name": "Outreach",
    "studentLeads": [{"name":"Adarsh B Poduval","role":"Lead"},{"name":"Sumedh Patange","role":"Lead"}],
    "description": "Builds partnerships and expands outreach by connecting with communities, sponsors, and collaborators, ensuring diverse opportunities and impactful collaborations both within and beyond campus."
  },
  {
    "id": "e2ed9c2c-c36c-457f-a8bb-cf2e8bc7c2e1",
    "icon": DesignServices,
    "tone": "#FF7A6B",
    "name": "UI/UX",
    "studentLeads": [{"name":"Adil O","role":"Lead"}],
    "description": "Designs visually appealing, user-friendly digital interfaces with a focus on accessibility, usability, and aesthetics, ensuring products provide enjoyable, intuitive, and meaningful user experiences."
  },
  {
    "id": "d3beefc1-f8b0-4202-b26c-36e9804b6636",
    "icon": Palette,
    "tone": "#FFD45E",
    "name": "Design",
    "studentLeads": [{"name":"Samriddhi","role":"Creatives Lead"},{"name":"Sadhana","role":"Creatives Co-Lead"}],
    "description": "Creates stunning visuals, event posters, and branding materials that capture the organization's identity, ensuring every design communicates creativity, professionalism, and excitement to engage the community."
  },
  {
    "id": "8143de1d-db17-42fa-958d-13b10804f894",
    "icon": Language,
    "tone": "#8AB4F8",
    "name": "Web Development",
    "studentLeads": [{"name":"Surjyadip Sen","role":"Lead"}],
    "description": "Designs, develops, and maintains responsive, high-performance websites for projects and events, using modern web technologies to enhance accessibility, user experience, and community engagement online."
  },
  {
    "id": "339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
    "icon": Mobile2,
    "tone": "#6EE7A0",
    "name": "App Development",
    "studentLeads": [{"name":"Hardik Prem","role":"Lead"}],
    "description": "Builds intuitive, impactful mobile applications, improving accessibility, interaction, and convenience for members and event participants through functional, user-focused design."
  },
  {
    "id": "9055864f-c7dc-44cd-91d5-8759d32a496a",
    "icon": SportsEsports,
    "tone": "#FF7A6B",
    "name": "Game Development",
    "studentLeads": [{"name":"Kingshuk","role":"Lead"},{"name":"Kanha Arjun Jain","role":"Lead"}],
    "description": "Combines creativity and technical skills to design engaging, entertaining games, giving members hands-on experience with real-world game development tools, engines, and production workflows."
  },
  {
    "id": "c0f3b1d1-ce05-45f6-9e34-ac9443fc5fcb",
    "icon": Analytics,
    "tone": "#8AB4F8",
    "name": "Data Science",
    "studentLeads": [{"name":"Srivarshini S","role":"Lead"}],
    "description": "Applies AI, machine learning, and analytics to transform data into actionable insights, helping solve problems, build predictive models, and inspire innovation across projects."
  },
  {
    "id": "a1d920df-9eb9-49eb-b3a4-e4a3d1245ede",
    "icon": Cloud,
    "tone": "#FFD45E",
    "name": "Cloud & DevOps",
    "studentLeads": [{"name":"V Srivatsan","role":"Lead"}],
    "description": "Explores cloud computing, infrastructure, and automation by building scalable applications, hosting hands-on workshops, and educating members about cloud platforms, containerization, CI/CD pipelines, and DevOps practices."
  },
  {
    "id": "6a89c4e2-7b19-4f32-821e-9821a41b5201",
    "icon": Hub,
    "tone": "#FF7A6B",
    "name": "Blockchain",
    "studentLeads": [{"name":"Aditi Singh","role":"Lead"}],
    "description": "Explores decentralized apps, smart contracts, and Web3 development, giving members hands-on experience with blockchain protocols and tools."
  },
  {
    "id": "3e9ac635-01d4-495e-aa87-a7335a2403c2",
    "icon": Trophy,
    "tone": "#6EE7A0",
    "name": "Competitive Programming",
    "studentLeads": [{"name":"Aayush Talukdar","role":"Lead"},{"name":"Rahul Chowdhary","role":"Lead"}],
    "description": "Promotes problem-solving skills through coding contests, hackathons, and peer learning, helping members sharpen algorithms, logic, and efficiency while preparing for real-world tech challenges."
  }
];

// Questionnaire Data
export const QuestionnaireData = [
  {
    "department": "App Development",
    "questions": [
      {
        "name": "What interests you about app development, and why would you like to join this department?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Describe an app you have built or would like to build. What problem does it solve?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Which programming languages, frameworks, or mobile development tools have you used?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How would you make an app easy to use on different devices and screen sizes?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How would you investigate and fix a bug reported by an app user?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      }
    ]
  },
  {
    "department": "Blockchain",
    "questions": [
      {
        "name": "What interests you about blockchain, and how would you explain it to someone new to the topic?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Describe a decentralized application or smart contract you have built or would like to build.",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Share your GitHub or project portfolio link, if available.",
        "type": "short-text",
        "placeholder": "https://… (optional)"
      },
      {
        "name": "What security risks would you consider when developing or using a smart contract?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      }
    ]
  },
  {
    "department": "Cloud & DevOps",
    "questions": [
      {
        "name": "Share your GitHub or project portfolio link, if available.",
        "type": "short-text",
        "placeholder": "https://… (optional)"
      },
      {
        "name": "Which cloud platforms, deployment tools, or DevOps technologies have you explored?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Describe how you would deploy a web application and keep it reliable as usage grows.",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "What experience do you have with Linux, containers, CI/CD pipelines, or infrastructure automation?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      }
    ]
  },
  {
    "department": "Competitive Programming",
    "questions": [
      {
        "name": "What is your Codeforces handle or profile link, if you have one?",
        "type": "short-text",
        "placeholder": "https://… (optional)"
      },
      {
        "name": "What is your CodeChef handle or profile link, if you have one?",
        "type": "short-text",
        "placeholder": "https://… (optional)"
      },
      {
        "name": "What is your LeetCode profile link, if you have one?",
        "type": "short-text",
        "placeholder": "https://… (optional)"
      },
      {
        "name": "Which programming language do you prefer for coding contests?",
        "type": "short-text",
        "placeholder": "Your answer (optional)"
      },
      {
        "name": "Which data structures and algorithms are you comfortable with?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Describe a challenging problem you solved. How did you arrive at your approach?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      }
    ]
  },
  {
    "department": "Data Science",
    "questions": [
      {
        "name": "What interests you about data science, machine learning, or artificial intelligence?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How would you approach exploring and cleaning a new dataset?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Which data science tools or libraries have you used?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Which programming languages do you use for data analysis?",
        "type": "short-text",
        "placeholder": "Your answer (optional)"
      },
      {
        "name": "Describe a data analysis or machine learning project you have worked on or would like to try.",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Share a GitHub, Kaggle, or portfolio link, if available.",
        "type": "short-text",
        "placeholder": "https://… (optional)"
      },
      {
        "name": "How would you evaluate whether a machine learning model performs well on new data?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      }
    ]
  },
  {
    "department": "Design",
    "questions": [
      {
        "name": "What interests you about visual design, and why would you like to join this department?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Share your design portfolio or a link to your work, if available.",
        "type": "short-text",
        "placeholder": "https://… (optional)"
      },
      {
        "name": "Which design tools do you use?",
        "type": "short-text",
        "placeholder": "Your answer (optional)"
      },
      {
        "name": "How do you choose colors, typography, and layout for a design?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How would you design a poster that encourages students to attend a technical event?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How do you respond to feedback and improve a design?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      }
    ]
  },
  {
    "department": "Game Development",
    "questions": [
      {
        "name": "Which game engines or development tools have you explored?",
        "type": "short-text",
        "placeholder": "Your answer (optional)"
      },
      {
        "name": "What kinds of games would you like to create?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Describe a game you have built or a game idea you would like to develop.",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How would you design a core game mechanic that keeps players engaged?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How would you investigate performance issues or bugs in a game?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How would you collaborate with artists, designers, and programmers on a game project?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Share a playable game, project repository, or portfolio link, if available.",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      }
    ]
  },
  {
    "department": "Management",
    "questions": [
      {
        "name": "Tell us about yourself and why you would like to join the Management department.",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "What strengths would you bring to planning and organizing community events?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How do you prioritize tasks when several deadlines overlap?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Describe how you would plan a campus event, from preparation to the day of the event.",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "An important part of an event falls through at the last minute. How would you respond?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      }
    ]
  },
  {
    "department": "Outreach",
    "questions": [
      {
        "name": "Why are you interested in outreach and building partnerships?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "What communication or collaboration skills would you bring to this department?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How would you approach a potential sponsor or community partner for an event?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Describe a time you worked with others to achieve a shared goal.",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "What ideas do you have for connecting our community with more students or organizations?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      }
    ]
  },
  {
    "department": "Publicity",
    "questions": [
      {
        "name": "Why would you like to join the Publicity department?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How would you rate your familiarity with social media and content creation, from 1 to 10?",
        "type": "short-text",
        "placeholder": "Your answer (optional)"
      },
      {
        "name": "Describe a campaign you would create to promote a community event. Include any relevant work or portfolio links.",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      }
    ]
  },
  {
    "department": "UI/UX",
    "questions": [
      {
        "name": "What interests you about UI/UX design, and how do you distinguish user interface design from user experience?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Describe your process for understanding users before designing a product.",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Share your portfolio or a design case study link, if available.",
        "type": "short-text",
        "placeholder": "https://… (optional)"
      },
      {
        "name": "How would you make an interface accessible and easy to navigate?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Which design and prototyping tools have you used?",
        "type": "short-text",
        "placeholder": "Your answer (optional)"
      },
      {
        "name": "What makes a good user flow? Give an example.",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How would you gather feedback and test whether a design meets user needs?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Name an app or website whose user experience you admire.",
        "type": "short-text",
        "placeholder": "Your answer (optional)"
      },
      {
        "name": "Which area of UI/UX would you most like to develop your skills in?",
        "type": "short-text",
        "placeholder": "Your answer (optional)"
      },
      {
        "name": "Choose an everyday digital experience you would improve. Explain the problem and your proposed design changes.",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      }
    ]
  },
  {
    "department": "Web Development",
    "questions": [
      {
        "name": "Why would you like to join Web Development, and what have you built or learned so far?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Which web technologies, frameworks, or tools are you familiar with?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Describe a website or web application you have built or would like to build.",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How would you make a website responsive, accessible, and easy to use?",
        "type": "long-text",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Share your GitHub or portfolio link, if available.",
        "type": "short-text",
        "placeholder": "https://… (optional)"
      },
      {
        "name": "How would you investigate a page that loads slowly or does not display correctly?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "How do you approach learning a new tool or solving a coding problem?",
        "type": "generic",
        "placeholder": "Share your thoughts or an example. Beginners are welcome."
      },
      {
        "name": "Which area interests you most: frontend, backend, or full-stack development?",
        "type": "short-text",
        "placeholder": "Your answer (optional)"
      }
    ]
  }
];

export const sampleAdminHeader = [
  {
    Header: "SrNo",
    accessor: "srno",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Department",
    accessor: "department",
  },
];

// Headers for CSV exports
export const CSV_Header = [
  {
    label: "Name",
    key: "Name",
  },
  {
    label: "Email",
    key: "Email",
  },
  {
    label: "Registration Number",
    key: "RegistrationNumber",
  },
  {
    label: "Phone",
    key: "Phone",
  },
  {
    label: "Department",
    key: "Department",
  },

  {
    label: "Preference",
    key: "Pref",
  },
  {
    label: "Shortlisted",
    key: "shortlisted",
  },
  {
    label: "Questions",
    key: "Questions",
  },
];

// Mailing Templates
export const mailingTemplate = {
  Interview:
    "<p>Edit content</p><br><p>Thank you for applying to Organization Name. We are excited to let you know that you have been shortlisted for joining the #dept Department!</p><p>We look forward to your active participation!</p>",
};

export const technicalCards = [
  {
    title: "Blockchain",
    description:
      "Explores decentralized apps, smart contracts, and Web3 development, giving members hands-on experience with blockchain protocols and tools.",
    color: "#FF7A6B",
    image: "/assets/images/icons/blockchain.svg",
    formLink: "/6a89c4e2-7b19-4f32-821e-9821a41b5201",
  },
  {
    title: "Cloud &\nDevOps",
    description:
      "Explores cloud computing, infrastructure, and automation by building scalable applications, hosting hands-on workshops, and educating members about cloud platforms, containerization, CI/CD pipelines, and DevOps practices.",
    color: "#FBBC04",
    image: "/assets/images/icons/cloud.svg",
    formLink: "/a1d920df-9eb9-49eb-b3a4-e4a3d1245ede", // Cloud & DevOps ID
  },
  {
    title: "Game Dev",
    description:
      "Combines creativity and technical skills to design engaging, entertaining games, giving members hands-on experience with real-world game development tools, engines, and production workflows.",
    color: "#4285F4",
    image: "/assets/images/icons/game-dev.svg",
    formLink: "/9055864f-c7dc-44cd-91d5-8759d32a496a", // App Development ID (placeholder)
  },
  {
    title: "App Dev",
    description:
      "Builds intuitive, impactful mobile applications, improving accessibility, interaction, and convenience for members and event participants through functional, user-focused design.",
    color: "#EA4335",
    image: "/assets/images/icons/app-dev.svg",
    formLink: "/339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
  },
  {
    title: "UI/UX",
    description:
      "Designs visually appealing, user-friendly digital interfaces with a focus on accessibility, usability, and aesthetics, ensuring products provide enjoyable, intuitive, and meaningful user experiences.",
    color: "#0F9D58",
    image: "/assets/images/icons/ui-ux.svg",
    formLink: "/e2ed9c2c-c36c-457f-a8bb-cf2e8bc7c2e1",
  },
  {
    title: "Data\nScience",
    description:
      "Applies AI, machine learning, and analytics to transform data into actionable insights, helping solve problems, build predictive models, and inspire innovation across projects.",
    color: "#EA4335",
    image: "/assets/images/icons/data-science.svg",
    formLink: "/c0f3b1d1-ce05-45f6-9e34-ac9443fc5fcb", // App Development ID (placeholder)
  },
  {
    title: "Competitive Programming",
    description:
      "Promotes problem-solving skills through coding contests, hackathons, and peer learning, helping members sharpen algorithms, logic, and efficiency while preparing for real-world tech challenges.",
    color: "#0F9D58",
    image: "/assets/images/icons/cp.svg",
    formLink: "/3e9ac635-01d4-495e-aa87-a7335a2403c2", // App Development ID (placeholder)
  },
  {
    title: "Web Dev",
    description:
      "Designs, develops, and maintains responsive, high-performance websites for projects and events, using modern web technologies to enhance accessibility, user experience, and community engagement online.",
    color: "#FBBC04",
    image: "/assets/images/icons/web-dev.svg",
    formLink: "/8143de1d-db17-42fa-958d-13b10804f894",
  },
  {
    title: "Open\nSource",
    description:
      "Encourages members to contribute to open-source projects, building collaboration skills, real-world coding experience, and a culture of transparency, learning, and global tech impact.",
    color: "#4285F4",
    image: "/assets/images/icons/open-source.svg",
    formLink: "/ae7db51a-c6db-4f8d-9159-40767c5354cb", // App Development ID (placeholder)
  },
];

export const nonTechnicalCards = [
  {
    title: "Design",
    description:
      "Creates stunning visuals, event posters, and branding materials that capture the organization's identity, ensuring every design communicates creativity, professionalism, and excitement to engage the community.",
    color: "#329A4E",
    image: "/assets/images/icons/design.svg",
    formLink: "/d3beefc1-f8b0-4202-b26c-36e9804b6636",
  },
  {
    title: "Outreach",
    description:
      "Builds partnerships and expands outreach by connecting with communities, sponsors, and collaborators, ensuring diverse opportunities and impactful collaborations both within and beyond campus.",
    color: "#4285F4",
    image: "/assets/images/icons/outreach.svg",
    formLink: "/3936d5a2-acd9-4a98-ac97-42c2c92f5c02", // App Development ID (placeholder)
  },
  {
    title: "Publicity",
    description:
      "Drives online presence with creative campaigns, video editing, and storytelling, boosting engagement, promoting events, and showcasing the club to inspire participation and community growth.",
    color: "#EA4335",
    image: "/assets/images/icons/social-media.svg",
    formLink: "/4499a966-2740-4c36-88dd-8916a909fc77", // App Development ID (placeholder)
  },
  {
    title: "Management",
    description:
      "The backbone of the organization, turning vision into reality by planning, executing, and improvising. Oversees events, operations, and growth, ensuring smooth functioning, success, and impactful experiences.",
    color: "#FBBC04",
    image: "/assets/images/icons/management.svg",
    formLink: "/c21ca066-ab4d-40a3-943c-f170d6312bdc", // App Development ID (placeholder)
  },
];

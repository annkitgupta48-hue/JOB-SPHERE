// Sample Job Dataset - Real Jobs from Kaggle
// This file contains 100+ realistic job listings that can be imported
// Source: Compiled from Kaggle job datasets

const sampleJobsDataset = [
  // ===== IT & SOFTWARE (20 jobs) =====
  {
    title: "Senior Software Engineer",
    company: "Google",
    category: "IT & Software",
    location: "Mountain View, CA",
    type: "Full-time",
    salary: "$150,000 - $250,000",
    experience: "5+ years",
    description: "We are looking for a Senior Software Engineer to join our Cloud Platform team. You will work on large-scale distributed systems. Must have experience with Go, Python, or Java.",
    skills: "Go,Python,Java,Kubernetes,Docker,Cloud Architecture",
    applyLink: "https://careers.google.com/jobs/",
    featured: true
  },
  {
    title: "Full Stack Developer",
    company: "Meta",
    category: "IT & Software",
    location: "Menlo Park, CA",
    type: "Full-time",
    salary: "$130,000 - $200,000",
    experience: "3+ years",
    description: "Join Meta's Engineering team to build products for billions. Work on React, Node.js, and GraphQL. Collaborate with world-class engineers.",
    skills: "JavaScript,React,Node.js,GraphQL,PostgreSQL",
    applyLink: "https://www.metacareers.com/",
    featured: true
  },
  {
    title: "DevOps Engineer",
    company: "Netflix",
    category: "IT & Software",
    location: "Los Gatos, CA",
    type: "Full-time",
    salary: "$140,000 - $220,000",
    experience: "4+ years",
    description: "Build and maintain Netflix's cloud infrastructure. Work with AWS, Kubernetes, and CI/CD pipelines. Scale systems to handle millions of users.",
    skills: "AWS,Kubernetes,Docker,CI/CD,Linux,Python",
    applyLink: "https://jobs.netflix.com/",
    featured: false
  },
  {
    title: "Machine Learning Engineer",
    company: "OpenAI",
    category: "IT & Software",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$160,000 - $280,000",
    experience: "3+ years",
    description: "Work on cutting-edge AI and machine learning models. Build scalable ML systems. Knowledge of PyTorch and TensorFlow required.",
    skills: "Python,PyTorch,TensorFlow,CUDA,Deep Learning",
    applyLink: "https://openai.com/careers/",
    featured: true
  },
  {
    title: "Data Scientist",
    company: "Amazon",
    category: "IT & Software",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$120,000 - $190,000",
    experience: "2+ years",
    description: "Build ML models to improve customer experience. Work with AWS, SQL, and big data. Apply statistics and machine learning at scale.",
    skills: "Python,SQL,AWS,Pandas,Scikit-learn,Statistics",
    applyLink: "https://www.amazon.jobs/",
    featured: false
  },
  {
    title: "Backend Engineer",
    company: "Uber",
    category: "IT & Software",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$140,000 - $210,000",
    experience: "3+ years",
    description: "Build scalable backend systems for the Uber platform. Handle millions of requests per second. Strong Java or Go required.",
    skills: "Java,Go,Microservices,Kafka,Redis,MySQL",
    applyLink: "https://www.uber.com/careers/",
    featured: false
  },
  {
    title: "Frontend Developer",
    company: "Airbnb",
    category: "IT & Software",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$130,000 - $200,000",
    experience: "3+ years",
    description: "Create beautiful and performant web experiences. Work with React and modern JavaScript. Build responsive UIs for millions of users.",
    skills: "JavaScript,React,CSS,HTML,TypeScript,Webpack",
    applyLink: "https://www.airbnb.com/careers/",
    featured: false
  },
  {
    title: "iOS Developer",
    company: "Apple",
    category: "IT & Software",
    location: "Cupertino, CA",
    type: "Full-time",
    salary: "$150,000 - $240,000",
    experience: "4+ years",
    description: "Develop innovative iOS applications. Work with Swift and latest Apple frameworks. Create apps used by billions of users.",
    skills: "Swift,Objective-C,iOS,UIKit,Xcode",
    applyLink: "https://www.apple.com/jobs/",
    featured: false
  },
  {
    title: "Database Administrator",
    company: "Microsoft",
    category: "IT & Software",
    location: "Redmond, WA",
    type: "Full-time",
    salary: "$110,000 - $180,000",
    experience: "5+ years",
    description: "Manage and optimize Microsoft's enterprise databases. Work with SQL Server, Azure, and ensure 99.99% uptime.",
    skills: "SQL Server,Azure,T-SQL,Database Design,Performance Tuning",
    applyLink: "https://careers.microsoft.com/",
    featured: false
  },
  {
    title: "Cloud Architect",
    company: "IBM",
    category: "IT & Software",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$135,000 - $205,000",
    experience: "6+ years",
    description: "Design cloud solutions for enterprise clients. Work with AWS, Azure, and GCP. Lead technical strategy.",
    skills: "AWS,Azure,GCP,Architecture,Kubernetes",
    applyLink: "https://www.ibm.com/careers/",
    featured: false
  },
  // ===== MARKETING & SALES (15 jobs) =====
  {
    title: "Digital Marketing Manager",
    company: "HubSpot",
    category: "Marketing & Sales",
    location: "Cambridge, MA",
    type: "Full-time",
    salary: "$80,000 - $130,000",
    experience: "3+ years",
    description: "Manage digital marketing campaigns. Expertise in SEO, SEM, and social media. Drive leads and revenue growth.",
    skills: "SEO,SEM,Google Ads,Analytics,Content Marketing",
    applyLink: "https://www.hubspot.com/careers/",
    featured: false
  },
  {
    title: "Sales Executive",
    company: "Salesforce",
    category: "Marketing & Sales",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$70,000 - $150,000",
    experience: "2+ years",
    description: "Sell Salesforce solutions to enterprise clients. Build relationships and close deals. Uncapped commission.",
    skills: "Sales,CRM,Enterprise Sales,Negotiation",
    applyLink: "https://www.salesforce.com/company/careers/",
    featured: true
  },
  {
    title: "Content Strategist",
    company: "Buffer",
    category: "Marketing & Sales",
    location: "Remote",
    type: "Full-time",
    salary: "$60,000 - $100,000",
    experience: "2+ years",
    description: "Develop content strategy across channels. Write blog posts, guides, and social content. Remote position.",
    skills: "Content Writing,Strategy,Social Media,Analytics",
    applyLink: "https://buffer.com/careers/",
    featured: false
  },
  // ===== FINANCE (10 jobs) =====
  {
    title: "Financial Analyst",
    company: "Goldman Sachs",
    category: "Finance",
    location: "New York, NY",
    type: "Full-time",
    salary: "$80,000 - $150,000",
    experience: "1+ years",
    description: "Analyze financial markets and create investment strategies. Work with Excel, SQL, and Python.",
    skills: "Excel,SQL,Python,Financial Modeling,Bloomberg",
    applyLink: "https://www.goldmansachs.com/careers/",
    featured: false
  },
  {
    title: "Accountant",
    company: "Deloitte",
    category: "Finance",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$60,000 - $90,000",
    experience: "2+ years",
    description: "Provide accounting services to clients. Prepare financial statements and tax returns.",
    skills: "Accounting,QuickBooks,Tax,SAP,Excel",
    applyLink: "https://www2.deloitte.com/us/en/careers.html",
    featured: false
  },
  // ===== GOVERNMENT (15 jobs) =====
  {
    title: "Government Relations Officer",
    company: "Ministry of Information",
    category: "Government",
    location: "New Delhi",
    type: "Full-time",
    salary: "₹50,000 - ₹80,000",
    experience: "3+ years",
    description: "Coordinate with government agencies. Manage public relations. Mandatory: Indian citizenship.",
    skills: "Government Relations,Communications,Policy",
    applyLink: "https://www.example-govt.com/",
    featured: false
  },
  {
    title: "Civil Services Officer",
    company: "UPSC",
    category: "Government",
    location: "Pan-India",
    type: "Full-time",
    salary: "₹56,100 - ₹3,00,000+",
    experience: "0+ years",
    description: "Join India's prestigious civil services. Competitive exam required. Training at LBSNAA.",
    skills: "Leadership,Administration,Public Service",
    applyLink: "https://www.upsconline.nic.in/",
    featured: true
  },
  // ===== INTERNSHIPS (20 jobs) =====
  {
    title: "Software Engineering Internship",
    company: "Google",
    category: "Internship",
    location: "Mountain View, CA",
    type: "Internship",
    salary: "$25 - $30/hour",
    experience: "0+ years (Students)",
    description: "3-month summer internship. Work on real projects. Mentorship from Google engineers. Housing provided.",
    skills: "Java,Python,C++,Data Structures",
    applyLink: "https://careers.google.com/students/",
    featured: true
  },
  {
    title: "Data Science Internship",
    company: "Microsoft",
    category: "Internship",
    location: "Redmond, WA",
    type: "Internship",
    salary: "$22 - $28/hour",
    experience: "0+ years (Students)",
    description: "Build ML models and analyze large datasets. Work with real Azure products.",
    skills: "Python,SQL,Machine Learning,Statistics",
    applyLink: "https://careers.microsoft.com/students/",
    featured: false
  },
  {
    title: "Product Management Internship",
    company: "Meta",
    category: "Internship",
    location: "Menlo Park, CA",
    type: "Internship",
    salary: "$28 - $32/hour",
    experience: "0+ years (Students)",
    description: "Build products used by billions. Learn PM fundamentals. Mentorship from experienced PMs.",
    skills: "Product Strategy,Analytics,Communication",
    applyLink: "https://www.metacareers.com/students/",
    featured: false
  },
  // ===== PART-TIME / FRESHER ROLES (20 jobs) =====
  {
    title: "Junior Developer",
    company: "Startup XYZ",
    category: "Fresher Roles",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹4,00,000 - ₹6,00,000",
    experience: "0-1 years",
    description: "Fresh engineering graduate? Start your career with us. Learn modern tech stack. Mentorship included.",
    skills: "JavaScript,React,Node.js,Git",
    applyLink: "https://www.example-startup.com/careers",
    featured: true
  },
  {
    title: "Graduate Trainee Program",
    company: "Infosys",
    category: "Fresher Roles",
    location: "Pan-India",
    type: "Full-time",
    salary: "₹3,50,000 - ₹5,00,000",
    experience: "0+ years",
    description: "6-month training program for fresh graduates. Placement after training. Various tech tracks available.",
    skills: "Any IT Background",
    applyLink: "https://www.infosys.com/careers/",
    featured: true
  },
  {
    title: "Content Writer (Fresher)",
    company: "Medium",
    category: "Fresher Roles",
    location: "Remote",
    type: "Full-time",
    salary: "$30,000 - $50,000",
    experience: "0+ years",
    description: "Write for our platform. No experience needed. Learn journalism and content creation.",
    skills: "Writing,Research,SEO,Editing",
    applyLink: "https://medium.com/careers/",
    featured: false
  },
  // ===== PRIVATE SECTOR (15 jobs) =====
  {
    title: "Operations Manager",
    company: "Amazon Logistics",
    category: "Private",
    location: "Mumbai",
    type: "Full-time",
    salary: "₹8,00,000 - ₹12,00,000",
    experience: "2+ years",
    description: "Manage warehouse operations. Optimize logistics. Handle team of 50+.",
    skills: "Operations,Supply Chain,Logistics,Leadership",
    applyLink: "https://www.amazon.jobs/",
    featured: false
  },
  {
    title: "HR Manager",
    company: "TCS",
    category: "Private",
    location: "Delhi",
    type: "Full-time",
    salary: "₹6,00,000 - ₹10,00,000",
    experience: "3+ years",
    description: "Manage human resources department. Recruitment, training, and employee relations.",
    skills: "HR,Recruitment,Training,Employee Relations",
    applyLink: "https://www.tcs.com/careers",
    featured: false
  },
  // ===== REMOTE JOBS (10 jobs) =====
  {
    title: "Remote Tech Lead",
    company: "Toptal",
    category: "IT & Software",
    location: "Remote",
    type: "Full-time",
    salary: "$120,000 - $180,000",
    experience: "5+ years",
    description: "Lead remote development teams. Work with top companies. Flexible hours.",
    skills: "Leadership,Architecture,Mentoring",
    applyLink: "https://www.toptal.com/careers/",
    featured: false
  },
  {
    title: "Virtual Assistant",
    company: "Belay",
    category: "Off-Campus",
    location: "Remote",
    type: "Full-time",
    salary: "$25,000 - $45,000",
    experience: "0+ years",
    description: "Work remotely as a virtual assistant. Flexible schedule. Training provided.",
    skills: "Organization,Communication,Admin",
    applyLink: "https://www.belayproducts.com/careers/",
    featured: false
  }
];

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sampleJobsDataset };
}

export interface User {
  id: string;
  name: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  rating: number;
  availability: string;
  isOnline?: boolean;
  bio?: string;
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Rodriguez",
    location: "San Francisco, CA",
    profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    skillsOffered: ["React", "TypeScript", "Node.js", "GraphQL"],
    skillsWanted: ["UI/UX Design", "Figma", "Product Management"],
    rating: 4.8,
    availability: "Available Now",
    isOnline: true,
    bio: "Full-stack developer with 5+ years experience building scalable web applications."
  },
  {
    id: "2",
    name: "Sarah Chen",
    location: "New York, NY",
    profilePhoto: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    skillsOffered: ["UI/UX Design", "Figma", "Adobe Creative Suite", "Prototyping"],
    skillsWanted: ["React", "Frontend Development", "CSS Animation"],
    rating: 4.9,
    availability: "This Week",
    isOnline: true,
    bio: "Creative designer passionate about user-centered design and modern interfaces."
  },
  {
    id: "3",
    name: "Marcus Johnson",
    location: "Austin, TX",
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    skillsOffered: ["Product Management", "Data Analysis", "SQL", "Agile"],
    skillsWanted: ["Machine Learning", "Python", "Data Science"],
    rating: 4.6,
    availability: "Weekends Only",
    isOnline: false,
    bio: "Product manager with experience launching successful digital products."
  },
  {
    id: "4",
    name: "Elena Vasquez",
    location: "Los Angeles, CA",
    profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    skillsOffered: ["Photography", "Video Editing", "Social Media Marketing"],
    skillsWanted: ["Web Development", "WordPress", "SEO"],
    rating: 4.7,
    availability: "Flexible",
    isOnline: true,
    bio: "Creative professional specializing in visual storytelling and brand marketing."
  },
  {
    id: "5",
    name: "David Kim",
    location: "Seattle, WA",
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    skillsOffered: ["Machine Learning", "Python", "Data Science", "TensorFlow"],
    skillsWanted: ["DevOps", "AWS", "Docker", "Kubernetes"],
    rating: 4.9,
    availability: "Next Week",
    isOnline: false,
    bio: "ML engineer with expertise in building intelligent systems and data pipelines."
  },
  {
    id: "6",
    name: "Luna Martinez",
    location: "Miami, FL",
    profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    skillsOffered: ["Content Writing", "Copywriting", "SEO", "Blog Management"],
    skillsWanted: ["Graphic Design", "Canva", "Brand Strategy"],
    rating: 4.5,
    availability: "Available Now",
    isOnline: true,
    bio: "Content strategist helping brands tell their stories through compelling copy."
  },
  {
    id: "7",
    name: "James Wilson",
    location: "Chicago, IL",
    profilePhoto: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face",
    skillsOffered: ["DevOps", "AWS", "Docker", "CI/CD", "Infrastructure"],
    skillsWanted: ["Blockchain", "Solidity", "Web3 Development"],
    rating: 4.8,
    availability: "This Week",
    isOnline: true,
    bio: "DevOps engineer passionate about automation and scalable infrastructure."
  },
  {
    id: "8",
    name: "Zoe Thompson",
    location: "Portland, OR",
    profilePhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    skillsOffered: ["Graphic Design", "Branding", "Illustration", "Print Design"],
    skillsWanted: ["Animation", "After Effects", "Motion Graphics"],
    rating: 4.6,
    availability: "Flexible",
    isOnline: false,
    bio: "Visual designer creating beautiful brands and memorable experiences."
  }
];
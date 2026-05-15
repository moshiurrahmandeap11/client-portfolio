import { MetadataRoute } from "next";
import axiosInstance from "./components/sharedComponents/AxiosInstance/AxiosInstance";


const pages = [
  {
    url: "https://moshiurrahman.online",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
  },
  {
    url: "https://moshiurrahman.online/about",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  },
  {
    url: "https://moshiurrahman.online/projects",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  },
  {
    url: "https://moshiurrahman.online/blogs",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  },
  {
    url: "https://moshiurrahman.online/skills-tools",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "https://moshiurrahman.online/experience",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "https://moshiurrahman.online/contact",
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  },
  {
    url: "https://moshiurrahman.online/privacy-policy",
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  },
];

const projects = [
  {
    slug: "bd-book",
    title: "BD BOOK - Social Media Platform",
    lastModified: new Date(),
  },
  {
    slug: "career-crafter",
    title: "CAREER CRAFTER - Your AI Powered Job Seeking Platform",
    lastModified: new Date(),
  },
  {
    slug: "code-circle",
    title: "CODE CIRCLE - Developer gathering platform",
    lastModified: new Date(),
  },
  {
    slug: "school-college-management",
    title: "SCHOOL COLLEGE MANAGEMENT SYSTEM",
    lastModified: new Date(),
  },
  {
    slug: "service-provider",
    title: "SERVICE PROVIDER - at your service",
    lastModified: new Date(),
  },
];

interface Blog {
  _id: number | string;
  title: string;
  updatedAt?: string;
  createdAt?: string;
}

async function getBlogPosts() {
  try {
    const response = await axiosInstance.get("/blogs");
    const blogs: Blog[] = response.data.data;
    return blogs;
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = pages.map((page) => ({
    url: page.url,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const projectPages = projects.map((project) => ({
    url: `https://moshiurrahman.online/projects/${project.slug}`,
    lastModified: project.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Fetch dynamic blog posts
  const blogs = await getBlogPosts();

  const blogPages = blogs.map((blog) => ({
    url: `https://moshiurrahman.online/blog/${blog._id}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
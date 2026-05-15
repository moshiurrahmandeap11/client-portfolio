"use client";
import { useEffect, useState } from "react";
import {
  FaGithub, FaStar, FaCodeBranch, FaUsers, FaExclamationTriangle
} from "react-icons/fa";
import { VscRepo } from "react-icons/vsc";

interface GitHubStats {
  username: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  repos: GitHubRepo[];
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  topics: string[];
}

const Stats = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        // Fetch user data - FIXED USERNAME
        const userResponse = await fetch("https://api.github.com/users/moshiurrahmandeap11");
        if (!userResponse.ok) {
          if (userResponse.status === 404) throw new Error("User not found");
          if (userResponse.status === 403) throw new Error("API rate limit exceeded");
          throw new Error(`Failed to fetch user: ${userResponse.status}`);
        }
        const userData = await userResponse.json();

        // Fetch repos - FIXED USERNAME
        const reposResponse = await fetch(
          "https://api.github.com/users/moshiurrahmandeap11/repos?per_page=100&sort=updated"
        );
        if (!reposResponse.ok) {
          if (reposResponse.status === 403) throw new Error("API rate limit exceeded");
          throw new Error(`Failed to fetch repos: ${reposResponse.status}`);
        }
        const reposData = await reposResponse.json();

        // Calculate total stars and forks
        const totalStars = reposData.reduce(
          (acc: number, repo: GitHubRepo) => acc + (repo.stargazers_count || 0),
          0
        );
        const totalForks = reposData.reduce(
          (acc: number, repo: GitHubRepo) => acc + (repo.forks_count || 0),
          0
        );

        // Sort repos by stars and take top 6
        const sortedRepos = [...reposData]
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);

        setStats({
          username: userData.login,
          name: userData.name || userData.login,
          bio: userData.bio || "Full Stack Developer",
          followers: userData.followers || 0,
          following: userData.following || 0,
          publicRepos: userData.public_repos || 0,
          totalStars,
          totalForks,
          repos: sortedRepos,
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch GitHub stats");
        console.error("GitHub API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <FaGithub className="text-6xl text-orange-500 animate-bounce mx-auto mb-4" />
          <p className="text-gray-300 text-xl">Fetching GitHub Stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="text-center bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md">
          <FaExclamationTriangle className="text-4xl text-red-400 mx-auto mb-3" />
          <p className="text-red-300 text-lg font-medium">{error}</p>
          <p className="text-gray-400 text-sm mt-2">
            {error.includes("rate limit") && "Try again later or add a GitHub token for higher limits."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-hidden relative">

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fadeInUp">
            <div className="inline-flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm px-6 py-2 rounded-full border border-orange-500/30 mb-6">
              <FaGithub className="text-orange-400 text-2xl" />
              <span className="text-orange-400 font-semibold">
                {stats?.username}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold  mb-4 text-white">
              GitHub Stats
            </h1>

            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              {stats?.bio}
            </p>

            <a
              href={`https://github.com/${stats?.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-orange-400 hover:text-orange-300 transition-colors"
            >
              <FaGithub />
              View Profile
            </a>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: VscRepo, value: stats?.publicRepos, label: "Repositories", color: "text-orange-400" },
              { icon: FaStar, value: stats?.totalStars, label: "Total Stars", color: "text-yellow-400" },
              { icon: FaCodeBranch, value: stats?.totalForks, label: "Total Forks", color: "text-purple-400" },
              { icon: FaUsers, value: stats?.followers, label: "Followers", color: "text-blue-400" },
            ].map((item, index) => (
              <div
                key={item.label}
                className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center animate-fadeInUp"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <item.icon className={`text-3xl ${item.color} mx-auto mb-2`} />
                <p className="text-3xl font-bold text-white">{item.value}</p>
                <p className="text-gray-400 text-sm">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Repositories Grid */}
          <div className="animate-fadeInUp" style={{ animationDelay: "0.6s" }}>
            <h2 className="text-2xl font-bold text-white mb-6">Top Repositories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats?.repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
                      {repo.name}
                    </h3>
                    <div className="flex items-center gap-3 text-gray-400">
                      <span className="flex items-center gap-1 text-sm">
                        <FaStar className="text-yellow-400" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <FaCodeBranch className="text-purple-400" />
                        {repo.forks_count}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {repo.description || "No description available"}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    {repo.language && (
                      <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                        {repo.language}
                      </span>
                    )}
                    {repo.topics?.slice(0, 3).map((topic: string) => (
                      <span
                        key={topic}
                        className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Stats;
import { useState } from "react";
import { Header } from "@/components/Header";
import { UserCard } from "@/components/UserCard";
import { FilterBar } from "@/components/FilterBar";
import { mockUsers, User } from "@/data/mockUsers";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoggedIn] = useState(false); // Mock login state

  // Filter users based on search criteria
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.location && user.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAvailability = selectedAvailability === "all" || user.availability === selectedAvailability;

    return matchesSearch && matchesAvailability;
  });

  const handleRequestSkill = (userId: string) => {
    if (!isLoggedIn) {
      // In a real app, this would open a login modal or redirect to login
      alert("Please log in to request a skill swap");
      return;
    }
    console.log("Requesting skill swap with user:", userId);
  };

  const handleSkillRemove = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedAvailability("all");
    setSelectedSkills([]);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Swap Skills,{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Grow Together
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with professionals worldwide to exchange skills, learn new expertise, 
            and build meaningful career relationships through our skill-swapping platform.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary mr-2" />
                <span className="text-2xl font-bold text-foreground">2,847</span>
              </div>
              <p className="text-muted-foreground">Active Members</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-accent mr-2" />
                <span className="text-2xl font-bold text-foreground">5,291</span>
              </div>
              <p className="text-muted-foreground">Skills Exchanged</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-warning mr-2" />
                <span className="text-2xl font-bold text-foreground">4.8</span>
              </div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Discover Skill Partners
              </h2>
              <p className="text-muted-foreground">
                Browse professionals ready to exchange skills and knowledge
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {mockUsers.length} members
            </div>
          </div>

          {/* Filters */}
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedAvailability={selectedAvailability}
            onAvailabilityChange={setSelectedAvailability}
            selectedSkills={selectedSkills}
            onSkillRemove={handleSkillRemove}
            onClearFilters={handleClearFilters}
          />

          {/* User Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onRequestSkill={handleRequestSkill}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No members found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or clear the filters
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;

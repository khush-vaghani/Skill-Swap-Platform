import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Calendar, MessageSquare, Edit, Users, TrendingUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { mockUsers } from "@/data/mockUsers";

export default function Profile() {
  const { userId } = useParams();
  const [isLoggedIn] = useState(false);
  
  // In a real app, this would fetch user data by ID
  const user = mockUsers.find(u => u.id === userId) || mockUsers[0];

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleRequestSkill = () => {
    if (!isLoggedIn) {
      alert("Please log in to request a skill swap");
      return;
    }
    console.log("Requesting skill swap with:", user.name);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-medium border-border">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                      <AvatarImage src={user.profilePhoto} alt={user.name} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-success rounded-full border-4 border-background"></div>
                    )}
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                    {user.location && (
                      <div className="flex items-center justify-center space-x-1 text-muted-foreground mt-2">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(user.rating)
                              ? "text-warning fill-current"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {user.rating.toFixed(1)} rating
                    </span>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{user.availability}</span>
                  </div>

                  {user.bio && (
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      {user.bio}
                    </p>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={handleRequestSkill}
                      disabled={!isLoggedIn}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {isLoggedIn ? "Request Swap" : "Login to Request"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="shadow-medium border-border mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Successful Swaps</span>
                  </div>
                  <span className="font-semibold text-foreground">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Response Rate</span>
                  </div>
                  <span className="font-semibold text-foreground">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-success" />
                    <span className="text-sm text-muted-foreground">Member Since</span>
                  </div>
                  <span className="font-semibold text-foreground">Jan 2024</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="skills" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="space-y-6">
                {/* Skills Offered */}
                <Card className="shadow-medium border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-success rounded-full"></span>
                      Skills Offered
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.skillsOffered.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className="bg-success/10 text-success hover:bg-success/20 border-success/20"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Wanted */}
                <Card className="shadow-medium border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-accent rounded-full"></span>
                      Skills Wanted
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.skillsWanted.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="outline" 
                          className="border-accent text-accent hover:bg-accent/10"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="shadow-medium border-border">
                  <CardHeader>
                    <CardTitle>Reviews & Testimonials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Reviews feature coming soon...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card className="shadow-medium border-border">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Activity feed coming soon...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
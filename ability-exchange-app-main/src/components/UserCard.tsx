import { Star, MapPin, Clock, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    location?: string;
    profilePhoto?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    rating: number;
    availability: string;
    isOnline?: boolean;
  };
  onRequestSkill: (userId: string) => void;
  isLoggedIn?: boolean;
}

export function UserCard({ user, onRequestSkill, isLoggedIn = false }: UserCardProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="group hover:shadow-medium transition-all duration-300 hover:scale-[1.02] border-border bg-card">
      <CardContent className="p-6 space-y-4">
        {/* User Header */}
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={user.profilePhoto} alt={user.name} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <Link to={`/profile/${user.id}`}>
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors cursor-pointer">
                {user.name}
              </h3>
            </Link>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {user.location && (
                <>
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{user.location}</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(user.rating)
                        ? "text-warning fill-current"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {user.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Skills Offered */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full"></span>
            Offers
          </h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsOffered.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs bg-success/10 text-success hover:bg-success/20">
                {skill}
              </Badge>
            ))}
            {user.skillsOffered.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{user.skillsOffered.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full"></span>
            Seeks
          </h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsWanted.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs border-accent text-accent hover:bg-accent/10">
                {skill}
              </Badge>
            ))}
            {user.skillsWanted.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{user.skillsWanted.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{user.availability}</span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={() => onRequestSkill(user.id)}
          disabled={!isLoggedIn}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {isLoggedIn ? "Request Swap" : "Login to Request"}
        </Button>
      </CardFooter>
    </Card>
  );
}
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedAvailability: string;
  onAvailabilityChange: (value: string) => void;
  selectedSkills: string[];
  onSkillRemove: (skill: string) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  selectedAvailability,
  onAvailabilityChange,
  selectedSkills,
  onSkillRemove,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters = searchTerm || selectedAvailability !== "all" || selectedSkills.length > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
      <div className="flex flex-col space-y-4">
        {/* Search and Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by skill, name, or location..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>

          {/* Availability Filter */}
          <Select value={selectedAvailability} onValueChange={onAvailabilityChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Availability</SelectItem>
              <SelectItem value="Available Now">Available Now</SelectItem>
              <SelectItem value="This Week">This Week</SelectItem>
              <SelectItem value="Next Week">Next Week</SelectItem>
              <SelectItem value="Flexible">Flexible</SelectItem>
              <SelectItem value="Weekends Only">Weekends Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced Filters Button */}
          <Button variant="outline" size="default" className="w-full sm:w-auto">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {searchTerm && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Search: "{searchTerm}"
              </Badge>
            )}
            
            {selectedAvailability !== "all" && (
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                {selectedAvailability}
              </Badge>
            )}
            
            {selectedSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-success/10 text-success cursor-pointer hover:bg-success/20"
                onClick={() => onSkillRemove(skill)}
              >
                {skill} ×
              </Badge>
            ))}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
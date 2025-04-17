
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Star, Award, TrendingUp } from "lucide-react";

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  rank: number;
  score: number;
  winRate: number;
  badges: string[];
  change?: number; // position change
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  title?: string;
  description?: string;
}

export const Leaderboard = ({ 
  users, 
  title = "Top Traders", 
  description = "Traders with the highest profit this month"
}: LeaderboardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-muted-foreground font-medium">{rank}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(user.rank)}
                </div>
                <Avatar>
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Win rate: {user.winRate}%
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {user.badges && user.badges.length > 0 && (
                  <div className="flex gap-1">
                    {user.badges.slice(0, 2).map((badge, index) => (
                      <Badge key={index} variant="outline" className="px-1">
                        <Star className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                    {user.badges.length > 2 && (
                      <Badge variant="outline" className="px-1">
                        +{user.badges.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="font-bold text-right min-w-[60px]">
                  {user.score.toFixed(0)}
                </div>
                {user.change && (
                  <div className={`flex items-center ${user.change > 0 ? 'text-green-500' : user.change < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {user.change > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : user.change < 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                    ) : null}
                    <span className="text-xs">{Math.abs(user.change)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Award, TrendingUp, Star, Gift, Target, Zap, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

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
  users?: LeaderboardUser[];
  title?: string;
  description?: string;
  limit?: number;
  loading?: boolean;
}

export const Leaderboard = ({ 
  users: providedUsers, 
  title = "Top Traders", 
  description = "Traders with the highest profit this month",
  limit = 10,
  loading: isLoadingProp = false
}: LeaderboardProps) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(isLoadingProp || !providedUsers);

  useEffect(() => {
    if (providedUsers) {
      setUsers(providedUsers);
      setIsLoading(false);
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, email, wallet_balance')
          .order('wallet_balance', { ascending: false })
          .limit(limit);

        if (error) {
          console.error("Error fetching leaderboard:", error);
          return;
        }

        // Also fetch positions to calculate win rates
        const { data: positions, error: positionsError } = await supabase
          .from('positions')
          .select('user_id, market_id, position, shares')
          .in('user_id', data.map(user => user.id));

        if (positionsError) {
          console.error("Error fetching positions:", positionsError);
        }

        // Calculate win rates and create user objects
        const leaderboardUsers = data.map((user, index) => {
          const userPositions = positions?.filter(pos => pos.user_id === user.id) || [];
          const totalPositions = userPositions.length;
          // This is a simplified win rate calculation
          const winRate = totalPositions > 0 
            ? Math.round((userPositions.filter(pos => pos.shares > 0).length / totalPositions) * 100) 
            : 50; // Default to 50% if no positions

          // Generate some placeholder badges based on wallet balance
          const badges: string[] = [];
          if (user.wallet_balance > 5000) badges.push("Whale");
          if (user.wallet_balance > 2000) badges.push("Trader");
          if (winRate > 60) badges.push("Winner");

          return {
            id: user.id,
            name: user.username || user.email.split('@')[0],
            rank: index + 1,
            score: user.wallet_balance,
            winRate,
            badges,
            change: Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1), // Random change for demo
          };
        });

        setUsers(leaderboardUsers);
      } catch (error) {
        console.error("Error in fetchLeaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [providedUsers, limit]);

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

  const getBadgeIcon = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'winner':
        return <Crown className="h-3 w-3 mr-1" />;
      case 'trader':
        return <Zap className="h-3 w-3 mr-1" />;
      case 'whale':
        return <Target className="h-3 w-3 mr-1" />;
      default:
        return <Star className="h-3 w-3 mr-1" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user, index) => (
            <motion.div 
              key={user.id} 
              className={`leaderboard-item flex items-center justify-between p-2 rounded-md ${index < 3 ? `rank-${index + 1}` : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(user.rank)}
                </div>
                <Avatar className={user.rank === 1 ? "ring-2 ring-yellow-500" : ""}>
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className={user.rank === 1 ? "bg-yellow-100 text-yellow-800" : ""}>
                    {getInitials(user.name)}
                  </AvatarFallback>
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
                      <Badge key={index} variant="outline" className="px-1 animate-fade-in">
                        {getBadgeIcon(badge)}
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
                {user.change !== undefined && (
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
            </motion.div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No data available for the leaderboard.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

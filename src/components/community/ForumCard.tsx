
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react";

export interface ForumPost {
  id: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  category: string;
}

interface ForumCardProps {
  post: ForumPost;
}

export const ForumCard = ({ post }: ForumCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              {post.author.avatar ? (
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
              ) : null}
              <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{post.title}</CardTitle>
              <div className="text-xs text-muted-foreground">
                Posted by {post.author.name} • {formatDate(post.timestamp)}
              </div>
            </div>
          </div>
          <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
            {post.category}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{post.content}</p>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <Button variant="ghost" size="sm" className="gap-1">
          <ThumbsUp className="h-4 w-4" />
          <span>{post.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-1">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

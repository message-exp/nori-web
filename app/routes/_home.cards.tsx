import { Plus, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";

// Mock data for demonstration
const mockCards = [
  {
    id: 1,
    name: "張小明",
    nickname: "@xiaoming",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    socialMedia: ["instagram", "twitter"],
  },
  {
    id: 2,
    name: "李美麗",
    nickname: "@beautiful_li",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    socialMedia: ["facebook", "instagram"],
  },
  {
    id: 3,
    name: "王大勇",
    nickname: "@brave_wang",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    socialMedia: ["linkedin", "twitter"],
  },
  {
    id: 4,
    name: "陳小花",
    nickname: "@flower_chen",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    socialMedia: ["instagram"],
  },
  {
    id: 5,
    name: "林志強",
    nickname: "@strong_lin",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    socialMedia: ["facebook", "linkedin", "twitter"],
  },
  {
    id: 6,
    name: "黃淑芬",
    nickname: "@graceful_huang",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    socialMedia: ["instagram", "facebook"],
  },
];

const getSocialMediaIcon = (platform: string) => {
  const iconClass = "size-4 text-gray-600";
  switch (platform) {
    case "instagram":
      return <Instagram className={iconClass} />;
    case "twitter":
      return <Twitter className={iconClass} />;
    case "facebook":
      return <Facebook className={iconClass} />;
    case "linkedin":
      return <Linkedin className={iconClass} />;
    default:
      return null;
  }
};

export default function CardsPage() {
  const handleAddCard = () => {
    // TODO: 實作新增卡片功能
    console.log("新增卡片");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Add Button */}
      <div className="flex justify-end p-4 border-b">
        <Button onClick={handleAddCard} className="flex items-center gap-2">
          <Plus className="size-4" />
          新增卡片
        </Button>
      </div>

      {/* Scrollable Grid Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockCards.map((card) => (
            <Card
              key={card.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:scale-105"
            >
              {/* Fixed 5:3 aspect ratio container */}
              <div className="aspect-[5/3]">
                <CardContent className="h-full p-4 flex">
                  {/* Left section with Avatar (1/3 to 1/2 width) */}
                  <div className="w-2/5 flex items-center justify-center">
                    <Avatar className="size-20">
                      <AvatarImage src={card.avatar} alt={card.name} />
                      <AvatarFallback className="text-xl">
                        {card.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Right section with names and social media */}
                  <div className="flex-1 flex flex-col justify-center space-y-3 pl-4">
                    {/* Names section */}
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-800 text-xl leading-tight">
                        {card.name}
                      </h3>
                      <p className="text-sm text-gray-500">{card.nickname}</p>
                    </div>

                    {/* Social media icons */}
                    <div className="flex space-x-2">
                      {card.socialMedia.map((platform) => (
                        <div
                          key={platform}
                          className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          {getSocialMediaIcon(platform)}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

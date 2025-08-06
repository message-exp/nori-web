import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

// Mock data for demonstration
const mockCards = [
  { id: 1, title: "合約卡片 1", description: "這是第一張合約卡片的描述內容" },
  { id: 2, title: "合約卡片 2", description: "這是第二張合約卡片的描述內容" },
  { id: 3, title: "合約卡片 3", description: "這是第三張合約卡片的描述內容" },
  { id: 4, title: "合約卡片 4", description: "這是第四張合約卡片的描述內容" },
  { id: 5, title: "合約卡片 5", description: "這是第五張合約卡片的描述內容" },
  { id: 6, title: "合約卡片 6", description: "這是第六張合約卡片的描述內容" },
];

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
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                {/* 預留空間給未來的內容 */}
                <div className="bg-gray-50 rounded-md p-4 min-h-[100px] flex items-center justify-center">
                  <span className="text-gray-400 text-sm">預留內容區域</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

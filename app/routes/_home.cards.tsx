import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";

import ContactCard from "~/components/contact-card";

const mockCards = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
}));

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
        <div
          className="grid justify-center"
          style={{
            gridTemplateColumns: "repeat(auto-fill, 320px)",
            gap: "16px",
          }}
        >
          {mockCards.map((card) => (
            <div key={card.id} className="flex justify-center">
              <ContactCard />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

import CardList from "~/components/card-list/card-list";

export default function CardsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模擬 3 秒載入時間
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">loading...</div>
    );
  }

  return <CardList />;
}

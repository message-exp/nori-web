import { useEffect, useState } from "react";

import CardList from "~/components/card-list/card-list";
import { checkClientState } from "~/lib/matrix-api/refresh-token";

export default function CardsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initClient = async () => {
      const clientState = await checkClientState();
      if (clientState) {
        setLoading(false);
      }
    };
    initClient();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">loading...</div>
    );
  }

  return <CardList />;
}

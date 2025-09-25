import { useEffect, useState } from "react";

import CardList from "~/components/card-list/card-list";
import { Loading } from "~/components/ui/loading";
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
    return <Loading />;
  }

  return <CardList />;
}

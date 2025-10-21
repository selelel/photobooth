import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function App() {
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    const { data } = await supabase.from("instruments").select() as any;
    setInstruments(data);
  }

  return (
    <ul>
      {instruments?.map((instrument: { name: string }, idx: number) => (
        <li key={instrument?.name ?? idx}>{instrument?.name ?? "Unknown"}</li>
      ))}
    </ul>
  );
}

export default App;
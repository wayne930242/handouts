import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <NavBar isSupabaseConnected={isSupabaseConnected} />

      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <h1 className="text-2xl font-bold text-center text-muted-foreground">
          Welcome to ShareHandouts!
        </h1>
        <div className="leading-loose">
          <p>這個網站讓 GM 可以更容易地分享並且統整發過的遊戲手邊資料。</p>
          <ul className="list-disc list-inside">
            <li>如果你是 GM，你可以登入並開始使用。</li>
            <li>
              如果你是玩家，你可以在下方輸入 GM 提供的戰役 ID，並輸入通關密語。
            </li>
          </ul>
        </div>

        <div>保留給 ID 與通關密語輸入欄</div>
      </div>

      <Footer />
    </div>
  );
}

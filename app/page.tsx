import PageLayout from "@/components/layouts/PageLayout";

export default async function Index() {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-center text-muted-foreground">
        Welcome to ShareHandouts!
      </h1>
      <div className="leading-loose">
        <p>這個網站讓 GM 可以更容易地分享並且統整發過的遊戲手邊資料。</p>
        <ul className="list-disc list-inside">
          <li>如果你是 GM，你可以登入並開始使用。</li>
          <li>
            如果你是玩家，你可以加入 GM 提供的戰役，並輸入通關密語（如果有的話）。
          </li>
        </ul>
      </div>

      <div>保留給 ID 與通關密語輸入欄</div>
    </PageLayout>
  );
}

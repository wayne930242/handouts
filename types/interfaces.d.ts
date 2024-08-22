export interface Campaign {
  id: number | "new";
  gm_id: string;
  name: string;
  description?: string;
  passphrase?: string;
}

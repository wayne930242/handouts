import { PacmanLoader } from "react-spinners";

export default function Loading({ loading }: { loading?: boolean }) {
  return <PacmanLoader color="#bbb" loading={loading} size={24} />;
}

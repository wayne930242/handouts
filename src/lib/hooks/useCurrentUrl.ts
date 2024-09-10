import { usePathname } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { encodeUrlPath } from "@/lib/route";

export default function useCurrentUrl(
  options: {
    includeSearchParams?: boolean;
    encodeUrl?: boolean;
  } = {}
) {
  const { includeSearchParams = false, encodeUrl = true } = options;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  let result = pathname;
  if (includeSearchParams && searchParams) {
    result = `${result}${result.endsWith("/") ? "" : "/"}?${searchParams}`;
  }
  if (encodeUrl) {
    result = encodeUrlPath(result);
  }

  return result;
}

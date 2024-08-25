import { Handout } from "@/types/interfaces";
import { ContentFieldProps } from "../HandoutCard";

export default function FileEditor({}: Props) {
  return <div>FileEditor</div>;
}

interface Props {
  field: ContentFieldProps;
  chapterId: number;
}

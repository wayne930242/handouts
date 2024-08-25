import { ContentFieldProps } from "../HandoutCard";

export default function TextEditor({}: Props) {
  return <div>TextEditor</div>;
}

interface Props {
  field: ContentFieldProps;
  chapterId: number;
}

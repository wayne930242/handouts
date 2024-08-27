import * as VisuallyHiddenRadix from "@radix-ui/react-visually-hidden";

export const VisuallyHidden = ({
  children,
  ...props
}: VisuallyHiddenRadix.VisuallyHiddenProps) => (
  <VisuallyHiddenRadix.Root {...props}>
    <VisuallyHiddenRadix.VisuallyHidden>
      {children}
    </VisuallyHiddenRadix.VisuallyHidden>
  </VisuallyHiddenRadix.Root>
);

export default VisuallyHidden;

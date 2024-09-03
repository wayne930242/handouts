import PageLayout from "@/components/layouts/PageLayout";
import ProfileForm from "./ProfileForm";

interface Props {
  params: {
    locale: string;
  };
}

export default function Profile({ params: { locale } }: Props) {
  return (
    <PageLayout needsAuth>
      <ProfileForm />
    </PageLayout>
  );
}

import PageLayout from "@/components/layout/PageLayout";
import ProfileForm from "@/components/profile/ProfileForm";

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

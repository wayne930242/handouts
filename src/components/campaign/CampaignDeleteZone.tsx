import DeleteZone from '@/components/form/DeleteZone';

export default function CampaignDeleteZone({ campaignId }: { campaignId: string }) {
  return (
    <DeleteZone
      id={campaignId}
      type="campaign"
      translationNamespace="CampaignDeleteZone"
      tableName="campaigns"
      redirectPath="/campaigns"
    />
  );
}
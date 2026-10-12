import { Redirect } from 'expo-router';
import { FEATURES } from '@/lib/features';
import RussianReview from '@/components/RussianReview';

export default function RussianReviewRoute() {
  return FEATURES.russianCourse ? <RussianReview /> : <Redirect href={'/languages' as never} />;
}

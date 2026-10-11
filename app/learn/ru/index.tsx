import { Redirect } from 'expo-router';
import { FEATURES } from '@/lib/features';
import RussianHome from '@/components/RussianHome';

export default function RussianHomeRoute() {
  return FEATURES.russianCourse ? <RussianHome /> : <Redirect href={'/languages' as never} />;
}

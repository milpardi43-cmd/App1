import { Redirect } from 'expo-router';
import { FEATURES } from '@/lib/features';
import RussianLibrary from '@/components/RussianLibrary';

export default function RussianLibraryRoute() {
  return FEATURES.russianCourse ? <RussianLibrary /> : <Redirect href={'/languages' as never} />;
}

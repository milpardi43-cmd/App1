import { Redirect } from 'expo-router';

/** Learning starts at language selection; device pairing is not a prerequisite. */
export default function Index() {
  return <Redirect href={'/languages' as never} />;
}

import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Web-only HTML shell for every page (used by `expo start --web` and by the
 * static web export). Native builds never load this file.
 *
 * The app is a Persian RTL app, so the document itself is marked `dir="rtl"`:
 * without it the server-rendered HTML paints LTR until index.js flips
 * `document.documentElement.dir` after hydration. The background colour matches
 * the page background used by the screens (Colors.neutral[950]) so there is no
 * white flash before styles load.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {/* Disables body scrolling so ScrollView behaves like it does on native. */}
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: pageBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const pageBackground = `
body { background-color: #f6f8fb; }
#root { background-color: #f6f8fb; }
`;

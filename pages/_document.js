import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Veyra-Life — Premium research compounds" />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="icon" href="/veyralogo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

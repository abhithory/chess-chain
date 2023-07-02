import Navigation from '@/components/Navigation'
import ThirdWebProvider from '@/components/provider/ThirdWebProvider'
import '@/style/globals.css'

export const metadata = {
  title: 'Chess Chain',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='body bg_gradient'>
        <ThirdWebProvider>
          <main>
            <Navigation />
            {children}
          </main>
        </ThirdWebProvider>
      </body>
    </html>
  )
}

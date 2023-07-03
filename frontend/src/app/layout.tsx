import Navigation from '@/components/Navigation'
import ThirdWebProvider from '@/components/provider/ThirdWebProvider'
import Web3ConnectionWrapper from '@/smartContract/Web3ConnectionContext'
import '@/style/globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
          <Web3ConnectionWrapper>
            <main className='full-h-w'>
              <Navigation />
              {children}
              <ToastContainer />
            </main>
          </Web3ConnectionWrapper>
        </ThirdWebProvider>
      </body>
    </html>
  )
}

import ChessBoard from '@/components/ChessBoard'
import Image from 'next/image'


export default function Home() {
  return (
    <section className="flex_center h-screen w-screen">
      <h1>Welcome to chess chain</h1>
      <ChessBoard />
    </section>
  )
}

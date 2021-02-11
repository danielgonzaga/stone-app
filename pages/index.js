import Head from 'next/head'
import { dom } from '@fortawesome/fontawesome-svg-core'
import StoneMap from '../components/Map' 
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Stone App</title>
        <style>{dom.css()}</style>
      </Head>
      <StoneMap />
      <Footer />
    </div>
  )
}

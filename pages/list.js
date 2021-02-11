import Head from 'next/head';
import { dom } from '@fortawesome/fontawesome-svg-core';
import Footer from '../components/Footer';
import List from '../components/List';

const ListPage = () => {
  return (
    <div>
        <Head>
          <title>Stone App</title>
          <style>{dom.css()}</style>
        </Head>
        <List />
        <Footer />
    </div>
  )
}

export default ListPage
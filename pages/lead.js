import Head from 'next/head';
import { dom } from '@fortawesome/fontawesome-svg-core';
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import Lead from '../components/Lead';


const LeadPage = () => {
    const router = useRouter();
    const id = router.query.id;

    return (
        <div>
            <Head>
                <title>Stone App</title>
                <style>{dom.css()}</style>
            </Head>
            <Lead id={id}/>
            <Footer />
        </div>
    )
}

export default LeadPage
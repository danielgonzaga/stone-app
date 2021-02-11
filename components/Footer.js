import styles from '../styles/Footer.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'
import { faList } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';

export default function Footer() {
  return (
    <div>
      <div className={styles.footer}>
        
        <Link href={{pathname: "/list"}}>
          <FontAwesomeIcon className={styles.icons} icon={faList} size="lg"/>
        </Link>
        
        <Link href={{pathname: "/"}}>
            <FontAwesomeIcon className={styles.icons} icon={faMapMarkedAlt} size="lg" />
        </Link>

        <FontAwesomeIcon className={styles.icons} icon={faUser} size="lg"/>
      </div>
    </div>
  );
}

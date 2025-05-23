import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/home.module.css';

export default function View() {
  
  const apiUrl = process.env.BFF_API_URL;
  const [serviceList, setServiceList] = useState([]);
  const [error, setError] = useState('');

  const router = useRouter();
  const { id, username } = router.query;
  
useEffect(() => {
  const fetchData = async () => {
    try {
      const storedUsername = localStorage.getItem('user');
      const session = localStorage.getItem('session');
      const reqData = { username: storedUsername, session };

      // Check user session
      const sessionRes = await fetch(`${apiUrl}/api/user/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqData),
      });

      if (!sessionRes.ok) {
        throw new Error('Failed to fetch user session');
      }

      const sessionData = await sessionRes.json();

      if (sessionData.code === '0') {
        router.push('/login');
        return;
      }

      // If id exists, fetch service list
      if (id) {
        const serviceRes = await fetch(`${apiUrl}/api/user/list-service`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ client_partner_id: id }),
        });

        if (!serviceRes.ok) {
          throw new Error('Failed to fetch service list');
        }

        const serviceData = await serviceRes.json();

        if (Array.isArray(serviceData)) {
          setServiceList(serviceData);
        } else {
          setServiceList([]);
          setError('No services found');
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  fetchData();
}, [id, apiUrl, router]);



  const [currentPage, setCurrentPage] = useState(1);
  const servicePerPage = 10;
  
  const totalPages =  Math.ceil(serviceList.length / servicePerPage);
  const start = (currentPage - 1) * servicePerPage;
  const currentService = serviceList.slice(start, start + servicePerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const handleHome = async (e) => {
    e.preventDefault();
      router.push('/home');
  };

  const handleEdit  = (client_name,service_id,client_partner_id,keyword,shortcode,telcoid,ads_id,aoc_refid,aoc_id,aoc_media,postback_url,dn_url,counter) => {
        router.push({
            pathname: '/edit',
            query: { 
              client_name: client_name,
              service_id:service_id,
              client_partner_id:client_partner_id,
              keyword:keyword,
              shortcode:shortcode,
              telcoid:telcoid,
              ads_id:ads_id,
              aoc_refid:aoc_refid,
              aoc_id:aoc_id,
              aoc_media:aoc_media,
              postback_url:postback_url,
              dn_url:dn_url,
              counter:counter,
            },
          });
      };


      
  return (
  
    <div className={styles.container}>
     
      {/* Left Sidebar */}
      <div className={styles.left}>
        {/* <button className={styles.button}>Dashboard</button>
        <button className={styles.button}>Settings</button> */}
      </div>

      {/* Middle Content */}
      <div className={styles.middle}>
        <h2>User List : ID = {id} , Username = {username}</h2> 
        <center><span>Page {currentPage} of {totalPages}</span></center>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Keyword</th>
              <th>Shortcode</th>
              <th>Telcoid</th>
              <th>Media</th>
            </tr>
          </thead>
    
          <tbody>
           
            {currentService.map((serviceList) => (
              <tr key={serviceList.id}>
                <td>{serviceList.id}</td>
                <td>{serviceList.keyword}</td>
                <td>{serviceList.shortcode}</td>
                <td>{serviceList.telcoid}</td>
                <td>{serviceList.wap_aoc_media}</td>
                <td>
                  <button onClick={() => handleEdit
                    (
                      username,
                      serviceList.id,
                      serviceList.client_partner_id,
                      serviceList.keyword,
                      serviceList.shortcode,
                      serviceList.telcoid,
                      serviceList.ads_id,
                      serviceList.wap_aoc_refid,
                      serviceList.wap_aoc_id,
                      serviceList.wap_aoc_media,
                      serviceList.postback_url,
                      serviceList.dn_url,
                      serviceList.postback_counter,

                     
                     
                    )} className={styles.button_action}>Edit</button>&nbsp;&nbsp;
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
        
          <button onClick={handlePrev} disabled={currentPage === 1}>
            
            ⬅ Prev
          </button>

          <button onClick={ handleHome} className={styles.button}>Home</button>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next ➡
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={styles.right}>
        {/* <button className={styles.button}>Profile</button>
        <button className={styles.button}>Logout</button> */}
      </div>
    </div>
  );

}
  
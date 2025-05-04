import { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from '../styles/home.module.css';

const dummyUsers = Array.from({ length: 53 }, (_, i) => ({
  id: i + 1,
  keyword: `keyword_${i + 1}`,
  shortcode: `shortcode_${i + 1}`,
  telcoid: `telcoid_${i + 1}`,
  media: `media_${i + 1}`,

}));






export default function View() {
    
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const totalPages = Math.ceil(dummyUsers.length / usersPerPage);
  const start = (currentPage - 1) * usersPerPage;
  const currentUsers = dummyUsers.slice(start, start + usersPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));


    const router = useRouter();


  const handleHome = async (e) => {
    e.preventDefault();
      router.push('/home');
  };

    const { id, username } = router.query;
  
    useEffect(() => {
      if (id && username) {
        console.log('Received User:', id, username);
        // You can pre-fill or use this data now
      }
    }, [id, username]);
  
  
    const handleEdit  = (user_id) => {
        router.push({
            pathname: '/edit',
            query: { id: user_id },
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
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.keyword}</td>
                <td>{user.shortcode}</td>
                <td>{user.telcoid}</td>
                <td>{user.media}</td>
                <td>
                  <button onClick={() => handleEdit(user.id)} className={styles.button_action}>Edit</button>&nbsp;&nbsp;
                  
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

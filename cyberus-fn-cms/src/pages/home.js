import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/home.module.css';

export default function Home() {
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [usersList, setUsersList] = useState([]);

  const [logsList, setLogsList] = useState([]);
  const [err,setError]= useState([]);


  
  useEffect(() => {
    const username = localStorage.getItem('user'); // replace with your key
    const session = localStorage.getItem('session'); // replace with your key
    const reqData = {
      username,
      session,
    };
//CHECK SESSION LOGIN API
    fetch(`${apiUrl}/api/user/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch user list');
      }
      return response.json();
    })
    .then((data) =>  {
      if (data["code"] === '0') {
     router.push('/login')
      }
    })
    .catch((err) => setError(err.message));

//LIST USER API
    fetch(`${apiUrl}/api/user/list-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // if your BFF API expects a body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user list');
        }
        return response.json();
      })
      .then((data) => setUsersList(data))
      .catch((err) => setError(err.message));

//LIST LOG ON REDIS
fetch(`${apiUrl}/api/user/list-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null,
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch user list');
      }
      return response.json();
    })
    .then((data) =>  setLogsList(data))
    .catch((err) => setError(err.message));


  }, []);

  
  
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const totalPages = Math.ceil(usersList.length / usersPerPage);
  const start = (currentPage - 1) * usersPerPage;
  const currentUsers = usersList.slice(start, start + usersPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  
  const router = useRouter();
  const handleAdd = async (e) => {
    e.preventDefault();
      router.push('/add');
  };
  const handleConfig  = (user_id, user_name) => {
    router.push({
        pathname: '/config',
        query: { id: user_id, username: user_name },
      });
  };

  const handleView = (user_id, user_name) => {
    router.push({
        pathname: '/view',
        query: { id: user_id, username: user_name },
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
        <h2>User List </h2> 
        <center><span>Page {currentPage} of {totalPages}</span></center>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>
                  <button onClick={() => handleConfig(user.id, user.username)} className={styles.button_action}>Config</button>&nbsp;&nbsp;
                  <button onClick={() => handleView(user.id, user.username)} className={styles.button_action}>&nbsp;View&nbsp;</button>&nbsp;&nbsp;
                  <button className={styles.button_action}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            ⬅ Prev
          </button>
          <button onClick={ handleAdd} className={styles.button}>Add</button>
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

       
       <pre>
  {logsList.map((log, index) => (
    <div key={index} style={{ marginBottom: '10px' }}>
      <div><strong>Loggin #{index + 1}</strong></div>
      {Object.entries(log).map(([key, value]) => (
        <div key={key}>
          {key} ({value.length}): {value}
        </div>
      ))}
    </div>
  ))}
</pre>

          

    </div>
  

    
  );
  
}

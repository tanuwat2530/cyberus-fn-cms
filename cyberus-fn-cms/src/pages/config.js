import { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from '../styles/config.module.css';

export default function ConfigPage() {
  

  const router = useRouter();
  const [err,setError]= useState([]);
  const { id, username } = router.query;

  useEffect(() => {
    const username = localStorage.getItem('user'); // replace with your key
    const session = localStorage.getItem('session'); // replace with your key
    const reqData = {
      username,
      session,
    };
    
    fetch('http://localhost:3003/api/user/session', {
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
              // Redirect if no session
      router.push('/login');
      }
    })
    .catch((err) => setError(err.message));

    if (id && username) {
      console.log('Received User:', id, username);
      setFormData((prev) => ({
        ...prev,
        client_partner_id: id,
      }));
    }
  }, [id, username]);


  const [formData, setFormData] = useState({
    client_partner_id:'',
    keyword: '',
    shortcode: '',
    telcoid: '',
    ads_id: '',
    wap_aoc_refid: '',
    wap_aoc_id: '',
    wap_aoc_media: '',
    postback_url: '',
    dn_url: '',
    counter: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasEmpty = Object.values(formData).some((v) => !v.trim());
    
  fetch('http://localhost:3003/api/user/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      return response.json();
    })
    .then((data) => {
      alert("User created successed")
      router.push("/home")
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });


    // Handle save logic (e.g., API call)
    console.log('Submitted:', JSON.stringify(formData));
  };

  return (
    <div className={styles.container}>
      <h1>Create Service Partner : ID = {id} , Name = {username} </h1>
      <form onSubmit={handleSubmit}>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
          {Object.keys(formData).map((key) => (
    <tr key={key}>
      <td>{key}</td>
      <td>
        <input
          className={styles.input}
          name={key}
          type="text"
          required
          value={formData[key]}
          onChange={handleChange}
          readOnly={key === 'client_partner_id'} // 👈 This line makes it readonly
         
        />
      </td>
    </tr>
  ))}

          </tbody>
        </table>
        <button type="submit" className={styles.submitBtn}>Save Config</button>
      </form>
    </div>
  );
}

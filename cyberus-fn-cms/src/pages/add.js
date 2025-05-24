import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/add.module.css';

export default function AddUser() {

const apiUrl = process.env.BFF_API_URL;
const router = useRouter();
const [err,setError]= useState([]);
 
useEffect(() => {
  const checkSession = async () => {
    try {
      const username = localStorage.getItem('user');
      const session = localStorage.getItem('session');
      const reqData = { username, session };


      const response = await fetch(`${apiUrl}/api/user/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqData),
      });

      if (!response.ok) throw new Error('Failed to fetch user list');

      const data = await response.json();

      if (data.code === '0') {
        // Access router inside effect
        router.push('/login');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  checkSession();

// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);




  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSuggestPassword = () => {
    const newPassword = generatePassword();
    setPassword(newPassword);
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  const formData = {
    username,
    password,
  };

  fetch('${apiUrl}/api/user/add', {
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

  };


  function generatePassword(length = 12) {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~';
    return Array.from({ length }, () =>
      charset[Math.floor(Math.random() * charset.length)]
    ).join('');
  }

  return (
    <div className={styles.container}>
      <h1>Create new user</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Input username"
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="text"     
          name="password"     
          value={password} placeholder="Input password or suggest password"
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="button" onClick={handleSuggestPassword} className={styles.button_suggest}>
  Suggest Password
</button>
        <button type="submit" className={styles.button}>
          Create
        </button>
      </form>
    </div>
  );
}

import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/add.module.css';

export default function addUser() {

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const router = useRouter();
const [err,setError]= useState([]);
 
useEffect(() => {
    const username = localStorage.getItem('user'); // replace with your key
    const session = localStorage.getItem('session'); // replace with your key
    const reqData = {
      username,
      session,
    };
    
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
              // Redirect if no session
      router.push('/login');
      }
    })
    .catch((err) => setError(err.message));

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

  fetch('http://localhost:3003/api/user/add', {
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

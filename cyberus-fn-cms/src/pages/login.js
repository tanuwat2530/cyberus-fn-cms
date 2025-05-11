import { useState } from 'react';
import { useRouter } from 'next/router';
import SHA256 from 'crypto-js/sha256';
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles/Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const uniqueId = uuidv4();
        // Combine and hash
    const combined = username + password + uniqueId;
    const session = SHA256(combined).toString();
    const formData = {
      username,
      password,
      session
    };
  
    fetch('http://localhost:5001/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Cannot login');
        }
        return response.json();
      })
      .then((data) => {

        console.log(data["code"])
        if (data["code"] === '1'){
          alert("Welcome "+username)
          localStorage.setItem("user", username);
          localStorage.setItem("session", session);
          router.push("/home")
          
        }else{
               // Redirect if no session
      navigate('/login');
        }

      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
    

  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>Login</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

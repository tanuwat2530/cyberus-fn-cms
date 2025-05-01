import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/add.module.css';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', editingIndex: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/home');

    // if (!form.name || !form.email) return;

    // if (form.editingIndex !== null) {
    //   const updatedUsers = [...users];
    //   updatedUsers[form.editingIndex] = { name: form.name, email: form.email };
    //   setUsers(updatedUsers);
    // } else {
    //   setUsers([...users, { name: form.name, email: form.email }]);
    // }

    // setForm({ name: '', password: '', editingIndex: null });
  };

  // const handleEdit = (index) => {
  //   setForm({ ...users[index], editingIndex: index });
  // };

  const [password, setPassword] = useState('');

const handleSuggestPassword = () => {
  const newPassword = generatePassword();
  setPassword(newPassword);
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
         
          className={styles.input}
        />
        <input
          type="text"          
          value={password}
                    placeholder="Input password or suggest password"
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button type="button" onClick={handleSuggestPassword} className={styles.button_suggest}>
  Suggest Password
</button>
        <button onClick={handleSubmit} type="submit" className={styles.button}>
          Create
        </button>
      </form>

      {/* <ul className={styles.userList}>
        {users.map((user, i) => (
          <li key={i} className={styles.userItem}>
            {user.name} ({user.email})
            <button onClick={() => handleEdit(i)} className={styles.editButton}>Edit</button>
          </li>
        ))}
      </ul> */}
    </div>
  );
}

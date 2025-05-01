import { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from '../styles/edit.module.css';

export default function ConfigPage() {
  const [formData, setFormData] = useState({
    keyword: '',
    shortcode: '',
    telcoid: '',
    ads_id: '',
    aoc_refid: '',
    aoc_id: '',
    aoc_media: '',
    postback_url: '',
    dn_url: '',
    counter: '',
  });

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      console.log('Received User:', id);
      // You can pre-fill or use this data now
    }
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasEmpty = Object.values(formData).some((v) => !v.trim());
    if (hasEmpty) {
      alert('All fields are required.');
      return;
    }

    // Handle save logic (e.g., API call)
    console.log('Submitted:', formData);
  };

  return (
    <div className={styles.container}>
      <h1>Edit Service Partner : ID = {id} , Name =  </h1>
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

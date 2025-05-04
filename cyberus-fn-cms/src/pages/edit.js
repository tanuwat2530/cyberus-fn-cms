import { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from '../styles/edit.module.css';

export default function ConfigPage() {
 
  const router = useRouter();
  const { client_name,
    service_id,
    keyword,
    shortcode,
    telcoid,
    ads_id,
    aoc_refid,
    aoc_id,
    aoc_media,
    postback_url,
    dn_url,
    counter} = router.query;

  useEffect(() => {
    //http://localhost:3000/edit?client_name=phonattic&service_id=28&client_partner_id=172dc14e&keyword=z&shortcode=c&ads_id=b&aoc_refid=n&aoc_id=%2C&aoc_media=.&postback_url=lh87je&dn_url=r&counter=0
    if (client_name) {
      console.log('Received User:', client_name);
      setFormData((prev) => ({
        ...prev,
        keyword: keyword,
        shortcode: shortcode,
        telcoid: telcoid,
        ads_id: ads_id,
        aoc_refid: aoc_refid,
        aoc_id:aoc_id,
        aoc_media:aoc_media,
        postback_url:postback_url,
        dn_url:dn_url,
        counter:counter,
      }));
      // You can pre-fill or use this data now
    }
  }, [client_name,
    service_id,
    keyword,
    shortcode,
    telcoid,
    ads_id,
    aoc_refid,
    aoc_id,
    aoc_media,
    postback_url,
    dn_url,
counter]);

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
      <h1>Edit Service Partner : ID = {service_id} , Partner Name =  {client_name}</h1>
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

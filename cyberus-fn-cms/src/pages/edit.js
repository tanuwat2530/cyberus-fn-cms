import { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from '../styles/edit.module.css';

export default function ConfigPage() {
 
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [err,setError]= useState([]);
  const { 
    client_partner_id,
    client_name,
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



    if (client_name) {

      setFormData((prev) => ({
        ...prev,
        id:parseInt(service_id, 10),//decimal base
        keyword: keyword,
        shortcode: shortcode,
        telcoid: telcoid,
        ads_id: ads_id,
        client_partner_id:client_partner_id,
        wap_aoc_refid: aoc_refid,
        wap_aoc_id:aoc_id,
        wap_aoc_media:aoc_media,
        postback_url:postback_url,
        dn_url:dn_url,
        postback_counter:parseInt(counter, 10),//decimal base
      }));
      // You can pre-fill or use this data now
    }
  }, [client_name,
    service_id,
    keyword,
    shortcode,
    telcoid,
    ads_id,
    client_partner_id,
    aoc_refid,
    aoc_id,
    aoc_media,
    postback_url,
    dn_url,
    counter]);

  const [formData, setFormData] = useState({
    id:'',
    keyword: '',
    shortcode: '',
    telcoid: '',
    ads_id: '',
    client_partner_id:'',
    wap_aoc_refid: '',
    wap_aoc_id: '',
    wap_aoc_media: '',
    postback_url: '',
    dn_url: '',
    postback_counter: '',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: name === "postback_counter" ? parseInt(value, 10) || 0 : value,
  }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    console.log(formData)
    fetch(`${api}/api/user/update-service`, {
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
        console.log(data)
        alert("Service updated successed")
        
        router.push({
          pathname: '/view',
          query: { 
            id: client_partner_id,
            username:client_name,
            
          },
        });
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  




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
                    type={key === 'postback_counter' ? 'number' : 'text'}
                    required
                    value={formData[key]}
                    onChange={handleChange}
                    readOnly={key === 'client_partner_id' || key === 'id'} // 👈 This line makes it readonly
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

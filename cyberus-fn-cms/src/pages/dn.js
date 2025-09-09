/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import { format, eachDayOfInterval } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

import styles from '../styles/mo.module.css';


export default function CmsDnReport(){

const [currentUrl ,setCurrentUrl] = useState(null)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const router = useRouter();
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
//const [err,setError]= useState([]);


// --- Data Fetching and Initial Setup ---
    useEffect(() => {
        setCurrentUrl(router.basePath)
        const username = localStorage.getItem('user');
        const session = localStorage.getItem('session');
        const partner_id = localStorage.getItem('partner_id');

        if (!username || !session) {
            router.push('/login');
            return;
        }

        const reqData = { username, session };

        // Combined fetch for initial data
        const fetchData = async () => {
            try {
                // Step 1: Check session validity and wait for the response.
                const sessionRes = await fetch(`${apiUrl}/api/user/session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reqData),
                });
                const sessionData = await sessionRes.json();
                if (sessionData.code === '0') {
                    router.push('/login');
                    return; // Stop execution if session is invalid
                }


            } catch (err) {
                console.error("Failed to fetch initial data:", err.message);
            }
        };

        fetchData();
    }, [apiUrl, router]);

const [startDate, setStartDate] = useState(new Date(), 'dd/MM/yyyy');
const [endDate, setEndDate] = useState(new Date(), 'dd/MM/yyyy');

const handleSearch = () => {
  if (startDate && endDate) {
    const datesInRange = eachDayOfInterval({ start: startDate, end: endDate });
    const formattedDates = datesInRange.map(date => format(date, 'dd/MM/yyyy'));
    const searchTimeArray = [];
    formattedDates.forEach(dateStr =>     
     searchTimeArray.push(convertDateRangeToTimestamps(dateStr))
    )
    
const payload = {
  "date-time": searchTimeArray      // your new date range
};

console.log("PAYLOAD : ",(JSON.stringify(payload)))
    fetch(`${apiUrl}/api/user/dn-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch report data');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Report Data:', JSON.stringify(data)); // optional debug log
                setData(data);
        setLoading(false);

      })
      .catch((err) => console.log(err.message));
      
  } else {
    alert("Please select both start and end dates.");
  }
};  



function convertDateRangeToTimestamps(dateString) {
    // Assuming the input dateString is 'DD/MM/YYYY'.
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10); // Month is 0-indexed in JS Date
    const year = parseInt(parts[2], 10);

    // Add 7 hours to the start of the day.
    const startDate = new Date(year, month - 1, day, 7, 0, 0, 0);
    const startTimestampSeconds = Math.floor(startDate.getTime() / 1000);

    // Add 7 hours to the end of the day.
    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
    // Add 7 hours to the end date
    endDate.setHours(endDate.getHours() + 7);
    const endTimestampSecondsPrecise = Math.floor(endDate.getTime() / 1000);

    return {
        dateString: dateString,
        startSeconds: startTimestampSeconds.toString(),
        endSeconds: endTimestampSecondsPrecise.toString()
    };
}

return (

<div>
<br/>
          <center>
   {/* --- Menu --- */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <nav>
                    <a href="/cms/home" title="Configuration">
                         SERVICE CONFIGURATION
                    </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="/cms/mo" title="Partner sent to Cyberus">
                        MO HISTORY
                    </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="/cms/dn" title="DN from Gateway">
                        DN HISTORY
                    </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     <a href="/cms/report" title="Summary data">
                       REPORT
                    </a>
                </nav>
            </header>
            </center>
      <div style={{marginTop:'10px', padding: '60px' ,backgroundColor: '#FFFFFF' , zIndex:'revert'}}>
             <center> <h1 className="text-3xl font-bold text-gray-800 ">Transaction Report</h1></center>
              {/* Date Picker UI */}
                  <div style={{ justifyContent: 'center', display: 'flex', gap: '20px' }}>
                    
                    <div>
                      <label><strong>Start Date:</strong></label><br />
                      <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" />
                    </div>
                    <div>
                      <label><strong>End Date:</strong></label><br />
                      <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" />
                    </div>
                    <div>
                      <button onClick={handleSearch} style={{ marginTop: '18px' }}>
                        Search
                      </button>
                    </div>
                  </div>
                   <div style={{marginTop:'10px'}}>
        {loading && (
          <div className="text-center py-10 text-gray-500 text-lg">
            Please select Date
          </div>
        )}
        {data && (
          <div>
            <table className={styles.table}>
              <thead>
                <tr >
                  <th><center>DATE</center></th>
                  <th><center>AIS-DN</center></th>
                  <th><center>DTAC-DN</center></th>
                  <th><center>TMVH-DN</center></th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td><center>{row['dn-date']}</center></td>
                    <td><a href={`${currentUrl}/dn-detail?telco=ais&start=${row['start-timestamp']}&end=${row['end-timestamp']}`} target="_blank" rel="noopener noreferrer">{row['ais-dn'].toLocaleString()}</a></td>
                    <td><a href={`${currentUrl}/dn-detail?telco=dtac&start=${row['start-timestamp']}&end=${row['end-timestamp']}`} target="_blank" rel="noopener noreferrer">{row['dtac-dn'].toLocaleString()}</a></td>
                    <td><a href={`${currentUrl}/dn-detail?telco=tmvh&start=${row['start-timestamp']}&end=${row['end-timestamp']}`} target="_blank" rel="noopener noreferrer">{row['tmvh-dn'].toLocaleString()}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      </div>
      </div>

      
  );
}
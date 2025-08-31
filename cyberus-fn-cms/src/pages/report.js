/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import { format, eachDayOfInterval } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,PieChart,Pie,Cell, ResponsiveContainer
} from 'recharts';

export default function CmsReport(){

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const router = useRouter();
const [shortcodeList, setShortcodeList] = useState([]);
const [dataReport, setDataReport] = useState(null);
const [registerPieData, setRegisterPieData] = useState([]);
const [cancelPieData, setCancelPieData] = useState([]);
//const [err,setError]= useState([]);


// --- Data Fetching and Initial Setup ---
    useEffect(() => {
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

                // Step 2: Fetch shortcodes and wait for the response.
                const shortcodeRes = await fetch(`${apiUrl}/api/user/all-shortcode`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: null,
                });
                const shortcodes = await shortcodeRes.json();
                setShortcodeList(shortcodes); // Set state for later use (e.g., in handleSearch)
               
                // Step 3: Now that we have the shortcodes, build the payload and fetch the pie chart data.
                const piePayload = { "list-shortcode": shortcodes };
                const pieRes = await fetch(`${apiUrl}/api/user/pie-report`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(piePayload),
                });
                const pieData = await pieRes.json();
                
                // Step 4: Process the pie data and set the state.
                const summaryData = pieData["data-summary"] || [];
                
                const registerData = summaryData.map(item => ({ name: item.ShortCode, value: item.RegisterTotal }));
                const cancelData = summaryData.map(item => ({ name: item.ShortCode, value: item.CancelTotal }));

                setRegisterPieData(registerData);
                setCancelPieData(cancelData);

            } catch (err) {
                console.error("Failed to fetch initial data:", err.message);
            }
        };

        fetchData();
    }, [apiUrl, router]);

const [startDate, setStartDate] = useState(new Date(), 'dd/MM/yyyy');
const [endDate, setEndDate] = useState(new Date(), 'dd/MM/yyyy');

//DO NOT MOVE ORDER
// Merge and group totals and shortcodes by date
const mergeChartData = (reportData) => {
  const allDates = Array.from(new Set(
    Object.values(reportData).flat().map(item => item.Date)
  ));

  return allDates.map(date => {
    const getSumAndShorts = (key) => {
      if (reportData[key] != null) {
        const filtered = reportData[key].filter(item => item.Date === date);
        return {
          total: filtered.reduce((sum, item) => sum + item.Total, 0),
          shorts: filtered.map(item => item.ShortCode).filter(code => code !== "0").join(', ')
        };
      } else {
        return {
          total: 0,
          shorts: ""
        };
      }
    };

    const aisCancel = getSumAndShorts("ais-cancel");
    const aisRegister = getSumAndShorts("ais-register");
    const dtacCancel = getSumAndShorts("dtac-cancel");
    const dtacRegister = getSumAndShorts("dtac-register");
    const tmvhCancel = getSumAndShorts("tmvh-cancel");
    const tmvhRegister = getSumAndShorts("tmvh-register");

    return {
      date,
      aisCancelTotal: aisCancel.total,
      aisRegisterTotal: aisRegister.total,
      dtacCancelTotal: dtacCancel.total,
      dtacRegisterTotal: dtacRegister.total,
      tmvhCancelTotal: tmvhCancel.total,
      tmvhRegisterTotal: tmvhRegister.total,
      aisCancelShort: aisCancel.shorts,
      aisRegisterShort: aisRegister.shorts,
      dtacCancelShort: dtacCancel.shorts,
      dtacRegisterShort: dtacRegister.shorts,
      tmvhCancelShort: tmvhCancel.shorts,
      tmvhRegisterShort: tmvhRegister.shorts
    };
  });
};

const lineChartReport = dataReport ? mergeChartData(dataReport) : [];

//DO NOT MOVE ORDER
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  return (
    <div style={{ backgroundColor: '#FFF', border: '1px solid #ccc', padding: 2 }}>
      <div><strong>Date:</strong> {label}</div>
      <div>AIS Cancel: {item.aisCancelTotal} ({item.aisCancelShort || 'N/A'})</div>
      <div>AIS Register: {item.aisRegisterTotal} ({item.aisRegisterShort || 'N/A'})</div>
      <div>DTAC Cancel: {item.dtacCancelTotal} ({item.dtacCancelShort || 'N/A'})</div>
      <div>DTAC Register: {item.dtacRegisterTotal} ({item.dtacRegisterShort || 'N/A'})</div>
      <div>TMVH Cancel: {item.tmvhCancelTotal} ({item.tmvhCancelShort || 'N/A'})</div>
      <div>TMVH Register: {item.tmvhRegisterTotal} ({item.tmvhRegisterShort || 'N/A'})</div>
    </div>
  );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA66CC'];

const handleSearch = () => {
  if (startDate && endDate) {

    const datesInRange = eachDayOfInterval({ start: startDate, end: endDate });
    const formattedDates = datesInRange.map(date => format(date, 'dd/MM/yyyy'));
    
    const searchTimeArray = [];
    formattedDates.forEach(dateStr =>     
     searchTimeArray.push(convertDateRangeToTimestamps(dateStr))
    )
    
const payload = {
  "list-shortcode": shortcodeList,     // e.g. from another state
  "date-time": searchTimeArray      // your new date range
};

console.log("PAYLOAD : ",(JSON.stringify(payload)))
    fetch(`${apiUrl}/api/user/chart-report`, {
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
         setDataReport(data); // <- set it into state
      })
      .catch((err) => console.log(err.message));
      
  } else {
    alert("Please select both start and end dates.");
  }
};  

// function convertDateRangeToTimestamps(dateString) {
//     // Ensure dateString is in a format parseable by new Date()
//     // For "DD/MM/YYYY", it's safer to parse manually or rearrange to "MM/DD/YYYY"
//     // or use a library. Let's assume MM/DD/YYYY for direct parsing.
//     // If your input is strictly DD/MM/YYYY, you'll need to reformat it.
//     // Example: "01/06/2025" -> "06/01/2025" for JavaScript's default parsing.

//     // Let's assume the input dateString is 'DD/MM/YYYY' and parse it correctly.
//     const parts = dateString.split('/');
//     const day = parseInt(parts[0], 10);
//     const month = parseInt(parts[1], 10); // Month is 0-indexed in JS Date
//     const year = parseInt(parts[2], 10);

//     // Start of the day (00:00:00.000)
//     // Month is (month - 1) because JavaScript months are 0-indexed (January is 0)
//     const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
//     const startTimestampMs = startDate.getTime(); // Timestamp in milliseconds

//     // End of the day (23:59:59.999)
//     // Option 1: Go to the next day at 00:00:00 and subtract 1 millisecond
//     //const nextDayDate = new Date(year, month - 1, day + 1, 0, 0, 0, 0);
//     //const endTimestampMs = nextDayDate.getTime() - 1; // Timestamp in milliseconds

//     // If you need it in seconds (Unix timestamp is typically in seconds)
//     const startTimestampSeconds = Math.floor(startTimestampMs / 1000);
//     //const endTimestampSeconds = Math.floor(endTimestampMs / 1000); // Note: this rounds down

//     // To get exactly 23:59:59 timestamp in seconds, you can set it directly:
//     const endDate = new Date(year, month - 1, day, 23, 59, 59, 999); // Set to 999ms for safety
//     const endTimestampSecondsPrecise = Math.floor(endDate.getTime() / 1000);

//     return {
       
//        // startMs: startTimestampMs,
//        // endMs: endTimestampMs,
//         dateString:dateString,
//         startSeconds: startTimestampSeconds.toString(),
//         endSeconds: endTimestampSecondsPrecise.toString() // Use this for 23:59:59 in seconds
//     };
// }

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

    <div style={{ display:'flex', width: '100%', height: 400, marginTop:20 }}>
      {/* Pie Chart */}
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>  
                  <Pie
                    data={registerPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {registerPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
               <center><h4 className="text-lg font-semibold text-gray-700 mt-2">All Register</h4></center> 
              </ResponsiveContainer>
             
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cancelPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {cancelPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
                 <center><h4 className="text-lg font-semibold text-gray-700 mt-2">All Cancel</h4></center> 
              </ResponsiveContainer>
</div>



      <div style={{marginTop:'10px', padding: '60px' ,backgroundColor: '#FFFFFF' , zIndex:'revert'}}>
       <center>REGISTER & CANCEL</center> 
       <br/>
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
                                     {/* Line Chart */}
                {dataReport && (
              <div style={{ width: '90%', height: 400, marginBottom: '40px' }}>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={lineChartReport} margin={{ top: 60, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="aisCancelTotal" stroke="#025c09" name="AIS Cancel" />
                    <Line type="monotone" dataKey="aisRegisterTotal" stroke="#0ead1b" name="AIS Register" />
                    <Line type="monotone" dataKey="dtacCancelTotal" stroke="#091875" name="DTAC Cancel" />
                    <Line type="monotone" dataKey="dtacRegisterTotal" stroke="#0541f5" name="DTAC Register" />
                    <Line type="monotone" dataKey="tmvhCancelTotal" stroke="#a36070" name="TMVH Cancel" />
                    <Line type="monotone" dataKey="tmvhRegisterTotal" stroke="#e6093d" name="TMVH Register" />
                  </LineChart>
                </ResponsiveContainer>
              </div>)}

      </div>
      </div>
  );
}
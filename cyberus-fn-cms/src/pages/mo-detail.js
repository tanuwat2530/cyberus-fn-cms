/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/mo.module.css';

export default function CmsMoDetailReport() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching and Initial Setup ---
    useEffect(() => {
        const username = localStorage.getItem('user');
        const session = localStorage.getItem('session');
        if (!username || !session) {
            router.push('/login');
            return;
        }

        // Check if the router is ready before accessing query parameters
        if (!router.isReady) {
            return;
        }

        const { telco, start, end } = router.query;
        if (!telco || !start || !end) {
            setError("Missing report parameters.");
            setLoading(false);
            return;
        }

        const reqData = { 
            "start-time": start,
            "end-time": end,
            "telco": telco 
        };

        const fetchReportDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${apiUrl}/api/user/mo-detail`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reqData),
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch report data.');
                }

                const responseData = await res.json();

                // Sort the data by timestamp in descending order
                // The `timestamp` field is expected to be a number (Unix timestamp).
                const sortedData = responseData.sort((a, b) => b.timestamp - a.timestamp);
                
                console.log(sortedData);
                setData(sortedData);
            } catch (err) {
                console.error("Failed to fetch detail data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReportDetail();
    }, [router.isReady, router.query, apiUrl, router]);

   // Helper function to format Unix timestamp to a 24-hour clock
const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    // The timestamp is in seconds, so multiply by 1000 for milliseconds
    const date = new Date(parseInt(timestamp, 10) * 1000);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // This is the key option for 24H format
    });
};

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto mt-4 p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Subscription Detail Report</h1>
                </div>

                {data && data.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg shadow-xl">
                        <table className={styles.table}>
                            <thead className="bg-blue-600 text-white text-sm uppercase">
                                <tr>
                                    <th className="py-3 px-4 border-b border-gray-200">RefID</th>
                                    <th className="py-3 px-4 border-b border-gray-200">Date/Time</th>
                                    <th className="py-3 px-4 border-b border-gray-200">Msisdn</th>
                                    <th className="py-3 px-4 border-b border-gray-200">Action</th>
                                    <th className="py-3 px-4 border-b border-gray-200">Shortcode</th>
                                    <th className="py-3 px-4 border-b border-gray-200">Description</th>
                                    <th className="py-3 px-4 border-b border-gray-200">Media</th>
                                    <th className="py-3 px-4 border-b border-gray-200">Postback</th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="py-3 px-4 text-gray-800 break-all">{row.ref_id}</td>
                                        <td className="py-3 px-4 text-gray-600 break-all">{formatTimestamp(row.timestamp)}</td>
                                        <td className="py-3 px-4 text-gray-600 break-all">{row.msisdn}</td>
                                        <td className="py-3 px-4 text-gray-600 break-all">{row.action}</td>
                                        <td className="py-3 px-4 text-gray-600 break-all">{row.short_code}</td>
                                        <td className="py-3 px-4 text-gray-600 break-all">{row.description}</td>
                                        <td className="py-3 px-4 text-gray-600 break-all">{row.media}</td>
                                        <td className="py-3 px-4 text-gray-600 break-all">{row.cyberus_return}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    !loading && <div className="text-center py-10 text-gray-500 text-lg">No data found for this period.</div>
                )}
            </div>
        </div>
    );
}
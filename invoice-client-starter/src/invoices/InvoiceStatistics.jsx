import React, { useEffect, useState } from "react";
import { apiGet } from "../utils/api";
import "../css/StatisticsPage.css"; // Ujisti se, že máš správné styly

const InvoiceStatistics = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiGet("/api/invoices/statistics")
            .then(setStats)
            .catch(err => {
                console.error("Chyba při načítání statistik faktur:", err);
                setError("Statistiky faktur se nepodařilo načíst.");
            });
    }, []);

    return (
        <div>
            <h2 className="statistics-section-title mb-3">Statistiky faktur</h2>
            <table className="statistics-table">
                <tbody>
                    <tr>
                        <td>Součet za letošní rok:</td>
                        <td>
                            {error ? (
                                <span className="statistics-badge bg-danger">{error}</span>
                            ) : stats === null ? (
                                <span className="statistics-badge gray">Načítám…</span>
                            ) : (
                                <span className="statistics-badge">
                                    {stats.currentYearSum.toLocaleString('cs-CZ')} Kč
                                </span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Součet za všechny roky:</td>
                        <td>
                            {error ? (
                                <span className="statistics-badge bg-danger">{error}</span>
                            ) : stats === null ? (
                                <span className="statistics-badge gray">Načítám…</span>
                            ) : (
                                <span className="statistics-badge green">
                                    {stats.allTimeSum.toLocaleString('cs-CZ')} Kč
                                </span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Celkový počet faktur:</td>
                        <td>
                            {error ? (
                                <span className="statistics-badge bg-danger">{error}</span>
                            ) : stats === null ? (
                                <span className="statistics-badge gray">Načítám…</span>
                            ) : (
                                <span className="statistics-badge gray">
                                    {stats.invoicesCount}
                                </span>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceStatistics;

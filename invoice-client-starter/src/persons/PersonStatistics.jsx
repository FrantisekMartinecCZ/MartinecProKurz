import React, { useEffect, useState } from "react";
import { apiGet } from "../utils/api";
import { Link } from "react-router-dom";
import "../css/StatisticsPage.css";

const PersonStatistics = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiGet("/api/persons/statistics")
            .then(setStats)
            .catch(err => {
                console.error("Chyba při načítání statistik:", err);
                setError("Statistiky se nepodařilo načíst.");
            });
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="statistics-section-title">Statistiky osob</h2>
                <Link to="/persons" className="btn btn-outline-secondary">
                    Zpět na seznam osob
                </Link>
            </div>
            <div className="statistics-table-wrapper">
                <p className="statistics-table-caption">
                    Seřazeno podle nejvyššího obratu.
                </p>
                <table className="statistics-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Jméno</th>
                            <th className="text-end">Obrat (Kč)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error ? (
                            <tr>
                                <td colSpan="3" className="text-danger text-center">{error}</td>
                            </tr>
                        ) : stats === null ? (
                            <tr>
                                <td colSpan="3" className="text-muted text-center">Načítání statistik…</td>
                            </tr>
                        ) : stats.length > 0 ? (
                            stats.map((p, index) => (
                                <tr key={p.personId}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Link to={`/persons/show/${p.personId}`} className="statistics-link">
                                            {p.personName}
                                        </Link>
                                    </td>
                                    <td className="text-end fw-bold">
                                        {p.revenue.toLocaleString('cs-CZ')} Kč
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-muted text-center">
                                    Nebyly nalezeny žádné statistiky.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PersonStatistics;

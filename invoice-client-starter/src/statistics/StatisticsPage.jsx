import React from "react";
import InvoiceStatistics from "../invoices/InvoiceStatistics";
import PersonStatistics from "../persons/PersonStatistics";
import "../css/StatisticsPage.css"; // Přidej import CSS

const StatisticsPage = () => (
    <div className="container mt-4">
        <h1 className="statistics-header mb-4">Statistiky</h1>
        <div className="statistics-columns">
            <div className="statistics-column">
                <InvoiceStatistics />
            </div>
            <div className="statistics-column">
                <PersonStatistics />
            </div>
        </div>
    </div>
);

export default StatisticsPage;

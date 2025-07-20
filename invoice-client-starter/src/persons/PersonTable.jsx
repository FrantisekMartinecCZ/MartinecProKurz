/*  _____ _______         _                      _
 * |_   _|__   __|       | |                    | |
 *   | |    | |_ __   ___| |___      _____  _ __| | __  ___ ____
 *   | |    | | '_ \ / _ \ __\ \ /\ / / _ \| '__| |/ / / __|_  /
 *  _| |_   | | | | |  __/ |_ \ V  V / (_) | |  |   < | (__ / /
 * |_____|  |_|_| |_|\___|\__| \_/\_/ \___/|_|  |_|\_(_)___/___|
 *                                _
 *              ___ ___ ___ _____|_|_ _ _____
 *             | . |  _| -_|     | | | |     |  LICENCE
 *             |  _|_| |___|_|_|_|_|___|_|_|_|
 *             |_|
 *
 *   PROGRAMOVÁNÍ  <>  DESIGN  <>  PRÁCE/PODNIKÁNÍ  <>  HW A SW
 *
 * Tento zdrojový kód je součástí výukových seriálů na
 * IT sociální síti WWW.ITNETWORK.CZ
 *
 * Kód spadá pod licenci prémiového obsahu a vznikl díky podpoře
 * našich členů. Je určen pouze pro osobní užití a nesmí být šířen.
 * Více informací na http://www.itnetwork.cz/licence
 */

import React from "react";
import { Link } from "react-router-dom";
import "../css/PersonTable.css";


const PersonTable = ({ label, items, deletePerson }) => {
    return (
    <div className="table-card">
        <div className="table-card-header">
            <h5 className="table-title">
                {label} <span className="table-badge">{items.length}</span>
            </h5>
        </div>
        <div className="table-card-body">
            <div className="table-scroll">
                <table className="person-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Jméno</th>
                            <th colSpan={3} className="text-center">Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <tr key={item._id || index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Link
                                            to={`/persons/show/${item._id}`}
                                            className="person-link"
                                        >
                                            {item.name}
                                        </Link>
                                    </td>
                                    <td className="text-center">
                                        <div className="action-group">
                                            <Link
                                                to={`/persons/show/${item._id}`}
                                                className="action-btn info"
                                                title="Zobrazit detail"
                                            >
                                                Zobrazit
                                            </Link>
                                            <Link
                                                to={`/persons/edit/${item._id}`}
                                                className="action-btn warn"
                                                title="Upravit osobu"
                                            >
                                                Upravit
                                            </Link>
                                            <button
                                                onClick={() => deletePerson(item._id)}
                                                className="action-btn danger"
                                                title="Smazat osobu"
                                            >
                                                Smazat
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="person-table-empty">
                                    Nebyly nalezeny žádné osoby.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);
};

export default PersonTable;


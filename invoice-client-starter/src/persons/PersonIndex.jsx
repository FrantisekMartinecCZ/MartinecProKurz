import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiDelete, apiGet } from "../utils/api";
import PersonTable from "./PersonTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import FlashMessage from "../components/FlashMessage";
import "../css/PersonIndex.css";

const PersonIndex = () => {
    const [persons, setPersons] = useState([]);
    const [flash, setFlash] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Převzetí flash message ze state po přesměrování
    useEffect(() => {
        if (location.state?.flash) {
            setFlash(location.state.flash);
            // smaž flash ze state, ať se neukáže znovu při refreshi
            navigate(".", { replace: true, state: {} });
        }
    }, [location.state, navigate]);

    // Flash na pár sekund
    useEffect(() => {
        if (flash) {
            const t = setTimeout(() => setFlash(null), 3000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    // Načti osoby
    const loadPersons = () => {
        apiGet("/api/persons")
            .then(setPersons)
            .catch((err) => setPersons([]));
    };

    useEffect(() => {
        loadPersons();
    }, []);

    // Smazání osoby
    const deletePerson = (id) => {
        if (window.confirm("Opravdu chcete smazat osobu?")) {
            apiDelete("/api/persons/" + id)
                .then(() => {
                    setFlash("Osoba byla úspěšně smazána.");
                    loadPersons();
                })
                .catch((err) => {
                    setFlash("Chyba při mazání osoby.");
                    console.error("Chyba při mazání:", err);
                });
        }
    };

    return (
        <div className="container mt-4">
            {flash && <FlashMessage theme="success" text={flash} />}
            <div className="person-index-header">
                <h1 className="person-index-title">Seznam osob</h1>
                <Link to="/persons/create" className="person-index-addbtn">
                    <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: 8 }} />
                    Přidat novou osobu
                </Link>
            </div>
            <div className="person-index-card">
                <div className="person-index-cardbody">
                    <PersonTable
                        deletePerson={deletePerson}
                        items={persons}
                        label="Celkový počet osob:"
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonIndex;

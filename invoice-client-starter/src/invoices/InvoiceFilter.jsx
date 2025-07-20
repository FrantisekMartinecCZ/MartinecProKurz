import React, { useEffect, useState } from "react";
import InputField from "../components/InputField";


// Filtr faktur s možností vyhledávat osoby podle jména i ID
const InvoiceFilter = (props) => {
    const handleSubmit = (e) => props.handleSubmit(e);
    const handleReset = () => props.handleReset();

    // Seznam osob načteme jen zde
    const [persons, setPersons] = useState([]);

    useEffect(() => {
        // Stáhni seznam osob (pokud není)
        fetch("/api/persons")
            .then(res => res.json())
            .then(data => setPersons(data))
            .catch(() => setPersons([]));
    }, []);

    // --- Handler změn pro všechna pole ---
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Pokud uživatel mění jméno, najdi ID podle zadaného jména
        if (name === "buyerName") {
            let person = persons.find(
                (p) => p.name && p.name.toLowerCase() === value.trim().toLowerCase()
            );
            // Pokud najdeme jméno, nastav také buyerId
            props.handleChange({
                target: { name: "buyerId", value: person ? (person.personId || person._id) : "" }
            });
            // Nastav buyerName normálně
            props.handleChange(e);
            return;
        }
        if (name === "sellerName") {
            let person = persons.find(
                (p) => p.name && p.name.toLowerCase() === value.trim().toLowerCase()
            );
            props.handleChange({
                target: { name: "sellerId", value: person ? (person.personId || person._id) : "" }
            });
            props.handleChange(e);
            return;
        }
        // U ostatních polí (ID) můžeš dělat i zpětně převod na jméno, pokud chceš (není nutné)
        if (name === "buyerId") {
            let person = persons.find(
                (p) => String(p.personId || p._id) === value.trim()
            );
            props.handleChange({
                target: { name: "buyerName", value: person ? person.name : "" }
            });
        }
        if (name === "sellerId") {
            let person = persons.find(
                (p) => String(p.personId || p._id) === value.trim()
            );
            props.handleChange({
                target: { name: "sellerName", value: person ? person.name : "" }
            });
        }

        // Ve všech případech pošli původní změnu
        props.handleChange(e);
    };

    const filter = props.filter;

    return (
        <div className="border p-3 rounded mb-4">
            <form onSubmit={handleSubmit}>
                <div className="row g-2 align-items-end">
                    {/* Kupující – jméno */}
                    <div className="col-md">
                      
                        <InputField
                            type="text"
                            name="buyerName"
                            handleChange={handleChange}
                            label="Kupující jméno"
                            value={filter.buyerName || ""}
                        />
                    </div>

                    {/* Prodávající –  jméno */}
                    <div className="col-md">
                        
                        <InputField
                            type="text"
                            name="sellerName"
                            handleChange={handleChange}
                            label="Prodávající jméno"
                            value={filter.sellerName || ""}
                        />
                    </div>

                    <div className="col-md">
                        <InputField
                            type="text"
                            name="product"
                            handleChange={handleChange}
                            label="Produkt"
                            value={filter.product || ""}
                        />
                    </div>
                    <div className="col-md">
                        <InputField
                            type="text"
                            name="minPrice"
                            handleChange={handleChange}
                            label="Min. cena"
                            value={filter.minPrice || ""}
                        />
                    </div>
                    <div className="col-md">
                        <InputField
                            type="text"
                            name="maxPrice"
                            handleChange={handleChange}
                            label="Max. cena"
                            value={filter.maxPrice || ""}
                        />
                    </div>
                    <div className="col-md">
                        <InputField
                            type="text"
                            name="limit"
                            handleChange={handleChange}
                            label="Limit"
                            value={filter.limit || ""}
                        />
                    </div>
                    <div className="col-md-auto">
                        <button type="submit" className="btn btn-primary me-2">
                            {props.confirmText || "Filtrovat"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleReset}
                        >
                            {props.resetText || "Reset"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default InvoiceFilter;

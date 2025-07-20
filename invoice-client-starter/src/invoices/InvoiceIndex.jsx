import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiDelete } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileMedical } from "@fortawesome/free-solid-svg-icons";
import FlashMessage from "../components/FlashMessage";
import { useLocation, useNavigate } from "react-router-dom";

import InvoiceFilter from "./InvoiceFilter";
import InvoiceTable from "./InvoiceTable";
import "../css/InvoiceIndex.css"; // Připojení nového CSS

const InvoiceIndex = () => {
       const location = useLocation();
    const navigate = useNavigate();
    const [flash, setFlash] = useState(location.state?.flash);
useEffect(() => {
        if (flash) {
            const t = setTimeout(() => {
                setFlash(null);
                navigate(".", { replace: true, state: {} });
            }, 3000);
            return () => clearTimeout(t);
        }
    }, [flash, navigate]);

    const [invoices, setInvoices] = useState([]);
    const [filters, setFilters] = useState({
        buyerId: undefined,
        sellerId: undefined,
        product: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        limit: undefined,
    });
    const [showFilter, setShowFilter] = useState(false); // pro mobilní modal

    const handleChange = (e) => {
        const { name, value } = e.target;
        let parsedValue = value;
        if (
            name === "buyerId" ||
            name === "sellerId" ||
            name === "minPrice" ||
            name === "maxPrice" ||
            name === "limit"
        ) {
            parsedValue = value !== "" ? Number(value) : undefined;
            if (value !== "" && isNaN(parsedValue)) {
                parsedValue = undefined;
            }
        } else {
            parsedValue = value !== "" ? value : undefined;
        }
        setFilters((prevFilters) => ({ ...prevFilters, [name]: parsedValue }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loadInvoices();
    };

    const handleResetCorrected = () => {
        setFilters({
            buyerId: undefined,
            sellerId: undefined,
            product: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            limit: undefined,
        });
        setTimeout(() => loadInvoices(), 0);
    };

    const loadInvoices = () => {
        const queryParams = [];
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.push(`${key}=${encodeURIComponent(value)}`);
            }
        });
        let url = "/api/invoices";
        if (queryParams.length > 0) {
            url += `?${queryParams.join("&")}`;
        }
        apiGet(url)
            .then((data) => setInvoices(data))
            .catch((err) => {
                console.error("Chyba při načítání faktur:", err);
                setInvoices([]);
            });
    };

  const handleDelete = (id) => {
    if (window.confirm("Opravdu chcete fakturu smazat?")) {
        apiDelete("/api/invoices/" + id)
            .then(() => {
                // Po smazání nastav flash a načti faktury znova
                setFlash("Faktura byla úspěšně smazána.");
                loadInvoices();
            })
            .catch((err) => {
                setFlash("Chyba při mazání faktury.");
                console.error("Chyba při mazání:", err);
            });
    }
};


    useEffect(() => {
        loadInvoices();
    }, []);

    return (
        <div className="container mt-4">
             {flash && <FlashMessage theme="success" text={flash} />}
            <div className="invoice-index-header">
                <h1 className="invoice-index-title">Seznam faktur</h1>
                <Link to="/invoices/create" className="invoice-index-addbtn">
                    <FontAwesomeIcon icon={faFileMedical} />
                    Vytvořit fakturu
                </Link>
            </div>

            <div className="invoice-index-card">
                <div className="invoice-index-cardbody">

                    {/* Tlačítko pouze na mobilu */}
                    <button
                        className="invoice-mobile-filter-btn"
                        onClick={() => setShowFilter(true)}
                        type="button"
                    >
                        Filtrovat
                    </button>

                    {/* Klasický filtr - pouze na desktopu */}
                    <div className="invoice-filter-desktop">
                        <InvoiceFilter
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            handleReset={handleResetCorrected}
                            filter={filters}
                            confirmText="Filtrovat"
                            resetText="Reset"
                        />
                    </div>

                    {/* Modal s filtrem na mobilu */}
                    {showFilter && (
                        <div
                            className="mobile-filter-overlay"
                            onClick={e => {
                                if (e.target.classList.contains("mobile-filter-overlay")) {
                                    setShowFilter(false);
                                }
                            }}
                        >
                            <div className="mobile-filter-modal">
                                <button
                                    className="mobile-filter-close"
                                    onClick={() => setShowFilter(false)}
                                    type="button"
                                    aria-label="Zavřít"
                                >
                                    ✕
                                </button>
                                <InvoiceFilter
                                    handleChange={handleChange}
                                    handleSubmit={e => { handleSubmit(e); setShowFilter(false); }}
                                    handleReset={handleResetCorrected}
                                    filter={filters}
                                    confirmText="Filtrovat"
                                    resetText="Reset"
                                />
                            </div>
                        </div>
                    )}

                    <hr className="my-4" />

                    <InvoiceTable
                        items={invoices}
                        deleteInvoice={handleDelete}
                        label="Nalezené faktury:"
                    />
                </div>
            </div>
        </div>
    );
};

export default InvoiceIndex;

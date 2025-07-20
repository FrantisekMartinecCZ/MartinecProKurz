// src/invoices/InvoiceForm.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../utils/api";
import InputField from "../components/InputField";
import FlashMessage from "../components/FlashMessage";
import "../css/InvoiceForm.css";

function toInputDateFormat(dateStr) {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.slice(0, 10);
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
        const [d, m, y] = dateStr.split(".");
        return `${y}-${m}-${d}`;
    }
    return dateStr;
}

const InvoiceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [persons, setPersons] = useState([]);
    const [invoice, setInvoice] = useState({
        invoiceNumber: "",
        sellerId: "",
        buyerId: "",
        issued: "",
        dueDate: "",
        product: "",
        price: "",
        vat: "",
        note: "",
    });
    const [sentState, setSent] = useState(false);
    const [successState, setSuccess] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        apiGet("/api/persons")
            .then(setPersons)
            .catch(() => setServerError("Nepodařilo se načíst seznam osob."));

        if (id) {
            apiGet("/api/invoices/" + id).then((data) => {
                setInvoice({
                    invoiceNumber: data.invoiceNumber,
                    sellerId: data.sellerId || data.seller?.personId || data.seller?._id || "",
                    buyerId: data.buyerId || data.buyer?.personId || data.buyer?._id || "",
                    issued: toInputDateFormat(data.issued),
                    dueDate: toInputDateFormat(data.dueDate),
                    product: data.product,
                    price: data.price,
                    vat: data.vat,
                    note: data.note || "",
                });
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInvoice((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
        }
        setServerError(null);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!invoice.invoiceNumber.toString().trim())
            newErrors.invoiceNumber = "Číslo faktury je povinné.";
        else if (!/^\d+$/.test(invoice.invoiceNumber))
            newErrors.invoiceNumber = "Číslo faktury musí být číslo.";

        if (!invoice.sellerId)
            newErrors.sellerId = "Prodávající je povinný.";
        if (!invoice.buyerId)
            newErrors.buyerId = "Kupující je povinný.";

        if (!invoice.issued)
            newErrors.issued = "Datum vystavení je povinné.";
        if (!invoice.dueDate)
            newErrors.dueDate = "Datum splatnosti je povinné.";
        if (invoice.issued && invoice.dueDate && invoice.dueDate < invoice.issued)
            newErrors.dueDate = "Splatnost nesmí být dříve než datum vystavení.";

        if (!invoice.product.trim())
            newErrors.product = "Popis produktu/služby je povinný.";
        else if (invoice.product.length > 200)
            newErrors.product = "Popis může mít maximálně 200 znaků.";

        if (!String(invoice.price).trim())
            newErrors.price = "Cena bez DPH je povinná.";
        else if (isNaN(Number(invoice.price)) || Number(invoice.price) < 1)
            newErrors.price = "Cena musí být kladné číslo.";

        if (!String(invoice.vat).trim())
            newErrors.vat = "DPH je povinné.";
        else if (isNaN(Number(invoice.vat)) || Number(invoice.vat) < 0 || Number(invoice.vat) > 100)
            newErrors.vat = "DPH musí být mezi 0 a 100 %.";

        if (invoice.note && invoice.note.length > 500)
            newErrors.note = "Poznámka může mít maximálně 500 znaků.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            invoiceNumber: String(invoice.invoiceNumber),
            issued: invoice.issued,
            dueDate: invoice.dueDate,
            product: invoice.product,
            price: Number(invoice.price),
            vat: Number(invoice.vat),
            note: invoice.note,
            buyerId: Number(invoice.buyerId),
            sellerId: Number(invoice.sellerId),

            
        };

  (id ? apiPut("/api/invoices/" + id, payload) : apiPost("/api/invoices", payload))
        .then(() => {
            setSent(true);
            setSuccess(true);
            setErrors({});
            setServerError(null);
            navigate("/invoices", {
                state: {
                    flash: id
                        ? "Faktura byla úspěšně upravena."
                        : "Faktura byla úspěšně vytvořena.",
                },
            });
        })
            .catch(async (error) => {
                let errorData = null;
                if (error.response && error.response.data) {
                    errorData = error.response.data;
                } else if (error instanceof Response) {
                    try { errorData = await error.json(); } catch { errorData = null; }
                }
                if (errorData && errorData.errors) {
                    const newErrors = {};
                    for (const key in errorData.errors) {
                        newErrors[key.charAt(0).toLowerCase() + key.slice(1)] = Array.isArray(errorData.errors[key])
                            ? errorData.errors[key][0]
                            : errorData.errors[key];
                    }
                    setErrors(newErrors);
                    setServerError(null);
                } else {
                    setServerError(
                        (errorData && (errorData.message || errorData.title)) ||
                        error.message ||
                        "Došlo k chybě na straně serveru."
                    );
                }
                setSent(true);
                setSuccess(false);
            });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="invoice-form-title">{id ? "Upravit" : "Vytvořit"} fakturu</h1>
                <Link to="/invoices" className="btn btn-outline-secondary">Zpět na seznam</Link>
            </div>

            {serverError && <div className="alert alert-danger">{serverError}</div>}
            {sentState && successState && (
                <FlashMessage
                    theme="success"
                    text="Faktura byla úspěšně uložena."
                />
            )}

            <form onSubmit={handleSubmit}>
                <div className="card invoice-form-card mb-4">
                    <div className="card-header"><h5 className="card-title mb-0">Smluvní strany</h5></div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label className="form-label">
                                Prodávající: <span className="text-danger">*</span>
                            </label>
                            <select name="sellerId" value={invoice.sellerId} onChange={handleChange} required className={`form-control ${errors.sellerId ? 'is-invalid' : ''}`}>
                                <option value="">-- Vyberte osobu --</option>
                                {persons.map((p) => (
                                    <option key={p.personId || p._id} value={p.personId || p._id}>
                                        {p.name} ({p.identificationNumber})
                                    </option>
                                ))}
                            </select>
                            {errors.sellerId && <div className="invalid-feedback">{errors.sellerId}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Kupující: <span className="text-danger">*</span>
                            </label>
                            <select name="buyerId" value={invoice.buyerId} onChange={handleChange} required className={`form-control ${errors.buyerId ? 'is-invalid' : ''}`}>
                                <option value="">-- Vyberte osobu --</option>
                                {persons.map((p) => (
                                    <option key={p.personId || p._id} value={p.personId || p._id}>
                                        {p.name} ({p.identificationNumber})
                                    </option>
                                ))}
                            </select>
                            {errors.buyerId && <div className="invalid-feedback">{errors.buyerId}</div>}
                        </div>
                    </div>
                </div>
                <div className="card invoice-form-card mb-4">
                    <div className="card-header"><h5 className="card-title mb-0">Základní údaje faktury</h5></div>
                    <div className="card-body">
                        <InputField required type="text" name="invoiceNumber" label="Číslo faktury" value={invoice.invoiceNumber} handleChange={handleChange} error={errors.invoiceNumber} disabled={!!id} />
                        {id && (<small className="text-danger d-block mt-n2 mb-3">Číslo faktury nelze upravit.</small>)}
                        <div className="row">
                            <div className="col-md-6">
                                <InputField required type="date" name="issued" label="Datum vystavení" value={invoice.issued} handleChange={handleChange} error={errors.issued} />
                            </div>
                            <div className="col-md-6">
                                <InputField required type="date" name="dueDate" label="Datum splatnosti" value={invoice.dueDate} handleChange={handleChange} error={errors.dueDate} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card invoice-form-card mb-4">
                    <div className="card-header"><h5 className="card-title mb-0">Položky a cena</h5></div>
                    <div className="card-body">
                        <InputField required type="text" name="product" label="Produkt/služba" value={invoice.product} handleChange={handleChange} error={errors.product} />
                        <div className="row">
                            <div className="col-md-6">
                                <InputField required type="number" name="price" label="Cena bez DPH" value={invoice.price} handleChange={handleChange} error={errors.price} />
                            </div>
                            <div className="col-md-6">
                                <InputField required type="number" name="vat" label="DPH (%)" value={invoice.vat} handleChange={handleChange} error={errors.vat} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card invoice-form-card mb-4">
                    <div className="card-header"><h5 className="card-title mb-0">Poznámka</h5></div>
                    <div className="card-body">
                        <textarea name="note" className={`form-control ${errors.note ? "is-invalid" : ""}`} rows="3" value={invoice.note} onChange={handleChange}></textarea>
                        {errors.note && <div className="invalid-feedback">{errors.note}</div>}
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <input type="submit" className="btn btn-submit-invoice" value="Uložit fakturu" />
                </div>
            </form>
        </div>
    );
};

export default InvoiceForm;

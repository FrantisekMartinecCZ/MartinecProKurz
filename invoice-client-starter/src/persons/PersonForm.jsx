import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../utils/api";
import InputField from "../components/InputField";
import InputCheck from "../components/InputCheck";
import FlashMessage from "../components/FlashMessage";
import Country from "./Country";
import "../css/PersonForm.css";

const PersonForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [person, setPerson] = useState({
        name: "",
        identificationNumber: "",
        taxNumber: "",
        accountNumber: "",
        bankCode: "",
        iban: "",
        telephone: "",
        mail: "",
        street: "",
        zip: "",
        city: "",
        country: Country.CZECHIA,
        note: ""
    });

    const [sentState, setSent] = useState(false);
    const [successState, setSuccess] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit) {
            apiGet("/api/persons/" + id).then((data) => setPerson(data));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setPerson((prev) => ({
            ...prev,
            [name]: type === "radio" ? Number(value) : value,
        }));
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
        }
        setServerError(null);
    };

    const validateForm = () => {
        const newErrors = {};
          if (!person.name.trim()) {
        newErrors.name = "Jméno je povinné.";
    } else if (person.name.trim().length > 100) {
        newErrors.name = "Jméno může mít maximálně 100 znaků.";
    }
        if (!person.identificationNumber.trim()) newErrors.identificationNumber = "IČO je povinné.";
        else if (!/^\d{8}$/.test(person.identificationNumber)) newErrors.identificationNumber = "IČO musí mít 8 číslic.";
        if (!person.mail.trim()) newErrors.mail = "E-mail je povinný.";
        else if (!/^[^@]+@[^@]+\.[^@]+$/.test(person.mail)) newErrors.mail = "Neplatný formát e-mailové adresy.";
        if (!person.street.trim()) newErrors.street = "Ulice je povinná.";
        if (!person.zip.trim()) newErrors.zip = "PSČ je povinné.";
        else if (!/^\d{5}$/.test(person.zip)) newErrors.zip = "PSČ musí mít 5 číslic.";
        if (!person.telephone.trim()) newErrors.telephone = "Telefoní číslo je povinné";
        else if (!/^\+\d{3}(?:\s?\d{3}){3}$/.test(person.telephone)) newErrors.telephone ="Telefon musí předvolbu ČR/SK : +420/+421  123123123 / 123 123 123 (bez pomlček).";
        
        if (!person.city.trim()) newErrors.city = "Město je povinné.";
                       
if (person.taxNumber && person.taxNumber.trim()) {
    if (
        !(person.taxNumber.match(/^CZ\d{8,10}$/) || person.taxNumber.match(/^SK\d{10}$/))
    ) {
        newErrors.taxNumber = "DIČ musí být ve formátu CZ12345678 nebo SK1234567890.";
    }
}
        if (!person.accountNumber.trim()) newErrors.accountNumber = "Číslo účtu je povinné.";
        if (!person.bankCode.trim()) newErrors.bankCode = "Kód banky je povinný.";
        else if (!/^\d{4}$/.test(person.bankCode)) newErrors.bankCode = "Kód banky musí mít 4 číslice.";
        if (!person.iban.trim()) newErrors.iban = "IBAN je povinný.";
        else if (person.iban.length > 34) newErrors.iban = "IBAN může mít maximálně 34 znaků.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    (isEdit ? apiPut("/api/persons/" + id, person) : apiPost("/api/persons", person))
        .then(() => {
            setSent(true);
            setSuccess(true);
            setErrors({});
            setServerError(null);
            navigate("/persons", {
                state: {
                    flash: id
                        ? "Osoba byla úspěšně upravena."
                        : "Osoba byla úspěšně vytvořena.",
                },
            });
        })

        .catch(async (error) => {
            let errorData = null;
            if (error.response && error.response.data) {
                errorData = error.response.data;
            } else if (error instanceof Response) {
                try {
                    errorData = await error.json();
                } catch {
                    errorData = null;
                }
            }
            alert(JSON.stringify(errorData, null, 2));
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
                    (errorData && errorData.message) ||
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
                <h1 className="person-form-title">{isEdit ? "Upravit" : "Vytvořit"} osobu</h1>
                <Link to="/persons" className="btn btn-outline-secondary">Zpět na seznam</Link>
            </div>

            {serverError && <div className="alert alert-danger">{serverError}</div>}

     

            <form onSubmit={handleSubmit}>
                <div className="card person-form-card mb-4">
                    <div className="card-header"><h5 className="card-title mb-0">Základní údaje</h5></div>
                    <div className="card-body">
                        <InputField required type="text" name="name" label="Jméno a přijmení / Název firmy" value={person.name} handleChange={handleChange} error={errors.name} />
                        <InputField required type="text" name="identificationNumber" label="IČO" value={person.identificationNumber} handleChange={handleChange} error={errors.identificationNumber} />
                        <InputField type="text" name="taxNumber" label="DIČ" value={person.taxNumber} handleChange={handleChange} error={errors.taxNumber} />
                    </div>
                </div>
                <div className="card person-form-card mb-4">
                    <div className="card-header"><h5 className="card-title mb-0">Kontakt</h5></div>
                    <div className="card-body">
                        <InputField required type="text" name="mail" label="E-mail" value={person.mail} handleChange={handleChange} error={errors.mail} />
                       <InputField required type="text" name="telephone" label="Telefon" value={person.telephone} handleChange={handleChange} error={errors.telephone} />
                    </div>
                </div>
                <div className="card person-form-card mb-4">
                    <div className="card-header"><h5 className="card-title mb-0">Adresa</h5></div>
                    <div className="card-body">
                        <InputField required type="text" name="street" label="Ulice a č. p." value={person.street} handleChange={handleChange} error={errors.street} />
                        <div className="row">
                            <div className="col-md-4">
                                <InputField required type="text" name="zip" label="PSČ" value={person.zip} handleChange={handleChange} error={errors.zip} />
                            </div>
                            <div className="col-md-8">
                                <InputField required type="text" name="city" label="Město" value={person.city} handleChange={handleChange} error={errors.city} />
                            </div>
                        </div>
                        <label className="form-label mt-2">Země</label>
                        <div>
                            <InputCheck type="radio" name="country" label="Česká republika" value={Country.CZECHIA} handleChange={handleChange} checked={String(person.country) === String(Country.CZECHIA)} />
                            <InputCheck type="radio" name="country" label="Slovensko" value={Country.SLOVAKIA} handleChange={handleChange} checked={String(person.country) === String(Country.SLOVAKIA)} />
                        </div>
                    </div>
                </div>
                <div className="card person-form-card mb-4">
                    <div className="card-header"><h5 className="card-title mb-0">Bankovní spojení</h5></div>
                    <div className="card-body">
                        <InputField required type="text" name="accountNumber" label="Číslo účtu" value={person.accountNumber} handleChange={handleChange} error={errors.accountNumber} />
                        <InputField required type="text" name="bankCode" label="Kód banky" value={person.bankCode} handleChange={handleChange} error={errors.bankCode} />
                        <InputField required type="text" name="iban" label="IBAN" value={person.iban} handleChange={handleChange} error={errors.iban} />
                    </div>
                </div>
                <div className="card person-form-card mb-4">
                    <div className="card-header"><h5 className="card-title mb-0">Poznámka</h5></div>
                    <div className="card-body">
                        <textarea name="note" className="form-control" rows="3" value={person.note} onChange={handleChange}></textarea>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <input type="submit" className="btn btn-submit-person" value="Uložit" />
                </div>
           
            </form>
        </div>
    );
};

export default PersonForm;

import React from "react";

/**

 *
 * @param {object} props Vstupní vlastnosti komponenty.
 * @param {string} props.label Text, který se zobrazí v popisku pole (<label>).
 * @param {string} props.name Interní název pole, použitý pro 'name' a 'id' atributy. Musí být unikátní v rámci formuláře.
 * @param {string} [props.type="text"] Typ pole (např. "text", "email", "password", "number").
 * @param {string|number} props.value Aktuální hodnota pole, řízená stavem z rodičovské komponenty.
 * @param {function} props.handleChange Funkce, která se zavolá při změně hodnoty v poli.
 * @param {string} [props.error] Chybová hláška pro validaci. Pokud je předána, pole se označí jako neplatné.
 * @param {boolean} [props.required=false] Zda je pole povinné (zobrazí se hvězdička).
 * @param {boolean} [props.disabled=false] Zda je pole neaktivní.
 * @param {string} [props.placeholder] Zástupný text (našeptávač) v poli.
 */
const InputField = (props) => {
    // Destrukturace props pro lepší čitelnost a definici výchozích hodnot.
    const {
        label,
        name,
        type = "text",
        value,
        handleChange,
        error,
        required = false,
        disabled = false,
        placeholder = "" // Přejmenováno z 'prompt' na standardní 'placeholder'
    } = props;

    // Dynamicky sestavíme třídy pro input. Pokud existuje 'error', přidáme Bootstrap třídu 'is-invalid'.
    const inputClassName = `form-control ${error ? 'is-invalid' : ''}`;

    return (
        // Místo 'form-group' (starší Bootstrap) používáme jen 'mb-3' (Bootstrap 5) pro vertikální odsazení.
        <div className="mb-3">
            {/* 'htmlFor' je svázán s 'id' inputu pro lepší přístupnost (kliknutí na label aktivuje pole). */}
            <label htmlFor={name} className="form-label">
                {label}
                {/* Pokud je pole povinné, zobrazíme červenou hvězdičku. */}
                {required && <span className="text-danger">*</span>}
            </label>

            <input
                id={name}
                type={type}
                name={name}
                className={inputClassName}
                value={value || ""} // Pojistka, aby hodnota nebyla nikdy null/undefined, což by způsobilo chybu v Reactu.
                onChange={handleChange}
                disabled={disabled}
                placeholder={placeholder}
            />
            
            {/* Tento blok se zobrazí POUZE tehdy, pokud je vlastnost 'error' "pravdivá" (není prázdná, null ani undefined). */}
            {/* Třída 'invalid-feedback' je standardní Bootstrap třída pro zobrazení validační chyby. */}
            {error && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}
        </div>
    );
};

export default InputField;
/* _____ _______         _           _
 * |_   _|__   __|       | |         | |
 * | |     | | '_ \ / _ \ __\ \ /\ / / _ \| '__| |/ / / __|_  /
 * | |     | | | | |  __/ |_ \ V  V / (_) | |  |  < | (__ / /
 * _| |_     | | | | |  __/ |_ \ V  V / (_) | |  |  < | (__ / /
 * |_____|    |_|_| |_|\___|\__| \_/\_/ \___/|_|  |_|\_(_)___/___|
 *
 * _
 * ___ ___ ___ _____|_|_ _ _____
 * | . |_| -_|     | | | |     |  LICENCE
 * | _|_| |___|_|_|_|_|___|_|_|_|
 * |_|
 *
 * PROGRAMOVÁNÍ  <>  DESIGN  <>  PRÁCE/PODNIKÁNÍ  <>  HW A SW
 *
 * Tento zdrojový kód je součástí výukových seriálů na
 * IT sociální síti WWW.ITNETWORK.CZ
 *
 * Kód spadá pod licenci prémiového obsahu a vznikl díky podpoře
 * našich členů. Je určen pouze pro osobní užití a nesmí být šířen.
 * Více informací na http://www.itnetwork.cz/licence
 */

// Tento řádek definuje základní URL adresu vašeho API.
// Pokud váš server běží například na "http://localhost:5000",
// měli byste sem tuto adresu vložit. Pokud je aplikace spouštěna
// na stejném serveru, jako API, může zůstat prázdná (relativní cesty).
const API_URL = ""; 
// --- Hlavní pomocná funkce pro odesílání HTTP požadavků ---
// Tato funkce je srdcem komunikace s API. Obaluje nativní funkci 'fetch'
// a přidává do ní logiku pro zpracování chyb a různých typů odpovědí.
const fetchData = (url, requestOptions) => {
    // Vytvoří kompletní URL pro požadavek. Spojí základní 'API_URL'
    // s konkrétní cestou, kterou dostane jako argument 'url'.
    const apiUrl = `${API_URL}${url}`; // Správně spojí základní API URL s relativní URL

    // Použije nativní funkci 'fetch' k odeslání HTTP požadavku.
    // 'fetch' vrací Promise, což je objekt pro asynchronní operace.
    return fetch(apiUrl, requestOptions)
        .then((response) => {
            // První '.then' blok se spustí, jakmile server odpoví (i když s chybou HTTP, např. 404 nebo 500).
            // 'response.ok' je true pro stavové kódy 200-299, jinak false.
            if (!response.ok) {
                // Pokud odpověď není úspěšná, přečteme text chyby ze serveru.
                // To je důležité pro lepší diagnostiku, protože server může poslat
                // specifickou chybovou zprávu v těle odpovědi.
                return response.text().then(errorText => {
                    console.error("Chyba ze serveru:", errorText); // Vypíše chybu ze serveru do konzole.
                    // Vytvoří a vyhodí novou chybu, která bude obsahovat stavový kód, text stavu
                    // a detailní chybovou zprávu ze serveru. Tuto chybu pak zachytí další '.catch'.
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Detail: ${errorText}`);
                });
            }

            // Pokud je metoda požadavku 'DELETE', a odpověď je úspěšná,
            // vrátíme prázdný objekt. Mnoho DELETE operací na serveru
            // nevrací žádné smysluplné tělo odpovědi (jen potvrdí smazání).
            if (requestOptions.method === 'DELETE') {
                return {};
            }
            // Pro všechny ostatní úspěšné requesty (GET, POST, PUT),
            // parsujeme tělo odpovědi jako JSON. 'response.json()' také vrací Promise.
            return response.json();
        })
        .catch((error) => {
            // Tento '.catch' blok zachytí jakékoli chyby, které nastaly během 'fetch'
            // (např. problém se sítí, nebo chyby vyhozené v předchozích '.then' blocích).
            console.error("Došlo k chybě při fetchData:", error); // Loguje chybu pro ladění.
            throw error; // Znovu vyhodí chybu, aby ji mohl zachytit kód, který volal 'fetchData'.
        });
};

// --- Exportované funkce pro specifické typy HTTP požadavků ---

// Funkce pro odesílání GET požadavků. Používá se pro načítání dat.
// 'url' je relativní cesta k API endpointu (např. "/api/invoices").
// 'params' je objekt s parametry, které se mají přidat do URL jako query string.
export const apiGet = (url, params) => {
    // 'URLSearchParams' je vestavěný JavaScriptový objekt pro snadnou práci s parametry URL.
    const queryParams = new URLSearchParams();

    // Projdeme všechny klíče a hodnoty v objektu 'params'.
    // Filtr: Přidáme pouze parametry, které nejsou 'undefined', 'null' nebo prázdný řetězec.
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            // Přidáme klíč a hodnotu k URLSearchParams.
            // '.toString()' je zde explicitně použito pro jistotu, i když URLSearchParams to často zvládne samo.
            queryParams.append(key, value.toString());
        }
    });

    let fullUrl = url;
    // Pokud existují nějaké parametry (tj. 'queryParams.toString()' není prázdný řetězec),
    // přidáme je k URL za otazník.
    if (queryParams.toString()) {
        fullUrl += `?${queryParams.toString()}`;
    }

    // Definujeme možnosti pro 'fetch' požadavek. Zde pouze metoda GET.
    const requestOptions = {
        method: "GET",
    };

    // Pro ladění: vypíše finální URL, která se bude volat.
    console.log("Generovaná GET URL:", fullUrl);

    // Zavolá hlavní 'fetchData' funkci a vrátí její Promise.
    return fetchData(fullUrl, requestOptions);
};

// Funkce pro odesílání POST požadavků. Používá se pro vytváření nových dat.
// 'url' je relativní cesta, 'data' je objekt, který se má odeslat v těle požadavku.
export const apiPost = (url, data) => {
    const requestOptions = {
        method: "POST", // Metoda POST.
        headers: { "Content-Type": "application/json" }, // Hlavička oznamující serveru, že posíláme JSON.
        body: JSON.stringify(data), // Tělo požadavku je JSON string z dat.
    };

    return fetchData(url, requestOptions);
};

// Funkce pro odesílání PUT požadavků. Používá se pro aktualizaci existujících dat.
// Funguje velmi podobně jako 'apiPost'.
export const apiPut = (url, data) => {
    const requestOptions = {
        method: "PUT", // Metoda PUT.
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

// Funkce pro odesílání DELETE požadavků. Používá se pro mazání dat.
// 'url' je relativní cesta k API endpointu pro smazání konkrétní položky.
export const apiDelete = (url) => {
    const requestOptions = {
        method: "DELETE", // Metoda DELETE.
    };

    return fetchData(url, requestOptions);
};


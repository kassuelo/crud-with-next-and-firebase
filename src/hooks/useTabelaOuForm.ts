import { useState } from "react";
export default function useTabelaOuForm() {
    const [visivel, setVisivel] = useState<"tabela" | "form">("tabela");

    function exibirTabela() {
        setVisivel("tabela");
    }
    function exibirFormulario() {
        setVisivel("form");
    }

    return {
        formularioVisivel: visivel === "form",
        tabelaVisivel: visivel === "tabela",
        exibirFormulario,
        exibirTabela,
    };
}

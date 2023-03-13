import imageError from "../../files/404page.png"
import React from "react";


export default function NoPage() {

    return (
        <div>
            <h1>Page non trouvée</h1>
            <img src={imageError} alt="imgErreur" width="600" height="600"></img>
        </div>
    );
}
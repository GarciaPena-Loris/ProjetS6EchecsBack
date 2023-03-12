import imageError from "../../files/404page.png"
import React from "react";


export default function NoPage() {

    return (
        <div>
            <img src={imageError} alt="imgErreur" width="600" height="600"></img>
        </div>
    );
}
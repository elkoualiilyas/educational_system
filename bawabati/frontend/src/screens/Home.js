import React from "react";
import { Alert, Button } from "react-bootstrap";

function Home() {
  return (
    <Alert variant="info" className="text-center">
      <h1>Bienvenue sur E-Vente</h1>
      <p>Nous mettons à votre disposition une large catégorie de produits.</p>
      <Button variant="primary" href="/products">
        Voir nos produits
      </Button>
    </Alert>
  );
}

export default Home;

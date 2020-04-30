import React from 'react';
import classes from './Privacy.css';

const privacy = (props) => (
    <div className={classes.Confirm}>
        <h1>Informativa sulla privacy di Emozionalmente</h1>
        <p>In vigore dal 1° marzo 2020</p>
        <h2>Privacy</h2>
        <p>Quando Emozionalmente, i3Lab e Politecnico di Milano (noi) ricevono tue informazioni, queste vengono gestite come segue.</p>
        <ul>
            <li>Dati demografici. Puoi inviarci informazioni relative alla tua nazionalità, età anagrafica e sesso. Tali informazioni ci aiutano a creare e migliorare strumenti e tecnologia di riconoscimento vocale e delle emozioni.</li>
            <li>Dati dell'account. Per usare Emozionalmente non è necessario creare un account. Se decidi di contribuire, dovrai creare un account. Il tuo indirizzo e-mail viene associato ai tuoi dati demografici e alle tue interazioni, ma non viene condiviso pubblicamente. Vengono visualizzati dei tabelloni che riportano il numero di registrazioni effettuate dagli utenti. Puoi eliminare il tuo account in qualsiasi momento; in tal caso, il tuo indirizzo e-mail verranno rimossi.</li>
            <li>Newsletter. Se scegli di registrarti a Emozionalmente, riceveremo il tuo indirizzo e-mail. Il tuo indirizzo e-mail potrebbe essere utilizzato per comunicazioni a proposito del progetto Emozionalmente e per darti informazioni relative al tuo account. </li>
            <li>Registrazioni vocali. Le registrazioni vocali, insieme ai dati demografici, possono essere resi disponibili nel database di Emozionalmente per il pubblico uso e consumo. </li>
            <li>Testo. Se invii frasi scritte, anch'esse possono essere rese disponibili nel database di Emozionalmente per il pubblico uso e consumo, in accordo a tutti i nostri campioni. Tali frasi non verranno associate ai dati demografici da te inviati.), in accordo a tutti i nostri campioni. Tali frasi non verranno associate ai dati demografici da te inviati.</li>
            <li>Dati relativi alle interazioni. Durante la navigazione, cerchiamo di comprendere come i nostri utenti interagiscono con l'app Emozionalmente o con il sito Web. Ad esempio, possiamo utilizzare i cookie per tracciare informazioni non identificabili, come il numero di campioni vocali registrati o ascoltati, le interazioni con i pulsanti e i menu e la durata delle sessioni.</li>
            <li>Dati tecnici. Cerchiamo di comprendere come interagisci con l'app Emozionalmente o con il sito web. Ad esempio, possiamo utilizzare i cookie per tenere traccia di informazioni deidentificate, come il numero di campioni vocali che hai registrato o ascoltato, le interazioni con i pulsanti e i menu e la durata delle sessioni. Raccogliamo inoltre dati su URL e titolo delle pagine Emozionalmente da te visitate. Per continuare a migliorare l'esperienza Emozionalmente, raccogliamo informazioni sul tipo di browser utilizzato e sulla versione, sulle dimensioni del viewport e sulla risoluzione dello schermo. Tali dati ci consentono di comprendere come le persone interagiscono con Emozionalmente, per continuare a migliorare il progetto. Raccogliamo inoltre informazioni sulla tua posizione e sull'impostazione della lingua del tuo browser, per ottimizzare la tua esperienza con Emozionalmente.</li>
        </ul>
    </div>
);

export default privacy;
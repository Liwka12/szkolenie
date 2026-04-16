
document.addEventListener('DOMContentLoaded', () => {
    
    const API_URL = 'https://apichat.m89.pl/api/messages';


    const btnWejdz = document.getElementById('btn-wejdz');
    const inputNick = document.getElementById('input-nick');
    const sekcjaLogowania = document.getElementById('sekcja-logowania');
    const sekcjaCzatu = document.getElementById('sekcja-czatu');
    const powitanie = document.getElementById('powitanie');
    const oknoWiadomosci = document.getElementById('okno-wiadomosci');
    const formularzWiadomosci = document.getElementById('formularz-wiadomosci');
    const inputWiadomosc = document.getElementById('input-wiadomosc');
    const btnWyloguj = document.getElementById('btn-wyloguj');

    async function pobierzWiadomosci() {
        try {
            const res = await fetch(API_URL);
            const dane = await res.json();
            
            oknoWiadomosci.innerHTML = '';
            
            dane.forEach(wpis => {
                const div = document.createElement('div');
                div.className = 'msg-item';

                div.innerHTML = `<strong>${wpis.author || 'Anonim'}:</strong> ${wpis.text || wpis.message || ''}`;
                oknoWiadomosci.appendChild(div);
            });
            
            oknoWiadomosci.scrollTop = oknoWiadomosci.scrollHeight;
        } catch (err) {
            console.error("Błąd pobierania:", err);
        }
    }

    function pokazCzat(nick) {
        sekcjaLogowania.classList.add('hidden');
        sekcjaCzatu.classList.remove('hidden');
        powitanie.innerText = `Cześć, ${nick}!`;
        
        pobierzWiadomosci();
        // Zadanie: Odświeżanie co 3 sekundy
        setInterval(pobierzWiadomosci, 3000);
    }

    btnWejdz.addEventListener('click', () => {
        const nick = inputNick.value.trim();
        if (nick) {
            localStorage.setItem('shoutboxNick', nick);
            pokazCzat(nick);
        } else {
            alert("Podaj swój nick!");
        }
    });

    formularzWiadomosci.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        const nowaWiadomosc = {
            author: localStorage.getItem('shoutboxNick'),
            text: inputWiadomosc.value
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nowaWiadomosc)
            });

            if (response.ok) {
                inputWiadomosc.value = ''; 
                pobierzWiadomosci(); 
            }
        } catch (err) {
            console.error("Błąd wysyłania:", err);
            alert("Nie udało się wysłać wiadomości.");
        }
    });

    btnWyloguj.addEventListener('click', () => {
        localStorage.removeItem('shoutboxNick');
        location.reload();
    });


    const zapisanyNick = localStorage.getItem('shoutboxNick');
    if (zapisanyNick) {
        pokazCzat(zapisanyNick);
    }
});
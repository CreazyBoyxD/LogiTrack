import React from 'react';

const TermsAndConditions = () => (
  <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Warunki Korzystania</h2>
      <p className="text-gray-600 mb-6">Oto warunki korzystania z naszej strony internetowej. Prosimy o uważne zapoznanie się z nimi.</p>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">1. Rejestracja i Konto</h3>
          <p className="text-gray-600"><strong>1.1.</strong> Aby korzystać z pełnych funkcji naszej strony, musisz zarejestrować konto, podając prawdziwe i dokładne informacje.</p>
          <p className="text-gray-600"><strong>1.2.</strong> Jesteś odpowiedzialny za utrzymanie poufności swojego hasła i konta oraz za wszelkie działania, które mają miejsce na Twoim koncie.</p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">2. Śledzenie Dostaw</h3>
          <p className="text-gray-600"><strong>2.1.</strong> Nasza strona umożliwia śledzenie dostaw w czasie rzeczywistym. Dokładamy wszelkich starań, aby informacje były dokładne, jednak nie możemy zagwarantować ich pełnej dokładności.</p>
          <p className="text-gray-600"><strong>2.2.</strong> Użytkownik jest odpowiedzialny za regularne sprawdzanie statusu swoich dostaw i podejmowanie odpowiednich działań w razie potrzeby.</p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">3. Zarządzanie Magazynem</h3>
          <p className="text-gray-600"><strong>3.1.</strong> Funkcje zarządzania magazynem są dostępne tylko dla użytkowników z odpowiednimi uprawnieniami (admin lub magazynier).</p>
          <p className="text-gray-600"><strong>3.2.</strong> Użytkownik jest odpowiedzialny za dokładność i aktualność danych wprowadzanych do systemu zarządzania magazynem.</p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">4. Odpowiedzialność</h3>
          <p className="text-gray-600"><strong>4.1.</strong> Nie ponosimy odpowiedzialności za jakiekolwiek straty lub szkody wynikające z korzystania z naszej strony internetowej.</p>
          <p className="text-gray-600"><strong>4.2.</strong> Użytkownik korzysta z naszej strony na własne ryzyko. Dokładamy wszelkich starań, aby strona była bezpieczna i wolna od błędów, jednak nie możemy tego zagwarantować.</p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">5. Prywatność</h3>
          <p className="text-gray-600"><strong>5.1.</strong> Szanujemy Twoją prywatność i zobowiązujemy się do ochrony Twoich danych osobowych zgodnie z naszą Polityką Prywatności.</p>
          <p className="text-gray-600"><strong>5.2.</strong> Użytkownik zgadza się na przetwarzanie swoich danych osobowych zgodnie z naszą Polityką Prywatności.</p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">6. Zmiany Warunków</h3>
          <p className="text-gray-600"><strong>6.1.</strong> Zastrzegamy sobie prawo do zmiany tych warunków w dowolnym momencie. Zmiany będą publikowane na naszej stronie internetowej.</p>
          <p className="text-gray-600"><strong>6.2.</strong> Kontynuowanie korzystania z naszej strony po wprowadzeniu zmian oznacza akceptację nowych warunków.</p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">7. Kontakt</h3>
          <p className="text-gray-600"><strong>7.1.</strong> Jeśli masz jakiekolwiek pytania dotyczące tych warunków, skontaktuj się z nami za pomocą formularza kontaktowego dostępnego na naszej stronie.</p>
        </div>
      </div>
    </div>
  </div>
);

export default TermsAndConditions;
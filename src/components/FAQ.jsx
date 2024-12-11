import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'Jak zarejestrować konto?',
      answer: 'Aby zarejestrować konto, kliknij na link "Rejestracja" w nagłówku. Wypełnij formularz rejestracyjny podając nazwę użytkownika, email i hasło. Po przesłaniu formularza otrzymasz email z potwierdzeniem. Postępuj zgodnie z instrukcjami w emailu, aby zakończyć rejestrację.'
    },
    {
      question: 'Jak mogę śledzić moje dostawy?',
      answer: 'Po zalogowaniu się, przejdź do strony "Śledzenie Dostaw" z nagłówka. Zobaczysz listę swoich dostaw wraz z ich aktualnym statusem i szacowanym czasem dostawy. Możesz również zobaczyć trasy dostaw na mapie.'
    },
    {
      question: 'Co zrobić, jeśli zapomnę hasła?',
      answer: 'Jeśli zapomnisz hasła, kliknij na link "Logowanie" w nagłówku, a następnie kliknij na link "Zapomniałeś hasła". Wprowadź swój zarejestrowany adres email, a my wyślemy Ci instrukcje, jak zresetować hasło.'
    },
    {
      question: 'Jak mogę zarządzać stanem magazynowym?',
      answer: 'Jeśli masz odpowiednią rolę (admin lub magazynier), możesz zarządzać stanem magazynowym, przechodząc do strony "Zarządzanie Magazynem". Tutaj możesz dodawać nowe produkty, aktualizować szczegóły istniejących produktów i usuwać produkty z magazynu.'
    },
    {
      question: 'Jak skontaktować się z obsługą klienta?',
      answer: 'Jeśli potrzebujesz pomocy, możesz skontaktować się z naszym zespołem obsługi klienta, klikając na link "Kontakt" w stopce. Wypełnij formularz kontaktowy ze swoim zapytaniem, a nasz zespół wsparcia skontaktuje się z Tobą jak najszybciej.'
    }
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Najczęściej Zadawane Pytania</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <button
                className="w-full text-left text-xl font-semibold text-gray-800 focus:outline-none flex justify-between items-center"
                onClick={() => toggleAccordion(index)}
              >
                {faq.question}
                <span className={`transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                  ▼
                </span>
              </button>
              <div
                className={`mt-2 text-gray-600 overflow-hidden transition-max-height duration-300 ease-in-out ${activeIndex === index ? 'max-h-screen' : 'max-h-0'}`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
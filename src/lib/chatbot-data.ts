import { PHONE_NUMBER, PHONE_NUMBER_RAW, EMAIL, WHATSAPP_NUMBER, ADDRESS_FULL, GOOGLE_MAPS_URL, ADMISSIONS_FORM_URL } from "./constants";

export interface ChatQA {
  question: string;
  answer: string;
}

export const chatbotQA: ChatQA[] = [
  {
    question: "What age groups do you accept?",
    answer:
      "We welcome children across four programs:\n• Toddlers — 1.5 to 2.5 years\n• Montessori 1 — 3 to 4 years\n• Montessori 2 — 4 to 5 years\n• Montessori 3 — 5 years and above",
  },
  {
    question: "What is the admission process?",
    answer: `Our admission process is simple:\n1. Fill out the application form\n2. Schedule a school visit\n3. Receive your admission letter\n4. Begin onboarding!\n\n<a href="${ADMISSIONS_FORM_URL}" target="_blank" rel="noopener noreferrer" class="underline font-medium">Apply Now →</a>`,
  },
  {
    question: "What are the school timings?",
    answer:
      "Our school timings are:\n• Toddlers, Montessori 1 & 2 — 9:00 AM to 12:30 PM\n• Montessori 3 — 9:00 AM to 2:30 PM\n• Daycare — 9:00 AM to 5:30 PM",
  },
  {
    question: "Do you provide transport?",
    answer:
      "Yes! We have our own transport fleet operating since 2017, covering major areas around Manikonda and Lanco Hills.",
  },
  {
    question: "Where are you located?",
    answer: `📍 ${ADDRESS_FULL}\n\n<a href="${GOOGLE_MAPS_URL}" target="_blank" rel="noopener noreferrer" class="underline font-medium">View on Google Maps →</a>`,
  },
  {
    question: "How can I contact you?",
    answer: `You can reach us through:\n\n📞 <a href="tel:${PHONE_NUMBER_RAW}" class="underline font-medium">${PHONE_NUMBER}</a>\n\n📧 <a href="mailto:${EMAIL}" class="underline font-medium">${EMAIL}</a>\n\n💬 <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" class="underline font-medium">Chat on WhatsApp</a>`,
  },
];

export const FALLBACK_MESSAGE = `For any other queries, feel free to reach out:\n\n📞 <a href="tel:${PHONE_NUMBER_RAW}" class="underline font-medium">${PHONE_NUMBER}</a>\n📧 <a href="mailto:${EMAIL}" class="underline font-medium">${EMAIL}</a>\n💬 <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" class="underline font-medium">WhatsApp</a>`;

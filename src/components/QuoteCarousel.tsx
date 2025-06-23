import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

// Quotes related to halal investing & avoiding riba
const QUOTES: Array<{
  type: "Quran" | "Hadith";
  arabic?: string;
  translation: string;
  reference: string;
}> = [
  {
    type: "Quran",
    arabic: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا",
    translation: "But Allah has permitted trade and forbidden interest.",
    reference: "Surah Al-Baqarah (2:275)"
  },
  {
    type: "Quran",
    arabic: "يَمْحَقُ اللَّهُ الرِّبَا وَيُرْبِي الصَّدَقَاتِ ۗ وَاللَّهُ لَا يُحِبُّ كُلَّ كَفَّارٍ أَثِيمٍ",
    translation: "Allah destroys interest and gives increase for charities. And Allah does not like every sinning disbeliever.",
    reference: "Surah Al-Baqarah (2:276)"
  },
  {
    type: "Quran",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَذَرُوا مَا بَقِيَ مِنَ الرِّبَا إِن كُنتُم مُّؤْمِنِينَ",
    translation: "O you who have believed, fear Allah and give up what remains of interest, if you should be believers.",
    reference: "Surah Al-Baqarah (2:278)"
  },
  {
    type: "Quran",
    arabic: "فَإِن لَّمْ تَفْعَلُوا فَأْذَنُوا بِحَرْبٍ مِّنَ اللَّهِ وَرَسُولِهِ",
    translation: "If you do not give up interest, then be informed of a war from Allah and His Messenger.",
    reference: "Surah Al-Baqarah (2:279)"
  },
  {
    type: "Quran",
    arabic: "وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ",
    translation: "And establish weight in justice and do not make deficient the balance.",
    reference: "Surah Ar-Rahman (55:9)"
  },
  {
    type: "Quran",
    arabic: "وَلَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ",
    translation: "Do not consume one another's wealth unjustly.",
    reference: "Surah Al-Baqarah (2:188)"
  },
  {
    type: "Quran",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ إِلَّا أَن تَكُونَ تِجَارَةً عَن تَرَاضٍ مِّنكُمْ",
    translation: "O you who have believed, do not consume one another's wealth unjustly but only [in lawful] business by mutual consent.",
    reference: "Surah An-Nisa (4:29)"
  },
  {
    type: "Hadith",
    translation: "The Messenger of Allah cursed the one who consumes riba, the one who pays it, the one who records it, and the witnesses. He said: 'They are all the same.'",
    reference: "Sahih Muslim 1598"
  },
  {
    type: "Hadith",
    translation: "The honest, trustworthy merchant will be with the Prophets, the truthful, and the martyrs.",
    reference: "Sunan al-Tirmidhi 1209 (Sahih)"
  },
  {
    type: "Hadith",
    translation: "If both parties (buyer and seller) speak the truth and disclose defects, their transaction will be blessed. But if they lie or hide defects, the blessing will be erased.",
    reference: "Sahih al-Bukhari 2079"
  },
  {
    type: "Hadith",
    translation: "What is lawful is clear, and what is unlawful is clear, and between them are matters that are doubtful. Whoever avoids the doubtful has protected his religion and his honor.",
    reference: "Sahih al-Bukhari 52, Sahih Muslim 1599"
  },
  {
    type: "Hadith",
    translation: "Indeed, Allah is pure and only accepts that which is pure.",
    reference: "Sahih Muslim 1015"
  }
];

export const QuoteCarousel = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);

  // Auto-rotate every 10 seconds
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <Carousel
      className="mt-6 font-sans"
      opts={{ 
        align: "center", 
        loop: true,
        direction: 'ltr' // Ensure carousel navigation works left-to-right
      }}
      setApi={setApi}
    >
      <CarouselContent>
        {QUOTES.map((q, idx) => (
          <CarouselItem
            key={idx}
            className="flex justify-center px-4 md:px-8"
          >
            <div
              className="max-w-xl w-full bg-gray-100 dark:bg-slate-800/80 rounded-lg px-6 py-4 text-center select-none transition-colors"

            >
              {q.arabic && (
                <div dir="rtl" className="mb-2">
                  <p className="text-lg leading-tight text-gray-800 dark:text-gray-200">
                    {q.arabic}
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-snug">
                  {q.translation}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {q.reference}
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default QuoteCarousel;


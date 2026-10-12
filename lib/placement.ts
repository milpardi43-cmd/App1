export type PlacementLanguage = 'en' | 'de';

export type PlacementQuestion = {
  id: string;
  language: PlacementLanguage;
  levelId: number;
  sourceLessonId: string;
  dimension: 'meaning' | 'detail' | 'inference';
  passage: string;
  prompt: string;
  choices: readonly string[];
  answerIndex: number;
};

export type PlacementLevelScore = {
  levelId: number;
  correct: number;
  total: number;
  meetsScreeningThreshold: boolean;
};

export type PlacementResult = {
  language: PlacementLanguage;
  questionCount: number;
  correctCount: number;
  answeredCount: number;
  unknownCount: number;
  recommendedLevelId: number;
  perLevel: PlacementLevelScore[];
  nonMonotonicPattern: boolean;
};

/**
 * Short, offline reading-and-meaning screen built from lessons already in the
 * course. It does not claim CEFR certification or test listening/speaking/writing.
 */
export const PLACEMENT_QUESTION_BANK: Record<PlacementLanguage, readonly PlacementQuestion[]> = {
  en: [
    {
      id: 'en-foundation-name', language: 'en', levelId: 0, sourceLessonId: 'foundation-introducing-yourself', dimension: 'meaning',
      passage: 'Hello, my name is Sara. What is your name?', prompt: 'کدام جمله پاسخ مناسبی به پرسش نام است؟',
      choices: ['I live near the station.', 'My name is Leila.', 'It costs three dollars.'], answerIndex: 1,
    },
    {
      id: 'en-foundation-help', language: 'en', levelId: 0, sourceLessonId: 'foundation-asking-for-help', dimension: 'meaning',
      passage: 'Can you help me?', prompt: 'گوینده چه درخواستی دارد؟',
      choices: ['قیمت چیزی را می‌پرسد.', 'زمان حرکت را می‌پرسد.', 'کمک می‌خواهد.'], answerIndex: 2,
    },
    {
      id: 'en-foundation-price', language: 'en', levelId: 0, sourceLessonId: 'foundation-buying-something', dimension: 'detail',
      passage: 'How much is this?', prompt: 'گوینده دربارهٔ چه چیزی سؤال می‌کند؟',
      choices: ['قیمت.', 'ساعت.', 'مسیر.'], answerIndex: 0,
    },
    {
      id: 'en-survival-rent', language: 'en', levelId: 1, sourceLessonId: 'survival-renting-a-home', dimension: 'detail',
      passage: 'The minimum stay is six months.', prompt: 'کمترین مدت اقامت چقدر است؟',
      choices: ['یک هفته.', 'یک سال.', 'شش ماه.'], answerIndex: 2,
    },
    {
      id: 'en-survival-email', language: 'en', levelId: 1, sourceLessonId: 'survival-personal-information', dimension: 'meaning',
      passage: 'What is your email address?', prompt: 'گوینده کدام اطلاعات را می‌خواهد؟',
      choices: ['نام کوچک.', 'نشانی ایمیل.', 'نشانی خانه.'], answerIndex: 1,
    },
    {
      id: 'en-survival-work', language: 'en', levelId: 1, sourceLessonId: 'survival-job-interview', dimension: 'inference',
      passage: 'I can help customers and answer questions.', prompt: 'گوینده کدام توانایی را بیان می‌کند؟',
      choices: ['کمک به مشتریان و پاسخ‌دادن به پرسش‌ها.', 'تغییر ساعت کاری دیگران.', 'تعمیر وسایل خانه.'], answerIndex: 0,
    },
    {
      id: 'en-everyday-devise', language: 'en', levelId: 2, sourceLessonId: 'everyday-making-a-plan', dimension: 'meaning',
      passage: 'We need to devise a better plan.', prompt: 'در این جمله devise نزدیک‌ترین معنی را به کدام واژه دارد؟',
      choices: ['رهاکردن.', 'طراحی یا تهیه‌کردن.', 'پنهان‌کردن.'], answerIndex: 1,
    },
    {
      id: 'en-everyday-tact', language: 'en', levelId: 2, sourceLessonId: 'everyday-handling-a-misunderstanding', dimension: 'inference',
      passage: 'We should discuss this with tact.', prompt: 'گوینده پیشنهاد می‌کند چگونه گفت‌وگو کنند؟',
      choices: ['با صدای بلند.', 'با عجله و بی‌توجهی.', 'با ملاحظه و سنجیدگی.'], answerIndex: 2,
    },
    {
      id: 'en-everyday-abandon', language: 'en', levelId: 2, sourceLessonId: 'everyday-facing-a-challenge', dimension: 'meaning',
      passage: 'We may have to abandon our plan.', prompt: 'احتمالاً چه کاری باید انجام دهند؟',
      choices: ['از برنامه دست بکشند.', 'برنامه را زودتر شروع کنند.', 'جزئیات بیشتری به برنامه اضافه کنند.'], answerIndex: 0,
    },
    {
      id: 'en-communication-majority', language: 'en', levelId: 3, sourceLessonId: 'communication-university-discussion', dimension: 'meaning',
      passage: 'The majority of students support the idea.', prompt: 'majority در این جمله به چه معناست؟',
      choices: ['هیچ‌یک از افراد.', 'دقیقاً دو نفر.', 'بیشترِ افراد.'], answerIndex: 2,
    },
    {
      id: 'en-communication-client', language: 'en', levelId: 3, sourceLessonId: 'communication-working-with-a-client', dimension: 'inference',
      passage: 'The client needs a simple solution.', prompt: 'مشتری به چه نوع راه‌حلی نیاز دارد؟',
      choices: ['راه‌حلی ساده و روشن.', 'راه‌حلی گران و پیچیده.', 'راه‌حلی که هنوز آزمایش نشده است.'], answerIndex: 0,
    },
    {
      id: 'en-communication-health', language: 'en', levelId: 3, sourceLessonId: 'communication-health-checkup', dimension: 'meaning',
      passage: 'Do not neglect these symptoms.', prompt: 'این توصیه چه می‌گوید؟',
      choices: ['این علائم را برای دیگران تعریف کنید.', 'این علائم را نادیده نگیرید.', 'دارو را بدون پرسش مصرف کنید.'], answerIndex: 1,
    },
    {
      id: 'en-advanced-rumor', language: 'en', levelId: 4, sourceLessonId: 'advanced-discussing-a-rumor', dimension: 'inference',
      passage: 'False stories circulate quickly online.', prompt: 'پیش از بازنشر یک خبر نادرست‌نما، کدام کار سنجیده‌تر است؟',
      choices: ['بازنشر فوری برای افراد بیشتر.', 'بررسی منبع و درستی خبر.', 'افزودن جزئیات تأییدنشده.'], answerIndex: 1,
    },
    {
      id: 'en-advanced-conflict', language: 'en', levelId: 4, sourceLessonId: 'advanced-analyzing-a-story', dimension: 'meaning',
      passage: 'The main conflict begins between two families.', prompt: 'main conflict در تحلیل داستان به چه اشاره دارد؟',
      choices: ['نام نویسنده.', 'پایان خوش داستان.', 'کشمکش یا مسئلهٔ اصلی.'], answerIndex: 2,
    },
    {
      id: 'en-advanced-journalist', language: 'en', levelId: 4, sourceLessonId: 'advanced-working-in-a-newsroom', dimension: 'inference',
      passage: 'A responsible journalist verifies every claim.', prompt: 'خبرنگار مسئول پیش از انتشار چه می‌کند؟',
      choices: ['درستی هر ادعا را بررسی می‌کند.', 'هر ادعایی را بدون منبع می‌پذیرد.', 'خبر را فقط بر پایهٔ حدس می‌نویسد.'], answerIndex: 0,
    },
  ],
  de: [
    {
      id: 'de-beginner-name', language: 'de', levelId: 0, sourceLessonId: 'de-v2-name-origin', dimension: 'meaning',
      passage: 'Ich heiße Mina.', prompt: 'گوینده چه چیزی را می‌گوید؟',
      choices: ['من در مینا زندگی می‌کنم.', 'من اهل مینا هستم.', 'اسم من مینا است.'], answerIndex: 2,
    },
    {
      id: 'de-beginner-time', language: 'de', levelId: 0, sourceLessonId: 'de-v2-numbers-time', dimension: 'detail',
      passage: 'Der Kurs beginnt um zehn Uhr.', prompt: 'کلاس چه ساعتی شروع می‌شود؟',
      choices: ['کلاس ساعت ده شروع می‌شود.', 'ساعت هفت.', 'کلاس ساعت ده تمام می‌شود.'], answerIndex: 0,
    },
    {
      id: 'de-beginner-word', language: 'de', levelId: 0, sourceLessonId: 'de-v2-classroom', dimension: 'meaning',
      passage: 'Was bedeutet dieses Wort?', prompt: 'گوینده دربارهٔ چه چیزی می‌پرسد؟',
      choices: ['قیمت این واژه‌نامه.', 'معنای این واژه.', 'زمان شروع کلاس.'], answerIndex: 1,
    },
    {
      id: 'de-a1-routine', language: 'de', levelId: 1, sourceLessonId: 'de-v2-daily-routine', dimension: 'detail',
      passage: 'Ich stehe um sieben Uhr auf. Danach frühstücke ich.', prompt: 'گوینده بعد از برخاستن چه کار می‌کند؟',
      choices: ['به ایستگاه می‌رود.', 'صبحانه می‌خورد.', 'با دوستانش قدم می‌زند.'], answerIndex: 1,
    },
    {
      id: 'de-a1-shopping', language: 'de', levelId: 1, sourceLessonId: 'de-v2-shopping', dimension: 'inference',
      passage: 'Die Jacke ist zu teuer.', prompt: 'چرا ممکن است گوینده این کت را نخرد؟',
      choices: ['چون بیش از حد گران است.', 'چون رنگ آن را نمی‌داند.', 'چون فروشگاه بسته است.'], answerIndex: 0,
    },
    {
      id: 'de-a1-try-on', language: 'de', levelId: 1, sourceLessonId: 'de-v2-shopping', dimension: 'meaning',
      passage: 'Kann ich sie anprobieren?', prompt: 'گوینده اجازهٔ انجام چه کاری را می‌پرسد؟',
      choices: ['پس‌دادن پول.', 'رزروکردن اتاق.', 'پروکردن لباس.'], answerIndex: 2,
    },
    {
      id: 'de-a2-weekend', language: 'de', levelId: 2, sourceLessonId: 'de-v2-weekend-past', dimension: 'detail',
      passage: 'Am Samstag habe ich meine Freunde besucht. Wir sind im Park spazieren gegangen. Danach haben wir zusammen gegessen.', prompt: 'آن‌ها پس از قدم‌زدن چه کردند؟',
      choices: ['به محل کار رفتند.', 'یک اتاق رزرو کردند.', 'با هم غذا خوردند.'], answerIndex: 2,
    },
    {
      id: 'de-a2-health', language: 'de', levelId: 2, sourceLessonId: 'de-v2-health-appointment', dimension: 'detail',
      passage: 'Seit gestern habe ich Kopfschmerzen.', prompt: 'سردرد از چه زمانی شروع شده است؟',
      choices: ['از هفتهٔ آینده.', 'از دیروز.', 'از یک ماه پیش.'], answerIndex: 1,
    },
    {
      id: 'de-a2-travel', language: 'de', levelId: 2, sourceLessonId: 'de-v2-travel-stay', dimension: 'detail',
      passage: 'Ich habe ein Zimmer für zwei Nächte reserviert.', prompt: 'اتاق برای چند شب رزرو شده است؟',
      choices: ['دو هفته.', 'یک شب.', 'دو شب.'], answerIndex: 2,
    },
    {
      id: 'de-b1-opinion', language: 'de', levelId: 3, sourceLessonId: 'de-v2-opinions-reasons', dimension: 'inference',
      passage: 'Einerseits spart der Bus Zeit, andererseits ist er oft voll.', prompt: 'گوینده به کدام دو ویژگی اتوبوس اشاره می‌کند؟',
      choices: ['ارزان‌بودن و دیررسیدن.', 'صرفه‌جویی در وقت و شلوغ‌بودن.', 'آرام‌بودن و کم‌بودن مسافر.'], answerIndex: 1,
    },
    {
      id: 'de-b1-work', language: 'de', levelId: 3, sourceLessonId: 'de-v2-work-experience', dimension: 'inference',
      passage: 'Obwohl der Termin knapp war, haben wir das Projekt abgeschlossen.', prompt: 'با وجود چه چیزی پروژه به پایان رسید؟',
      choices: ['با وجود کمبود وقت.', 'با وجود آماده‌نبودن پروژه.', 'با وجود تغییر موضوع.'], answerIndex: 0,
    },
    {
      id: 'de-b1-complaint', language: 'de', levelId: 3, sourceLessonId: 'de-v2-complaint-solution', dimension: 'meaning',
      passage: 'Falls das nicht möglich ist, möchte ich mein Geld zurück.', prompt: 'اگر خواستهٔ گوینده ممکن نباشد، چه می‌خواهد؟',
      choices: ['قرار را به تعویق بیندازد.', 'محصول دیگری سفارش دهد.', 'پولش را پس بگیرد.'], answerIndex: 2,
    },
  ],
};

export function getPlacementQuestions(language: PlacementLanguage): readonly PlacementQuestion[] {
  return PLACEMENT_QUESTION_BANK[language];
}

export function scorePlacement(language: PlacementLanguage, answers: Readonly<Record<string, number>>): PlacementResult {
  const questions = getPlacementQuestions(language);
  const questionIds = new Set(questions.map(question => question.id));
  for (const [questionId, choiceIndex] of Object.entries(answers)) {
    if (!questionIds.has(questionId)) throw new Error(`Unknown placement question: ${questionId}`);
    if (!Number.isInteger(choiceIndex) || choiceIndex < -1 || choiceIndex >= questions.find(question => question.id === questionId)!.choices.length) {
      throw new Error(`Invalid placement answer for: ${questionId}`);
    }
  }

  const levelIds = [...new Set(questions.map(question => question.levelId))].sort((left, right) => left - right);
  const perLevel = levelIds.map(levelId => {
    const levelQuestions = questions.filter(question => question.levelId === levelId);
    const correct = levelQuestions.filter(question => answers[question.id] === question.answerIndex).length;
    return { levelId, correct, total: levelQuestions.length, meetsScreeningThreshold: correct >= Math.ceil(levelQuestions.length * (2 / 3)) };
  });
  const maxLevelId = levelIds[levelIds.length - 1] ?? 0;
  let recommendedLevelId = levelIds[0] ?? 0;
  for (const level of perLevel) {
    if (!level.meetsScreeningThreshold) {
      recommendedLevelId = level.levelId;
      break;
    }
    recommendedLevelId = Math.min(level.levelId + 1, maxLevelId);
  }

  return {
    language,
    questionCount: questions.length,
    correctCount: questions.filter(question => answers[question.id] === question.answerIndex).length,
    answeredCount: questions.filter(question => Object.prototype.hasOwnProperty.call(answers, question.id) && answers[question.id] !== -1).length,
    unknownCount: questions.filter(question => answers[question.id] === -1).length,
    recommendedLevelId,
    perLevel,
    nonMonotonicPattern: perLevel.some((level, index) => !level.meetsScreeningThreshold && perLevel.slice(index + 1).some(later => later.meetsScreeningThreshold)),
  };
}

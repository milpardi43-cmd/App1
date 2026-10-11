import type { LearningUnit, GuidedLesson, ChoiceExercise, WriteExercise } from './learningDesign';
export type GapChoice = { text:string; fa?:string; question:string; choices:string[]; correct:number; why:string };
export type GapWrite = { prompt:string; answers:string[]; hint:string; why:string };
export interface GapLesson {
  id:string; title:string; goal:string; pattern:string; sound:string;
  examples:[string,string][]; dialogue:[string,string][];
  listen:GapChoice; read:GapChoice; write:GapWrite;
  final: {kind:'reading'|'listening';task:GapChoice}|{kind:'writing';task:GapWrite};
}
export function gapUnit(id:string,title:string,oralMissionFa:string,specs:GapLesson[],language:'de'|'en'='de'):LearningUnit {
  const choice=(s:GapLesson,t:GapChoice,skill:'reading'|'listening',suffix:string):ChoiceExercise=>({id:`${s.id}-${suffix}`,objectiveId:`${s.id}-goal`,kind:'choice',skill,promptFa:t.question,explanationFa:t.why,
    ...(skill==='reading'?{readingText:t.text}:{audioText:t.text,transcriptFa:t.fa}),choices:t.choices.map((label,i)=>({id:`c${i}`,label})),correctChoice:`c${t.correct}`});
  const write=(s:GapLesson,t:GapWrite,suffix:string):WriteExercise=>({id:`${s.id}-${suffix}`,objectiveId:`${s.id}-goal`,kind:'write',skill:'writing',promptFa:t.prompt,acceptedAnswers:t.answers,sample:t.answers[0],hintFa:t.hint,explanationFa:t.why,taskNoteFa:'این پاسخ کوتاه با الگوهای مشخص بررسی می‌شود، نه با داوری آزاد زبان. برای نوشتن آزاد و فرم چندفیلدی به کارگاه A1 بروید. بزرگی حروف و نشانه‌گذاری را پس از پاسخ با نمونه مقایسه کنید.'});
  const lessons:GuidedLesson[]=specs.map((s,i)=>({id:s.id,title:s.title,canDoFa:s.goal,objectiveIds:[`${s.id}-goal`],prerequisiteIds:i?[specs[i-1].id]:[],situationFa:s.goal,patternFa:s.pattern,pronunciationFa:s.sound,examples:s.examples.map(([text,fa])=>({text,fa})),dialogue:s.dialogue.map(([text,fa],i)=>({speaker:i%2?'شما':'همراه',text,fa})),exercises:[choice(s,s.listen,'listening','listen'),choice(s,s.read,'reading','read'),write(s,s.write,'write')]}));
  return {id,version:1,language,level:'A1',title,lessons,objectives:specs.map(s=>({id:`${s.id}-goal`,canDoFa:s.goal})),oralMissionFa,mission:specs.map(s=>s.final.kind==='writing'?write(s,s.final.task,'mission'):choice(s,s.final.task,s.final.kind,'mission'))};
}
